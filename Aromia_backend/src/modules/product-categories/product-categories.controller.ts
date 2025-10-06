import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría de producto' })
  @ApiResponse({ status: 201, description: 'Categoría creada correctamente' })
  create(@Body() dto: CreateProductCategoryDto) {
    return this.productCategoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías de productos' })
  @ApiResponse({ status: 200, description: 'Lista obtenida correctamente' })
  findAll() {
    return this.productCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría de producto por ID' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada' })
  findOne(@Param('id') id: string) {
    return this.productCategoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría de producto' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada correctamente' })
  update(@Param('id') id: string, @Body() dto: UpdateProductCategoryDto) {
    return this.productCategoriesService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoría de producto' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada correctamente' })
  remove(@Param('id') id: string) {
    return this.productCategoriesService.remove(+id);
  }
}
