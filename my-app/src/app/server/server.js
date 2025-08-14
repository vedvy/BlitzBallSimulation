//IMPORTANT: npm run dev-server inside /server
//DOUBLY IMPORTANT TO IMPLEMENT: I may need a separate package.json for th server,
//which means file restructuring
import express from "express";
import cors from "cors";
import Player from './models/player.js';
import Team from './models/team.js';
import MainGame from './models/main_game.js';
import TempPlayerStats from "./models/tempPlayerStats.js";

import mongoose from 'mongoose';
import bodyParser from "body-parser";
import { withCoalescedInvoke } from "next/dist/lib/coalesced-function.js";
import { createStaticHandler } from "react-router-dom";

// const express = require("express");

// const cors = require('cors');

// const Player = require('./models/player.jsx');
// const Team = require('./models/team.jsx');
// const MainGame = require('./models/main_game.js');

// const mongoose = require('mongoose');

let mongoDB = 'mongodb://localhost:27017/blitzball';
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error occurred'));


const jsonParser = bodyParser.json();

const app = express();
app.use(cors());

app.get("/players", async function(req, res) {
    console.log("GETTING PLAYERS");
    try{
        const playersArray = await Player.find({});
       
        res.send(playersArray);
    }
    catch(err){
        res.status(500).json({message: "err", err});
    }
});

app.get("/teamplayernames", jsonParser, async function(req, res) {
    try{
        console.log("Getting player names");
        // const playersArray = req.body['playersArray'];
        const playersArray = await Player.find({});
        const MainGameInfo = (await MainGame.find({}).exec())[0];
        
        console.log("after players Array");
        // const teamRed = req.body['teamRed'];
        // const teamBlue = req.body['teamBlue'];
        const teamRed = await Team.findById(MainGameInfo.teamRed);
        const teamBlue = await Team.findById(MainGameInfo.teamBlue);
        console.log("After getting teams defined");
        var redTeamPlayers = [];
        var blueTeamPlayers = [];
    

        for(let i = 0; i < playersArray.length; i++)
        {
            
            if(teamRed.teamPlayers.includes(playersArray[i]._id))
            {
        
                let redPlayerFound = await Player.findById(playersArray[i]._id);
                redTeamPlayers.push(redPlayerFound.name);
            }
            else if(teamBlue.teamPlayers.includes(playersArray[i]._id))
            {
            
                let bluePlayerFound = await Player.findById(playersArray[i]._id);
                blueTeamPlayers.push(bluePlayerFound.name);
            }
        }
        res.json({
            redTeamPlayers: redTeamPlayers,
            blueTeamPlayers: blueTeamPlayers
        }
        );
    }
    catch(err){
        res.status(500).json({message: "err", err});
    }
});

app.get("/teams", async function(req, res) {
    try{
        const teamsArray = await Team.find({});
        res.send(teamsArray);
    }
    catch(err){
        res.status(500).json({message: "err", err});
    }
});

app.get("/tempPlayerStats", async function(req, res)
{
    try{
        const tempPlayer = await TempPlayerStats.find({});
        console.log("TempPlayerStats acquired");
        res.send(tempPlayer);
    }
    catch(err){
        res.status(500).json({message: "err", err});
    }
});

app.get("/maingame", async function(req, res){
    try{
        const mainGame = await MainGame.find({});
        console.log(mainGame[0].gameOver);
        res.json({
            mainGame: mainGame,
            gameOver: mainGame[0].gameOver
        });
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

/*POST Section for Game Screen*/

app.post("/switchPositions", jsonParser, async function(req, res) {
    try{
        const redTeam = req.body['redTeam'];
        const blueTeam = req.body['blueTeam'];
        const MainGameInfo = req.body['main_game_info'];
        const currentTopOfInning = MainGameInfo.topOfInning;

        if(redTeam.teamChoices === "pitcher")
        {
            const updateRedTeam = await Team.findByIdAndUpdate(redTeam._id, {teamChoices: "hitter"}, {new: true});
            const updateBlueTeam = await Team.findByIdAndUpdate(blueTeam._id, {teamChoices: "pitcher"}, {new: true});
        }
        else
        {
            const updateRedTeam = await Team.findByIdAndUpdate(redTeam._id, {teamChoices: "pitcher"}, {new: true});
            const updateBlueTeam = await Team.findByIdAndUpdate(blueTeam._id, {teamChoices: "hitter"}, {new: true});
        }
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
                firstBaseActive: {isActive: false, playerOnPlate: null, playerOnPlateDisplay: ""},
                secondBaseActive: {isActive: false, playerOnPlate: null, playerOnPlateDisplay: ""},
                thirdBaseActive: {isActive: false, playerOnPlate: null, playerOnPlateDisplay: ""},
                topOfInning: !currentTopOfInning
            }, {new: true});
        res.send(updateGameInfo);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
})

app.post("/setNextPlayers", jsonParser, async function(req, res)
{

    try{
        const nextRedPlayer = req.body['redPlayerChosen'];
        const nRPObject = (await Player.find({name: nextRedPlayer}).exec())[0];
        const nextBluePlayer = req.body['bluePlayerChosen'];
        const nBPObject = (await Player.find({name: nextBluePlayer}).exec())[0];
        const teamRed = req.body['teamRed'];
        const teamBlue = req.body['teamBlue'];
        

        const updateRedTeam = await Team.findByIdAndUpdate(teamRed._id, {currentPlayer: nRPObject, currentPlayerDisplay: nextRedPlayer});
        const updateBlueTeam = await Team.findByIdAndUpdate(teamBlue._id, {currentPlayer: nBPObject, currentPlayerDisplay: nextBluePlayer});

        res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("/incrementOuts", jsonParser, async function(req, res){
    try{
        const MainGameInfo = req.body['main_game_info'];
        const resetOuts = req.body['resetOuts'];
        const teamRed = req.body['teamRed'];
        const teamBlue = req.body['teamBlue'];
        const StrikeOut = req.body['isStrikeOut'];
        const outType = req.body['outType'];
        const outFielder = req.body['outFielder'];


        if(resetOuts)
        {
            console.log("Resetting Outs");
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, 
            {
                currentOuts: 0,
                currentStrikes: 0,
                currentHBP: 0,
                currentBalls: 0,
            }, {new: true});    
        }
        else
        {
            console.log("Incrementing Outs");
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, 
            {
               $inc: {currentOuts: 1},
                currentStrikes: 0,
                currentHBP: 0,
                currentBalls: 0,
            }, {new: true});
        }
        
        
        if(teamRed.teamChoices === "pitcher")
        {
            let gameLog = `${outFielder} got ${teamBlue.currentPlayerDisplay} OUT! Strikeout: ${StrikeOut}`;
            if(outType)
            {
                gameLog += `Out Type: ${outType}`;
            }
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {$push: {logMessages: gameLog}},
            {new: true}
        );
            let tempPlayerRed = (await TempPlayerStats.find({name: teamRed.currentPlayerDisplay}).exec())[0];
            let tempPlayerBlue = (await TempPlayerStats.find({name: teamBlue.currentPlayerDisplay}).exec())[0];
            if(StrikeOut)
            {
                await TempPlayerStats.findByIdAndUpdate(tempPlayerRed._id, {$inc: {'PitcherStats.StrikeOuts': 1, 
                }});
                await TempPlayerStats.findByIdAndUpdate(tempPlayerBlue._id, {$inc: {'HitterStats.StrikeOuts': 1,
                    'HitterStats.PlateAppearences': 1, 
                    'HitterStats.AtBats': 1
                }});
            }
            else
            {
                await TempPlayerStats.findByIdAndUpdate(tempPlayerRed._id, {$inc: {'PitcherStats.Outs': 1}});
                await TempPlayerStats.findByIdAndUpdate(tempPlayerBlue._id, {$inc: {'HitterStats.PlateAppearences': 1, 'HitterStats.AtBats': 1
                }});
            }
        }
        else
        {
            let gameLog =  `${outFielder} got ${teamRed.currentPlayerDisplay} OUT! StrikeOut: ${StrikeOut}`;
            if(outType)
            {
                gameLog += `Out Type: ${outType}`;
            }
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {$push: {logMessages: gameLog}},
            {new: true}
        );

            let tempPlayerRed = (await TempPlayerStats.find({name: teamRed.currentPlayerDisplay}).exec())[0];
            let tempPlayerBlue = (await TempPlayerStats.find({name: teamBlue.currentPlayerDisplay}).exec())[0];

            if(StrikeOut)
            {
                await TempPlayerStats.findByIdAndUpdate(tempPlayerBlue._id, {$inc: {'PitcherStats.StrikeOuts': 1,
                }});
                await TempPlayerStats.findByIdAndUpdate(tempPlayerRed._id, {$inc: {'HitterStats.StrikeOuts': 1,
                    'HitterStats.PlateAppearences': 1, 
                    'HitterStats.AtBats': 1
                }});
            }
            else
            {
                await TempPlayerStats.findByIdAndUpdate(tempPlayerBlue._id, {$inc: {'PitcherStats.Outs': 1}});
                await TempPlayerStats.findByIdAndUpdate(tempPlayerRed._id, {$inc: {'HitterStats.PlateAppearences': 1, 'HitterStats.AtBats': 1
                }});
            }
        }

        res.send(200);
        
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("/incrementStrikes", jsonParser, async function(req, res){
    try{
        const MainGameInfo = req.body['main_game_info'];
        
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            $inc: {currentStrikes: 1}
            }, {new: true});
        
        res.send(updateGameInfo);

    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }

});

app.post("/incrementBalls", jsonParser, async function(req, res) {
    try{
        const MainGameInfo = req.body['main_game_info'];

        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            $inc: {currentBalls: 1}
        }, {new: true});
        res.send(updateGameInfo);
    }
    catch(err){
        res.status(500).json({message: "err", err});
    }
});

app.post("/incrementHBP", jsonParser, async function(req, res)
{
    try{
        const MainGameInfo = req.body['main_game_info'];
        
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            $inc: {currentHBP: 1}
        }, {new: true});

        res.send(updateGameInfo);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

/*Use this and the other base updates to update the HA stat in Pitching.*/

app.post("/updateFirstBase", jsonParser, async function(req, res)
{

    try{
        console.log("inside first base");
        const MainGameInfo = req.body['main_game_info'];
        const isActive = req.body['isActive'];
        const currentHitterPlayer = req.body['currentHitterPlayer'];
        const currentPitchingPlayer = req.body['currentPitchingPlayer'];
        
        console.log(currentHitterPlayer);

        const currentHitterPlayerID = await Player.find({name: currentHitterPlayer});

        console.log(currentHitterPlayerID[0]._id);
        if(isActive)
        {
            const BBFlag = req.body['BBFlag'];
            const HBPFlag = req.body['HBPFlag'];

            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            firstBaseActive: {isActive: isActive, playerOnPlate: currentHitterPlayerID[0]._id, playerOnPlateDisplay: currentHitterPlayer},
            currentBalls: 0,
            currentHBP: 0,
            currentStrikes: 0
        }, {new: true});

            let tempHitterPlayerUpdate = (await TempPlayerStats.find({name: currentHitterPlayer}).exec())[0];
            let tempPitchingPlayerUpdate = (await TempPlayerStats.find({name: currentPitchingPlayer}).exec())[0];

            if(BBFlag)
            {
                await TempPlayerStats.findByIdAndUpdate(tempHitterPlayerUpdate._id, {$inc: {'HitterStats.Walks': 1, 'HitterStats.PlateAppearences': 1}});
                await TempPlayerStats.findByIdAndUpdate(tempPitchingPlayerUpdate._id, 
                    {$inc: {'PitcherStats.Walks': 1}}
                );
                let gameLog = `${currentHitterPlayer} walks to first base!`;
                const updateGameLogs = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
                    $push: {logMessages: gameLog}
                });
            }
            else if(HBPFlag)
            {
                await TempPlayerStats.findByIdAndUpdate(tempHitterPlayerUpdate._id, {$inc: {'HitterStats.HitByPitches': 1, 'HitterStats.PlateAppearences': 1}});
                await TempPlayerStats.findByIdAndUpdate(tempPitchingPlayerUpdate._id, 
                    {$inc: {'PitcherStats.HitByPitches': 1}}
                );
                let gameLog = `${currentHitterPlayer} endures the pain of 2 Hit By Pitches and walks!`;
                const updateGameLogs = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
                    $push: {logMessages: gameLog}
                });
            }
            else
            {
                let UpdatingHitterPlayer = await TempPlayerStats.findByIdAndUpdate(tempHitterPlayerUpdate._id, {$inc: {'HitterStats.OneB': 1, 'HitterStats.PlateAppearences': 1,
                    'HitterStats.AtBats': 1,
                    'HitterStats.Hits': 1
                }});
                let UpdatingPitchingPlayer = await TempPlayerStats.findByIdAndUpdate(tempPitchingPlayerUpdate,
                    {$inc: {'PitcherStats.HitsAllowed': 1}}
                );
            }
            
    }
        else
        {
           const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            firstBaseActive: {isActive: isActive, playerOnPlate: null, playerOnPlateDisplay: ""},
            currentBalls: 0,
            currentHBP: 0,
            currentStrikes: 0
        }, {new: true}); 

        }
    

        res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("/updateSecondBase", jsonParser, async function(req, res)
{
    try{
        console.log("Inside Second Base");

        const MainGameInfo = req.body['main_game_info'];
        const isActive = req.body['isActive'];
        const currentHitterPlayer = req.body['currentHitterPlayer'];
        const currentPitcherPlayer = req.body['currentPitchingPlayer'];

        const currentHitterPlayerID = await Player.find({name: currentHitterPlayer});

        /*Use the currentPlayer name as the query for tempPlayerStats. Then update 2B.
        Same Idea for 3B and HR*/

        if(isActive)
        {
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            secondBaseActive: {isActive: isActive, playerOnPlate: currentHitterPlayerID[0]._id, playerOnPlateDisplay: currentHitterPlayer},
            currentBalls: 0,
            currentHBP: 0,
            currentStrikes: 0 
        }, {new: true});
        
        if(currentPitcherPlayer)
        {
            let tempHittingPlayerUpdate = (await TempPlayerStats.find({name: currentHitterPlayer}).exec())[0];
            let UpdatingHitterPlayerStats = await TempPlayerStats.findByIdAndUpdate(tempHittingPlayerUpdate._id, {$inc: {'HitterStats.TwoB': 1, 
            'HitterStats.PlateAppearence': 1, 'HitterStats.AtBats': 1, 'HitterStats.Hits': 1
        }});

            let tempPitchingPlayerUpdate = (await TempPlayerStats.find({name: currentPitcherPlayer}).exec())[0];
            let UpdatingPitcherPlayerStats = await TempPlayerStats.findByIdAndUpdate(tempPitchingPlayerUpdate._id,
            {$inc: {'PitcherStats.HitsAllowed': 1}}
        );
        }

        }
        else
        {
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            secondBaseActive: {isActive: isActive, playerOnPlate: null, playerOnPlateDisplay: ""},
            currentBalls: 0,
            currentHBP: 0,
            currentStrikes: 0 
        }, {new: true});
        }
        
        res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

/*The OneB, TwoB, ThreeB updates should be done based on the decision buttons. Pressing 'single' shouldn't increment
ThreeB.*/

app.post("/updateThirdBase", jsonParser, async function(req, res)
{
    try{
        console.log("Inside Third Base");

        const MainGameInfo = req.body['main_game_info'];
        const isActive = req.body['isActive'];
        const currentHitterPlayer = req.body['currentHitterPlayer'];
        const currentPitcherPlayer = req.body['currentPitchingPlayer'];

        const currentHitterPlayerID = await Player.find({name: currentHitterPlayer});
        if(isActive)
        {
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            thirdBaseActive: {isActive: isActive, playerOnPlate: currentHitterPlayerID._id, playerOnPlateDisplay: currentHitterPlayer},
            currentBalls: 0,
            currentHBP: 0,
            currentStrikes: 0
        }, {new: true});

        if(currentPitcherPlayer)
        {
            let tempHitterPlayerUpdate = (await TempPlayerStats.find({name: currentHitterPlayer}).exec())[0];
            let UpdatingHitterPlayerStats = await TempPlayerStats.findByIdAndUpdate(tempHitterPlayerUpdate._id, {$inc: {'HitterStats.ThreeB': 1,
            'HitterStats.PlateAppearences': 1, 'HitterStats.AtBats': 1, 'HitterStats.Hits': 1
        }});

            let tempPitchingPlayerUpdate = (await TempPlayerStats.find({name: currentPitcherPlayer}).exec())[0];
            let UpdatingPitcherPlayerStats = await TempPlayerStats.findByIdAndUpdate(tempPitchingPlayerUpdate._id,
            {$inc: {'PitcherStats.HitsAllowed': 1}}
        );
        }
        
        }
        else
        {
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            thirdBaseActive: {isActive: isActive, playerOnPlate: null, playerOnPlateDisplay: ""},
            currentBalls: 0,
            currentHBP: 0,
            currentStrikes: 0
        }, {new: true});
        }
        
        res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("/updateHRStat", jsonParser, async function(req, res)
{   
    try{
    const currentHitterPlayer = req.body['currentHitterPlayer'];
    const currentPitchingPlayer = req.body['currentPitchingPlayer'];
    let tempHitterPlayerUpdate = (await TempPlayerStats.find({name: currentHitterPlayer}).exec())[0];
    await TempPlayerStats.findByIdAndUpdate(tempHitterPlayerUpdate._id, {$inc: {'HitterStats.HomeRuns': 1,
        'HitterStats.PlateAppearences': 1, 'HitterStats.AtBats': 1, 'HitterStats.Hits': 1
    }});

    let tempPitchingPlayerUpdate = (await TempPlayerStats.find({name: currentPitchingPlayer}).exec())[0];
    await TempPlayerStats.findByIdAndUpdate(tempPitchingPlayerUpdate._id, {$inc: {'PitcherStats.HomeRuns': 1,
        'PitcherStats.HitsAllowed': 1
    }});


    res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
    

});

/*Provide player who was at bat when the score increments and update their RBI with scoreAddition
Also provide an array of players who made it to Home Plate to increment their Runs counter.
Use this to also update ER*/
app.post("/updateScores", jsonParser, async function(req, res){
    try{
        const updateRedScores = req.body['updateRedScores'];
        const teamRed = req.body['teamRed'];
        const teamBlue = req.body['teamBlue'];
        const scoreAddition = req.body['score_increment'];
        const MainGameInfo = req.body['mainGameInfo'];
        const gameLog = req.body['gameLog'];
        const scoringPlayersArray = req.body['scoringPlayersArray'];
        const currentHitter = req.body['currentHitter'];

        const BBFlag = req.body['BBFlag'];
        const HBPFlag = req.body['HBPFlag'];

        console.log("updateScores: ");
        console.log(MainGameInfo._id);
        console.log(gameLog);

        var currentPitcher = "";
        if(updateRedScores)
        {
            const updateTeamRed = await Team.findByIdAndUpdate(teamRed._id, {
                $inc: {teamScore: scoreAddition}
            }, {new: true});
            currentPitcher = teamBlue.currentPlayerDisplay;

        }
        else
        {
            const updateTeamBlue = await Team.findByIdAndUpdate(teamBlue._id, 
                {
                    $inc: {teamScore: scoreAddition}
                }, {new: true}
            );
            currentPitcher = teamRed.currentPlayerDisplay;
        }

        let currentHitterID = (await TempPlayerStats.find({name: currentHitter}).exec())[0];
        await TempPlayerStats.findByIdAndUpdate(currentHitterID._id, {$inc: {'HitterStats.RunsBattedIn': scoreAddition}});
        for(let i = 0; i < scoringPlayersArray.length; i++)
        {
            let playerID = (await TempPlayerStats.find({name: scoringPlayersArray[i]}).exec())[0];
            await TempPlayerStats.findByIdAndUpdate(playerID._id, {$inc: {'HitterStats.Runs': 1}});
        }
        
        let currentPitcherID = (await TempPlayerStats.find({name: currentPitcher}).exec())[0];
        await TempPlayerStats.findByIdAndUpdate(currentPitcherID._id, {$inc: {'PitcherStats.EarnedRuns': scoreAddition}});

        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {$push: {logMessages: gameLog}},
            {new: true}
        );


        res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("/updateGameOver", jsonParser, async function(req, res)
{
    try{
        const MainGameInfo = req.body['main_game_info'];
        const ForceQuit = req.body['forceQuit'];
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            gameOver: true, earlyQuitOut: ForceQuit
        });
        res.send(updateGameInfo);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("/updateInnings", jsonParser, async function(req, res)
{
    try{
        const MainGameInfo = req.body['main_game_info'];
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            $inc: {currentInning: 1}
        });
        res.send(updateGameInfo);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

/*Use this function call below to calculate the league avgs. Determine whether to store in 
another collection or just temp storage.*/


app.post("/calculateLeagueAverages", jsonParser, async function(req, res)
{
    let tempPlayerArray = await TempPlayerStats.find({});
     

});

/*Use this function call below to update the remaining stats using the league Averages and other updated stats.
One by one for each playing member, input the formulas and enter as such for all. This should be done after game over
is called, but before the actual game over screen is displayed*/

app.post("/updateRemainingStats", jsonParser, async function(req, res)
{
    try{
        let tempPlayerArray = await TempPlayerStats.find({});
    
        for(let i = 0; i < tempPlayerArray.length; i++)
    {
        let player = (await TempPlayerStats.findById(tempPlayerArray[i]._id).exec())[0];
        /*--------------------------- HITTER STATS CALCULATIONS ----------------------------------------*/
        /*don't forget to increment Games*/
        let totalBases = player.HitterStats.OneB + (2 * player.HitterStats.TwoB) + (3 * player.HitterStats.ThreeB)
        + (4 * player.HitterStats.HomeRuns);
        let playerAVG = player.HitterStats.Hits / player.HitterStats.AtBats;
        let SlugPercent = totalBases / player.HitterStats.AtBats;
        let OBPPercent = (player.HitterStats.Hits + player.HitterStats.Walks + player.HitterStats.HitByPitches) / player.HitterStats.PlateAppearences;
        let OPSStat = (SlugPercent + OBPPercent);
        /*IMPORTANT: OPS+ requires the league average of OBP%.*/
        let StrikeoutPercent = (player.HitterStats.StrikeOuts / player.HitterStats.PlateAppearences);
        //wOBA: weighted On Base Average. (BB * .69) + (.72 * HBP) + (.89 * 1B) + (1.27 * 2B) + (1.62 * 3B) + (2.1 * HR). 
        //Then the sum is divided by (AB + BB + HBP)
        let wOBASum = (player.HitterStats.Walks * 0.69) + (player.HitterStats.HitByPitches * 0.72) + (player.HitterStats.OneB * 0.89)
        + (player.HitterStats.TwoB * 1.27) + (player.HitterStats.ThreeB) + (player.HitterStats.HomeRuns * 2.1);
        let finalWOBA = (wOBASum) / (player.HitterStats.AtBats + player.HitterStats.Walks + player.HitterStats.HitByPitches);
        /*IMPORTANT: wRC+ requires league averages of wOBA!*/
        let BABIPDenom = (player.HitterStats.AtBats - player.HitterStats.HomeRuns - player.HitterStats.StrikeOuts);
        let finalBABIP = BABIPDenom <= 0 ? undefined : ((player.HitterStats.Hits - player.HitterStats.HomeRuns) / BABIPDenom);
        let ISO = (player.HitterStats.TwoB + 2 * player.HitterStats.ThreeB + 3 * player.HitterStats.HomeRuns) / player.HitterStats.AtBats;
        /*IMPORTANT: wRC+ RANK Requires the wRC+ stats to sort each player!*/
        /*At this point, update the entire player's stats here before calculating the pitcher stats stuff*/


        /*--------------------------PITCHER STATS------------------------------*/
        /*Don't forget to increment Games here too!*/
        let IP = (player.PitcherStats.Outs / 3);
        let IPdec = IP - Math.floor(IP);
        var finalIP = 0;
        if(IPdec > 0 && IPdec < 0.4)
        {
            finalIP = Math.floor(IP) + 0.1;
        } 
        else if(IPdec > 0.4 && IPdec < 0.7)
        {
            finalIP = Math.floor(IP) + 0.2;
        }
        else
        {
            finalIP = IP + 0.00;
        }
        let ERA = (player.PitcherStats.EarnedRuns / IP) * 9;
        
        let FIPSum = (13 * player.PitcherStats.HomeRuns) + (3 * (player.PitcherStats.Walks + player.PitcherStats.HitByPitches))
        - (2 * player.PitcherStats.StrikeOuts);
        let finalFIP = (FIPSum / IP) + 3.72;
        let WHIP = (player.PitcherStats.Walks + player.PitcherStats.HitsAllowed) / (IP);
        /*IMPORTANT: ERA- and FIP- require their respective league averages!!*/
        /*Once you have the SV and BSV, calculate the SV%*/
        //Check this one in case IP must be different!
        let KPerNineStat = (player.PitcherStats.StrikeOuts * 9) / (IP);
        /*FIP- requires league averages to be sorted.*/
        //Also check this one for same IP issue?
        let BBPerNineStat = (player.PitcherStats.Walks * 9) / (IP); 
        /*UPDATE PITCHER STATS HERE!!*/

    }
    res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
    
});

app.listen(8000, () => {console.log("Server listening on port 8000...");});

app.get("", (req,res) =>
{
    console.log("Request received");
});

// end of server.js
process.on("SIGINT", async () => {
    console.log("Server closed. Database instance disconnected.");
    await mongoose.disconnect();
  
    process.exit(0);
});