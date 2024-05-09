import { Scoreboard } from '../src/app/scoreboard';
import { Utils } from '../src/app/utils';

jest.mock('../src/app/utils')

describe('Scoreboard:Update Special', () => {
  let scoreboard: Scoreboard;
  beforeEach(() => {
    jest.clearAllMocks()
    scoreboard = new Scoreboard();
  });

  it('should update scores correctly', () => {
    const gameId1 = 'gameId1';
    const homeTeam = 'Mexico';
    const awayTeam = 'Canada';
    const playerInitials = 'A.B';

    jest.mocked(Utils.guid).mockReturnValueOnce(gameId1);

    
    const { gameId } = scoreboard.startGame(homeTeam, awayTeam);

    const updateResult1 = scoreboard.updateScore(gameId, -1, 0, playerInitials);
    expect(updateResult1).toEqual({ scoreUpdated: false, message: 'Score should be incremented by 1' });

    expect(scoreboard.getGame(gameId)).toEqual({
      gameId: gameId1,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      startTime: expect.any(Number),
      goals: [],
      fouls: []
    });

    const updateResult2 = scoreboard.updateScore(gameId, 1, 0, playerInitials);
    expect(updateResult2).toEqual({ scoreUpdated: true, message: 'Score Updated' });
    expect(scoreboard.getGame(gameId)).toEqual({
      gameId: gameId1,
      homeTeam,
      awayTeam,
      homeScore: 1,
      awayScore: 0,
      startTime: expect.any(Number),
      goals: [{
        scoreTime: expect.any(Number),
        playerInitials
      }],
      fouls: []
    });

    const updateResult3 = scoreboard.updateScore(gameId, 2, 1, playerInitials);
    expect(updateResult3).toEqual({ scoreUpdated: false, message: 'Update one score at a time' });

    expect(scoreboard.getGame(gameId)).toEqual({
      gameId: gameId1,
      homeTeam,
      awayTeam,
      homeScore: 1,
      awayScore: 0,
      startTime: expect.any(Number),
      goals: [{
        scoreTime: expect.any(Number),
        playerInitials
      }],
      fouls: []
    });

    const updateResult4 = scoreboard.updateScore(gameId, 2, 0, playerInitials);
    expect(updateResult4).toEqual({ scoreUpdated: true, message: 'Score Updated' });

    expect(scoreboard.getGame(gameId)).toEqual({
      gameId: gameId1,
      homeTeam,
      awayTeam,
      homeScore: 2,
      awayScore: 0,
      startTime: expect.any(Number),
      goals: [{
        scoreTime: expect.any(Number),
        playerInitials
      }, {
        scoreTime: expect.any(Number),
        playerInitials
      }],
      fouls: []
    });

    const updateResult5 = scoreboard.updateScore(gameId, 1, 0, playerInitials);
    expect(updateResult5).toEqual({ scoreUpdated: false, message: 'Score should be incremented by 1' });

    expect(scoreboard.getGame(gameId)).toEqual({
      gameId: gameId1,
      homeTeam,
      awayTeam,
      homeScore: 2,
      awayScore: 0,
      startTime: expect.any(Number),
      goals: [{
        scoreTime: expect.any(Number),
        playerInitials
      }, {
        scoreTime: expect.any(Number),
        playerInitials
      }],
      fouls: []
    });

    const updateResult6 = scoreboard.updateScore(gameId, 2, 1, playerInitials);
    expect(updateResult6).toEqual({ scoreUpdated: true, message: 'Score Updated' });
    expect(scoreboard.getGame(gameId)).toEqual({
      gameId: gameId1,
      homeTeam,
      awayTeam,
      homeScore: 2,
      awayScore: 1,
      startTime: expect.any(Number),
      goals: [{
        scoreTime: expect.any(Number),
        playerInitials
      }, {
        scoreTime: expect.any(Number),
        playerInitials
      }, {
        scoreTime: expect.any(Number),
        playerInitials
      }],
      fouls: []
    });

  });
});
