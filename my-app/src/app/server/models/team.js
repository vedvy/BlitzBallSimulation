const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamColor: { type: String, required: true},
    teamPlayers: [{type: Schema.Types.ObjectId, ref: "player", required: true}],
    teamScore: {type: Number, default: 0},
    teamChoices: {type: String, enum: ["hitter", "pitcher"], required: true}

},
{toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

teamSchema.virtual("id").get(function(){
    return this._id;
});

module.exports = mongoose.model("team", teamSchema);
