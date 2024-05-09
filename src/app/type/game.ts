import { FoulType } from "./foul_enum";

type Goal = {
    playerInitials: string;
    scoreTime: number;
};
type Foul = {
    playerInitials: string;
    foulTime: number;
    foulType: FoulType;
};
export type Game = {
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    startTime: number;
    goals: Goal[];
    fouls: Foul[];
};