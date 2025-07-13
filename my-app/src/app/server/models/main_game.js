const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const mainGameSchema = new Schema({
    teamRed: {type: Schema.Types.ObjectId, ref: "team", required: true},
    teamBlue: {type: Schema.Types.ObjectId, ref: "team", required: true},
    currentOuts: {type: Number, default: 0},
    currentStrikes: {type: Number, default: 0},
    currentInning: {type: Number, default: 1},
    topOfInning: {type: Boolean, default: false},
    firstBaseActive: {type: Boolean, default: false},
    secondBaseActive: {type: Boolean, default: false},
    thirdBaseActive: {type: Boolean, default: false},
    gameOver: {type: Boolean, default: false}
});

/* 
Add virtual functions for the following fields: 
pretty much all except for teams Red and Blue. And add the context. and the init.
*/

mainGameSchema.virtual("id").get(function()
{
    return this._id;
})

module.exports = mongoose.model("MainGame", mainGameSchema);