import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Animedle as AnimedleNamespace, ServerSuccessfullResponse, User as UserNamespace } from 'src/types';
import { User } from './entities/user.entity';
import { ResponseService } from 'src/common/response/response.service';
import { AuthService } from 'src/auth/auth.service';
import { UseHintDto } from './dto/use-hint.dto';
import { AnimedleService } from 'src/animedle/animedle.service';
import { AnimedleTry } from 'src/animedle/entities/animedle-try.entity';

@Injectable()
export class UserService {
    constructor(
        @Inject(ResponseService) private responseService: ResponseService,
        @Inject(AuthService) private authService: AuthService,
        @Inject(AnimedleService) private animedleService: AnimedleService,
    ) { }

    async getUserResponse(id: string): Promise<UserNamespace.ContextValue> {
        const { username } = await User.findOneOrFail({
            where: {
                id,
            },
        });

        return {
            id,
            username,
        };
    }

    async create(createUserDto: CreateUserDto): Promise<ServerSuccessfullResponse<string>> {
        const { confirmPassword, email, password, username } = createUserDto;

        // Validation to do

        const newUser = new User();
        newUser.avatar = null;
        newUser.passwordHash = await this.authService.hashPassword(password);
        newUser.email = email;
        newUser.username = username;
        await newUser.save();

        return this.responseService.sendSuccessfullResponse('Successfully created an account!');
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    async useHint(user: User, useHintDto: UseHintDto): Promise<ServerSuccessfullResponse<AnimedleNamespace.ContextValue>> {
        const { hint } = useHintDto;

        const animedle = await this.animedleService.getActual();

        const animedleTry = await AnimedleTry.findOneOrFail({
            where: {
                user: {
                    id: user.id,
                },
                animedle: {
                    id: animedle.id,
                },
            },
        });

        switch (hint) {
            case AnimedleNamespace.HintType.AverageRate: {
                animedleTry.hintType = AnimedleNamespace.HintType.AverageRate;
                animedleTry.hint = String(animedle.averageRate);
                await animedleTry.save();
                break;
            }

            case AnimedleNamespace.HintType.Episodes: {
                animedleTry.hintType = AnimedleNamespace.HintType.Episodes;
                animedleTry.hint = String(animedle.episodes);
                await animedleTry.save();
                break;
            }

            case AnimedleNamespace.HintType.FamiliarAnime: {
                animedleTry.hintType = AnimedleNamespace.HintType.FamiliarAnime;
                animedleTry.hint = String(animedle.familiarAnime);
                await animedleTry.save();
                break;
            }

            case AnimedleNamespace.HintType.Format: {
                animedleTry.hintType = AnimedleNamespace.HintType.Format;
                animedleTry.hint = animedle.format;
                await animedleTry.save();
                break;
            }

            case AnimedleNamespace.HintType.Genre: {
                animedleTry.hintType = AnimedleNamespace.HintType.Genre;
                const genres = [...animedle.genres];
                const drawedGenres: string[] = [];
                for (let i = 0; i < 2; i++) {
                    const index = Math.floor(Math.random() * genres.length);
                    drawedGenres.push(genres[index]);
                    genres.splice(index, 1);
                }
                animedleTry.hint = drawedGenres.join(', ');
                await animedleTry.save();
                break;
            }

            case AnimedleNamespace.HintType.Popularity: {
                animedleTry.hintType = AnimedleNamespace.HintType.Popularity;
                animedleTry.hint = Intl.NumberFormat('en', { maximumSignificantDigits: 2 }).format(animedle.popularity);
                await animedleTry.save();
                break;
            }

            case AnimedleNamespace.HintType.Season: {
                animedleTry.hintType = AnimedleNamespace.HintType.Season;
                animedleTry.hint = animedle.season;
                await animedleTry.save();
                break;
            }

            case AnimedleNamespace.HintType.Studio: {
                animedleTry.hintType = AnimedleNamespace.HintType.Studio;
                animedleTry.hint = animedle.studio;
                await animedleTry.save();
                break;
            }

            case AnimedleNamespace.HintType.Year: {
                animedleTry.hintType = AnimedleNamespace.HintType.Year;
                animedleTry.hint = String(animedle.year);
                await animedleTry.save();
                break;
            }
        }

        return this.responseService.sendSuccessfullResponse(await this.animedleService.getContextValue(user));
    }
}
