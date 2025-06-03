const fullname = document.getElementById("fullname");
const email = document.getElementById("email");
const dateOfBirth = document.getElementById("dob");
const contactNumber = document.getElementById("contact");
let likesPizza = false;
let likesPasta = false;
let likesPapWors = false;
let watchesTV = false;
let listensToRadio = false;
let eatsOut = false;
let watchesMovies = false;

function getCheckedFoods(event) {
	event.preventDefault();
	const checkboxes = document.querySelectorAll('input[name="food"]:checked');
	const selectedValues = Array.from(checkboxes).map((cb) => cb.value);
	console.log(selectedValues); // Output the selected values
}

document
	.getElementById("foodForm")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // ⛔ Prevent page reload
		const checkboxes = document.querySelectorAll('input[name="food"]:checked');
		const selectedValues = Array.from(checkboxes).map((cb) => cb.value);
		console.log(selectedValues); // Log or process selected values
		for (let i = 0; i < selectedValues.length; i++) {
			if (selectedValues[i] === "Pizza") {
				likesPizza = true;
			} else if (selectedValues[i] === "Pasta") {
				likesPasta = true;
			} else if (selectedValues[i] === "Pap & Wors") {
				likesPapWors = true;
			} else {
				continue;
			}
		}
		getSelectedRadio();
		console.log(
			likesPizza,
			"pizza",
			likesPasta,
			"pasta",
			likesPapWors,
			"Pap & wors"
		);
	});

function getSelectedRadio() {
	const results = {
		watchesTV: parseInt(getCheckedValue("television")),
		listensToRadio: parseInt(getCheckedValue("radio")),
		eatsOut: parseInt(getCheckedValue("eat-out")),
		watchesMovies: parseInt(getCheckedValue("movies")),
	};

	console.log(results); // Display results or send to server

	let watchesTV = results.watchesTV >= 1 && results.watchesTV <= 3;
	let listensToRadio =
		results.listensToRadio >= 1 && results.listensToRadio <= 3;
	let eatsOut = results.eatsOut >= 1 && results.eatsOut <= 3;
	let watchesMovies = results.watchesMovies >= 1 && results.watchesMovies <= 3;

	console.log(
		watchesTV,
		"TV",
		listensToRadio,
		"radio",
		eatsOut,
		"eatsout",
		watchesMovies,
		"movies"
	);
}

function getCheckedValue(groupName) {
	const selected = document.querySelector(`input[name="${groupName}"]:checked`);
	return selected ? selected.value : null;
}
