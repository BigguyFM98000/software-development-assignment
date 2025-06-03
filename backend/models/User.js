const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	dateOfBirth: { type: Date, required: true },
	contactNumber: { type: Number, required: true },
	preferences: {
		likesPizza: { type: Boolean, default: false },
		likesPasta: { type: Boolean, default: false },
		likesPapWors: { type: Boolean, default: false },
		watchesMovies: { type: Boolean, default: false },
		listensToRadio: { type: Boolean, default: false },
		eatsOut: { type: Boolean, default: false },
		watchesTV: { type: Boolean, default: false },
	},
});

/*
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "dateOfBirth": "1990-01-01",
  "likesPizza": true,
  "likesPasta": false,
  "likesPapWors": true,
  "watchesMovies": true,
  "listensToRadio": false,
  "eatsOut": true,
  "watchesTV": true
}
*/

module.exports = mongoose.model("User", UserSchema);
