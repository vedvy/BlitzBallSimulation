//nodemon .\initializeDB.js mongodb://localhost:27017/blitzball

import mongoose from 'mongoose';

import Player from './models/player.js';
import Team from './models/team.js';
// import MainGame from './models/main_game.js';
import TempPlayerStats from './models/tempPlayerStats.js'

import ScreenView from './models/screenView.js';


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

// async function createGame(mainGameObject){

//     let newGame = new MainGame({
//         teamRed: mainGameObject.teamRed,
//         teamBlue: mainGameObject.teamBlue,
//         currentOuts: mainGameObject.currentOuts,
//         currentStrikes: mainGameObject.currentStrikes,
//         currentInning: mainGameObject.currentInning,
//         topOfInning: mainGameObject.topOfInning,
//         firstBaseActive: mainGameObject.firstBaseActive,
//         secondBaseActive: mainGameObject.secondBaseActive,
//         thirdBaseActive: mainGameObject.thirdBaseActive,
//         gameOver: mainGameObject.gameOver,
//     });
//     return newGame.save();
// }

async function createTempPlayerStats(tempPlayerOBJ)
{
    let newTempPlayer = new TempPlayerStats({
        name: tempPlayerOBJ.name,
        HitterStats: tempPlayerOBJ.HitterStats,
        PitcherStats: tempPlayerOBJ.PitcherStats
    });
    return newTempPlayer.save();
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

    // const team1 = {
    //     teamColor: "red",
    //     teamPlayers: [playerRef1.id, playerRef2, playerRef3, playerRef4],
    //     teamScore: 0,
    //     teamChoices: "hitter"
    // };
    
    // const team2 = {
    //     teamColor: "blue",
    //     teamPlayers: [playerRef5, playerRef6, playerRef7, playerRef8],
    //     teamScore: 0,
    //     teamChoices: "pitcher"
    // };

    // let teamRef1 = await createTeam(team1);
    // let teamRef2 = await createTeam(team2);

    // const game1 = {
    //     teamRed: teamRef1,
    //     teamBlue: teamRef2,
    //     currentOuts: 0,
    //     currentStrikes: 0,
    //     currentInning: 1,
    //     topOfInning: false,
    //     firstBaseActive: {isActive: false},
    //     secondBaseActive: {isActive: false},
    //     thirdBaseActive: {isActive: false},
    //     gameOver: false
    // };

    // let gameRef1 = await createGame(game1);

    // let HitterStats1 = {
    //         Games: 0,
    //         PlateAppearences: 0,
    //         AtBats: 0,
    //         Hits: 0,
    //         OneB: 0,
    //         TwoB: 0,
    //         ThreeB: 0,
    //         HomeRuns: 0,
    //         Walks: 0,
    //         HitByPitches: 0,
    //         RunsBattedIn: 0,
    //         Runs: 0,
    //         TotalBases: 0,
    //         StrikeOuts: 0,
    //         Average: 1.00,
    //         SLGPercent: 1.00,
    //         OBPPercent: 1.00,
    //         OnBasePlusSlugging: 1.00,
    //         OPSPlus: 1.00,
    //         KPercent: 1.00,
    //         wOBA: 1.00,
    //         wRCPlus: 1.00,
    //         BatAvgBallsInPlay: 1.00,
    //         IsolatedPower: 1.00,
    //         wRCPlus: 0
    // }

    // let PitcherStats1 = {
    //             Games: 0,
    //             InningsPitched: 0, 
    //             EarnedRunAverage: 1.00,
    //             FieldingIndPitching: 1.00,
    //             Walks: 0,
    //             StrikeOuts: 0,
    //             HitByPitches: 0,
    //             HomeRuns: 0,
    //             EarnedRuns: 0,
    //             HitsAllowed: 0,
    //             WalksHitsInningsPitched: 0,
    //             ERAMinus: 0,
    //             FIPMinus: 0,
    //             Save: 0,
    //             BlownSave: 0,
    //             SVPercent: 0,
    //             KPerNine: 1.00,
    //             FIPMinusRank: 0,
    //             BBPerNine: 1.00
    // }

    // const tempPlayer1 = {
    //     name: player1.name,
    //     HitterStats: HitterStats1,
    //     PitcherStats: PitcherStats1
    // };

    // let tempPlayerRef1 = await createTempPlayerStats(tempPlayer1);

    // const tempPlayer2 = {
    //     name: player2.name,
    //     HitterStats: HitterStats1,
    //     PitcherStats: PitcherStats1
    // }

    // let tempPlayerRef2 = await createTempPlayerStats(tempPlayer2);

    // const tempPlayer3 = {
    //     name: player3.name,
    //     HitterStats: HitterStats1,
    //     PitcherStats: PitcherStats1
    // }

    // let tempPlayerRef3 = await createTempPlayerStats(tempPlayer3);

    // const tempPlayer4 = {
    //     name: player4.name,
    //     HitterStats: HitterStats1,
    //     PitcherStats: PitcherStats1
    // }

    // let tempPlayerRef4 = await createTempPlayerStats(tempPlayer4);

    // const tempPlayer5 = {
    //     name: player5.name,
    //     HitterStats: HitterStats1,
    //     PitcherStats: PitcherStats1
    // }

    // let tempPlayerRef5 = await createTempPlayerStats(tempPlayer5);

    // const tempPlayer6 = {
    //     name: player6.name,
    //     HitterStats: HitterStats1,
    //     PitcherStats: PitcherStats1
    // }

    // let tempPlayerRef6 = await createTempPlayerStats(tempPlayer6);

    // const tempPlayer7 = {
    //     name: player7.name,
    //     HitterStats: HitterStats1,
    //     PitcherStats: PitcherStats1
    // }

    // let tempPlayerRef7 = await createTempPlayerStats(tempPlayer7);

    // const tempPlayer8 = {
    //     name: player8.name,
    //     HitterStats: HitterStats1,
    //     PitcherStats: PitcherStats1
    // }

    // let tempPlayerRef8 = await createTempPlayerStats(tempPlayer8);

    let screenView = new ScreenView({
        current_view: "SetUp"
    });

    await screenView.save();



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