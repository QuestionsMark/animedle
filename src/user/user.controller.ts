import { Controller, Get, Post, Body, Patch, HttpCode, UseGuards, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UseHintDto } from './dto/use-hint.dto';
import { Animedle, Auth, History, Profile, ServerSuccessfullResponse } from 'src/types';
import { AuthGuard } from '@nestjs/passport';
import { UserObject } from 'src/decorators/user.decorator';
import { User } from './entities/user.entity';
import { GuesDto } from './dto/gues.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @HttpCode(201)
    create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<ServerSuccessfullResponse<string>> {
        return this.userService.create(createUserDto);
    }

    @Post('/gues')
    @HttpCode(201)
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    gues(
        @UserObject() user: User,
        @Body() guesDto: GuesDto,
    ): Promise<ServerSuccessfullResponse<Animedle.ContextValue>> {
        return this.userService.gues(user, guesDto);
    }

    @Post('/avatar')
    @HttpCode(201)
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    createAvatar(
        @UserObject() user: User,
    ): Promise<ServerSuccessfullResponse<Profile.ContextValue>> {
        return this.userService.createAvatar(user);
    }

    @Get('/history')
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    getHistory(
        @UserObject() user: User,
    ): Promise<ServerSuccessfullResponse<History.ContextValue>> {
        return this.userService.getHistory(user);
    }

    @Get('/profile')
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    getProfile(
        @UserObject() user: User,
    ): Promise<ServerSuccessfullResponse<Profile.ContextValue>> {
        return this.userService.getProfile(user);
    }

    @Get('/skins')
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    getSkins(
        @UserObject() user: User,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ): Promise<ServerSuccessfullResponse<string[]>> {
        return this.userService.getSkins(user, page, limit);
    }

    @Patch('/hint')
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    useHint(
        @UserObject() user: User,
        @Body() useHintDto: UseHintDto,
    ): Promise<ServerSuccessfullResponse<Animedle.ContextValue>> {
        return this.userService.useHint(user, useHintDto);
    }

    @Patch('/avatar/:skinId')
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    changeAvatar(
        @UserObject() user: User,
        @Param('skinId') skinId: string,
    ): Promise<ServerSuccessfullResponse<Profile.ContextValue>> {
        return this.userService.changeAvatar(user, skinId);
    }

}
