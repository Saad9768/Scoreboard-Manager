import { Scoreboard } from '../src/app/scoreboard';
import { FoulType } from '../src/app/type/foul_enum';
import { Utils } from '../src/app/utils';

jest.mock('../src/app/utils')

describe('Scoreboard:Fouls', () => {
  let scoreboard: Scoreboard;
  beforeEach(() => {
    jest.clearAllMocks()
    scoreboard = new Scoreboard();
  });
  it('should add the fouls correctly', () => {
    const gameId = 'gameId0';
    const homeTeam = 'India';
    const awayTeam = 'Qatar';
    const playerInitials1 = 'A.B';
    const playerInitials2 = 'P.Q';

    jest.mocked(Utils.guid)
      .mockReturnValueOnce(gameId)
    scoreboard.startGame(homeTeam, awayTeam);

    const { foulUpdated: foulUpdated1, message: message1 } = scoreboard.addFoul(gameId, playerInitials1);
    expect(foulUpdated1).toBe(true);
    expect(message1).toBe(`Foul Updated to ${FoulType.YELLOW_CARD}`);

    expect(scoreboard.getGame(gameId)).toEqual({
      gameId,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      startTime: expect.any(Number),
      goals: [],
      fouls: [{
        playerInitials: playerInitials1,
        foulTime: expect.any(Number),
        foulType: FoulType.YELLOW_CARD,
      }]
    });

    const { foulUpdated: foulUpdated2, message: message2 } = scoreboard.addFoul(gameId, playerInitials1);
    expect(foulUpdated2).toBe(true);
    expect(message2).toBe(`Foul Updated to ${FoulType.RED_CARD}`);

    expect(scoreboard.getGame(gameId)).toEqual({
      gameId,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      startTime: expect.any(Number),
      goals: [],
      fouls: [{
        playerInitials: playerInitials1,
        foulTime: expect.any(Number),
        foulType: FoulType.YELLOW_CARD,
      }, {
        playerInitials: playerInitials1,
        foulTime: expect.any(Number),
        foulType: FoulType.RED_CARD,
      }]
    });

    const { foulUpdated: foulUpdated3, message: message3 } = scoreboard.addFoul(gameId, playerInitials1);
    expect(foulUpdated3).toBe(false);
    expect(message3).toBe(`Player already got ${FoulType.RED_CARD}`);
    expect(scoreboard.getGame(gameId)).toEqual({
      gameId,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      startTime: expect.any(Number),
      goals: [],
      fouls: [{
        playerInitials: playerInitials1,
        foulTime: expect.any(Number),
        foulType: FoulType.YELLOW_CARD,
      }, {
        playerInitials: playerInitials1,
        foulTime: expect.any(Number),
        foulType: FoulType.RED_CARD,
      }]
    });

    const { foulUpdated: foulUpdated4, message: message4 } = scoreboard.addFoul(gameId, playerInitials2);
    expect(foulUpdated4).toBe(true);
    expect(message4).toBe(`Foul Updated to ${FoulType.YELLOW_CARD}`);

    expect(scoreboard.getGame(gameId)).toEqual({
      gameId,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      startTime: expect.any(Number),
      goals: [],
      fouls: [{
        playerInitials: playerInitials1,
        foulTime: expect.any(Number),
        foulType: FoulType.YELLOW_CARD,
      }, {
        playerInitials: playerInitials1,
        foulTime: expect.any(Number),
        foulType: FoulType.RED_CARD,
      }, {
        playerInitials: playerInitials2,
        foulTime: expect.any(Number),
        foulType: FoulType.YELLOW_CARD,
      }]
    });

  });

});
