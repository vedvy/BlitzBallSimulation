//IMPORTANT: npm run dev-server
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