import { Animedle } from "./animedle";

export namespace Gues {
    export interface Response {
        isCorrect: boolean;
        title: string;
        answears: Animedle.Answear[];
    }
}