import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExpectionFilter } from './filters/global-exception.filter';
import { ResponseService } from './common/response/response.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.use(cookieParser());
  (app as NestExpressApplication).use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  app.useGlobalFilters(new GlobalExpectionFilter(new ResponseService()));
  await app.listen(process.env.PORT, () => console.log(`Server is listening on http://localhost:${process.env.PORT}`));
}
bootstrap();
