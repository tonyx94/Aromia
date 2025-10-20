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
  ) {}

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
        phone: user.phone,
        email: user.email,
      }
    };
  }
}
