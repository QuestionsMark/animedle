import { Injectable, Inject } from '@nestjs/common';
import { OpenaiService } from 'src/common/openai/openai.service';
import { ResponseService } from 'src/common/response/response.service';
import { Profile as ProfileNamespace, ServerSuccessfullResponse } from 'src/types';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProfileService {
    constructor(
        @Inject(ResponseService) private responseService: ResponseService,
        @Inject(OpenaiService) private openaiService: OpenaiService,
    ) { }

    async getContextValue(user: User): Promise<ProfileNamespace.ContextValue> {
        const { avatar, points, premiumCoins, streak, winStreak, skins, username } = await User.findOneOrFail({
            relations: ['avatar', 'skins'],
            where: {
                id: user.id,
            },
        });

        const response: ProfileNamespace.ContextValue = {
            avatar: avatar.id,
            points,
            premiumCoins,
            skins: skins.map(s => s.id),
            streak,
            username,
            winStreak,
        };

        return response;
    }

    async generateAvatar(user: User): Promise<void> {
        const file = await this.openaiService.generateAvatar();

        user.avatar = file;
        user.skins = [...user.skins, file];
        await user.save();
    }

    async createAvatar(user: User): Promise<ServerSuccessfullResponse<ProfileNamespace.ContextValue>> {
        await this.generateAvatar(user);

        return this.responseService.sendSuccessfullResponse(await this.getContextValue(user));
    }
}
