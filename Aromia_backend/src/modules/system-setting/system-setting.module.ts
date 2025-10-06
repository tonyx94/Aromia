import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSettingsService } from './system-setting.service';
import { SystemSettingsController } from './system-setting.controller';
import { SystemSetting } from './entities/system-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSetting])],
  controllers: [SystemSettingsController],
  providers: [SystemSettingsService],
  exports: [SystemSettingsService],
})
export class SystemSettingsModule {}
