import { Module } from '@nestjs/common';
import { EmployeesAuthService } from './employees-auth.service';
import { EmployeesAuthController } from './employees-auth.controller';
import { EmployeesModule } from '../employees/employees.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    EmployeesModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EmployeesAuthController],
  providers: [EmployeesAuthService, LocalStrategy, JwtStrategy],
  exports: [EmployeesAuthService],
})
export class EmployeesAuthModule {}
