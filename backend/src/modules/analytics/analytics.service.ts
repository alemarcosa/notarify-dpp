import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getGlobalAnalytics() {
    const cacheKey = 'analytics:global';
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - ((startOfToday.getDay() + 6) % 7)); // Monday start

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const thirtyDaysAgo = new Date(startOfToday);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const [
      scansToday,
      scansThisWeek,
      scansThisMonth,
      latestScans,
      rawDailyEvents,
      groupedPassports,
    ] = await Promise.all([
      this.prisma.scanEvent.count({ where: { scannedAt: { gte: startOfToday } } }),
      this.prisma.scanEvent.count({ where: { scannedAt: { gte: startOfWeek } } }),
      this.prisma.scanEvent.count({ where: { scannedAt: { gte: startOfMonth } } }),
      this.prisma.scanEvent.findMany({
        take: 20,
        orderBy: { scannedAt: 'desc' },
        include: {
          passport: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.scanEvent.findMany({
        where: { scannedAt: { gte: thirtyDaysAgo } },
        select: { scannedAt: true },
      }),
      this.prisma.scanEvent.groupBy({
        by: ['passportId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    // Build actual daily trend over the last 30 days
    const countByDate = new Map<string, number>();
    for (const event of rawDailyEvents) {
      const dateKey = event.scannedAt.toISOString().split('T')[0];
      countByDate.set(dateKey, (countByDate.get(dateKey) || 0) + 1);
    }

    const dailyTrend: { date: string; scans: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyTrend.push({
        date: key,
        scans: countByDate.get(key) || 0,
      });
    }

    // Resolve top products from top passports
    const passportIds = groupedPassports.map((gp) => gp.passportId);
    const passportsWithProduct = await this.prisma.productPassport.findMany({
      where: { id: { in: passportIds } },
      include: {
        product: {
          include: {
            coverImage: true,
          },
        },
      },
    });

    const passportMap = new Map(passportsWithProduct.map((p) => [p.id, p]));
    const topProducts = groupedPassports
      .map((gp) => {
        const passport = passportMap.get(gp.passportId);
        if (!passport?.product) return null;
        return {
          ...passport.product,
          views: gp._count.id,
          passportUuid: passport.passportUuid,
        };
      })
      .filter(Boolean);

    const data = {
      scansToday,
      scansThisWeek,
      scansThisMonth,
      dailyTrend,
      topProducts,
      latestScans,
    };

    // Cache for 60 seconds
    await this.redis.set(cacheKey, data, 60);
    return data;
  }
}
