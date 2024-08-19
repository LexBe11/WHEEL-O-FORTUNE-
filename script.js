// script.js

const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const guessButton = document.getElementById('guessButton');
const letterGuessInput = document.getElementById('letterGuess');
const commentaryText = document.getElementById('commentaryText');
const timeLeftDisplay = document.getElementById('timeLeft');
const puzzleElement = document.getElementById('puzzle');
const genreElement = document.getElementById('genre');

const wheelValues = [
    100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 
    1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, "Bankrupt", "10,000", "1,000,000", 
    "Bankrupt", "1,000,000", "Bankrupt"
];

const puzzles = [
    { genre: "Phrase", puzzle: "A BLESSING IN DISGUISE" },
    { genre: "Sentence", puzzle: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG" },
    { genre: "Person", puzzle: "ALBERT EINSTEIN" },
    { genre: "Building", puzzle: "EMPIRE STATE BUILDING" },
    { genre: "Gambling", puzzle: "WHAT HAPPENS IN VEGAS STAYS IN VEGAS" },
    { genre: "Game", puzzle: "WHEEL OF FORTUNE" },
    { genre: "Movie", puzzle: "THE GODFATHER" },
    { genre: "Book", puzzle: "TO KILL A MOCKINGBIRD" },
    { genre: "TV Show", puzzle: "GAME OF THRONES" },
    { genre: "Country", puzzle: "AUSTRALIA" },
    { genre: "Animal", puzzle: "ELEPHANT" },
    { genre: "City", puzzle: "NEW YORK CITY" },
    { genre: "Color", puzzle: "ROYAL BLUE" },
    { genre: "Sport", puzzle: "BASKETBALL" },
    { genre: "Song", puzzle: "BOHEMIAN RHAPSODY" }
];

let currentPuzzle = "";
let currentGenre = "";
let puzzleDisplay = "";
let prizeMoney = 0;
let timer;
let timeLeft = 10;
let wheelAngle = 0;

function drawWheel() {
    const radius = wheelCanvas.width / 2;
    const arcSize = (2 * Math.PI) / wheelValues.length;

    wheelValues.forEach((value, index) => {
        const angle = index * arcSize;
        ctx.beginPath();
        ctx.arc(radius, radius, radius, angle, angle + arcSize);
        ctx.lineTo(radius, radius);
        ctx.fillStyle = index % 2 === 0 ? '#ffcc00' : '#ff6600';
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.font = "bold 14px Arial";
        ctx.fillText(value, radius * 0.65, 5);
        ctx.restore();
    });
}

function spinWheel() {
    spinButton.disabled = true;
    letterGuessInput.disabled = true;
    guessButton.disabled = true;
    commentaryText.textContent = "Spinning...";
    wheelAngle = 0;

    const randomSpin = Math.random() * 360 + 360 * 3; // Spin at least 3 full rotations
    const finalAngle = (randomSpin % 360) * (Math.PI / 180);

    const totalTime = 3000; // Spin duration in ms
    let startTime = null;

    function animateSpin(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        wheelAngle = (elapsed / totalTime) * 360;
        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
        drawWheel();
        ctx.save();
        ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
        ctx.rotate(wheelAngle * (Math.PI / 180));
        ctx.restore();
        if (elapsed < totalTime) {
            requestAnimationFrame(animateSpin);
        } else {
            endSpin(finalAngle);
        }
    }

    requestAnimationFrame(animateSpin);
}

function endSpin(finalAngle) {
    wheelAngle = finalAngle;
    const sectionAngle = 360 / wheelValues.length;
    const index = Math.floor((finalAngle % 360) / sectionAngle);
    const result = wheelValues[index];
    commentaryText.textContent = `You landed on: ${result}`;
    if (result === "Bankrupt") {
        commentaryText.textContent = "You landed on Bankrupt! All your prize money is lost.";
        prizeMoney = 0;
        resetGame();
    } else {
        revealLetters(result);
    }
}

function revealLetters(result) {
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    currentPuzzle = puzzle.puzzle;
    currentGenre = puzzle.genre;

    genreElement.textContent = `Genre: ${currentGenre}`;

    // Show half of the puzzle word
    const halfLength = Math.floor(currentPuzzle.length / 2);
    puzzleDisplay = currentPuzzle.slice(0, halfLength).replace(/[A-Z]/g, '_') + currentPuzzle.slice(halfLength);
    puzzleElement.textContent = puzzleDisplay;

    letterGuessInput.disabled = false;
    guessButton.disabled = false;
    keyboardContainer.style.display = "block";

    timer = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            commentaryText.textContent = "Time's up! Spin the wheel again.";
            resetGame();
        }
    }, 1000);
}

function guessLetter() {
    const guess = letterGuessInput.value.toUpperCase();
    letterGuessInput.value = '';
    letterGuessInput.disabled = true;
    guessButton.disabled = true;
    
    if (guess.length === 1 && /[A-Z]/.test(guess)) {
        let updatedPuzzleDisplay = '';
        let correctGuess = false;
        for (let i = 0; i < currentPuzzle.length; i++) {
            if (currentPuzzle[i] === guess) {
                updatedPuzzleDisplay += guess;
                correctGuess = true;
            } else {
                updatedPuzzleDisplay += puzzleDisplay[i];
            }
        }
        puzzleDisplay = updatedPuzzleDisplay;
        puzzleElement.textContent = puzzleDisplay;
        if (correctGuess) {
            prizeMoney += wheelValues[0]; // Update prize money (this needs to be based on the wheel value)
            commentaryText.textContent = `Correct guess! Prize money: $${prizeMoney}`;
        } else {
            commentaryText.textContent = "Incorrect guess. Try again!";
        }
    } else {
        commentaryText.textContent = "Invalid input. Please enter a single letter.";
    }

    // Enable guess again
    letterGuessInput.disabled = false;
    guessButton.disabled = false;
}

function guessWord() {
    const guess = letterGuessInput.value.toUpperCase();
    letterGuessInput.value = '';
    letterGuessInput.disabled = true;
    guessButton.disabled = true;
    
    if (guess.length > 0) {
        if (guess === currentPuzzle) {
            prizeMoney += wheelValues[0]; // Update prize money (this needs to be based on the wheel value)
            commentaryText.textContent = `Correct! You guessed the puzzle. Prize money: $${prizeMoney}`;
            resetGame();
        } else {
            commentaryText.textContent = "Incorrect guess. Try again!";
        }
    } else {
        commentaryText.textContent = "Invalid input. Please enter a valid word.";
    }

    // Enable guess again
    letterGuessInput.disabled = false;
    guessButton.disabled = false;
}

function resetGame() {
    spinButton.disabled = false;
    letterGuessInput.disabled = true;
    guessButton.disabled = true;
    letterGuessInput.value = '';
    timeLeft = 10;
    timeLeftDisplay.textContent = timeLeft;
    clearInterval(timer);
}

document.getElementById('spinButton').addEventListener('click', spinWheel);
document.getElementById('guessButton').addEventListener('click', () => {
    if (letterGuessInput.value.length === 1) {
        guessLetter();
    } else {
        guessWord();
    }
});
