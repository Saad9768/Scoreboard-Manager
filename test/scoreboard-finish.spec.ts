import { Scoreboard } from '../src/app/scoreboard';
import { FoulType } from '../src/app/type/foul_enum';
import { Utils } from '../src/app/utils';

jest.mock('../src/app/utils')

describe('Scoreboard', () => {
    let scoreboard: Scoreboard;
    beforeEach(() => {
        jest.clearAllMocks()
        scoreboard = new Scoreboard();
    });

    it('should finish games correctly', () => {
        const mockedGameId1 = 'gameId1';
        const mockedGameId2 = 'gameId2';
        const homeTeam1 = 'Mexico';
        const awayTeam1 = 'Canada';
        const homeTeam2 = 'Spain';
        const awayTeam2 = 'Brazil';

        jest.mocked(Utils.guid)
            .mockReturnValueOnce(mockedGameId1)
            .mockReturnValueOnce(mockedGameId2);

        scoreboard.startGame(homeTeam1, awayTeam1);
        scoreboard.updateScore(mockedGameId1, 3, 2, 'A.B');
        scoreboard.startGame(homeTeam2, awayTeam2);
        scoreboard.updateScore(mockedGameId2, 4, 2, 'P.Q');
        scoreboard.finishGame(mockedGameId2);

        const game1 = scoreboard.getGame(mockedGameId1)
        expect(game1).toBeTruthy();
        const game2 = scoreboard.getGame(mockedGameId2)
        expect(game2).toBeUndefined();
    });
    it('should not finish the game twice', () => {
        const mockedGameId1 = 'gameId1';
        const homeTeam1 = 'Mexico';
        const awayTeam1 = 'Canada';

        jest.mocked(Utils.guid)
            .mockReturnValueOnce(mockedGameId1);

        scoreboard.startGame(homeTeam1, awayTeam1);
        const { gameDeleted: gameDeleted1, message: message1 } = scoreboard.finishGame(mockedGameId1);
        expect(gameDeleted1).toBe(true);
        expect(message1).toBe('Game deleted');
        const { gameDeleted: gameDeleted2, message: message2 } = scoreboard.finishGame(mockedGameId1);
        expect(gameDeleted2).toBe(false);
        expect(message2).toBe('Game not found or deleted');

    });

    it('should get not create a new game for the same the team twice', () => {
        const mockedGameId1 = 'gameId1';
        const homeTeam = 'Mexico';
        const awayTeam = 'Canada';

        jest.mocked(Utils.guid)
            .mockReturnValueOnce(mockedGameId1);

        const { gameId, message: message1 } = scoreboard.startGame(homeTeam, awayTeam);
        expect(message1).toBe('Game Started');

        const { message: message2 } = scoreboard.startGame(homeTeam, 'awayTeam');
        expect(message2).toBe('Game already exists');

        const { message: message3 } = scoreboard.startGame('homeTeam', awayTeam);
        expect(message3).toBe('Game already exists');
        scoreboard.finishGame(gameId);
        const { message: message11 } = scoreboard.startGame(homeTeam, awayTeam);
        expect(message11).toBe('Game Started');
    });

    it('should get not update the game once finised', () => {
        const gameId = 'gameId';
        const homeTeam = 'Mexico';
        const awayTeam = 'Canada';

        jest.mocked(Utils.guid)
            .mockReturnValueOnce(gameId);

        scoreboard.startGame(homeTeam, awayTeam);

        const { scoreUpdated: scoreUpdated10, message: updateMessage10 } = scoreboard.updateScore(gameId, 1, 0, 'A.B');
        expect(scoreUpdated10).toBe(true);
        expect(updateMessage10).toBe('Score Updated');

        const { scoreUpdated: scoreUpdated1, message: updateMessage1 } = scoreboard.updateScore(gameId, 1, 0, 'C.D');
        expect(scoreUpdated1).toBe(false);
        expect(updateMessage1).toBe('Cannot be incremented, score will be same');

        const { scoreUpdated: scoreUpdated_1, message: updateMessage_1 } = scoreboard.updateScore(gameId, -1, 0, 'E.F');
        expect(scoreUpdated_1).toBe(false);
        expect(updateMessage_1).toBe('Score should be incremented by 1');

        const { scoreUpdated: scoreUpdated0, message: updateMessage0 } = scoreboard.updateScore(gameId, 2, 1, 'F.G');
        expect(scoreUpdated0).toBe(false);
        expect(updateMessage0).toBe('Update one score at a time');

        const { gameDeleted, message: finisMessage } = scoreboard.finishGame(gameId);
        expect(gameDeleted).toBe(true);
        expect(finisMessage).toBe('Game deleted');

        const { scoreUpdated: scoreUpdated2, message: updateMessage2 } = scoreboard.updateScore(gameId, 2, 0, 'H.I');
        expect(scoreUpdated2).toBe(false);
        expect(updateMessage2).toBe('Game not found or deleted');
    });
});
