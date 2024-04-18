import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { getCurrentDate, getHashPassword } from '../utils';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}
  create = async (createEmployeeDto: CreateEmployeeDto) => {
    // check duplicate email
    const isDuplicateEmail = await this.findByEmail(createEmployeeDto.email);
    if (isDuplicateEmail) {
      throw new BadRequestException('Email must be unique.');
    }

    // create new employee
    const employeeCreated = await this.employeesRepository.save({
      ...createEmployeeDto,
      password: getHashPassword(createEmployeeDto.password),
    });

    return {
      employee_id: employeeCreated.employee_id,
      created_at: employeeCreated.created_at,
    };
  };

  findAll = async (page: number, limit: number, sort: string, filters: Record<string, any>) => {
    const [field, order] = sort.split(',');
    const [results, total] = await this.employeesRepository.findAndCount({
      select: [
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'is_active',
        'created_at',
        'updated_at',
      ],
      where: filters,
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [field]: order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      },
    });

    return {
      meta: {
        current: page,
        pageSize: limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: results,
    };
  };

  findOne(employee_id: number) {
    return this.employeesRepository.findOneBy({ employee_id });
  }

  findByEmail = async (email: string) => {
    return await this.employeesRepository.findOneBy({ email });
  };

  update = async (employee_id: number, updateEmployeeDto: UpdateEmployeeDto) => {
    const employee = await this.findOne(employee_id);
    if (!employee) {
      throw new BadRequestException(`Employee ${employee_id} not found.`);
    }

    await this.employeesRepository.update({ employee_id }, updateEmployeeDto);

    return {
      employee_id: employee.employee_id,
      updated_at: employee.updated_at,
    };
  };

  remove = async (employee_id: number) => {
    const employee = await this.findOne(employee_id);
    if (!employee) {
      throw new BadRequestException(`Employee ${employee_id} not found.`);
    }

    await this.employeesRepository.delete({ employee_id });

    return {
      employee_id: employee_id,
      deleted_at: getCurrentDate(),
    };
  };
}
