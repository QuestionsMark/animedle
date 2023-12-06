import { Animedle } from "./animedle";

export namespace History {
    export interface ContextValue {
        animedles: Animedle.Item[];
    }
}