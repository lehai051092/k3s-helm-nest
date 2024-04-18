import { Injectable } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { Employee } from '../employees/entities/employee.entity';
import { checkPassword, IEmployee } from '../utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmployeesAuthService {
  constructor(
    private employeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  validateUser = async (email: string, pass: string): Promise<Omit<Employee, 'password'>> => {
    const employee = await this.employeesService.findByEmail(email);
    if (employee && checkPassword(pass, employee.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...employeeData } = employee;
      return employeeData;
    }

    return null;
  };

  validateEmployeeById = async (
    id: number,
  ): Promise<Pick<Employee, 'employee_id' | 'first_name' | 'last_name' | 'email'>> => {
    const employee = await this.employeesService.findOne(id);
    if (employee) {
      const { employee_id, first_name, last_name, email } = employee;
      return { employee_id, first_name, last_name, email };
    }

    return null;
  };

  login = async (employee: IEmployee) => {
    const { employee_id, first_name, last_name, email } = employee;
    const payload: IEmployee = { employee_id, first_name, last_name, email };
    return {
      access_token: this.jwtService.sign(payload),
      employee: {
        employee_id,
        first_name,
        last_name,
        email,
      },
    };
  };
}
