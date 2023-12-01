import { Gues } from "./gues";

export namespace Animedle {
    export enum Format {
        TV = 'TV',
        TVShort = 'TV short',
        Movie = 'Movie',
        Special = 'Special',
        OVA = 'OVA',
        ONA = 'ONA',
        Music = 'Music',
    }

    export enum Season {
        Fall = 'Fall',
        Summer = 'Summer',
        Winter = 'Winter',
        Spring = 'Spring',
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
        AverageRate = 'Average Rate',
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
    }
}