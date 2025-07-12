//nodemon .\initializeDB.js mongodb://localhost:27017/blitzball

import mongoose from 'mongoose';

import Player from './models/player.js';
import Team from './models/team.js';
import MainGameInfo from './models/main_game.js';



let userArgs = process.argv.slice(2);

// if(!userArgs[0].startsWith('mongoDB')){
//     console.log("Start your mongo connections with a valid url as the first arg. userArgs:", userArgs[0]);
//     return;
// }

let uri = 'mongodb://127.0.0.1:27017/blitzball';

 async function createPlayer(playerObject){
    console.log("Created player!");
    let newPlayer = new Player({
        name: playerObject.name,
    });

    return newPlayer.save();
}

async function createTeam(teamObject){
    let newTeam = new Team({
        teamColor: teamObject.teamColor,
        teamPlayers: teamObject.teamPlayers,
        teamScore: teamObject.teamScore,
        teamChoices: teamObject.teamChoices,
    })
    return newTeam.save();
}

async function createGame(mainGameObject){

    let newGame = new MainGameInfo({
        teamRed: mainGameObject.teamRed,
        teamBlue: mainGameObject.teamBlue,
        currentOuts: mainGameObject.currentOuts,
        currentStrikes: mainGameObject.currentStrikes,
        currentInning: mainGameObject.currentInning,
        topOfInning: mainGameObject.topOfInning,
        firstBaseActive: mainGameObject.firstBaseActive,
        secondBaseActive: mainGameObject.secondBaseActive,
        thirdBaseActive: mainGameObject.thirdBaseActive,
        gameOver: mainGameObject.gameOver,
    });
    return newGame.save();
}

async function initializeDB()
{
    await mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error occurred: '));

    const player1 = {
        name: "John"
    };

    const player2 = {
        name: "Tim"
    };

    const player3 = {
        name: "Steve"
    };

    const player4 = {
        name: "Jenny"
    };

    const player5 = {
        name: "Alice"
    };

    const player6 = {
        name: "Carrie"
    };

    const player7 = {
        name: "Jack"
    };

    const player8 = {
        name: "Leon"
    };
    console.log("Right before player refs");
    let playerRef1 = await createPlayer(player1);
    let playerRef2 = await createPlayer(player2);
    let playerRef3 = await createPlayer(player3);
    let playerRef4 = await createPlayer(player4);
    let playerRef5 = await createPlayer(player5);
    let playerRef6 = await createPlayer(player6);
    let playerRef7 = await createPlayer(player7);
    let playerRef8 = await createPlayer(player8);
    console.log("AAfter player refs");

    const team1 = {
        teamColor: "red",
        teamPlayers: [playerRef1, playerRef2, playerRef3, playerRef4],
        teamScore: 0,
        teamChoices: "hitter"
    };
    
    const team2 = {
        teamColor: "blue",
        teamPlayers: [playerRef5, playerRef6, playerRef7, playerRef8],
        teamScore: 0,
        teamChoices: "pitcher"
    };

    let teamRef1 = await createTeam(team1);
    let teamRef2 = await createTeam(team2);

    const game1 = {
        teamRed: teamRef1,
        teamBlue: teamRef2,
        currentOuts: 0,
        currentStrikes: 0,
        currentInning: 1,
        topOfInning: false,
        firstBaseActive: false,
        secondBaseActive: false,
        thirdBaseActive: false,
        gameOver: false
    };

    let gameRef1 = await createGame(game1);

    if(db)
    {
        db.close();
    }
    console.log("Initializing Complete!");

}

initializeDB()
    .catch((err) => {
        console.log('ERROR: ' + err);
        console.trace();
        if (db) {
            db.close();
        }
    });

console.log('Processing Data...');