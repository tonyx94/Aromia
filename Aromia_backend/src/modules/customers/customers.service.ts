import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) { }

  async create(createCustomerDto: CreateCustomerDto) {
    const hashedPassword = await bcrypt.hash(createCustomerDto.password, 10);

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
    });

    return this.customerRepository.save(customer);
  }

  findAll() {
    return this.customerRepository.find({
      relations: ['addresses', 'orders', 'shoppingCart'],
    });
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['addresses', 'orders', 'shoppingCart'],
    });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);
    return customer;
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = await this.customerRepository.findOne({ where: { email } });
    return customer ?? undefined;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);

    if (updateCustomerDto.password) {
      updateCustomerDto.password = await bcrypt.hash(updateCustomerDto.password, 10);
    }

    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async remove(id: number) {
    const customer = await this.findOne(id);
    return this.customerRepository.remove(customer);
  }

  // ===== DASHBOARD STATISTICS METHODS =====

  async getCustomerGrowth(startDate: string, endDate: string): Promise<any> {
    const customers = await this.customerRepository
      .createQueryBuilder('customer')
      .select('DATE(customer.created_at)', 'date')
      .addSelect('COUNT(customer.id)', 'newCustomers')
      .where('customer.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('DATE(customer.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany();

    let totalCustomers = 0;
    const data = customers.map(item => {
      totalCustomers += parseInt(item.newCustomers);
      return {
        date: item.date,
        newCustomers: parseInt(item.newCustomers) || 0,
        totalCustomers,
      };
    });

    return { data };
  }
}