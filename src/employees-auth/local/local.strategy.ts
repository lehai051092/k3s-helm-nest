import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmployeesAuthService } from '../employees-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private employeesAuthService: EmployeesAuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const employee = await this.employeesAuthService.validateUser(email, password);
    if (!employee) {
      throw new UnauthorizedException('Invalid Username/Password!');
    }
    return employee;
  }
}
