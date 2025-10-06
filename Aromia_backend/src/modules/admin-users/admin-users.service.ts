import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from './entities/admin-user.entity';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { Role } from '../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createAdminUserDto: CreateAdminUserDto) {
    const role = await this.roleRepository.findOne({ where: { id: createAdminUserDto.roleId } });
    if (!role) throw new NotFoundException(`Role with ID ${createAdminUserDto.roleId} not found`);

    const hashedPassword = await bcrypt.hash(createAdminUserDto.password, 10);

    const adminUser = this.adminUserRepository.create({
      ...createAdminUserDto,
      password: hashedPassword,
      role,
    });

    return this.adminUserRepository.save(adminUser);
  }

  findAll() {
    return this.adminUserRepository.find();
  }

  async findOne(id: number) {
    const user = await this.adminUserRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`AdminUser with ID ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<AdminUser | undefined> {
    const user = await this.adminUserRepository.findOne({
      where: { email },
      relations: ['role'],
    });
    return user ?? undefined;
  }

  async update(id: number, updateAdminUserDto: UpdateAdminUserDto) {
    const adminUser = await this.findOne(id);

    if (updateAdminUserDto.password) {
      updateAdminUserDto.password = await bcrypt.hash(updateAdminUserDto.password, 10);
    }

    if (updateAdminUserDto.roleId) {
      const role = await this.roleRepository.findOne({ where: { id: updateAdminUserDto.roleId } });
      if (!role) throw new NotFoundException(`Role with ID ${updateAdminUserDto.roleId} not found`);
      adminUser.role = role;
    }

    Object.assign(adminUser, updateAdminUserDto);
    return this.adminUserRepository.save(adminUser);
  }

  async remove(id: number) {
    const adminUser = await this.findOne(id);
    return this.adminUserRepository.remove(adminUser);
  }
}
 