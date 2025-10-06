import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateCustomerDto {
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
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
