# Scoreboard Manager

This TypeScript module provides a simple yet robust way to manage games and scores. Utilizing classes and modern JavaScript/TypeScript practices, it allows users to start a game, update scores, finish a game, and retrieve a sorted summary of games based on their scores.

## Features

- **Start a Game**: Initiate a game between two teams.
- **Update Scores**: Modify the scores during a game. It checks the score inputed are same or not incremental or invalid or player who is assigned a goal is already red carded or not.
- **Finish a Game**: Mark a game as finished and remove it from the tracking system.
- **Get Game Summary**: Retrieve a list of games sorted by total score and starting time. It also get the name(s) of the player(s) for they have scored or performed foul at the respective time.

## Description
- It uses binary search to get the game from the gameId. The complexity is ```O(log(n))``` .If the sum of the scores are same for the some games then it will switch back to linear search for those equal values 
- It uses binary search method to insert the game in proper position. which makes the result sorted. The complexity is ```O(log(n))```
- So the code does not need to sort the array which save the code from sorting complexity which can go upto ```O(n2)```

## Installation

To use this module, ensure you have Node.js and TypeScript installed. Clone this repository or download the files to your local machine.

```bash
npm install
```
To build the app one can run

```bash
npm run dev:build
```
To run the app

```bash
npm start
```

To run the test case 

```bash
npm test
```

To get the test coverage

```bash
npm run test:coverage
```


## Usage

#### Type
- Game has many goals.
- Game has many fouls.
```
Game = {
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    startTime: number;
    goals: Goal[];
    fouls: Foul[];
};
Foul = {
    playerInitials: string;
    foulTime: number;
    foulType: FoulType;
};
Goal = {
    playerInitials: string;
    scoreTime: number;
};
enum FoulType {
    YELLOW_CARD = 'Yellow Card',
    RED_CARD= 'Red Card',
};
```

Below is how you can use the Scoreboard class within your own projects:

#### Importing the Class

```
import { Scoreboard } from './path/to/scoreboard';
```

#### Creating an Instance

```
const scoreboard = new Scoreboard();
```

#### Starting a Game

```
const { gameId, message } = scoreboard.startGame('HomeTeamName', 'AwayTeamName');
console.log({ gameId, message });

```

### Updating Scores

```
const { scoreUpdated, message } = scoreboard.updateScore(gameId, newHomeScore, newAwayScore, playerInitials);
console.log({ scoreUpdated, message });
```

### Add Foul

```
const { scoreUpdated, message } = scoreboard.addFoul(gameId, playerInitials);
console.log({ foulUpdated, message });
```

#### Finishing a Game

```
const { gameDeleted, message } = scoreboard.finishGame(gameId);
console.log({ gameDeleted, message });
```
#### Getting the Sorted Game Summary

```
const gamesSummary:Games[] = scoreboard.getSummary();
console.log(gamesSummary);
```

