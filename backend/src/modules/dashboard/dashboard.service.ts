import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getDashboardData() {
    const cacheKey = 'dashboard:overview';
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
      totalProducts,
      publishedProducts,
      qrCodesGenerated,
      totalViews,
      recentProducts,
      recentScans,
      rawWeekEvents,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.productPassport.count(),
      this.prisma.scanEvent.count(),
      this.prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          coverImage: true,
          passport: { select: { passportUuid: true, status: true } },
        },
      }),
      this.prisma.scanEvent.findMany({
        take: 5,
        orderBy: { scannedAt: 'desc' },
        include: {
          passport: {
            include: {
              product: { select: { name: true, sku: true } },
            },
          },
        },
      }),
      this.prisma.scanEvent.findMany({
        where: { scannedAt: { gte: sevenDaysAgo } },
        select: { scannedAt: true },
      }),
    ]);

    // Build 7-day scan trend for the dashboard line chart
    const countByDate = new Map<string, number>();
    for (const event of rawWeekEvents) {
      const key = event.scannedAt.toISOString().split('T')[0];
      countByDate.set(key, (countByDate.get(key) || 0) + 1);
    }

    const scansTrend: { date: string; scans: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      scansTrend.push({
        date: key,
        scans: countByDate.get(key) || 0,
      });
    }

    const data = {
      totalProducts,
      publishedProducts,
      qrCodesGenerated,
      totalPassports: qrCodesGenerated,
      totalViews,
      recentProducts,
      recentScans,
      scansTrend,
    };

    await this.redis.set(cacheKey, data, 30);
    return data;
  }
}
