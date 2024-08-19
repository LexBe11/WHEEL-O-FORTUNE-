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
const keyboardContainer = document.querySelector('.keyboard-container');
const keyboard = document.getElementById('keyboard');

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
let timer;
let timeLeft = 10;

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

    const randomSpin = Math.random() * 360 + 360 * 3; // Spin at least 3 full rotations
    const finalAngle = (randomSpin % 360) * (Math.PI / 180);

    const totalTime = 3000; // Spin duration in ms
    let startTime = null;

    function animateSpin(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsedTime = currentTime - startTime;

        const easeOut = Math.pow((elapsedTime / totalTime), 0.5);
        const currentAngle = easeOut * finalAngle;

        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
        ctx.save();
        ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
        ctx.rotate(currentAngle);
        ctx.translate(-wheelCanvas.width / 2, -wheelCanvas.height / 2);
        drawWheel();
        ctx.restore();

        if (elapsedTime < totalTime) {
            requestAnimationFrame(animateSpin);
        } else {
            const landedIndex = Math.floor((randomSpin % 360) / (360 / wheelValues.length));
            const result = wheelValues[landedIndex];
            commentaryText.textContent = `Landed on ${result}.`;
            if (result === "Bankrupt") {
                commentaryText.textContent = "Bankrupt! You lose your turn.";
                setTimeout(() => resetGame(), 2000);
            } else {
                revealLetters(result);
            }
        }
    }

    requestAnimationFrame(animateSpin);
}

function revealLetters(result) {
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    currentPuzzle = puzzle.puzzle;
    currentGenre = puzzle.genre;

    genreElement.textContent = `Genre: ${currentGenre}`;
    puzzleDisplay = "_".repeat(currentPuzzle.length);
    puzzleElement.textContent = puzzleDisplay;

    keyboardContainer.style.display = "block";
    letterGuessInput.disabled = false;
    guessButton.disabled = false;

    // Initialize timer
    timeLeft = 10;
    timeLeftDisplay.textContent = timeLeft;
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timer);
        commentaryText.textContent = "Time's up! Try spinning the wheel again.";
        resetGame();
    }
}

function resetGame() {
    spinButton.disabled = false;
    keyboardContainer.style.display = "none";
    letterGuessInput.value = "";
    letterGuessInput.disabled = true;
    guessButton.disabled = true;
    commentaryText.textContent = "Spin the wheel to start!";
}

function checkGuess(letter) {
    let newPuzzleDisplay = "";
    let found = false;
    for (let i = 0; i < currentPuzzle.length; i++) {
        if (currentPuzzle[i].toUpperCase() === letter.toUpperCase()) {
            newPuzzleDisplay += letter.toUpperCase();
            found = true;
        } else {
            newPuzzleDisplay += puzzleDisplay[i];
        }
    }
    puzzleDisplay = newPuzzleDisplay;
    puzzleElement.textContent = puzzleDisplay;

    if (!found) {
        commentaryText.textContent = "Incorrect guess.";
    } else if (!puzzleDisplay.includes('_')) {
        commentaryText.textContent = "Congratulations! You've solved the puzzle!";
        resetGame();
    }
}

function handleKeyboardClick(event) {
    const letter = event.target.textContent;
    if (letter) {
        checkGuess(letter);
    }
}

spinButton.addEventListener('click', spinWheel);
guessButton.addEventListener('click', () => checkGuess(letterGuessInput.value));
keyboard.addEventListener('click', handleKeyboardClick);

