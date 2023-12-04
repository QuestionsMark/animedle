import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Animedle as AnimedleNamespace, ServerSuccessfullResponse } from 'src/types';
import { Animedle } from './entities/animedle.entity';
import { ResponseService } from 'src/common/response/response.service';
import { User } from 'src/user/entities/user.entity';
import { AnimedleTry } from './entities/animedle-try.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AnimedleService {
    constructor(
        @Inject(ResponseService) private responseService: ResponseService,
        private readonly httpService: HttpService,
    ) { }

    private anilistAddress = 'https://graphql.anilist.co';

    async callAnilistApi<T>(query: string, variables: { [key: string]: any }): Promise<T> {
        const response = await this.httpService.axiosRef.post<T>(this.anilistAddress, JSON.stringify({
            query,
            variables,
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        return response.data;
    }

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
        const { gueses, hint, hintType, isFinished } = await AnimedleTry.findOneOrFail({
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

        const response: AnimedleNamespace.ContextValue = {
            freeHint: {
                hint: hint ? {
                    type: hintType,
                    value: hint,
                } : null,
                hintsToChoose: animedle.hintsToChoose,
            },
            gueses: gueses.sort((a, b) => +a.createdAt - +b.createdAt).map(({ animeId, answearsJSON, isCorrect, title }) => ({
                animeId,
                answears: JSON.parse(answearsJSON),
                isCorrect,
                title,
            })),
            isFinished,
        };

        return response;
    }

    async isAnimeTitleCorrect(title: string): Promise<number | null> {
        const query = `
        query ($id: Int, $page: Int, $perPage: Int, $search: String) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                media (id: $id, search: $search) {
                    id
                    title {
                    romaji
                    }
                    format
                }
            }
        }
        `;

        const variables = {
            search: title,
            page: 1,
            perPage: 20,
        };

        const data = await this.callAnilistApi<AnimedleNamespace.IsAnimeTitleCorrectResponse>(query, variables);

        const anime = data.data.Page.media.find(a => a.title.romaji.toLowerCase() === title.toLowerCase() && [AnimedleNamespace.Format.Movie, AnimedleNamespace.Format.OVA, AnimedleNamespace.Format.Special, AnimedleNamespace.Format.TV].includes(a.format));

        return !anime ? null : anime.id;
    }

    async getAnime(animeId: number): Promise<AnimedleNamespace.AnimeResponse> {
        const query = `
        query ($id: Int) {
            Media (id: $id, type: ANIME) {
              id
              title {
                romaji
              }
              startDate {
                year
              }
              format
              season
              genres
              episodes
              siteUrl
              averageScore
              popularity
              studios {
                edges {
                  id
                  isMain
                  node {
                    name
                  }
                }
              }
              relations {
                edges {
                  node {
                    id
                    format
                  }
                }
              }
            }
          }
        `;

        const variables = {
            id: animeId,
        };

        return this.callAnilistApi<AnimedleNamespace.AnimeResponse>(query, variables);
    }

    getFormattedAnimeData(anime: AnimedleNamespace.AnimeResponse): AnimedleNamespace.FormattedAnimeData {
        const { averageScore, episodes, format, genres, id, popularity, relations, season, siteUrl, startDate, studios, title } = anime.data.Media;

        return {
            averageScore,
            episodes,
            familiarAnime: relations.edges.filter(a => [AnimedleNamespace.Format.Movie, AnimedleNamespace.Format.OVA, AnimedleNamespace.Format.Special, AnimedleNamespace.Format.TV].includes(a.node.format)).length,
            format,
            genres,
            id,
            popularity,
            season,
            siteUrl,
            studio: studios.edges.find(s => s.isMain)?.node.name || studios.edges[0].node.name,
            title: title.romaji,
            year: startDate.year,
        };
    }

    getAnswears(anime: AnimedleNamespace.AnimeResponse, actualAnime: AnimedleNamespace.AnimeResponse): AnimedleNamespace.Answear[] {
        const formattedAnimeData = this.getFormattedAnimeData(anime);
        const { averageScore, episodes, familiarAnime, format, genres, popularity, season, studio, year } = formattedAnimeData;
        const formattedActualAnimeData = this.getFormattedAnimeData(actualAnime);
        const { averageScore: actualAverageScore, episodes: actualEpisodes, familiarAnime: actualFamiliarAnime, format: actualFormat, genres: actualGenres, popularity: actualPopularity, season: actualSeason, studio: actualStudio, year: actualYear } = formattedActualAnimeData;
        const answears: AnimedleNamespace.Answear[] = [];

        if (averageScore.toFixed(1) === actualAverageScore.toFixed(1)) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: averageScore / 10,
            });
        } else if (Math.abs(averageScore - actualAverageScore) <= 0.5) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Almost,
                guesAnswear: averageScore / 10,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: averageScore / 10,
            });
        }

        if (episodes === actualEpisodes) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: episodes,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: episodes,
            });
        }

        if (familiarAnime === actualFamiliarAnime) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: familiarAnime,
            });
        } else if (Math.abs(familiarAnime - actualFamiliarAnime) === 1) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Almost,
                guesAnswear: familiarAnime,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: familiarAnime,
            });
        }

        if (format === actualFormat) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: format,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: format,
            });
        }

        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        if (actualGenres.includes(randomGenre)) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: randomGenre,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: randomGenre,
            });
        }

        if (Math.abs(popularity - actualPopularity) <= popularity * 0.1) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: Intl.NumberFormat('en', { maximumSignificantDigits: 2 }).format(popularity),
            });
        } else if (Math.abs(popularity - actualPopularity) <= popularity * 0.2) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Almost,
                guesAnswear: Intl.NumberFormat('en', { maximumSignificantDigits: 2 }).format(popularity),
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: Intl.NumberFormat('en', { maximumSignificantDigits: 2 }).format(popularity),
            });
        }

        if (season === actualSeason) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: season,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: season,
            });
        }

        if (studio === actualStudio) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: studio,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: studio,
            });
        }

        if (year === actualYear) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: year,
            });
        } else if (Math.abs(popularity - actualPopularity) <= 2) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Almost,
                guesAnswear: year,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: year,
            });
        }

        return answears;
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
