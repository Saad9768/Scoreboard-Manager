import { Scoreboard } from "./app/scoreboard";

const main = () => {
    const homeTeam1 = 'Mexico';
    const awayTeam1 = 'Canada';
    const homeTeam2 = 'Spain';
    const awayTeam2 = 'Brazil';
    const homeTeam3 = 'Germany';
    const awayTeam3 = 'Portugal';
    const homeTeam4 = 'Hungary';
    const awayTeam4 = 'Austria';

    const scoreboard = new Scoreboard();

    const { gameId: gameId1, message: startMessage1 } = scoreboard.startGame(homeTeam1, awayTeam1);
    console.log('startMessage1 :: ', startMessage1)
    const { message: updateMessage1 } = scoreboard.updateScore(gameId1, 3, 2);
    console.log('updateMessage1 :: ', updateMessage1)


    const { gameId: gameId2, message: startMessage2 } = scoreboard.startGame(homeTeam2, awayTeam2);
    console.log('startMessage2 :: ', startMessage2)
    const { message: updateMessage2 } = scoreboard.updateScore(gameId2, 4, 3);
    console.log('updateMessage2 :: ', updateMessage2)

    const { gameId: gameId3, message: startMessage3 } = scoreboard.startGame(homeTeam3, awayTeam3);
    console.log('startMessage3 :: ', startMessage3)
    const { message: updateMessage3 } = scoreboard.updateScore(gameId3, 4, 4);
    console.log('updateMessage3 :: ', updateMessage3)

    const { gameId: gameId4, message: startMessage4 } = scoreboard.startGame(homeTeam4, awayTeam4);
    console.log('startMessage4 :: ', startMessage4)
    const { message: updateMessage4 } = scoreboard.updateScore(gameId4, 1, 1);
    console.log('updateMessage4 :: ', updateMessage4)

    const { message: finishGameMessage } = scoreboard.finishGame(gameId3);
    console.log('finishGameMessage :: ', finishGameMessage)

    const summary = scoreboard.getSummary();
    console.log('summary :: ', summary)
}
main();