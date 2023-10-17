import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Vass API')
    .setVersion('1.0')
    .setDescription(
      'The User API allows clients to manage user-related operations. The auth endpoints enable clients to register and log in. The customer endpoints are designed for clients to manage customer information.',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(cookieParser());

  // Strip any properties from the incoming data that do not have corresponding properties in the DTO class.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get(ConfigService);
  const PORT = configService.get('APP_PORT');

  await app.listen(PORT);
}
bootstrap();
