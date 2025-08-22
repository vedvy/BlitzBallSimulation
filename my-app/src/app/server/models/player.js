const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: {type: String, required: true},
},
{toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

playerSchema.virtual("id").get(function()
{
    return this._id;
});

console.log('mongoose.models in player:', mongoose.models);
module.exports = mongoose.model("player", playerSchema);
