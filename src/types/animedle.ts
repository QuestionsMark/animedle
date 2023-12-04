import { Gues } from "./gues";

export namespace Animedle {
    export enum Format {
        TV = 'TV',
        Movie = 'MOVIE',
        Special = 'SPECIAL',
        OVA = 'OVA',
    }

    export enum Season {
        Fall = 'FALL',
        Summer = 'SUMMER',
        Winter = 'WINTER',
        Spring = 'SPRING',
    }

    export enum Correctness {
        Correct = 'Good',
        Almost = 'Almost',
        Incorrect = 'Incorrect',
    }

    export interface Answear {
        guesAnswear: string | number;
        correctness: Correctness;
        answearHint?: string;
    }

    export enum HintType {
        Genre = 'Genre',
        Year = 'Year',
        Season = 'Season',
        Episodes = 'Episodes',
        FamiliarAnime = 'Familiar Anime',
        Studio = 'Studio',
        Format = 'Format',
        AverageScore = 'Average Score',
        Popularity = 'Popularity',
    }

    export interface Hint {
        type: HintType;
        value: string | number;
    }

    export interface FreeHint {
        hintsToChoose: HintType[];
        hint: Hint | null;
    }

    export interface ContextValue {
        freeHint: FreeHint;
        gueses: Gues.Response[];
        isFinished: boolean;
    }

    export interface FormattedAnimeData {
        id: number;
        averageScore: number;
        episodes: number;
        format: Format;
        genres: string[];
        popularity: number;
        familiarAnime: number;
        season: Season;
        year: number;
        studio: string;
        title: string;
        siteUrl: string;
    }

    // axios
    export interface IsAnimeTitleCorrectResponse {
        data: {
            Page: {
                media: {
                    id: number,
                    title: {
                        romaji: string;
                    },
                    format: Animedle.Format,
                }[],
            }
        }
    }

    export interface AnimeResponse {
        data: {
            Media: {
                id: number;
                title: {
                    romaji: string;
                };
                startDate: {
                    year: number;
                };
                format: Format;
                season: Season;
                genres: string[];
                episodes: number;
                siteUrl: string;
                averageScore: number;
                popularity: number;
                studios: {
                    edges: {
                        id: number;
                        isMain: boolean;
                        node: {
                            name: string;
                        };
                    }[];
                };
                relations: {
                    edges: {
                        node: {
                            id: number;
                            format: Format;
                        };
                    }[];
                };
            };
        };
    }
}