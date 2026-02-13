import mongoose from "mongoose";

const { Schema } = mongoose;

const playerSchema = new Schema({
    name: {type: String, required: true},
},
{toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

playerSchema.virtual("id").get(function()
{
    return this._id;
});

let PlayerModel;
try {
  PlayerModel = mongoose.models.Player || mongoose.model("Player", playerSchema);
} catch (error) {
  console.log('Player model registration error:', error.message);
  PlayerModel = mongoose.model("Player");
}
export default PlayerModel;
