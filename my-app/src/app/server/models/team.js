import mongoose from "mongoose";

const { Schema } = mongoose;

const teamSchema = new Schema({
    teamColor: { type: String, required: true},
    teamPlayers: [{type: Schema.Types.ObjectId, ref: "player", required: true}],
    teamScore: {type: Number, default: 0},
    teamChoices: {type: String, enum: ["hitter", "pitcher"], required: true},
    currentPlayer: {type: Schema.Types.ObjectId, ref: "player"},
    currentPlayerDisplay: {type: String}

},
{toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

/*Add a current player field to help with filling in the team UI thing. ObjectId or String?
String may come back to kick me in the ass for updating stats. Though I could always do a Query
for the players. idk, we'll. Also,
add a screen or indication to allow the user to pick who is up at bat/pitch.
Finally, when determine how to store the logs. Another model? idk.*/

teamSchema.virtual("id").get(function(){
    return this._id;
});

let TeamModel;
try {
  TeamModel = mongoose.models.Team || mongoose.model("Team", teamSchema);
} catch (error) {
  console.log('Team model registration error:', error.message);
  TeamModel = mongoose.model("Team");
}
export default TeamModel;
