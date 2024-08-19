// script.js
document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.getElementById('wheelImage');
    const spinButton = document.getElementById('spinButton');
    const displayWord = document.getElementById('displayWord');
    const alphabetContainer = document.getElementById('alphabet');
    const word = 'Taylor Swift';
    let revealedWord = '_ '.repeat(word.length).trim();
    
    function updateDisplay(word, guess) {
        let updatedWord = '';
        for (let i = 0; i < word.length; i++) {
            if (word[i] === guess) {
                updatedWord += guess + ' ';
            } else {
                updatedWord += revealedWord[i * 2] + ' ';
            }
        }
        revealedWord = updatedWord.trim();
        displayWord.textContent = revealedWord;
    }

    function spinWheel() {
        const spinDuration = 3000; // 3 seconds
        wheel.style.transition = `transform ${spinDuration}ms ease-out`;
        wheel.style.transform = `rotate(${360 * 5}deg)`; // 5 full spins

        setTimeout(() => {
            wheel.style.transition = 'none';
            wheel.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`; // Random stop position
        }, spinDuration);
    }

    function createAlphabetButtons() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        alphabet.split('').forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.addEventListener('click', () => {
                updateDisplay(word, letter);
                button.disabled = true;
            });
            alphabetContainer.appendChild(button);
        });
    }

    spinButton.addEventListener('click', () => {
        spinWheel();
        setTimeout(() => {
            // Allow guessing after spin animation
            const buttons = alphabetContainer.querySelectorAll('button');
            buttons.forEach(button => button.disabled = false);
        }, 3000); // Allow guessing after 3 seconds
    });

    createAlphabetButtons();
});
