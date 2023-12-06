import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AnimedleService } from "src/animedle/animedle.service";
import { AnimedleTry } from "src/animedle/entities/animedle-try.entity";
import { Animedle } from "src/animedle/entities/animedle.entity";
import { CronExpression } from "src/types";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class CronService {
    constructor(
        @Inject(AnimedleService) private animedleService: AnimedleService
    ) { }

    async resetStreak(user: User): Promise<void> {
        user.streak = 0;
        await user.save();
    }

    @Cron(CronExpression.Every5Mins, {
        timeZone: 'Europe/Warsaw',
    })
    async updateStatistics() {
        const animedleCount = await Animedle.count();
        if (animedleCount) {
            const animedle = await this.animedleService.getActual();

            const users = await User.find();

            for (const user of users) {
                const animedleTry = await AnimedleTry.findOne({
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
                if (!animedleTry || animedleTry.gueses.length === 0) {
                    await this.resetStreak(user);
                } else {
                    if (!animedleTry.isFinished) {
                        user.winStreak = 0;
                        await user.save();
                    }
                }
            }

            const animedleTries = await AnimedleTry.find({
                where: {
                    animedle: {
                        id: animedle.id,
                    },
                    isFinished: false,
                },
            });

            for (const animedleTry of animedleTries) {
                animedleTry.isFinished = true;
                await animedleTry.save();
            }
            console.log('Users statistics successfully updated!');
        }
    }

    @Cron(CronExpression.Every5Mins, {
        timeZone: 'Europe/Warsaw',
    })
    async createNewAnimedle() {
        await this.animedleService.create();
        console.log('New animedle successfully created!');
    }
}