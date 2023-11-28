import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Auth, ServerSuccessfullResponse, User as UserNamespace } from 'src/types';
import { User } from 'src/user/entities/user.entity';
import { UserObject } from 'src/decorators/user.decorator';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Get('/logout')
  @UseGuards(AuthGuard(Auth.Strategy.Jwt))
  async logout(
    @UserObject() user: User,
    @Res() res: Response,
  ) {
    return this.authService.logout(user, res);
  }

  @Get('/is-logged')
  @UseGuards(AuthGuard(Auth.Strategy.Jwt))
  async isLogged(
    @UserObject() user: User,
  ): Promise<ServerSuccessfullResponse<UserNamespace.Response>> {
    return this.authService.isLogged(user.id);
  }
}

