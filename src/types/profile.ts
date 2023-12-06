export namespace Profile {
    export interface ContextValue {
        avatar: string;
        username: string;
        streak: number;
        bestStreak: number;
        winStreak: number;
        bestWinStreak: number;
        points: number;
        premiumCoins: number;
        skins: string[];
    }
}