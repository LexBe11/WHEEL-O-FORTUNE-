// script.js

const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const guessButton = document.getElementById('guessButton');
const letterGuessInput = document.getElementById('letterGuess');
const puzzleElement = document.getElementById('puzzle');
const genreElement = document.getElementById('genre');
const commentaryText = document.getElementById('commentaryText');
const timeLeftDisplay = document.getElementById('timeLeft');
const wheelValues = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 'BANKRUPT', 'BANKRUPT', 10000, 1000000];
let currentPuzzle = '';
let puzzleDisplay = '';
let prizeMoney = 0;
let timer;
let timeLeft = 10;
let genre = '';
const puzzles = [
    { puzzle: 'HELLO WORLD', genre: 'Phrase' },
    { puzzle: 'NEW YORK CITY', genre: 'Place' },
    { puzzle: 'PIANO LESSON', genre: 'Event' },
    { puzzle: 'MARTIN LUTHER KING', genre: 'Person' },
    { puzzle: 'Eiffel Tower', genre: 'Building' },
    { puzzle: 'CHESS GAME', genre: 'Game' }
];

function drawWheel() {
    const wheelRadius = wheelCanvas.width / 2;
    const angleStep = (2 * Math.PI) / wheelValues.length;

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    for (let i = 0; i < wheelValues.length; i++) {
        const startAngle = i * angleStep;
        const endAngle = (i + 1) * angleStep;

        ctx.beginPath();
        ctx.arc(wheelRadius, wheelRadius, wheelRadius, startAngle, endAngle);
        ctx.lineTo(wheelRadius, wheelRadius);
        ctx.fillStyle = i % 2 === 0 ? '#ff9999' : '#66b3ff';
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(wheelRadius, wheelRadius);
        ctx.rotate(startAngle + angleStep / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(wheelValues[i], wheelRadius - 10, 10);
        ctx.restore();
    }
}

function spinWheel() {
    spinButton.disabled = true;
    const spinAngle = Math.random() * 2 * Math.PI;
    const spinDuration = 3000;
    const startTime = Date.now();

    const spin = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / spinDuration, 1);
        const angle = spinAngle * progress;

        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
        ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
        ctx.rotate(angle);
        ctx.translate(-wheelCanvas.width / 2, -wheelCanvas.height / 2);
        drawWheel();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (progress < 1) {
            requestAnimationFrame(spin);
        } else {
            endSpin();
        }
    };

    spin();
}

function endSpin() {
    const wheelRadius = wheelCanvas.width / 2;
    const angleStep = (2 * Math.PI) / wheelValues.length;
    const spinAngle = Math.random() * 2 * Math.PI;
    const segmentIndex = Math.floor((spinAngle + Math.PI / 2) / angleStep) % wheelValues.length;
    const result = wheelValues[segmentIndex];

    commentaryText.textContent = `You landed on: ${result}`;
    if (result === 'BANKRUPT') {
        prizeMoney = 0;
        commentaryText.textContent += " You've hit BANKRUPT!";
    } else {
        prizeMoney = result;
        commentaryText.textContent += ` Your prize money is now $${prizeMoney}.`;
        choosePuzzle();
    }
    startTimer();
}

function choosePuzzle() {
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    const puzzle = puzzles[randomIndex];
    currentPuzzle = puzzle.puzzle.toUpperCase();
    genre = puzzle.genre;
    puzzleDisplay = currentPuzzle.replace(/./g, '_');
    puzzleElement.textContent = puzzleDisplay;
    genreElement.textContent = genre;
    letterGuessInput.disabled = false;
    guessButton.disabled = false;
    commentaryText.textContent = "Guess a letter or word!";
}

function startTimer() {
    timeLeft = 10;
    timeLeftDisplay.textContent = timeLeft;

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

    if (guess === currentPuzzle) {
        puzzleDisplay = currentPuzzle;
        puzzleElement.textContent = puzzleDisplay;
        commentaryText.textContent = `Congratulations! You've guessed the puzzle. Your prize is $${prizeMoney}.`;
        resetGame();
    } else {
        commentaryText.textContent = "Incorrect guess. Try again!";
    }

    // Enable guess again
    letterGuessInput.disabled = false;
    guessButton.disabled = false;
}

function resetGame() {
    spinButton.disabled = false;
    letterGuessInput.disabled = true;
    guessButton.disabled = true;
}

spinButton.addEventListener('click', spinWheel);
guessButton.addEventListener('click', () => {
    if (letterGuessInput.value.length === 1) {
        guessLetter();
    } else {
        guessWord();
    }
});
