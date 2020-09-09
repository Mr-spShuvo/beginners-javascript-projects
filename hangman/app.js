const Hangman = function (word, remainingGuess) {
  this.word = word.toLowerCase().split('');
  this.remainingGuess = remainingGuess;
  this.guessedLetters = [];
  this.status = 'playing';
};

Hangman.prototype.gameStatus = function () {
  const isWin = this.guessedLetters.every(letter => this.word.includes(letter));
  if (!this.remainingGuess) this.status = 'failed';
  else if (isWin) this.status = 'finished';
  else this.status = 'playing';
};

Hangman.prototype.getPuzzle = function () {
  let puzzle = '';

  this.word.forEach(letter => {
    if (this.guessedLetters.includes(letter) || letter == ' ') puzzle += letter;
    else puzzle += '_';
  });

  return puzzle;
};

Hangman.prototype.makeGuess = function (guess) {
  guess = guess.toLowerCase();
  const isUnique = this.guessedLetters.includes(guess);
  const isCorrect = this.word.includes(guess);

  if (!isUnique) this.guessedLetters.push(guess);
  if (!isUnique && !isCorrect) this.remainingGuess--;

  this.gameStatus();
};

// Game Play

const puzzleElem = document.querySelector('.game__puzzle');
const guessElem = document.querySelector('.game__remainingGuess span');
const typedElem = document.querySelector('.type-anim__letter');

let game;
const startGame = async () => {
  // const res = await fetch('https://random-word-api.herokuapp.com/word');
  // const word = await res.json();
  //console.log(word[0]);
  game = new Hangman('jjj', 3);
  puzzleElem.textContent = game.getPuzzle();
  guessElem.textContent = game.remainingGuess;
};

startGame();

window.addEventListener('keypress', e => {
  const guessKey = String.fromCharCode(e.charCode);
  game.makeGuess(guessKey);
  puzzleElem.textContent = game.getPuzzle();
  guessElem.textContent = game.remainingGuess;
  typedElem.textContent = guessKey;
  console.log(game.status);
  if (game.status === 'failed') guessElem.textContent = 'No Guess Left!';
});
