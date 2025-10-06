import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from './entities/system-setting.entity';
import { CreateSystemSettingDto } from './dto/create-system-setting.dto';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly settingsRepo: Repository<SystemSetting>,
  ) {}

  create(dto: CreateSystemSettingDto): Promise<SystemSetting> {
    const setting = this.settingsRepo.create(dto);
    return this.settingsRepo.save(setting);
  }

  findAll(): Promise<SystemSetting[]> {
    return this.settingsRepo.find({ order: { setting_key: 'ASC' } });
  }

  async findOne(id: number): Promise<SystemSetting> {
    const setting = await this.settingsRepo.findOne({ where: { id } });
    if (!setting) throw new NotFoundException(`System setting #${id} not found`);
    return setting;
  }

  async update(id: number, dto: UpdateSystemSettingDto): Promise<SystemSetting> {
    const setting = await this.findOne(id);
    Object.assign(setting, dto);
    return this.settingsRepo.save(setting);
  }

  async remove(id: number): Promise<void> {
    const setting = await this.findOne(id);
    await this.settingsRepo.remove(setting);
  }
}
