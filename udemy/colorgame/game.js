// selectors

var h1 = document.querySelector("h1");
var rgbDisplay = document.querySelector("#rgbDisplay");
var messageDisplay = document.querySelector("#message");
var squares = document.querySelectorAll(".square");
var resetBtn = document.querySelector("#reset")
var modeBtns = document.querySelectorAll(".mode");

// define colors

var colorCount = 6;
var colors = [];
var pickedColor = pickColor();

// initialize

init();

function init() {
	setupModes();
	setupSquares();
	reset();
};

// set up mode buttons

function setupModes() {
	for (i = 0; i < modeBtns.length; i++) {
		modeBtns[i].addEventListener("click", function() {

			// adjust classes

			modeBtns[0].classList.remove("selected");
			modeBtns[1].classList.remove("selected");
			modeBtns[2].classList.remove("selected");
			this.classList.add("selected");

			// call reset function

			// this.textContent === "Easy" ? colorCount = 3: colorCount = 6;

			if (this.textContent === "Easy") {
				colorCount = 3;
			}
			else if (this.textContent === "Medium") {
				colorCount = 6;
			}
			else {
				colorCount = 9;
			};

			reset();

		})
	};
};

// setup squares
// add event listener to each square check clicked color
function setupSquares() {
	for (i = 0; i < squares.length; i++) {
		squares[i].addEventListener("click", function() {
			
			// get square color

			var clickedColor = this.style.backgroundColor;

			// compare to picked color

			if (clickedColor === pickedColor) {
				messageDisplay.textContent = "Correct!";
				h1.style.backgroundColor = clickedColor;
				resetBtn.textContent = "Play Again?";
				changeColors(clickedColor);
			}
			else {
				messageDisplay.textContent = "Try Again";
				this.style.backgroundColor = "#232323";
			}

		});
	};
};

// reset button

resetBtn.addEventListener("click", function() {

	// make sure it says "New Colors" and reset the background of the h1

	this.textContent = "New Colors";
	h1.style.backgroundColor = "steelblue";
	messageDisplay.textContent = "";

	// regen colors

	reset();

});

// reset function

function reset() {

	colors = generateRandomColors(colorCount);
	applyColors();

	pickedColor = pickColor();
	rgbDisplay.textContent = pickedColor;

	messageDisplay.textContent = "";
	resetBtn.textContent = "New Colors";

	h1.style.backgroundColor = "steelblue";

};

// function to apply colors to squares;

function applyColors() {
	for (i = 0; i < squares.length; i++) {
		if (colors[i]) {
			squares[i].style.display = "block";
			squares[i].style.backgroundColor = colors[i];
		}
		else {
			squares[i].style.display = "none";
		}		
	};
};

// function to generate random RGB
// r, g, and b go from 0 to 255

function randomColor() {

	// generate the colors

	var r = Math.floor(Math.random() * 256),
		g =  Math.floor(Math.random() * 256),
		b =  Math.floor(Math.random() * 256);

	// generate rgb string

	return "rgb(" + r + ", " + g + ", " + b + ")";

};

// function to take random colors and push into array

function generateRandomColors(num) {

	// make array

	var arr = [];

	// add num random colors to array

	for (i = 0; i < num; i++) {
		arr.push(randomColor());
	}

	// return it to colors;

	return arr;

};

// function to select color

function pickColor() {
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
};

// function to change color

function changeColors(color) {
	
	// loop through all squares and apply color based on argument

	for (i = 0; i < squares.length; i++) {
		squares[i].style.backgroundColor = color;
	};

};