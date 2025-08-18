//IMPORTANT: npm run dev-server inside /server
//DOUBLY IMPORTANT TO IMPLEMENT: I may need a separate package.json for th server,
//which means file restructuring
import express from "express";
import cors from "cors";
import Player from './models/player.js';
import Team from './models/team.js';
import MainGame from './models/main_game.js';
import TempPlayerStats from "./models/tempPlayerStats.js";
import leagueAverages from "./models/leagueAverages.js";

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
    try{
        let tempPlayerArray = await TempPlayerStats.find({});
    var OneBSum = 0, TwoBSum = 0, ThreeBSum = 0, HittingHRSum = 0, HittingBBSum = 0, HittingHBPSum = 0, ABSum = 0, 
    PASum = 0, HitsSum = 0, OBPPercent = 0, wOBA = 0;
    var IPSum = 0, KSum = 0, ERA = 0, ERSum = 0, PitchingHRSum = 0, PitchingBBSum = 0, PitchingHBPSum = 0, FIP = 0;

    for(let i = 0; i < tempPlayerArray.length; i++)
    {
        console.log(tempPlayerArray[i]);
        console.log(tempPlayerArray[i]._id);
        let player = (await TempPlayerStats.findById(tempPlayerArray[i]._id));
        console.log(player);
        let hittingPlayer = player.HitterStats; 
        

        OneBSum += hittingPlayer.OneB;
        console.log(hittingPlayer.OneB);
        console.log(OneBSum);
        TwoBSum += hittingPlayer.TwoB;
        ThreeBSum += hittingPlayer.ThreeB;
        HittingHRSum += hittingPlayer.HomeRuns;
        HittingBBSum += hittingPlayer.Walks;
        HittingHBPSum += hittingPlayer.HitByPitches;
        ABSum += hittingPlayer.AtBats;
        PASum += hittingPlayer.PlateAppearences;
        HitsSum += hittingPlayer.Hits;
        
        let pitchingPlayer = player.PitcherStats;
        IPSum += pitchingPlayer.InningsPitched;
        KSum += pitchingPlayer.StrikeOuts;
        ERSum += pitchingPlayer.EarnedRuns;
        PitchingHRSum += pitchingPlayer.HomeRuns;
        PitchingBBSum += pitchingPlayer.Walks;
        PitchingHBPSum += pitchingPlayer.HitByPitches;
    }

    OBPPercent = (HitsSum + HittingHBPSum + HittingBBSum) / PASum;
    let wOBASum = (0.69 * HittingBBSum) + (0.72 * HittingHBPSum) + (0.89 * OneBSum) + (1.27 * TwoBSum) + (1.62 * ThreeBSum) + (2.1 * HittingHRSum);
    wOBA = (wOBASum) / (HittingBBSum + ABSum + HittingHBPSum);


    // ERA = (ERSum / IPSum) * 9;
    // let FIPSum = (13 * PitchingHRSum) + (3 * (PitchingBBSum + PitchingHBPSum)) - (2 * KSum);
    // FIP = (FIPSum / IPSum) + 3.72;
    // console.log(FIPSum);
    // console.log(FIP);

    let LeagueAverages = new leagueAverages({
        HitterStats:
        {
            OneB: OneBSum,
            TwoB: TwoBSum,
            ThreeB: ThreeBSum,
            HomeRuns: HittingHRSum,
            Walks: HittingBBSum,
            HitByPitches: HittingHBPSum,
            AtBats: ABSum,
            PlateAppearences: PASum,
            Hits: HitsSum,
            OBPPercent: OBPPercent,
            SLGPercent: 0,
            wOBA: wOBASum
        },
        PitcherStats:
        {
            StrikeOuts: KSum,
            InningsPitched: IPSum,
            EarnedRunAverage: 0.00,
            EarnedRuns: ERSum,
            HomeRuns: PitchingHRSum,
            Walks: PitchingBBSum,
            HitByPitches: PitchingHBPSum,
            FIPAvg: 0.00
        }
    });

    await LeagueAverages.save();
    res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
    

});

/*Use this function call below to update the remaining stats using the league Averages and other updated stats.
One by one for each playing member, input the formulas and enter as such for all. This should be done after game over
is called, but before the actual game over screen is displayed*/

app.post("/updateRemainingStats", jsonParser, async function(req, res)
{
    try{
        console.log("Inside update Remaining Stats");
        let tempPlayerArray = await TempPlayerStats.find({});
        let LeagueAverages = (await leagueAverages.find({}).exec())[0];
        console.log("Found League Averages object");
        var totalBasesSum = 0;
        var IPSum = 0;

        for(let i = 0; i < tempPlayerArray.length; i++)
    {
        let player = (await TempPlayerStats.findById(tempPlayerArray[i]._id));
        console.log(player.name);
        /*--------------------------- HITTER STATS CALCULATIONS ----------------------------------------*/
        /*don't forget to increment Games*/
        let totalBases = player.HitterStats.OneB + (2 * player.HitterStats.TwoB) + (3 * player.HitterStats.ThreeB)
        + (4 * player.HitterStats.HomeRuns);
        totalBasesSum += totalBases;
        
        let playerAVG = player.HitterStats.Hits / player.HitterStats.AtBats;
        if(isNaN(playerAVG))
        {
            playerAVG = undefined;
        }
        let SlugPercent = totalBases / player.HitterStats.AtBats;
        if(isNaN(SlugPercent))
        {
            SlugPercent = undefined;
        }
        let OBPPercent = (player.HitterStats.Hits + player.HitterStats.Walks + player.HitterStats.HitByPitches) / player.HitterStats.PlateAppearences;
        if(isNaN(OBPPercent))
        {
            OBPPercent = undefined;
        }
        let OPSStat = (SlugPercent + OBPPercent);
        if(isNaN(OPSStat))
        {
            OPSStat = undefined;
        }
        console.log("Random consolle log 1");
        /*IMPORTANT: OPS+ requires the league average of OBP%.*/
        // let OPSPlus = (100 * (OBPPercent / LeagueAverages.HitterStats.OBPPercent)) + (100 * ())

        let StrikeoutPercent = (player.HitterStats.StrikeOuts / player.HitterStats.PlateAppearences);
        if(isNaN(StrikeoutPercent))
        {
            StrikeoutPercent = undefined;
        }
        //wOBA: weighted On Base Average. (BB * .69) + (.72 * HBP) + (.89 * 1B) + (1.27 * 2B) + (1.62 * 3B) + (2.1 * HR). 
        //Then the sum is divided by (AB + BB + HBP)
        let wOBASum = (player.HitterStats.Walks * 0.69) + (player.HitterStats.HitByPitches * 0.72) + (player.HitterStats.OneB * 0.89)
        + (player.HitterStats.TwoB * 1.27) + (player.HitterStats.ThreeB) + (player.HitterStats.HomeRuns * 2.1);
        let finalWOBA = (wOBASum) / (player.HitterStats.AtBats + player.HitterStats.Walks + player.HitterStats.HitByPitches);
        if(isNaN(finalWOBA))
        {
            finalWOBA = undefined;
        }
        /*IMPORTANT: wRC+ requires league averages of wOBA!*/
        let wRCPlus = player.HitterStats.PlateAppearences + player.HitterStats.Games >= 20 ? 
        (100 * (finalWOBA / LeagueAverages.HitterStats.wOBA)) : undefined;
        if(isNaN(wRCPlus))
        {
            wRCPlus = undefined;
        }
        let BABIPDenom = (player.HitterStats.AtBats - player.HitterStats.HomeRuns - player.HitterStats.StrikeOuts);

        let finalBABIP = BABIPDenom <= 0 ? undefined : ((player.HitterStats.Hits - player.HitterStats.HomeRuns) / BABIPDenom);
        let ISO = (player.HitterStats.TwoB + 2 * player.HitterStats.ThreeB + 3 * player.HitterStats.HomeRuns) / player.HitterStats.AtBats;
        if(isNaN(ISO))
        {
            ISO = undefined;
        }
        
        /*IMPORTANT: wRC+ RANK Requires the wRC+ stats to sort each player!*/

        /*At this point, update the entire player's stats here before calculating the pitcher stats stuff*/
        
        console.log(totalBases, " ", playerAVG, " ", SlugPercent, " ", OBPPercent, 
            " ", OPSStat, " ", StrikeoutPercent, " ", finalWOBA, " ", wRCPlus, " ",
             finalBABIP, " ", ISO
        );
        console.log("Before update hit  stats");
        await TempPlayerStats.findByIdAndUpdate(player._id, {
            $inc: {'HitterStats.Games': 1},
            'HitterStats.TotalBases': totalBases,
            'HitterStats.Average': playerAVG,
            'HitterStats.SLGPercent': SlugPercent,
            'HitterStats.OBPPercent': OBPPercent,
            'HitterStats.OnBasePlusSlugging': OPSStat,
            'HitterStats.KPercent': StrikeoutPercent,
            'HitterStats.wOBA': finalWOBA,
            'HitterStats.wRCPlus': wRCPlus,
            'HitterStats.BatAvgBallsInPlay': finalBABIP,
            'HitterStats.IsolatedPower': ISO
        });
        console.log("Done updating Hitting Stats");
        /*--------------------------PITCHER STATS------------------------------*/
        /*Don't forget to increment Games here too!*/
        let IP = (player.PitcherStats.Outs / 3);
        IPSum += IP;
        let IPdec = IP - Math.floor(IP);
        var finalIP = 0;
        /*TODO: IP gets calculated here, so handle the FIPSUM and FIPAvg stuff here instead. AND ERA AVG. DAMN*/
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
        if(isNaN(ERA))
        {
            ERA = undefined;
        } 
        
        let FIPSum = (13 * player.PitcherStats.HomeRuns) + (3 * (player.PitcherStats.Walks + player.PitcherStats.HitByPitches))
        - (2 * player.PitcherStats.StrikeOuts);
        
        console.log("ranodm conasole log 2");
        let finalFIP = IP <= 0 ? undefined : (FIPSum / IP) + 3.72;
        
        
        let WHIP = (IP === 0) ? undefined : (player.PitcherStats.Walks + player.PitcherStats.HitsAllowed) / (IP);
        
        /*Once you have the SV and BSV, calculate the SV%*/
        
        let KPerNineStat = IP <= 0 ? undefined : (player.PitcherStats.StrikeOuts * 9) / (IP);
        /*FIP- requires league averages to be sorted.*/

        
        let BBPerNineStat = IP <= 0 ? undefined : (player.PitcherStats.Walks * 9) / (IP); 
        
        /*UPDATE PITCHER STATS HERE!!*/
        console.log("before pitching stats update");
        await TempPlayerStats.findByIdAndUpdate(player._id, {
            $inc: {'PitcherStats.Games': 1},
            'PitcherStats.InningsPitched': finalIP,
            'PitcherStats.EarnedRunAverage': ERA,
            'PitcherStats.FieldingIndPitching': finalFIP,
            'PitcherStats.WalksHitsInningsPitched': WHIP,
            'PitcherStats.KPerNine': KPerNineStat,
            'PitcherStats.BBPerNine': BBPerNineStat
        });
        console.log("Done with updating Pitching stats");
    }
    console.log("Out of big ass loop");
    /*Until I come up with a better system, use the totalBasesSum here to properly update the final stat: OPS+*/
    let wRCPlusArray = tempPlayerArray.sort(compareWRCDescending);
    console.log(LeagueAverages.PitcherStats.StrikeOuts);

    let SLGPercentAverage = LeagueAverages.HitterStats.AtBats <= 0 ? undefined : (totalBasesSum / LeagueAverages.HitterStats.AtBats);
    console.log("SLGPercentAverage: ", SLGPercentAverage);
    let ERAAverage = IPSum <= 0 ? undefined : (LeagueAverages.PitcherStats.EarnedRuns / IPSum) * 9;
    console.log("ERAAverage: ", ERAAverage);
    let FIPAverageSum = (13 * LeagueAverages.PitcherStats.HomeRuns) + (3 * (LeagueAverages.PitcherStats.Walks + LeagueAverages.PitcherStats.HitByPitches)) 
    - (2 * LeagueAverages.PitcherStats.StrikeOuts);
    console.log("FIPAverageSum: ", FIPAverageSum);
    let FIPAverage = IPSum <= 0 ? undefined : (FIPAverageSum / IPSum) + 3.72;
    console.log("FIPAverage: ", FIPAverage);
    // console.log(FIPSum);
    // console.log(FIP);
    console.log("Before second for loop");
    for(let i = 0; i < tempPlayerArray.length; i++)
    {
        let player = (await TempPlayerStats.findById(tempPlayerArray[i]._id));
        let OPSPlus = (LeagueAverages.HitterStats.OBPPercent <= 0 || SLGPercentAverage <= 0) ? undefined :
        (100 * (player.HitterStats.OBPPercent / LeagueAverages.HitterStats.OBPPercent)) 
        + (100 * (player.HitterStats.SLGPercent / SLGPercentAverage));
        console.log(isNaN(OPSPlus));
        if(isNaN(OPSPlus))
        {
            OPSPlus = undefined;
        }
        console.log("OPSPlus: ", OPSPlus);
        
        let ERAMinus = player.PitcherStats.InningsPitched <= 0 ? undefined : 
        (100 * (ERAAverage / LeagueAverages.PitcherStats.EarnedRunAverage));
        
        let FIPMinus = player.PitcherStats.InningsPitched <= 0 ? undefined : 
        (100 * (player.PitcherStats.FieldingIndPitching / FIPAverage));

        await TempPlayerStats.findByIdAndUpdate(player._id, {
            'HitterStats.OPSPlus': OPSPlus,
            'HitterStats.wRCPlusRank': wRCPlusArray.indexOf(player.name),
            'PitcherStats.EarnedRunAverage': ERAMinus,
            'PitcherStats.FIPMinus': FIPMinus
            
        });
    }
    console.log("After second for loop");
    /*Do one more for-loop for the FIPMinus Array. Refactoring will take too long for now.*/
    let FIPMinusArray = tempPlayerArray.sort(compareFIPMinusAscending);
    for(let i = 0; i < tempPlayerArray.length; i++)
    {
        let player = (await TempPlayerStats.findById(tempPlayerArray[i]._id));
        
        if(player.PitcherStats.FIPMinus !== undefined)
        {
            await TempPlayerStats.findByIdAndUpdate(player._id, {
            'PitcherStats.FIPMinus': FIPMinusArray.indexOf(player.name)    
        });
        } 
    }

    res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
    
});

function compareWRCDescending(a, b)
{
    return b.HitterStats.wRCPlus - a.HitterStats.wRCPlus;
}

function compareFIPMinusAscending(a, b)
{
    return a.PitcherStats.FIPMinus - b.PitcherStats.FIPMinus;
}

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