// script.js

document.addEventListener('DOMContentLoaded', () => {
    generateLetterButtons();

    document.getElementById('add-phrase').addEventListener('click', () => {
        const newPhrase = document.getElementById('phrase-input').value;
        updatePhraseDisplay(newPhrase);
        document.getElementById('phrase-input').value = ''; // Clear input after adding
    });

    document.getElementById('clear-phrase').addEventListener('click', () => {
        updatePhraseDisplay('');
    });
});

function generateLetterButtons() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const buttonContainer = document.getElementById('letter-buttons');

    letters.split('').forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.addEventListener('click', () => handleLetterClick(letter));
        buttonContainer.appendChild(button);
    });
}

function handleLetterClick(letter) {
    const currentPhraseElement = document.getElementById('current-phrase');
    currentPhraseElement.textContent += letter; // Append letter to the phrase display
}

function updatePhraseDisplay(phrase) {
    const phraseDisplayElement = document.getElementById('current-phrase');
    phraseDisplayElement.textContent = `Selected Phrase: ${phrase}`;
}
