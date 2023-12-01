import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Auth, ServerSuccessfullResponse, User as UserNamespace } from 'src/types';
import { User } from 'src/user/entities/user.entity';
import { UserObject } from 'src/decorators/user.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('/login')
  @HttpCode(200)
  async appLogin(
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }

  @Get('/logout')
  @UseGuards(AuthGuard(Auth.Strategy.Jwt))
  async logout(
    @UserObject() user: User,
  ) {
    return this.authService.logout(user);
  }

  @Get('/is-logged')
  @UseGuards(AuthGuard(Auth.Strategy.Jwt))
  async isLogged(
    @UserObject() user: User,
  ): Promise<ServerSuccessfullResponse<UserNamespace.ContextValue>> {
    return this.authService.isLogged(user.id);
  }
}

