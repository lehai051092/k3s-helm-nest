import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException, ValidationPipe, VersioningType } from '@nestjs/common';
import { Transform } from './utils';
import { JwtAuthGuard } from './employees-auth/jwt/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // Config Global Guard
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Transform Response
  app.useGlobalInterceptors(new Transform(reflector));

  // Config Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Config Cookies
  // app.use(cookieParser());

  // Config CORS
  app.enableCors({
    origin:
      configService.get<string>('ENVIRONMENT') === 'production'
        ? function (origin, callback) {
            const whitelist = ['http://example1.com', 'http://example2.com']; // replace with your whitelist domains
            if (whitelist.indexOf(origin) !== -1) {
              callback(null, true);
            } else {
              callback(new InternalServerErrorException('Not allowed by CORS'));
            }
          }
        : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  // Config Versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  await app.listen(configService.get<string>('PORT'));
}

bootstrap();
