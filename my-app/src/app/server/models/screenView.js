const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const ScreenViewSchema = new Schema({
    current_view: {type: String, default: "SetUp"}
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

module.exports = mongoose.model("ScreenViewSchema", ScreenViewSchema);