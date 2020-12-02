const mongoose = require("mongoose");

const challSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true },
	content: { type: String },
	link: { type: String },
	points: { type: Number },
	flag: { type: String, required: true },
	solves: { type: Array }
});

module.exports = Chall = mongoose.model("Chall", challSchema);