import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { Request } from 'express';

@Injectable()
export class PassportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getPublicData(uuid: string, req: Request) {
    const cacheKey = `passport:${uuid}`;
    let data = await this.redis.get<any>(cacheKey);

    if (!data) {
      const passport = await this.prisma.productPassport.findUnique({
        where: { passportUuid: uuid },
        include: {
          product: {
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
            },
          },
        },
      });

      if (!passport || passport.status !== 'ACTIVE') {
        throw new NotFoundException('Product Passport not found or is currently inactive');
      }

      data = passport;
      // Cache public passport data for 5 minutes
      await this.redis.set(cacheKey, data, 300);
    }

    // Register scan event asynchronously without blocking response
    this.registerScanEvent(data.id, req).catch((err) => {
      console.error('Failed to log passport scan event:', err?.message || err);
    });

    return data;
  }

  async listAll() {
    return this.prisma.productPassport.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: true,
            status: true,
            coverImage: true,
          },
        },
        _count: {
          select: { scanEvents: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async registerScanEvent(passportId: string, req: Request) {
    const userAgent = (req.headers['user-agent'] as string) || '';
    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress = Array.isArray(forwarded)
      ? forwarded[0]
      : (forwarded as string)?.split(',')[0] || req.ip || req.socket.remoteAddress || '127.0.0.1';

    const acceptLang = (req.headers['accept-language'] as string) || '';
    const browserLanguage = acceptLang.split(',')[0]?.trim() || 'en-US';

    // Parse browser
    let browser = 'Other';
    if (/edg/i.test(userAgent)) browser = 'Microsoft Edge';
    else if (/chrome|crios/i.test(userAgent)) browser = 'Google Chrome';
    else if (/firefox|fxios/i.test(userAgent)) browser = 'Mozilla Firefox';
    else if (/safari/i.test(userAgent)) browser = 'Apple Safari';
    else if (/opera|opr/i.test(userAgent)) browser = 'Opera';

    // Parse OS
    let os = 'Other';
    if (/windows/i.test(userAgent)) os = 'Windows';
    else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/linux/i.test(userAgent)) os = 'Linux';

    // Country mock logic based on language or headers
    let country = 'Global / International';
    if (acceptLang.toLowerCase().includes('it')) country = 'Italy';
    else if (acceptLang.toLowerCase().includes('de')) country = 'Germany';
    else if (acceptLang.toLowerCase().includes('fr')) country = 'France';
    else if (acceptLang.toLowerCase().includes('es')) country = 'Spain';
    else if (acceptLang.toLowerCase().includes('en-us')) country = 'United States';
    else if (acceptLang.toLowerCase().includes('en-gb')) country = 'United Kingdom';

    await this.prisma.scanEvent.create({
      data: {
        passportId,
        ipAddress: ipAddress.replace(/^.*:/, ''), // clean ipv6 localhost prefix
        browser,
        operatingSystem: os,
        browserLanguage,
        country,
      },
    });
  }
}
