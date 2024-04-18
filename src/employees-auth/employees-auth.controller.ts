import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EmployeesAuthService } from './employees-auth.service';
import { LocalAuthGuard } from './local/local-auth.guard';
import { IEmployee, Public, ResponseMessage, User } from '../utils';

@Controller('employees-auth')
export class EmployeesAuthController {
  constructor(private readonly employeesAuthService: EmployeesAuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login a employee')
  @Post('login')
  login(@Req() req: any) {
    return this.employeesAuthService.login(req.user);
  }

  @ResponseMessage('Get employee profile')
  @Get('profile')
  getProfile(@User() user: IEmployee) {
    return user;
  }
}
