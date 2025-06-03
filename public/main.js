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
}

function getSelectedRadio() {
	const results = {
		watchesTV: parseInt(getCheckedValue("television")),
		listensToRadio: parseInt(getCheckedValue("radio")),
		eatsOut: parseInt(getCheckedValue("eat-out")),
		watchesMovies: parseInt(getCheckedValue("movies")),
	};

	let watchesTV = results.watchesTV >= 1 && results.watchesTV <= 3;
	let listensToRadio =
		results.listensToRadio >= 1 && results.listensToRadio <= 3;
	let eatsOut = results.eatsOut >= 1 && results.eatsOut <= 3;
	let watchesMovies = results.watchesMovies >= 1 && results.watchesMovies <= 3;

	return { watchesTV, listensToRadio, eatsOut, watchesMovies };
}

function getCheckedValue(groupName) {
	const selected = document.querySelector(`input[name="${groupName}"]:checked`);
	return selected ? selected.value : null;
}

document
	.getElementById("foodForm")
	.addEventListener("submit", async function (event) {
		event.preventDefault();
		const checkboxes = document.querySelectorAll('input[name="food"]:checked');
		const selectedValues = Array.from(checkboxes).map((cb) => cb.value);

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
		const { watchesTV, listensToRadio, eatsOut, watchesMovies } =
			getSelectedRadio();

		// Basic validation
		if (
			fullname.value.trim() === "" ||
			email.value.trim() === "" ||
			dateOfBirth.value.trim() === "" ||
			contactNumber.value.trim() === ""
		) {
			alert("Please fill in all the fields.");
			return; // Stop submission
		}

		// Email validation
		let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(email.value.trim())) {
			alert("Please enter a valid email address.");
			return;
		}

		let data = {
			fullName: fullname.value,
			email: email.value,
			dateOfBirth: dateOfBirth.value,
			contactNumber: contactNumber.value,
			likesPizza: likesPizza,
			likesPasta: likesPasta,
			likesPapWors: likesPapWors,
			watchesMovies: watchesMovies,
			listensToRadio: listensToRadio,
			eatsOut: eatsOut,
			watchesTV: watchesTV,
		};
		try {
			const res = await fetch("http://localhost:3001/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				throw new Error("Failed to add new survey");
			}
			const newSurvey = await res.json();
		} catch (error) {
			console.error("Error adding survey");
		}
	});
