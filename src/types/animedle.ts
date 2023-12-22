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

    export interface Answear {
        guesAnswear: string | number;
        correctness: Correctness;
        hintType: HintType;
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

    // Response
    export interface Item {
        id: string;
        solved: boolean;
        tries: number;
        title: string;
        withHint: Animedle.HintType | null;
        createdAt: Date;
        ad?: boolean;
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

    export interface SuggestionsResponse {
        data: {
            Page: {
                pageInfo: {
                    total: number;
                    currentPage: number;
                    lastPage: number;
                    hasNextPage: boolean;
                    perPage: number;
                };
                media: {
                    title: {
                        romaji: string;
                    };
                    format: Format;
                }[];
            };
        };
    }

    export interface DrawAnimeResponse {
        data: {
            Page: {
                pageInfo: {
                    total: number;
                    lastPage: number;
                    perPage: number;
                };
                media: {
                    id: number;
                    title: {
                        romaji: string;
                    };
                    format: Format;
                    popularity: number;
                }[];
            };
        };
    }
}