import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ResponseModule } from 'src/common/response/response.module';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ResponseModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
  ],
  exports: [
    JwtStrategy,
    AuthService,
  ],
})
export class AuthModule { }
