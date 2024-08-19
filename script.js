// script.js

const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const guessButton = document.getElementById('guessButton');
const letterGuessInput = document.getElementById('letterGuess');
const commentaryText = document.getElementById('commentaryText');
const timeLeftDisplay = document.getElementById('timeLeft');

const wheelValues = [
    100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 
    1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, "Bankrupt", "10,000", "1,000,000", 
    "Bankrupt", "1,000,000", "Bankrupt"
];

let currentPuzzle = "HELLO WORLD";
let guessedLetters = [];
let puzzleDisplay = "_ _ _ _ _   _ _ _ _ _";
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
            const segmentIndex = Math.floor((currentAngle / (2 * Math.PI)) * wheelValues.length) % wheelValues.length;
            const segmentValue = wheelValues[segmentIndex];
            commentaryText.textContent = `You landed on ${segmentValue}`;
            if (segmentValue === "Bankrupt") {
                commentaryText.textContent = "Bankrupt! You lose all your points!";
                spinButton.disabled = false;
            } else {
                letterGuessInput.disabled = false;
                guessButton.disabled = false;
                timeLeft = 10;
                startTimer();
            }
        }
    }

    requestAnimationFrame(animateSpin);
}

function startTimer() {
    timeLeftDisplay.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            commentaryText.textContent = "Time's up!";
            letterGuessInput.disabled = true;
            guessButton.disabled = true;
            spinButton.disabled = false;
        }
    }, 1000);
}

function guessLetter() {
    const guess = letterGuessInput.value.toUpperCase();
    if (guessedLetters.includes(guess)) {
        commentaryText.textContent = `You've already guessed "${guess}". Try another letter.`;
    } else {
        guessedLetters.push(guess);
        if (currentPuzzle.includes(guess)) {
            commentaryText.textContent = `"${guess}" is in the word!`;
            updatePuzzleDisplay();
        } else {
            commentaryText.textContent = `"${guess}" is not in the word.`;
        }
    }
    letterGuessInput.value = '';
}

function updatePuzzleDisplay() {
    puzzleDisplay = currentPuzzle.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    document.getElementById('puzzle').textContent = puzzleDisplay;
    if (!puzzleDisplay.includes('_')) {
        commentaryText.textContent = "Congratulations! You've solved the puzzle!";
        letterGuessInput.disabled = true;
        guessButton.disabled = true;
        clearInterval(timer);
    }
}

spinButton.addEventListener('click', spinWheel);
guessButton.addEventListener('click', guessLetter);

drawWheel();
