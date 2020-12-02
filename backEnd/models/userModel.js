const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	admin: { type: Boolean, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 5 },
	displayName: { type: String },
	points: { type: Number },
	challs_done: { type: Array }
});

module.exports = User = mongoose.model("user", userSchema);