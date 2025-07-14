//IMPORTANT: npm run dev-server inside /server
//DOUBLY IMPORTANT TO IMPLEMENT: I may need a separate package.json for th server,
//which means file restructuring
import express from "express";
import cors from "cors";
import Player from './models/player.js';
import Team from './models/team.js';
import MainGame from './models/main_game.js';
import mongoose from 'mongoose';
import bodyParser from "body-parser";

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

app.get("/teams", async function(req, res) {
    try{
        const teamsArray = await Team.find({});
        res.send(teamsArray);
    }
    catch(err){
        res.status(500).json({message: "err", err});
    }
});

app.get("/maingame", async function(req, res){
    try{
        const mainGame = await MainGame.find({});
        res.send(mainGame);
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
            const updateRedTeam = await Team.findByIdAndUpdate(redTeam.id, {teamChoices: "hitter"}, {new: true});
            const updateBlueTeam = await Team.findByIdAndUpdate(blueTeam.id, {teamChoices: "pitcher"}, {new: true});
        }
        else
        {
            const updateRedTeam = await Team.findByIdAndUpdate(redTeam.id, {teamChoices: "pitcher"}, {new: true});
            const updateBlueTeam = await Team.findByIdAndUpdate(blueTeam.id, {teamChoices: "hitter"}, {new: true});
        }
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo.id, {
                firstBaseActive: false,
                secondBaseActive: false,
                thirdBaseActive: false,
                topOfInning: !currentTopOfInning
            }, {new: true});
        res.send(updateGameInfo);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
})


app.post("incrementOuts", jsonParser, async function(req, res){
    try{
        const MainGameInfo = req.body['main_game_info'];
        const resetOuts = req.body['resetOuts'];
 
        if(resetOuts)
        {
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo.id, 
            {
                currentOuts: 0,
                currentStrikes: 0
            }, {new: true});    
        }
        else
        {
            const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo.id, 
            {
               $inc: {currentOuts: 1},
                currentStrikes: 0
            }, {new: true});
        }

        res.send(updateGameInfo);
        
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("incrementStrikes", jsonParser, async function(req, res){
    try{
        const MainGameInfo = req.body['main_game_info'];
        
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo.id, {
            $inc: {currentStrikes: 1}
            }, {new: true});
        
        res.send(updateGameInfo);

    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }

});

app.post("updateFirstBase", jsonParser, async function(req, res)
{
    try{
        const MainGameInfo = req.body['main_game_info'];
        const isActive = req.body['isActive'];
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo.id, {
            firstBaseActive: isActive 
        }, {new: true});
        res.send(updateGameInfo);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("updateSecondBase", jsonParser, async function(req, res)
{
    try{
        const MainGameInfo = req.body['main_game_info'];
        const isActive = req.body['isActive'];
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo.id, {
            secondBaseActive: isActive 
        }, {new: true});
        res.send(updateGameInfo);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("updateThirdBase", jsonParser, async function(req, res)
{
    try{
        const MainGameInfo = req.body['main_game_info'];
        const isActive = req.body['isActive'];
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo.id, {
            thirdBaseActive: isActive 
        }, {new: true});
        res.send(updateGameInfo);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("updateScores", jsonParser, async function(req, res){
    try{
        const updateRedScores = req.body['updateRedScores'];
        const teamRed = req.body['teamRed'];
        const teamBlue = req.body['teamBlue'];
        const scoreAddition = req.body['score_increment'];
        if(updateRedScores)
        {
            const updateTeamRed = await Team.findByIdAndUpdate(teamRed.id, {
                $inc: {teamScore: scoreAddition}
            }, {new: true});
        }
        else
        {
            const updateTeamBlue = await Team.findByIdAndUpdate(teamBlue.id, 
                {
                    $inc: {teamScore: scoreAddition}
                }, {new: true}
            );
        }
        res.send(200);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("updateGameOver", jsonParser, async function(req, res)
{
    try{
        const MainGameInfo = req.body['main_game_info'];
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo.id, {
            gameOver: true
        });
        res.send(updateGameInfo);
    }
    catch(err)
    {
        res.status(500).json({message: "err", err});
    }
});

app.post("updateInnings", jsonParser, async function(req, res)
{
    try{
        const MainGameInfo = req.body['main_game_info'];
        const updateGameInfo = await MainGame.findByIdAndUpdate(MainGameInfo.id, {
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