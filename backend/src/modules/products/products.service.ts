import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  private readonly uploadDir: string;
  private readonly frontendUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  async create(dto: CreateProductDto, userId: string) {
    const existing = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });
    if (existing) {
      throw new ConflictException(`A product with SKU "${dto.sku}" already exists`);
    }

    const { materials, sustainability, productionDate, ...productFields } = dto;

    return this.prisma.$transaction(async (tx) => {
      return tx.product.create({
        data: {
          ...productFields,
          productionDate: productionDate ? new Date(productionDate) : null,
          createdById: userId,
          materials: materials?.length
            ? {
                create: materials.map((m, index) => ({
                  name: m.name,
                  percentage: m.percentage,
                  countryOfOrigin: m.countryOfOrigin,
                  recyclable: m.recyclable ?? false,
                  sortOrder: index,
                })),
              }
            : undefined,
          sustainability: sustainability
            ? {
                create: {
                  carbonFootprint: sustainability.carbonFootprint,
                  waterConsumption: sustainability.waterConsumption,
                  recycledMaterialPercentage: sustainability.recycledMaterialPercentage,
                  repairabilityScore: sustainability.repairabilityScore,
                  recyclable: sustainability.recyclable ?? false,
                },
              }
            : undefined,
        },
        include: {
          materials: true,
          sustainability: true,
          coverImage: true,
        },
      });
    });
  }

  async findAll(query: ProductQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 10));
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { sku: { contains: term, mode: 'insensitive' } },
        { serialNumber: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          coverImage: true,
          passport: {
            select: {
              id: true,
              passportUuid: true,
              status: true,
              version: true,
              qrCodePath: true,
              _count: {
                select: { scanEvents: true },
              },
            },
          },
          _count: {
            select: {
              materials: true,
              certifications: true,
              documents: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Shape items to include total views count directly for UI simplicity
    const data = items.map((product) => ({
      ...product,
      totalViews: product.passport?._count?.scanEvents ?? 0,
    }));

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        coverImage: true,
        materials: {
          orderBy: { sortOrder: 'asc' },
        },
        sustainability: true,
        certifications: {
          include: {
            documentFile: true,
          },
        },
        documents: {
          include: {
            file: true,
          },
        },
        images: {
          include: {
            file: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
        passport: {
          include: {
            _count: {
              select: { scanEvents: true },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" was not found`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    const { materials, sustainability, productionDate, ...productFields } = dto;

    return this.prisma.$transaction(async (tx) => {
      // If materials array is provided, replace existing materials
      if (materials !== undefined) {
        await tx.material.deleteMany({ where: { productId: id } });
        if (materials.length > 0) {
          await tx.material.createMany({
            data: materials.map((m, idx) => ({
              productId: id,
              name: m.name,
              percentage: m.percentage,
              countryOfOrigin: m.countryOfOrigin,
              recyclable: m.recyclable ?? false,
              sortOrder: idx,
            })),
          });
        }
      }

      // If sustainability is provided, upsert
      if (sustainability !== undefined) {
        await tx.sustainability.upsert({
          where: { productId: id },
          create: {
            productId: id,
            carbonFootprint: sustainability.carbonFootprint,
            waterConsumption: sustainability.waterConsumption,
            recycledMaterialPercentage: sustainability.recycledMaterialPercentage,
            repairabilityScore: sustainability.repairabilityScore,
            recyclable: sustainability.recyclable ?? false,
          },
          update: {
            carbonFootprint: sustainability.carbonFootprint,
            waterConsumption: sustainability.waterConsumption,
            recycledMaterialPercentage: sustainability.recycledMaterialPercentage,
            repairabilityScore: sustainability.repairabilityScore,
            recyclable: sustainability.recyclable ?? false,
          },
        });
      }

      const updated = await tx.product.update({
        where: { id },
        data: {
          ...productFields,
          ...(productionDate !== undefined && {
            productionDate: productionDate ? new Date(productionDate) : null,
          }),
        },
        include: {
          materials: true,
          sustainability: true,
          coverImage: true,
          passport: true,
        },
      });

      // Invalidate passport cache if product was updated
      if (updated.passport?.passportUuid) {
        await this.redis.del(`passport:${updated.passport.passportUuid}`);
      }

      return updated;
    });
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (product.passport && product.passport.status === 'ACTIVE') {
      throw new BadRequestException(
        'Cannot delete a product with an active passport. Revoke or archive it first.',
      );
    }

    // Soft delete product
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { success: true, message: 'Product archived successfully' };
  }

  async publish(id: string) {
    const product = await this.findOne(id);

    const qrDir = path.join(this.uploadDir, 'qrcodes');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    let passport = await this.prisma.productPassport.findUnique({
      where: { productId: id },
    });

    let version = 1;
    let passportUuid = passport?.passportUuid || uuidv4();

    const publicUrl = `${this.frontendUrl}/passport/${passportUuid}`;
    const qrFilePath = path.join(qrDir, `${passportUuid}.png`);
    const qrRelativePath = `uploads/qrcodes/${passportUuid}.png`;

    await QRCode.toFile(qrFilePath, publicUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1a365d',
        light: '#ffffff',
      },
    });

    if (passport) {
      version = passport.version + 1;
      await this.prisma.product.update({
        where: { id },
        data: { version, status: 'PUBLISHED' },
      });

      passport = await this.prisma.productPassport.update({
        where: { id: passport.id },
        data: {
          version,
          status: 'ACTIVE',
          qrCodePath: qrRelativePath,
          publishedAt: new Date(),
        },
      });
    } else {
      await this.prisma.product.update({
        where: { id },
        data: { status: 'PUBLISHED' },
      });

      passport = await this.prisma.productPassport.create({
        data: {
          productId: id,
          passportUuid,
          version: 1,
          qrCodePath: qrRelativePath,
          status: 'ACTIVE',
          publishedAt: new Date(),
        },
      });
    }

    // Purge cached passport
    await this.redis.del(`passport:${passportUuid}`);

    return {
      ...passport,
      publicUrl,
    };
  }
}
