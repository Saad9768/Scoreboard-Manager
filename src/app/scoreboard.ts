import { Utils } from "./utils";
type Goal = {
    playerInitials: string;
    scoreTime: number;
};
type Game = {
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    startTime: number;
    goals: Goal[];
};

export class Scoreboard {
    private games: Map<string, Game>;
    private gameInProgress: Map<string, string>;
    private sortedGames: Game[];

    constructor() {
        this.games = new Map();
        this.gameInProgress = new Map();
        this.sortedGames = [];
    }

    startGame(homeTeam: string, awayTeam: string) {
        const homeTeamGameId = this.gameInProgress.get(homeTeam);
        const awayTeamGameId = this.gameInProgress.get(awayTeam);
        if (homeTeamGameId) {
            return {
                gameId: homeTeamGameId,
                message: 'Game already exists'
            };
        }
        if (awayTeamGameId) {
            return {
                gameId: awayTeamGameId,
                message: 'Game already exists'
            };
        }
        return this.createGame(homeTeam, awayTeam);
    }

    private createGame(homeTeam: string, awayTeam: string) {
        const gameId = Utils.guid();
        const game: Game = {
            gameId,
            homeTeam,
            awayTeam,
            homeScore: 0,
            awayScore: 0,
            startTime: Date.now(),
            goals: []
        };
        this.games.set(gameId, game);
        this.gameInProgress.set(homeTeam, gameId);
        this.gameInProgress.set(awayTeam, gameId);
        this.sortedGames.push(game)
        return { gameId, message: 'Game Started' }
    }

    getGame(gameId: string) {
        return this.games.get(gameId);
    }

    private checkScore(game: Game, homeScore: number, awayScore: number) {
        const { homeScore: currentHomeScore, awayScore: currentAwayScore } = game;

        if (currentHomeScore === homeScore && currentAwayScore === awayScore) {
            return { scoreUpdated: false, message: 'Cannot be incremented, score will be same' }
        }
        if (homeScore - currentHomeScore !== 1 && awayScore - currentAwayScore !== 1) {
            return { scoreUpdated: false, message: 'Score should be incremented by 1' }
        }
        if (homeScore !== currentHomeScore && awayScore !== currentAwayScore) {
            return { scoreUpdated: false, message: 'Update one score at a time' }
        }
    }

    updateScore(gameId: string, homeScore: number, awayScore: number, playerInitials: string) {
        const game = this.getGame(gameId);
        if (!game) {
            return { scoreUpdated: false, message: 'Game not found or deleted' }
        }
        const inValidScoreMessage = this.checkScore(game, homeScore, awayScore)
        if (inValidScoreMessage) {
            return inValidScoreMessage;
        }
        const { goals } = game;
        this.removeGameFromSortedGames(game);
        if (homeScore) {
            game.homeScore = homeScore
        }
        if (awayScore) {
            game.awayScore = awayScore
        }
        goals.push({
            playerInitials,
            scoreTime: new Date().getTime()
        })
        this.insertGameIntoSortedArray(game);
        return { scoreUpdated: true, message: 'Score Updated' }
    }

    finishGame(gameId: string) {
        const game = this.getGame(gameId);
        if (!game) {
            return { gameDeleted: false, message: 'Game not found or deleted' }
        }
        this.games.delete(gameId);
        this.gameInProgress.delete(game.homeTeam);
        this.gameInProgress.delete(game.awayTeam);
        this.removeGameFromSortedGames(game);
        return { gameDeleted: true, message: 'Game deleted' }
    }

    getSummary(): Game[] {
        return this.sortedGames;
    }

    private removeGameFromSortedGames(game: Game) {
        const gameIndex = this.findGameIndexByGameId(game);
        if (gameIndex !== -1) {
            this.sortedGames.splice(gameIndex, 1)
        }
    }
    private findGameIndexByGameId(game: Game) {
        let low = 0;
        let high = this.sortedGames.length - 1;
        const gameScore = game.homeScore + game.awayScore;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const midGame = this.sortedGames[mid];
            const midScore = midGame.homeScore + midGame.awayScore;
            if (midScore === gameScore) {
                if (midGame.gameId === game.gameId) {
                    return mid;
                } else {
                    let left = mid - 1;
                    let right = mid + 1;
                    const sameLeftGameScore = left >= 0 && this.sortedGames[left].homeScore + this.sortedGames[left].awayScore;
                    while (left >= low && sameLeftGameScore === gameScore) {
                        if (this.sortedGames[left].gameId === game.gameId) {
                            return left;
                        }
                        left--;
                    }
                    const sameRightGameScore = right >= 0 && this.sortedGames[right].homeScore + this.sortedGames[right].awayScore;
                    while (right <= high && sameRightGameScore === gameScore) {
                        if (this.sortedGames[right].gameId === game.gameId) {
                            return right;
                        }
                        right++;
                    }
                    return -1;
                }
            } else if (midScore > gameScore) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    private insertGameIntoSortedArray(newGame: Game) {
        const totalScoreNewGame = newGame.homeScore + newGame.awayScore;

        let low = 0;
        let high = this.sortedGames.length - 1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const totalScoreMid = this.sortedGames[mid].homeScore + this.sortedGames[mid].awayScore;

            if (totalScoreMid > totalScoreNewGame) {
                low = mid + 1;
            } else if (totalScoreMid < totalScoreNewGame) {
                high = mid - 1;
            } else {
                if (this.sortedGames[mid].startTime <= newGame.startTime) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
        }
        this.sortedGames.splice(low, 0, newGame);
    }
}