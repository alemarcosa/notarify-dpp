import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class MaterialDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  percentage: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryOfOrigin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  recyclable?: boolean;
}

export class SustainabilityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  carbonFootprint?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  waterConsumption?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  recycledMaterialPercentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  repairabilityScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  recyclable?: boolean;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  productionDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryOfOrigin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImageId?: string;

  @ApiPropertyOptional({ enum: ProductStatusEnum })
  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum;

  @ApiPropertyOptional({ type: [MaterialDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialDto)
  materials?: MaterialDto[];

  @ApiPropertyOptional({ type: SustainabilityDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SustainabilityDto)
  sustainability?: SustainabilityDto;
}
