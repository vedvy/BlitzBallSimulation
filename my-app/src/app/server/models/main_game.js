const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const mainGameSchema = new Schema({
    teamRed: {type: Schema.Types.ObjectId, ref: "team", required: true},
    teamBlue: {type: Schema.Types.ObjectId, ref: "team", required: true},
    currentBalls:{type: Number, default: 0},
    currentHBP: {type: Number, default: 0},
    currentOuts: {type: Number, default: 0},
    currentStrikes: {type: Number, default: 0},
    currentInning: {type: Number, default: 1},
    topOfInning: {type: Boolean, default: false},
    firstBaseActive: {
        isActive: Boolean,
        playerOnPlate: Schema.Types.ObjectId,
        playerOnPlateDisplay: String
    },
    secondBaseActive: {
        isActive: Boolean,
        playerOnPlate: Schema.Types.ObjectId,
        playerOnPlateDisplay: String  
    },
    thirdBaseActive: {
        isActive: Boolean,
        playerOnPlate: Schema.Types.ObjectId,
        playerOnPlateDisplay: String
    },
    gameOver: {type: Boolean, default: false},
    earlyQuitOut: {type: Boolean, default: false},
    logMessages: [{type: String}]

});

/*Change fBA, sBA, and tBA to have the following fields: 
isActive: Boolean,
currentPlayer: Schema.Types.ObjectId (If no one is on the plate, set the Display one to an empty String.),
currentPlayerDisplay: String*/

mainGameSchema.virtual("id").get(function()
{
    return this._id;
})


module.exports = mongoose.model('MainGame', mainGameSchema);
