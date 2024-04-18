import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmployeesAuthService } from '../employees-auth.service';
import { IEmployee } from '../../utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private employeesAuthService: EmployeesAuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  validate = async (payload: IEmployee) => {
    const { employee_id } = payload;
    const employee = await this.employeesAuthService.validateEmployeeById(+employee_id);
    if (!employee) {
      throw new UnauthorizedException('Invalid Token!');
    }

    return employee;
  };
}
