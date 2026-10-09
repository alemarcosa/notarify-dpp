import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { FilesModule } from './modules/files/files.module';
import { PassportsModule } from './modules/passports/passports.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    FilesModule,
    PassportsModule,
    AnalyticsModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
