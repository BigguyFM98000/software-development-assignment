const totalSurveys = document.getElementById("survey-total");
const pizzaPercentage = document.getElementById("percent-pizza");
const pastaPercentage = document.getElementById("percent-pasta");
const papworsPercentage = document.getElementById("percent-papwors");
const moviePercentage = document.getElementById("movies-rating");
const radioPercentage = document.getElementById("radio-rating");
const eatoutPercentage = document.getElementById("eatout-rating");
const televisionPercentage = document.getElementById("tv-rating");
let surveyUsers = [];
const averageAge = document.getElementById("avg-age");
const minAge = document.getElementById("min-age");
const maxAge = document.getElementById("max-age");

async function getPercentages() {
	try {
		const res = await fetch("http://localhost:3001/api/percentages");
		if (!res.ok) {
			throw new Error("Failed to fetch percentages");
		}
		const percentages = await res.json();

		pizzaPercentage.innerText = `${percentages.pizza.toFixed(1)}% Pizza`;
		pastaPercentage.innerText = `${percentages.pasta.toFixed(1)}% Pasta`;
		papworsPercentage.innerText = `${percentages.papWors.toFixed(
			1
		)}% Pap and Wors`;
		moviePercentage.innerText = `${percentages.movies.toFixed(1)}%`;
		radioPercentage.innerText = `${percentages.radio.toFixed(1)}%`;
		eatoutPercentage.innerText = `${percentages.eatsOut.toFixed(1)}%`;
		televisionPercentage.innerText = `${percentages.tv.toFixed(1)}%`;
	} catch (error) {
		console.log("Error fetching percentages: " + error);
	}
}
getPercentages();

async function getTotalSurveys() {
	try {
		const res = await fetch("http://localhost:3001/api/users");
		if (!res.ok) {
			throw new Error("Failed to fetch users");
		}
		const users = await res.json();

		totalSurveys.innerText = `${users.length} survey(s)`;
		let stats = calculateAgeStats(users);
		averageAge.innerText = `${stats.averageAge} average age`;
		minAge.innerText = `${stats.minAge} min age`;
		maxAge.innerText = `${stats.maxAge} max age`;
	} catch (error) {
		console.log("Error fetching percentages: " + error);
	}
}
getTotalSurveys();

function getAgeFromDOB(dob) {
	if (!dob) return 0;
	const birthDate = new Date(dob);
	if (isNaN(birthDate.getTime())) {
		console.warn("Invalid date:", dob);
		return 0;
	}

	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}
	return age;
}

function calculateAgeStats(users) {
	if (!Array.isArray(users) || users.length === 0) {
		console.warn("User list is empty or invalid");
		return { averageAge: 0, minAge: 0, maxAge: 0 };
	}

	const ages = users.map((user) => getAgeFromDOB(user.dateOfBirth));
	console.log("Ages array:", ages); // For debugging

	const totalAge = ages.reduce((sum, age) => sum + age, 0);
	const averageAge = totalAge / ages.length;
	const minAge = Math.min(...ages);
	const maxAge = Math.max(...ages);

	return {
		averageAge: averageAge.toFixed(1),
		minAge,
		maxAge,
	};
}
