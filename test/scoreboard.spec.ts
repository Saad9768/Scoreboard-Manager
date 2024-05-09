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
      startTime: expect.any(Number),
      goals: [],
      fouls: []
    });
  });

  it('should update scores correctly', () => {
    const gameId1 = 'gameId1';
    const homeTeam = 'Mexico';
    const awayTeam = 'Canada';
    const playerInitials = 'A.B';

    jest.mocked(Utils.guid).mockReturnValueOnce(gameId1);

    const { gameId } = scoreboard.startGame(homeTeam, awayTeam);
    const updateResult = scoreboard.updateScore(gameId, 1, 0, playerInitials);
    expect(updateResult).toEqual({ scoreUpdated: true, message: 'Score Updated' });
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
  });

  it('should get the games correctly', () => {
    const gameId = 'gameId';
    const homeTeam = 'Mexico';
    const awayTeam = 'Canada';
    const playerInitials1 = 'A.B';
    const playerInitials2 = 'P.Q';

    jest.mocked(Utils.guid)
      .mockReturnValueOnce(gameId);
    scoreboard.startGame(homeTeam, awayTeam);
    scoreboard.updateScore(gameId, 0, 1, playerInitials1);
    expect(scoreboard.getGame(gameId)).toEqual(
      {
        gameId,
        homeTeam,
        awayTeam,
        homeScore: 0,
        awayScore: 1,
        startTime: expect.any(Number),
        goals: [{
          scoreTime: expect.any(Number),
          playerInitials: playerInitials1
        }],
        fouls: []
      }
    );
    scoreboard.updateScore(gameId, 1, 1, playerInitials2);
    expect(scoreboard.getGame(gameId)).toEqual(
      {
        gameId, homeTeam, awayTeam, homeScore: 1, awayScore: 1, startTime: expect.any(Number),
        goals: [{
          scoreTime: expect.any(Number),
          playerInitials: playerInitials1
        }, {
          scoreTime: expect.any(Number),
          playerInitials: playerInitials2
        }],
        fouls: []
      }
    );
  });

  it('should sort games correctly in summary', () => {
    const mockedGameId0 = 'gameId0';
    const mockedGameId1 = 'gameId1';
    const mockedGameId2 = 'gameId2';
    const mockedGameId3 = 'gameId3';
    const mockedGameId4 = 'gameId4';

    const homeTeam0 = 'India';
    const awayTeam0 = 'Qatar';

    const homeTeam1 = 'Mexico';
    const awayTeam1 = 'Canada';
    const playerInitials1 = 'A.B';

    const homeTeam2 = 'Spain';
    const awayTeam2 = 'Brazil';
    const playerInitials2 = 'A.B';

    const homeTeam3 = 'Germany';
    const awayTeam3 = 'Portugal';
    const playerInitials3 = 'A.B';

    const homeTeam4 = 'Hungary';
    const awayTeam4 = 'Austria';
    const playerInitials4 = 'A.B';


    jest.mocked(Utils.guid)
      .mockReturnValueOnce(mockedGameId0)
      .mockReturnValueOnce(mockedGameId1)
      .mockReturnValueOnce(mockedGameId2)
      .mockReturnValueOnce(mockedGameId3)
      .mockReturnValueOnce(mockedGameId4);

    scoreboard.startGame(homeTeam0, awayTeam0);

    scoreboard.startGame(homeTeam1, awayTeam1);

    scoreboard.startGame(homeTeam2, awayTeam2);

    scoreboard.startGame(homeTeam3, awayTeam3);
    scoreboard.updateScore(mockedGameId3, 1, 0, playerInitials3);

    scoreboard.startGame(homeTeam4, awayTeam4);
    scoreboard.updateScore(mockedGameId4, 1, 0, playerInitials4);

    scoreboard.updateScore(mockedGameId1, 0, 1, playerInitials1);

    scoreboard.updateScore(mockedGameId2, 0, 1, playerInitials2);

    scoreboard.addFoul(mockedGameId1, playerInitials1);

    scoreboard.addFoul(mockedGameId1, playerInitials1);

    scoreboard.finishGame(mockedGameId3);

    const summary = scoreboard.getSummary();

    expect(summary.length).toBe(4);

    expect(summary).toEqual([
      {
        gameId: mockedGameId4,
        homeTeam: homeTeam4,
        awayTeam: awayTeam4,
        homeScore: 1,
        awayScore: 0,
        startTime: expect.any(Number),
        goals: [{
          scoreTime: expect.any(Number),
          playerInitials: playerInitials4
        }],
        fouls: []
      },
      {
        gameId: mockedGameId1,
        homeTeam: homeTeam1,
        awayTeam: awayTeam1,
        homeScore: 0,
        awayScore: 1,
        startTime: expect.any(Number),
        goals: [{
          scoreTime: expect.any(Number),
          playerInitials: playerInitials1
        }],
        fouls: [{
          foulType: FoulType.YELLOW_CARD,
          foulTime: expect.any(Number),
          playerInitials: playerInitials1
        },{
          foulType: FoulType.RED_CARD,
          foulTime: expect.any(Number),
          playerInitials: playerInitials1
        }]
      },
      {
        gameId: mockedGameId2,
        homeTeam: homeTeam2,
        awayTeam: awayTeam2,
        homeScore: 0,
        awayScore: 1,
        startTime: expect.any(Number),
        goals: [{
          scoreTime: expect.any(Number),
          playerInitials: playerInitials2
        }],
        fouls: []
      },
      {
        gameId: mockedGameId0,
        homeTeam: homeTeam0,
        awayTeam: awayTeam0,
        homeScore: 0,
        awayScore: 0,
        startTime: expect.any(Number),
        goals: [],
        fouls: []
      }
    ]);
  });
});
