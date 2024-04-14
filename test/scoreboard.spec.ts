import { Scoreboard } from '../src/app/scoreboard';
import { Utils } from '../src/app/utils';

jest.mock('../src/app/utils')

describe('Scoreboard', () => {
  let scoreboard: Scoreboard;
  beforeEach(() => {
    jest.clearAllMocks()
    scoreboard = new Scoreboard();
  });

  it('should initializes with an empty list of games', () => {
    expect(scoreboard.getSummary()).toEqual([]);
  });

  it('should starts a game correctly', () => {
    const mockedGameId = 'bba845dd-bd61-e6da-804a-e9bd2d777e1b'
    jest.mocked(Utils.guid).mockReturnValueOnce(mockedGameId);
    const { gameId, message } = scoreboard.startGame('Home', 'Away');
    expect(gameId).toBe(mockedGameId);
    expect(message).toBe('Game Started');
    expect(scoreboard.getGame(gameId)).toEqual({
      gameId: mockedGameId,
      homeTeam: 'Home',
      awayTeam: 'Away',
      homeScore: 0,
      awayScore: 0,
      startTime: expect.any(Number)
    });
  });

  it('should update scores correctly', () => {
    const gameId1 = 'gameId1';
    const homeTeam = 'Mexico';
    const awayTeam = 'Canada';

    jest.mocked(Utils.guid).mockReturnValueOnce(gameId1);

    const { gameId } = scoreboard.startGame(homeTeam, awayTeam);
    const updateResult = scoreboard.updateScore(gameId, 3, 2);
    expect(updateResult).toEqual({ scoreUpdated: true, message: 'Score Updated' });
    expect(scoreboard.getGame(gameId)).toEqual({
      gameId: gameId1,
      homeTeam,
      awayTeam,
      homeScore: 3,
      awayScore: 2,
      startTime: expect.any(Number)
    });
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
    scoreboard.updateScore(mockedGameId1, 3, 2);
    scoreboard.startGame(homeTeam2, awayTeam2);
    scoreboard.updateScore(mockedGameId2, 4, 2);
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

  it('should get the games correctly', () => {
    const gameId = 'gameId';
    const homeTeam = 'Mexico';
    const awayTeam = 'Canada';

    jest.mocked(Utils.guid)
      .mockReturnValueOnce(gameId);
    scoreboard.startGame(homeTeam, awayTeam);
    scoreboard.updateScore(gameId, 3, 2);
    expect(scoreboard.getGame(gameId)).toEqual(
      { gameId, homeTeam, awayTeam, homeScore: 3, awayScore: 2, startTime: expect.any(Number) }
    );
    scoreboard.updateScore(gameId, 5, 4);
    expect(scoreboard.getGame(gameId)).toEqual(
      { gameId, homeTeam, awayTeam, homeScore: 5, awayScore: 4, startTime: expect.any(Number) }
    );
  });

  it('should get not create a new game for the same the team twice', () => {
    const mockedGameId1 = 'gameId1';
    const homeTeam = 'Mexico';
    const awayTeam = 'Canada';

    jest.mocked(Utils.guid)
      .mockReturnValueOnce(mockedGameId1);

    const { message: message1 } = scoreboard.startGame(homeTeam, awayTeam);
    expect(message1).toBe('Game Started');

    const { message: message2 } = scoreboard.startGame(homeTeam, 'awayTeam');
    expect(message2).toBe('Game already exists');

    const { message: message3 } = scoreboard.startGame('homeTeam', awayTeam);
    expect(message3).toBe('Game already exists');
  });

  it('should get not update the game once finised', () => {
    const gameId = 'gameId';
    const homeTeam = 'Mexico';
    const awayTeam = 'Canada';

    jest.mocked(Utils.guid)
      .mockReturnValueOnce(gameId);

    scoreboard.startGame(homeTeam, awayTeam);

    const { scoreUpdated: scoreUpdated1, message: updateMessage1 } = scoreboard.updateScore(gameId, 3, 2);
    expect(scoreUpdated1).toBe(true);
    expect(updateMessage1).toBe('Score Updated');

    const { gameDeleted, message: finisMessage } = scoreboard.finishGame(gameId);
    expect(gameDeleted).toBe(true);
    expect(finisMessage).toBe('Game deleted');

    const { scoreUpdated: scoreUpdated2, message: updateMessage2 } = scoreboard.updateScore(gameId, 3, 2);
    expect(scoreUpdated2).toBe(false);
    expect(updateMessage2).toBe('Game not found or deleted');
  });

  it('should sort games correctly in summary', () => {
    const mockedGameId1 = 'gameId1';
    const mockedGameId2 = 'gameId2';
    const mockedGameId3 = 'gameId3';
    const mockedGameId4 = 'gameId4';

    const homeTeam1 = 'Mexico';
    const awayTeam1 = 'Canada';
    const homeTeam2 = 'Spain';
    const awayTeam2 = 'Brazil';
    const homeTeam3 = 'Germany';
    const awayTeam3 = 'Portugal';
    const homeTeam4 = 'Hungary';
    const awayTeam4 = 'Austria';


    jest.mocked(Utils.guid)
      .mockReturnValueOnce(mockedGameId1)
      .mockReturnValueOnce(mockedGameId2)
      .mockReturnValueOnce(mockedGameId3)
      .mockReturnValueOnce(mockedGameId4);

    scoreboard.startGame(homeTeam1, awayTeam1);
    scoreboard.updateScore(mockedGameId1, 3, 2);

    scoreboard.startGame(homeTeam2, awayTeam2);
    scoreboard.updateScore(mockedGameId2, 4, 2);

    scoreboard.startGame(homeTeam3, awayTeam3);
    scoreboard.updateScore(mockedGameId3, 1, 1);

    scoreboard.startGame(homeTeam4, awayTeam4);
    scoreboard.updateScore(mockedGameId4, 1, 1);

    scoreboard.finishGame(mockedGameId3);

    const summary = scoreboard.getSummary();

    expect(summary.length).toBe(3);

    expect(summary).toEqual([
      { gameId: mockedGameId2, homeTeam: homeTeam2, awayTeam: awayTeam2, homeScore: 4, awayScore: 2, startTime: expect.any(Number) },
      { gameId: mockedGameId1, homeTeam: homeTeam1, awayTeam: awayTeam1, homeScore: 3, awayScore: 2, startTime: expect.any(Number) },
      { gameId: mockedGameId4, homeTeam: homeTeam4, awayTeam: awayTeam4, homeScore: 1, awayScore: 1, startTime: expect.any(Number) }
    ]);
  });
});