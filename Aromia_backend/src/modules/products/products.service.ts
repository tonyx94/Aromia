import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // ===== DASHBOARD STATISTICS METHODS =====

  async getTopProducts(startDate: string, endDate: string, limit: number = 10): Promise<any> {
    const topProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('product.image_url', 'imageUrl')
      .addSelect('SUM(orderItem.quantity)', 'quantitySold')
      .addSelect('SUM(orderItem.total_price)', 'revenue')
      .where('order.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('product.id')
      .orderBy('quantitySold', 'DESC')
      .limit(limit)
      .getRawMany();

    return {
      products: topProducts.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantitySold: parseInt(item.quantitySold) || 0,
        revenue: parseFloat(item.revenue) || 0,
        imageUrl: item.imageUrl,
      })),
    };
  }
}
