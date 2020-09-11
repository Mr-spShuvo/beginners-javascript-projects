const puzzleElem = document.querySelector('.game__puzzle');
const guessElem = document.querySelector('.game__remainingGuess span');
const gameButton = document.querySelector('.game-overlay__action');
const gameOverlay = document.querySelector('.game-overlay');
const keyword = document.querySelector('.keyboard');
const title = document.querySelector('.game-overlay__title');
const info = document.querySelector('.game-overlay__info');
const action = document.querySelector('.game-overlay__action');

// Generating Keyboard Layout
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

letters.forEach((letter, index) => {
  const element = `<button class="keyboard__letter" onclick="gamePlay(this.dataset.key)" data-key=${letter}>${letter}</button>`;
  keyword.insertAdjacentHTML('beforeend', element);
  if (index == 9 || index == 18) {
    keyword.insertAdjacentHTML('beforeend', '<br>');
  }
});

// Getting Random Words from API

const getRandomWord = async callback => {
  const res = await fetch('https://random-word-api.herokuapp.com/word');
  const randomWord = await res.json();
  callback(randomWord[0]);
};

// Create Game Instances
let game;
let randomWord;
const startGame = () => {
  getRandomWord(word => {
    randomWord = word;
    console.log(word);
    game = new Hangman(word, 3);
    puzzleElem.textContent = game.getPuzzle();
    guessElem.textContent = game.remainingGuess;
  });
};
startGame();

// Start Game Button
gameButton.addEventListener('click', () => {
  gameOverlay.style.display = 'none';
  gameOverlay.classList.remove('failed');
  resetKeyBoardState();
  game.status = 'playing';
});

// Game Play Results
const gameResults = status => {
  if (status == 'finished' || status === 'failed') {
    setTimeout(() => {
      gameOverlay.style.display = 'flex';
    }, 300);
  }
  if (status == 'finished') {
    title.textContent = 'Congratulation!';
    info.textContent = 'I bet you want to play again.';
    action.textContent = 'Play again!';
    startGame();
  }
  if (status == 'failed') {
    title.textContent = "Alas! You've Failed.";
    info.textContent = `The word was ${randomWord}`;
    action.textContent = 'Try again!';
    gameOverlay.classList.add('failed');
    startGame();
  }
};

// Game Play Functionality
const gamePlay = guessKey => {
  game.makeGuess(guessKey);
  disabledKey(guessKey);
  puzzleElem.textContent = game.getPuzzle();
  guessElem.textContent = game.remainingGuess;
  gameResults(game.status);
};

// Taking Guess Input
window.addEventListener('keypress', e => {
  if (game.status === 'playing') {
    const guessKey = String.fromCharCode(e.charCode);
    gamePlay(guessKey);
  }
});

// Disabling Guessed Key
const disabledKey = guessKey => {
  const elem = document.querySelector(`[data-key=${guessKey}]`);
  elem.classList.add('keyboard__letter--disabled');
};

// Reset disabled Keys
const resetKeyBoardState = () => {
  const keys = document.querySelectorAll('.keyboard__letter--disabled');
  keys.forEach(key => key.classList.remove('keyboard__letter--disabled'));
};
