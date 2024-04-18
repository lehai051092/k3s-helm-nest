import { OmitType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends OmitType(CreateEmployeeDto, ['email', 'password']) {}
