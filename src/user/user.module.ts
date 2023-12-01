import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ResponseModule } from 'src/common/response/response.module';
import { AuthModule } from 'src/auth/auth.module';
import { AnimedleModule } from 'src/animedle/animedle.module';

@Module({
  imports: [
    ResponseModule,
    forwardRef(() => AuthModule),
    AnimedleModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
