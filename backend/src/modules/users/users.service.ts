import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: any) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    
    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(createUserDto.password, 12);
    
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        role: createUserDto.role || 'EDITOR',
      },
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, pageSize = 10 } = query;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: any) {
    let dataToUpdate = { ...updateUserDto };
    
    if (updateUserDto.password) {
      dataToUpdate.passwordHash = await bcrypt.hash(updateUserDto.password, 12);
      delete dataToUpdate.password;
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });
      const { passwordHash: _, ...result } = user;
      return result;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
