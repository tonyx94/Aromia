import { IsOptional, IsString, IsDateString } from 'class-validator';
export class UpdateCustomerProfileDto {

  @IsOptional()
  @IsString()
  first_name?: string;  

  @IsOptional()
  @IsString()
  last_name?: string;  

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string; 
}