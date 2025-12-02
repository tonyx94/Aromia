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
  ) { }

  async create(createCustomerAddressDto: CreateCustomerAddressDto) {
    const customer = await this.customerRepository.findOne({
      where: { id: createCustomerAddressDto.customerId },
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${createCustomerAddressDto.customerId} not found`,
      );
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
    if (!address)
      throw new NotFoundException(
        `CustomerAddress with ID ${id} not found`,
      );
    return address;
  }

  async update(
    id: number,
    updateCustomerAddressDto: UpdateCustomerAddressDto,
  ) {
    const address = await this.findOne(id);

    if (updateCustomerAddressDto.customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: updateCustomerAddressDto.customerId },
      });
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${updateCustomerAddressDto.customerId} not found`,
        );
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

  async findAllByCustomer(customerId: number): Promise<CustomerAddress[]> {
    return this.customerAddressRepository.find({
      where: { customer: { id: customerId } },
      order: { isDefault: 'DESC', id: 'ASC' },
    });
  }

  async createForCustomer(
    customerId: number,
    dto: CreateCustomerAddressDto,
  ): Promise<CustomerAddress> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    if (dto.isDefault) {
      await this.customerAddressRepository.update(
        { customer: { id: customerId } },
        { isDefault: false },
      );
    }

    const address = this.customerAddressRepository.create({
      ...dto,
      customer,
    });

    return this.customerAddressRepository.save(address);
  }

  async updateForCustomer(
    customerId: number,
    addressId: number,
    dto: UpdateCustomerAddressDto,
  ): Promise<CustomerAddress> {
    const address = await this.customerAddressRepository.findOne({
      where: { id: addressId, customer: { id: customerId } },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (dto.isDefault) {
      await this.customerAddressRepository.update(
        { customer: { id: customerId } },
        { isDefault: false },
      );
    }

    Object.assign(address, dto);
    return this.customerAddressRepository.save(address);
  }

  async removeForCustomer(customerId: number, addressId: number) {
    const address = await this.customerAddressRepository.findOne({
      where: { id: addressId, customer: { id: customerId } },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    await this.customerAddressRepository.remove(address);
  }

  async setDefaultForCustomer(
    customerId: number,
    addressId: number,
  ): Promise<CustomerAddress> {
    const address = await this.customerAddressRepository.findOne({
      where: { id: addressId, customer: { id: customerId } },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.customerAddressRepository.update(
      { customer: { id: customerId } },
      { isDefault: false },
    );

    address.isDefault = true;
    return this.customerAddressRepository.save(address);
  }
}
