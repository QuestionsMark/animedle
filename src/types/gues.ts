import { Animedle } from "./animedle";

export namespace Gues {
    export interface Response {
        isCorrect: boolean;
        title: string;
        animeId: number;
        answears: Animedle.Answear[];
    }
}