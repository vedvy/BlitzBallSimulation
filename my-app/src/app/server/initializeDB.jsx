const mongoose = require('mongoose');
const Player = require('./models/player');
const Team = require('./models/team');
const MainGameInfo = require('./models/main_game');

let userArgs = process.argv.slice(2);

if(!userArgs[0].startsWith('mongoDB')){
    console.log("Start your mongo connections with a valid url as the first arg.");
    return;
}

let mongoDB = userArgs[0];
mongoose.connect(mongoDB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error occurred: '));

function createPlayer(playerObject){
    let newPlayer = new Player({
        name: playerObject.name,
    });

    return newPlayer.save();
}

function createTeam(teamObject){
    let newTeam = new Team({
        teamColor: teamObject.teamColor,
        teamPlayers: teamObject.teamPlayers,
        teamScore: teamObject.teamScore,
        teamChoices: teamObject.teamChoices,
    })
    return newTeam.save();
}

function createGame(mainGameObject){
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