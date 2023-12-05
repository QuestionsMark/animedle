import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnimedleService } from './animedle.service';
import { Animedle, Auth, ServerSuccessfullResponse } from 'src/types';
import { AuthGuard } from '@nestjs/passport';
import { UserObject } from 'src/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('animedle')
export class AnimedleController {
    constructor(private readonly animedleService: AnimedleService) { }

    @Get()
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    findActual(
        @UserObject() user: User,
    ): Promise<ServerSuccessfullResponse<Animedle.ContextValue>> {
        return this.animedleService.findActual(user);
    }

    @Get('/suggestions')
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    @UseGuards(AuthGuard(Auth.Strategy.Jwt))
    findSuggestions(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
    ): Promise<ServerSuccessfullResponse<string[]>> {
        return this.animedleService.findSuggestions(page, limit, search);
    }
}
