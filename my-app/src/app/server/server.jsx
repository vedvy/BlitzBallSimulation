const express = require("express");

const cors = require('cors');

const Player = require('./models/player');
const Team = require('./models/team');
const MainGame = require('./models/main_game');

const mongoose = require('mongoose');

let mongoDB = 'mongodb://127.0.0.1:27107/blitzball';
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error occurred'));

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();
app.use(cors());

app.get("/players", async function(req, res) {
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

