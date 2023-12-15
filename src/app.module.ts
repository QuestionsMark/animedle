import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModule } from './common/response/response.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { AnimedleModule } from './animedle/animedle.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './common/cron/cron.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'config/.env',
    }),
    TypeOrmModule.forRoot(new DataSource({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ["dist/**/**.entity{.ts,.js}"],
      bigNumberStrings: false,
      logging: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',  // on production have to be false!!!
    }).options),
    ScheduleModule.forRoot(),
    ResponseModule,
    AuthModule,
    UserModule,
    FileModule,
    AnimedleModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
