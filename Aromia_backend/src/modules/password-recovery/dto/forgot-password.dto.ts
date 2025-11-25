import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({ enum: ['customer', 'admin'], default: 'customer' })
  @IsEnum(['customer', 'admin'], { message: 'El tipo de usuario debe ser "customer" o "admin"' })
  userType: 'customer' | 'admin';
}