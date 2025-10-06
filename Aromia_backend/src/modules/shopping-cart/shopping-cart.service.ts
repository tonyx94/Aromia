import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { Customer } from '../customers/entities/customer.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private readonly cartRepo: Repository<ShoppingCart>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateShoppingCartDto): Promise<ShoppingCart> {
    const customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const cartItem = this.cartRepo.create({ customer, product, quantity: dto.quantity });
    return this.cartRepo.save(cartItem);
  }

  findAll(): Promise<ShoppingCart[]> {
    return this.cartRepo.find({ relations: ['customer', 'product'] });
  }

  async findOne(id: number): Promise<ShoppingCart> {
    const item = await this.cartRepo.findOne({ where: { id }, relations: ['customer', 'product'] });
    if (!item) throw new NotFoundException('Cart item not found');
    return item;
  }

  async update(id: number, dto: UpdateShoppingCartDto): Promise<ShoppingCart> {
    const item = await this.findOne(id);

    if (dto.customerId) {
      const customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
      if (!customer) throw new NotFoundException('Customer not found');
      item.customer = customer;
    }

    if (dto.productId) {
      const product = await this.productRepo.findOne({ where: { id: dto.productId } });
      if (!product) throw new NotFoundException('Product not found');
      item.product = product;
    }

    if (dto.quantity !== undefined) item.quantity = dto.quantity;

    return this.cartRepo.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.cartRepo.remove(item);
  }
}
