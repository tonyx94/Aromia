import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSystemSettingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  setting_key: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  setting_value?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
