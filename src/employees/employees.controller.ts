import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  CURRENT_PAGE_PAGINATION_DEFAULT,
  LIMIT_PAGINATION_DEFAULT,
  ResponseMessage,
  SORT_PAGINATION_DEFAULT,
} from '../utils';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ResponseMessage('Register a new employee.')
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @ResponseMessage('Get all employee.')
  @Get()
  findAll(
    @Query('page') page: string = CURRENT_PAGE_PAGINATION_DEFAULT.toString(),
    @Query('limit') limit: string = LIMIT_PAGINATION_DEFAULT.toString(),
    @Query('sort') sort: string = SORT_PAGINATION_DEFAULT,
    @Query('filters') filters: string = '{}',
  ) {
    return this.employeesService.findAll(+page, +limit, sort, JSON.parse(filters));
  }

  @ResponseMessage('Get employee by id.')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @ResponseMessage('Update employee by id.')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @ResponseMessage('Remove employee by id.')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
