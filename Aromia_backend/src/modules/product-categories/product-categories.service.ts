import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async create(dto: CreateProductCategoryDto): Promise<ProductCategory> {
    const category = this.categoryRepository.create(dto);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.categoryRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<ProductCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    return category;
  }

  async update(id: number, dto: UpdateProductCategoryDto): Promise<ProductCategory> {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
