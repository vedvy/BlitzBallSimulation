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

