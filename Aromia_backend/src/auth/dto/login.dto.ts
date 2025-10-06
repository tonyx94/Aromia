import { IsEmail, IsString, IsIn } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsIn(['admin', 'customer'])
  userType: 'admin' | 'customer';
}
