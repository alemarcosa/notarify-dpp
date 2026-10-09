import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PassportsService } from './passports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('passports')
@Controller()
export class PassportsController {
  constructor(private readonly passportsService: PassportsService) {}

  @Get(['passport/:uuid', 'public/passports/:uuid'])
  @ApiOperation({ summary: 'Public: Retrieve complete Product Passport and log scan event' })
  @ApiParam({ name: 'uuid', description: 'Product Passport UUID' })
  @ApiResponse({ status: 200, description: 'Product passport details including sustainability and materials' })
  @ApiResponse({ status: 404, description: 'Passport not found or revoked' })
  async getPublicPassport(@Param('uuid') uuid: string, @Req() req: Request) {
    return this.passportsService.getPublicData(uuid, req);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('passports')
  @ApiOperation({ summary: 'Protected: List all published product passports with scan totals' })
  @ApiResponse({ status: 200, description: 'List of passports' })
  listPassports() {
    return this.passportsService.listAll();
  }
}
