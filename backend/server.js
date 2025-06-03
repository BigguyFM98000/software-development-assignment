const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { body, validationResult } = require("express-validator");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
	.connect(process.env.Mongo_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error(err));

// POST Route: Create a new user with validation
app.post(
	"/api/users",
	[
		body("fullName").isString().notEmpty().withMessage("Full name is required"),
		body("email")
			.isEmail()
			.withMessage("Invalid email format")
			.custom(async (email) => {
				const userExists = await User.findOne({ email });
				if (userExists) {
					throw new Error("Email is already in use");
				}
				return true;
			}),
		body("dateOfBirth")
			.isDate()
			.withMessage("Invalid date of birth")
			.custom((dob) => {
				const today = new Date();
				const age = today.getFullYear() - new Date(dob).getFullYear();
				if (age < 18) {
					throw new Error("User must be at least 18 years old");
				}
				return true;
			}),
		body("likesPizza").isBoolean().withMessage("Likes Pizza must be a boolean"),
		body("likesPasta").isBoolean().withMessage("Likes Pasta must be a boolean"),
		body("likesPapWors")
			.isBoolean()
			.withMessage("Likes Pap & Wors must be a boolean"),
		body("watchesMovies")
			.isBoolean()
			.withMessage("Watches Movies must be a boolean"),
		body("listensToRadio")
			.isBoolean()
			.withMessage("Listens to Radio must be a boolean"),
		body("eatsOut").isBoolean().withMessage("Eats Out must be a boolean"),
		body("watchesTV").isBoolean().withMessage("Watches TV must be a boolean"),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const {
				fullName,
				email,
				dateOfBirth,
				contactNumber,
				likesPizza = false, // Default to false if not provided
				likesPasta = false, // Default to false if not provided
				likesPapWors = false, // Default to false if not provided
				watchesMovies = false, // Default to false if not provided
				listensToRadio = false, // Default to false if not provided
				eatsOut = false, // Default to false if not provided
				watchesTV = false, // Default to false if not provided
			} = req.body;

			// Create the new user
			const newUser = new User({
				fullName,
				email,
				dateOfBirth,
				contactNumber,
				preferences: {
					likesPizza,
					likesPasta,
					likesPapWors,
					watchesMovies,
					listensToRadio,
					eatsOut,
					watchesTV,
				},
			});

			const savedUser = await newUser.save();
			res.status(201).json(savedUser);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
);

// PUT Route: Update an existing user
app.put(
	"/api/users/:email", // Using email as a parameter for update
	[
		body("fullName")
			.optional()
			.isString()
			.notEmpty()
			.withMessage("Full name must be a non-empty string"),
		body("dateOfBirth")
			.optional()
			.isDate()
			.withMessage("Invalid date of birth")
			.custom((dob) => {
				const today = new Date();
				const age = today.getFullYear() - new Date(dob).getFullYear();
				if (age < 18) {
					throw new Error("User must be at least 18 years old");
				}
				return true;
			}),
		body("likesPizza")
			.optional()
			.isBoolean()
			.withMessage("Likes Pizza must be a boolean"),
		body("likesPasta")
			.optional()
			.isBoolean()
			.withMessage("Likes Pasta must be a boolean"),
		body("likesPapWors")
			.optional()
			.isBoolean()
			.withMessage("Likes Pap & Wors must be a boolean"),
		body("watchesMovies")
			.optional()
			.isBoolean()
			.withMessage("Watches Movies must be a boolean"),
		body("listensToRadio")
			.optional()
			.isBoolean()
			.withMessage("Listens to Radio must be a boolean"),
		body("eatsOut")
			.optional()
			.isBoolean()
			.withMessage("Eats Out must be a boolean"),
		body("watchesTV")
			.optional()
			.isBoolean()
			.withMessage("Watches TV must be a boolean"),
	],
	async (req, res) => {
		// Check for validation errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const email = req.params.email;
			const updateData = req.body;

			const user = await User.findOneAndUpdate({ email }, updateData, {
				new: true,
			});

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			res.status(200).json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
);

// DELETE Route: Delete a user by email
app.delete("/api/users/:email", async (req, res) => {
	try {
		const email = req.params.email;

		const user = await User.findOneAndDelete({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ message: "User deleted successfully", user });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// GET Route: Fetch all users
app.get("/api/users", async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// GET Route: Calculate the percentage of users who like certain foods/activities
app.get("/api/percentages", async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();

		if (totalUsers === 0) {
			return res.status(200).json({
				pizza: 0,
				pasta: 0,
				papWors: 0,
				movies: 0,
				radio: 0,
				eatsOut: 0,
				tv: 0,
			});
		}

		// Aggregate to calculate the percentage for each preference
		const aggregationResult = await User.aggregate([
			{
				$group: {
					_id: null,
					likesPizzaCount: {
						$sum: { $cond: [{ $eq: ["$preferences.likesPizza", true] }, 1, 0] },
					},
					likesPastaCount: {
						$sum: { $cond: [{ $eq: ["$preferences.likesPasta", true] }, 1, 0] },
					},
					likesPapWorsCount: {
						$sum: {
							$cond: [{ $eq: ["$preferences.likesPapWors", true] }, 1, 0],
						},
					},
					watchesMoviesCount: {
						$sum: {
							$cond: [{ $eq: ["$preferences.watchesMovies", true] }, 1, 0],
						},
					},
					listensToRadioCount: {
						$sum: {
							$cond: [{ $eq: ["$preferences.listensToRadio", true] }, 1, 0],
						},
					},
					eatsOutCount: {
						$sum: { $cond: [{ $eq: ["$preferences.eatsOut", true] }, 1, 0] },
					},
					watchesTVCount: {
						$sum: { $cond: [{ $eq: ["$preferences.watchesTV", true] }, 1, 0] },
					},
				},
			},
		]);

		// If no result, return zeros
		if (aggregationResult.length === 0) {
			return res.status(200).json({
				pizza: 0,
				pasta: 0,
				papWors: 0,
				movies: 0,
				radio: 0,
				eatsOut: 0,
				tv: 0,
			});
		}

		// Extract the count from the aggregation result
		const counts = aggregationResult[0];

		const percentages = {
			pizza: (counts.likesPizzaCount / totalUsers) * 100,
			pasta: (counts.likesPastaCount / totalUsers) * 100,
			papWors: (counts.likesPapWorsCount / totalUsers) * 100,
			movies: (counts.watchesMoviesCount / totalUsers) * 100,
			radio: (counts.listensToRadioCount / totalUsers) * 100,
			eatsOut: (counts.eatsOutCount / totalUsers) * 100,
			tv: (counts.watchesTVCount / totalUsers) * 100,
		};

		res.status(200).json(percentages);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
