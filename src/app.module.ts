import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONNECTION } from 'config/db.config';
import { ResponseModule } from './common/response/response.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { AnimedleModule } from './animedle/animedle.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './common/cron/cron.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_CONNECTION.options),
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
