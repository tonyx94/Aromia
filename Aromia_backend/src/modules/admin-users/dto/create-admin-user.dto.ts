import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateAdminUserDto {
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsInt()
  roleId: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
