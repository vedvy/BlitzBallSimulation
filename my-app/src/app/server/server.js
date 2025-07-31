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
            let gameLog = `${teamRed.currentPlayerDisplay} got ${teamBlue.currentPlayerDisplay} OUT! 
            Strikeout: ${StrikeOut}`;
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {$push: {logMessages: gameLog}},
            {new: true}
        );
        }
        else
        {
            let gameLog =  `${teamBlue.currentPlayerDisplay} got ${teamRed.currentPlayerDisplay} OUT!
            StrikeOut: ${StrikeOut}`;
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {$push: {logMessages: gameLog}},
            {new: true}
        );
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

app.post("/updateFirstBase", jsonParser, async function(req, res)
{
    /*Have a BB and HBP flag too to update those fields.*/
    try{
        console.log("inside first base");
        const MainGameInfo = req.body['main_game_info'];
        const isActive = req.body['isActive'];
        const currentPlayer = req.body['currentPlayer'];
        
        
        console.log(currentPlayer);

        const currentPlayerID = await Player.find({name: currentPlayer});

        console.log(currentPlayerID[0]._id);
        if(isActive)
        {
            const BBFlag = req.body['BBFlag'];
            const HBPFlag = req.body['HBPFlag'];

            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            firstBaseActive: {isActive: isActive, playerOnPlate: currentPlayerID[0]._id, playerOnPlateDisplay: currentPlayer},
            currentBalls: 0,
            currentHBP: 0,
            currentStrikes: 0
        }, {new: true});

            let tempPlayerUpdate = (await TempPlayerStats.find({name: currentPlayer}).exec())[0];
            if(BBFlag)
            {
                let UpdatingPlayerBB = await TempPlayerStats.findByIdAndUpdate(tempPlayerUpdate._id, {$inc: {'HitterStats.BB': 1}});
                let gameLog = `${currentPlayer} walks to first base!`;
                const updateGameLogs = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
                    $push: {logMessages: gameLog}
                });
            }
            else if(HBPFlag)
            {
                let UpdatingPlayerHBP = await TempPlayerStats.findByIdAndUpdate(tempPlayerUpdate._id, {$inc: {'HitterStats.HitByPitches': 1}});
                let gameLog = `${currentPlayer} endures the pain of 2 Hit By Pitches and walks!`;
                const updateGameLogs = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
                    $push: {logMessages: gameLog}
                });
            }
            else
            {
                let UpdatingPlayerOneB = await TempPlayerStats.findByIdAndUpdate(tempPlayerUpdate._id, {$inc: {'HitterStats.OneB': 1}});
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
        const currentPlayer = req.body['currentPlayer'];
        console.log(currentPlayer);

        const currentPlayerID = await Player.find({name: currentPlayer});

        /*Use the currentPlayer name as the query for tempPlayerStats. Then update 2B.
        Same Idea for 3B and HR*/

        if(isActive)
        {
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            secondBaseActive: {isActive: isActive, playerOnPlate: currentPlayerID._id, playerOnPlateDisplay: currentPlayer},
            currentBalls: 0,
            currentHBP: 0,
            currentStrikes: 0 
        }, {new: true});
        let tempPlayerUpdate = (await TempPlayerStats.find({name: currentPlayer}).exec())[0];
        let UpdatingPlayerTwoB = await TempPlayerStats.findByIdAndUpdate(tempPlayerUpdate._id, {$inc: {'HitterStats.TwoB': 1}});
        
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

app.post("/updateThirdBase", jsonParser, async function(req, res)
{
    try{
        console.log("Inside Third Base");

        const MainGameInfo = req.body['main_game_info'];
        const isActive = req.body['isActive'];
        const currentPlayer = req.body['currentPlayer'];
        console.log(currentPlayer);

        const currentPlayerID = await Player.find({name: currentPlayer});
        if(isActive)
        {
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo._id, {
            thirdBaseActive: {isActive: isActive, playerOnPlate: currentPlayerID._id, playerOnPlateDisplay: currentPlayer},
            currentBalls: 0,
            currentHBP: 0,
            currentStrikes: 0
        }, {new: true});
        let tempPlayerUpdate = (await TempPlayerStats.find({name: currentPlayer}).exec())[0];
        let UpdatingPlayerThreeB = await TempPlayerStats.findByIdAndUpdate(tempPlayerUpdate._id, {$inc: {'HitterStats.ThreeB': 1}});
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
        const currentPlayer = req.body['currentPlayer'];
    let tempPlayerUpdate = (await TempPlayerStats.find({name: currentPlayer}).exec())[0];
    let UpdatingPlayerHR = await TempPlayerStats.findByIdAndUpdate(tempPlayerUpdate._id, {$inc: {'HitterStats.HomeRuns': 1}});
    res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
    

});

app.post("/updateScores", jsonParser, async function(req, res){
    try{
        const updateRedScores = req.body['updateRedScores'];
        const teamRed = req.body['teamRed'];
        const teamBlue = req.body['teamBlue'];
        const scoreAddition = req.body['score_increment'];
        const MainGameInfo = req.body['mainGameInfo'];
        const gameLog = req.body['gameLog'];
        console.log("updateScores: ");
        console.log(MainGameInfo._id);
        console.log(gameLog);

        if(updateRedScores)
        {
            const updateTeamRed = await Team.findByIdAndUpdate(teamRed._id, {
                $inc: {teamScore: scoreAddition}
            }, {new: true});
        }
        else
        {
            const updateTeamBlue = await Team.findByIdAndUpdate(teamBlue._id, 
                {
                    $inc: {teamScore: scoreAddition}
                }, {new: true}
            );
        }
        
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