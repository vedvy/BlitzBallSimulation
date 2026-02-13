import mongoose from "mongoose";

const { Schema } = mongoose;

const ScreenViewSchema = new Schema({
    current_view: {type: String, default: "SetUp"}
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

let ScreenViewModel;
try {
  ScreenViewModel = mongoose.models.ScreenView || mongoose.model("ScreenView", ScreenViewSchema);
} catch (error) {
  console.log('ScreenView model registration error:', error.message);
  ScreenViewModel = mongoose.model("ScreenView");
}
export default ScreenViewModel;