import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUsersService } from '../modules/admin-users/admin-users.service';
import { CustomersService } from '../modules/customers/customers.service';



@Injectable()
export class AuthService {
  constructor(
    private readonly adminUserService: AdminUsersService,
    private readonly customerService: CustomersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string, userType: 'admin' | 'customer') {
    let user;
    if (userType === 'admin') {
      user = await this.adminUserService.findByEmail(email);
    } else {
      user = await this.customerService.findByEmail(email);
    }

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Contraseña incorrecta');

    // Debug: verificar el valor de isActive
    console.log('User isActive status:', user.isActive, 'for user:', user.email);

    // Validar que el usuario esté activo
    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta está inactiva. Contacta al administrador.');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.userType === 'admin' ? user.role.name : 'customer',
    };
    console.log(user)
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.firstName + " " + user.lastName,
        lastname: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role, // Include the full role object
        roleId: user.roleId,
        isActive: user.isActive,
      }
    };
  }
}
