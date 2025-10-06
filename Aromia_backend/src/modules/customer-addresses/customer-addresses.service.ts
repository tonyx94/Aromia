import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAddress } from './entities/customer-address.entity';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class CustomerAddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerAddressDto: CreateCustomerAddressDto) {
    const customer = await this.customerRepository.findOne({
      where: { id: createCustomerAddressDto.customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${createCustomerAddressDto.customerId} not found`);
    }

    const address = this.customerAddressRepository.create({
      ...createCustomerAddressDto,
      customer,
    });
    return this.customerAddressRepository.save(address);
  }

  findAll() {
    return this.customerAddressRepository.find({ relations: ['customer'] });
  }

  async findOne(id: number) {
    const address = await this.customerAddressRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!address) throw new NotFoundException(`CustomerAddress with ID ${id} not found`);
    return address;
  }

  async update(id: number, updateCustomerAddressDto: UpdateCustomerAddressDto) {
    const address = await this.findOne(id);

    if (updateCustomerAddressDto.customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: updateCustomerAddressDto.customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${updateCustomerAddressDto.customerId} not found`);
      }
      address.customer = customer;
    }

    Object.assign(address, updateCustomerAddressDto);
    return this.customerAddressRepository.save(address);
  }

  async remove(id: number) {
    const address = await this.findOne(id);
    return this.customerAddressRepository.remove(address);
  }
}
