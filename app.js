'use strict';
// Selecting all the needed elements
const btns = document.querySelectorAll('button'),
	container = document.querySelector('.container'),
	input = document.querySelector('input'),
	timeEl = document.querySelector('.time'),
	scoreEl = document.querySelector('.score'),
	wordContainer = document.querySelector('.word__container'),
	hintEl = document.querySelector('.hint');

let randomWord, timer;
let time = 3; // defining the time
let score = 0;
// Sweet Alert Pop up
const Toast = Swal.mixin({
	toast: true,
	position: 'top',
});
// the check word button functionality
const checkWord = () => {
	let userGuess = input.value.toLowerCase();
	if (!userGuess) return; // using guard clause
	if (userGuess === randomWord) {
		// the below code will be executed if the user guess is correct
		Toast.fire({
			icon: 'success',
			title: 'Correct Guess',
			showConfirmButton: false,
			timer: 1000,
		});
		input.value = '';
		score++;
		scoreEl.innerHTML = `Current Score: <b>${score}</b> points`;
		gameFunc();
	} else {
		Toast.fire({
			icon: 'error',
			title: 'Wrong Guess',
			showConfirmButton: false,
			timer: 1000,
		});
	}
};
btns[1].addEventListener('click', checkWord);

// initiating timer
const initTimer = maxTime => {
	clearInterval(timer);
	timer = setInterval(() => {
		if (maxTime > 0) {
			maxTime--;
			return (timeEl.innerHTML = `Time left: ${maxTime}s`);
		}
		clearInterval(timer);
		// if time is up and pop-up appears
		Swal.fire({
			title: 'Time up',
			text: `You scored ${score} points`,
			confirmButtonText: 'Play Again',
		}).then(result => {
			// if the PROCEED button is clicked the code below will be executed
			if (result.isConfirmed) {
				initTimer(30 + 1);
				gameFunc();
				score = 0; // resetting the score
				scoreEl.innerHTML = `Current Score: <b>${score}</b> points`;
			}
		});
		input.value = '';
		gameFunc();
	}, 1000);
};
initTimer(30 + 1);

// implementing the game functionality
const gameFunc = async function () {
	//fetching the required word
	let resp = await fetch('words.json');
	let data = await resp.json();
	// console.log(data);
	let randomObj = data[Math.floor(Math.random() * data.length)];
	randomWord = randomObj.word;
	let randomHint = randomObj.hint;
	let randomWordArray = randomWord.split('');
	for (let i = randomWordArray.length; i > -1; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[randomWordArray[i], randomWordArray[j]] = [randomWordArray[j], randomWordArray[i]]; // shuffling and switching the letters
	}
	let joinedWord = randomWordArray.join('').toUpperCase();
	wordContainer.innerHTML = joinedWord;
	hintEl.innerHTML = `Hint: ${randomHint}`;
};
gameFunc(); // calling the game functionality

// the refresh button functionality
btns[0].addEventListener('click', () => {
	gameFunc();
	input.value = '';
});
// if the user is using a mobile phone
if (document.body.getBoundingClientRect().width <= 360) {
	input.addEventListener('focusin', () => {
		container.style.top = `37%`;
		input.addEventListener('keypress', ({ key }) => {
			if (key === 'Enter') {
				checkWord();
			}
		});
	});
	input.addEventListener('focusout', () => {
		container.style.top = `45%`;
	});
}
input.addEventListener('focusin', () => {
	input.addEventListener('keypress', ({ key }) => {
		if (key === 'Enter') {
			checkWord();
		}
	});
});
alert('Working);
