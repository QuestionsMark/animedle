import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Animedle as AnimedleNamespace, ServerSuccessfullResponse } from 'src/types';
import { Animedle } from './entities/animedle.entity';
import { ResponseService } from 'src/common/response/response.service';
import { User } from 'src/user/entities/user.entity';
import { AnimedleTry } from './entities/animedle-try.entity';

@Injectable()
export class AnimedleService {
    constructor(
        @Inject(ResponseService) private responseService: ResponseService,
    ) { }

    async getActual(): Promise<Animedle> {
        const animedles = await Animedle.find({
            take: 1,
            order: {
                createdAt: 'DESC',
            },
        });
        if (!animedles.length) throw new NotFoundException('Animedle not found!');

        return animedles[0];
    }

    async getContextValue(user: User): Promise<AnimedleNamespace.ContextValue> {
        const animedle = await this.getActual();
        const { gueses, hint, hintType } = await AnimedleTry.findOneOrFail({
            relations: ['gueses'],
            where: {
                user: {
                    id: user.id,
                },
                animedle: {
                    id: animedle.id,
                },
            },
        });

        return {
            freeHint: {
                hint: hint ? {
                    type: hintType,
                    value: hint,
                } : null,
                hintsToChoose: animedle.hintsToChoose,
            },
            gueses: gueses.map(({ answearsJSON, isCorrect, title }) => ({
                answears: JSON.parse(answearsJSON),
                isCorrect,
                title,
            })),
        } as AnimedleNamespace.ContextValue;
    }

    create() {
        return 'This action adds a new animedle';
    }

    async findActual(user: User): Promise<ServerSuccessfullResponse<AnimedleNamespace.ContextValue>> {
        const animedle = await this.getActual();
        const animedleTry = await AnimedleTry.findOne({
            where: {
                user: {
                    id: user.id,
                },
                animedle: {
                    id: animedle.id,
                },
            },
        });

        if (!animedleTry) {
            const newAnimedleTry = new AnimedleTry();
            newAnimedleTry.gueses = [];
            newAnimedleTry.hint = null;
            newAnimedleTry.hintType = null;
            await newAnimedleTry.save();
            newAnimedleTry.user = user;
            newAnimedleTry.animedle = animedle;
            await newAnimedleTry.save();
        }

        return this.responseService.sendSuccessfullResponse(await this.getContextValue(user));
    }
}
