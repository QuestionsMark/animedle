import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Animedle as AnimedleNamespace, ServerSuccessfullResponse } from 'src/types';
import { Animedle } from './entities/animedle.entity';
import { ResponseService } from 'src/common/response/response.service';
import { User } from 'src/user/entities/user.entity';
import { AnimedleTry } from './entities/animedle-try.entity';
import { HttpService } from '@nestjs/axios';
import { ANIME_POPULARITY_MIN } from 'config/config';

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
            averageScore: averageScore || 0,
            episodes,
            familiarAnime: relations.edges.filter(a => [AnimedleNamespace.Format.Movie, AnimedleNamespace.Format.OVA, AnimedleNamespace.Format.Special, AnimedleNamespace.Format.TV].includes(a.node.format)).length,
            format,
            genres,
            id,
            popularity,
            season,
            siteUrl,
            studio: studios.edges.find(s => s.isMain)?.node.name || studios.edges[0]?.node.name || '-',
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
                hintType: AnimedleNamespace.HintType.AverageScore,
            });
        } else if (Math.abs(averageScore - actualAverageScore) <= 0.5) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Almost,
                guesAnswear: averageScore / 10,
                hintType: AnimedleNamespace.HintType.AverageScore,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: averageScore / 10,
                hintType: AnimedleNamespace.HintType.AverageScore,
            });
        }

        if (episodes === actualEpisodes) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: episodes,
                hintType: AnimedleNamespace.HintType.Episodes,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: episodes,
                hintType: AnimedleNamespace.HintType.Episodes,
            });
        }

        if (familiarAnime === actualFamiliarAnime) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: familiarAnime,
                hintType: AnimedleNamespace.HintType.FamiliarAnime,
            });
        } else if (Math.abs(familiarAnime - actualFamiliarAnime) === 1) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Almost,
                guesAnswear: familiarAnime,
                hintType: AnimedleNamespace.HintType.FamiliarAnime,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: familiarAnime,
                hintType: AnimedleNamespace.HintType.FamiliarAnime,
            });
        }

        if (format === actualFormat) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: format,
                hintType: AnimedleNamespace.HintType.Format,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: format,
                hintType: AnimedleNamespace.HintType.Format,
            });
        }

        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        if (actualGenres.includes(randomGenre)) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: randomGenre,
                hintType: AnimedleNamespace.HintType.Genre,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: randomGenre,
                hintType: AnimedleNamespace.HintType.Genre,
            });
        }

        if (Math.abs(popularity - actualPopularity) <= popularity * 0.1) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: Intl.NumberFormat('en', { maximumSignificantDigits: 2 }).format(popularity),
                hintType: AnimedleNamespace.HintType.Popularity,
            });
        } else if (Math.abs(popularity - actualPopularity) <= popularity * 0.2) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Almost,
                guesAnswear: Intl.NumberFormat('en', { maximumSignificantDigits: 2 }).format(popularity),
                hintType: AnimedleNamespace.HintType.Popularity,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: Intl.NumberFormat('en', { maximumSignificantDigits: 2 }).format(popularity),
                hintType: AnimedleNamespace.HintType.Popularity,
            });
        }

        if (season === actualSeason) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: season,
                hintType: AnimedleNamespace.HintType.Season,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: season || '-',
                hintType: AnimedleNamespace.HintType.Season,
            });
        }

        if (studio === actualStudio) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: studio,
                hintType: AnimedleNamespace.HintType.Studio,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: studio,
                hintType: AnimedleNamespace.HintType.Studio,
            });
        }

        if (year === actualYear) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Correct,
                guesAnswear: year,
                hintType: AnimedleNamespace.HintType.Year,
            });
        } else if (Math.abs(popularity - actualPopularity) <= 2) {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Almost,
                guesAnswear: year,
                hintType: AnimedleNamespace.HintType.Year,
            });
        } else {
            answears.push({
                correctness: AnimedleNamespace.Correctness.Incorrect,
                guesAnswear: year,
                hintType: AnimedleNamespace.HintType.Year,
            });
        }

        return answears;
    }

    async create(): Promise<void> {
        const query = `
        query ($page: Int, $perPage: Int, $format_in: [MediaFormat], $popularity_greater: Int) {
            Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                lastPage
                perPage
            }
            media (popularity_greater: $popularity_greater, format_in: $format_in) {
                id
                title {
                romaji
                }
                format
                popularity
            }
            }
        }
        `;

        const getVariables = () => {
            return {
                page: Math.floor(Math.random() * 3 + 1),
                perPage: 50,
                format_in: [AnimedleNamespace.Format.Movie, AnimedleNamespace.Format.OVA, AnimedleNamespace.Format.Special, AnimedleNamespace.Format.TV],
                popularity_greater: ANIME_POPULARITY_MIN,
            };
        }

        const data = await this.callAnilistApi<AnimedleNamespace.DrawAnimeResponse>(query, getVariables());
        const { id, title } = data.data.Page.media[Math.floor(Math.random() * data.data.Page.media.length)];
        const hints = [AnimedleNamespace.HintType.AverageScore, AnimedleNamespace.HintType.Episodes, AnimedleNamespace.HintType.FamiliarAnime, AnimedleNamespace.HintType.Format, AnimedleNamespace.HintType.Genre, AnimedleNamespace.HintType.Popularity, AnimedleNamespace.HintType.Season, AnimedleNamespace.HintType.Studio, AnimedleNamespace.HintType.Year];
        const hintsToChoose: AnimedleNamespace.HintType[] = [];
        for (let i = 0; i < 3; i++) {
            const index = Math.floor(Math.random() * hints.length);
            hintsToChoose.push(hints[index]);
            hints.splice(index, 1);
        }

        const newAnimedle = new Animedle();
        newAnimedle.anime = title.romaji;
        newAnimedle.animeId = id;
        newAnimedle.hintsToChoose = hintsToChoose;
        await newAnimedle.save();
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

    async findSuggestions(page: number, limit: number, search: string): Promise<ServerSuccessfullResponse<string[]>> {
        const query = `
        query ($id: Int, $page: Int, $perPage: Int, $search: String, $format_in: [MediaFormat]) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (id: $id, search: $search, format_in: $format_in) {
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
            page,
            perPage: limit,
            search,
            format_in: [AnimedleNamespace.Format.Movie, AnimedleNamespace.Format.OVA, AnimedleNamespace.Format.Special, AnimedleNamespace.Format.TV],
        };

        const anime = await this.callAnilistApi<AnimedleNamespace.SuggestionsResponse>(query, variables);

        const suggestions = Array.from(new Set(anime.data.Page.media.map(a => a.title.romaji)));

        return this.responseService.sendSuccessfullResponse(suggestions, 0);
    }
}
