import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateCustomerAddressDto {
  @IsInt()
  @IsOptional()
  customerId?: number;  

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  alias: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  streetAddress: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
