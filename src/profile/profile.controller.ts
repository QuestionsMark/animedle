import { Controller, Get, UseGuards, Post, HttpCode } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { UserObject } from 'src/decorators/user.decorator';
import { Auth, Profile, ServerSuccessfullResponse } from 'src/types';
import { User } from 'src/user/entities/user.entity';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get()
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    findOne(
        @UserObject() user: User,
    ): Promise<ServerSuccessfullResponse<Profile.ContextValue>> {
        return this.profileService.findOne(user);
    }

    @Post('/generate-avatar')
    @HttpCode(201)
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    test(
        @UserObject() user: User,
    ): Promise<ServerSuccessfullResponse<Profile.ContextValue>> {
        return this.profileService.createAvatar(user);
    }
}
