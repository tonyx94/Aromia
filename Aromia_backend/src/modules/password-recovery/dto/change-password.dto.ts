import { IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Contraseña actual del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  currentPassword: string;

  @ApiProperty({ minLength: 8, example: 'nuevaContraseña123' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  newPassword: string;

  @ApiProperty({ enum: ['customer', 'admin'], default: 'customer' })
  @IsEnum(['customer', 'admin'], { message: 'El tipo de usuario debe ser "customer" o "admin"' })
  userType: 'customer' | 'admin';
}