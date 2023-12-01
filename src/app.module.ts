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

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_CONNECTION.options),
    ResponseModule,
    AuthModule,
    UserModule,
    FileModule,
    AnimedleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
