import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CORS_CONFIG, PORT, VALIDATION_PIPE_CONFIG } from 'config/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExpectionFilter } from './filters/global-exception.filter';
import { ResponseService } from './common/response/response.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CORS_CONFIG);
  app.use(cookieParser());
  (app as NestExpressApplication).use(helmet());
  app.useGlobalPipes(VALIDATION_PIPE_CONFIG);
  app.useGlobalFilters(new GlobalExpectionFilter(new ResponseService()));
  await app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));
}
bootstrap();
