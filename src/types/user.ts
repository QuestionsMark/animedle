export namespace User {
    //Response
    export interface ContextValue {
        id: string;
        username: string;
        review: number | null;
    }

    export interface RankingItem {
        id: string;
        username: string;
        points: number;
        bestWinStreak: number;
        avatar: string;
        ad?: boolean;
        top?: number;
    }
}