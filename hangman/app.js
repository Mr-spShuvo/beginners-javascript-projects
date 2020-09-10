const puzzleElem = document.querySelector(".game__puzzle");
const guessElem = document.querySelector(".game__remainingGuess span");
const gameButton = document.querySelector(".game-overlay__action");
const gameOverlay = document.querySelector(".game-overlay");
const keyword = document.querySelector(".keyboard");
const title = document.querySelector(".game-overlay__title");
const info = document.querySelector(".game-overlay__info");
const action = document.querySelector(".game-overlay__action");

// Generating Keyboard Layout
const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

letters.forEach((letter, index) => {
  const element = `<button class="keyboard__letter" onclick="gamePlay(this.dataset.key)" data-key=${letter}>${letter}</button>`;
  keyword.insertAdjacentHTML("beforeend", element);
  if (index == 9 || index == 18) {
    keyword.insertAdjacentHTML("beforeend", "<br>");
  }
});

// Getting Random Words from API
let word;
const getRandomWord = async () => {
  const res = await fetch("https://random-word-api.herokuapp.com/word");
  const randomWord = await res.json();
  word = randomWord[0];
};
getRandomWord();

// Create Game Instances
let game;
const startGame = () => {
  console.log(word);
  game = new Hangman(word, 3);
  puzzleElem.textContent = game.getPuzzle();
  guessElem.textContent = game.remainingGuess;
};

// Game Play Results
const gameResults = (status) => {
  if (status == "finished" || status === "failed") {
    setTimeout(() => {
      gameOverlay.style.display = "flex";
    }, 300);
  }
  if (status == "finished") {
    title.textContent = "Congratulation!";
    info.textContent = "I bet you want to play again.";
    action.textContent = "Play again!";
  }
  if (status == "failed") {
    title.textContent = "Alas! You've Failed.";
    info.textContent = `The word was ${word}`;
    action.textContent = "Try again!";
    gameOverlay.classList.add("failed");
  }
};

// Game Play Functionality
const gamePlay = (guessKey) => {
  game.makeGuess(guessKey);
  disabledKey(guessKey);
  puzzleElem.textContent = game.getPuzzle();
  guessElem.textContent = game.remainingGuess;
  gameResults(game.status);
};

// Taking Guess Input
window.addEventListener("keypress", (e) => {
  const guessKey = String.fromCharCode(e.charCode);
  gamePlay(guessKey);
});

// Disabling Guessed Key
const disabledKey = (guessKey) => {
  const elem = document.querySelector(`[data-key=${guessKey}]`);
  elem.classList.add("keyboard__letter--disabled");
};

gameButton.addEventListener("click", () => {
  gameOverlay.style.display = "none";
  gameOverlay.classList.remove("failed");
  getRandomWord();
  resetKeyBoardState();
  startGame();
});

const resetKeyBoardState = () => {
  const keys = document.querySelectorAll(".keyboard__letter--disabled");
  keys.forEach((key) => key.classList.remove("keyboard__letter--disabled"));
};
