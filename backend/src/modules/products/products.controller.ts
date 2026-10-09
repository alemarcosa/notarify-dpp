import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product with materials and sustainability data' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 409, description: 'Product with this SKU already exists' })
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any) {
    return this.productsService.create(createProductDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List products with filtering, search and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of products' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full product details by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product details' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete / archive a product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product archived successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete product with active passport' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish product, generate digital passport and QR Code' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Passport generated or updated with new version' })
  publish(@Param('id') id: string) {
    return this.productsService.publish(id);
  }
}
