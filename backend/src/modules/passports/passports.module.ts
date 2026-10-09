import { Module } from '@nestjs/common';
import { PassportsService } from './passports.service';
import { PassportsController } from './passports.controller';

@Module({
  controllers: [PassportsController],
  providers: [PassportsService],
  exports: [PassportsService],
})
export class PassportsModule {}
