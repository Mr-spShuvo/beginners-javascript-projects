class Hangman {
  constructor(word, remainingGuess) {
    this.word = word.toLowerCase().split('');
    this.remainingGuess = remainingGuess;
    this.guessedLetters = [];
    this.status = '';
  }

  gameStatus() {
    const isWin = this.word.every(letter => this.guessedLetters.includes(letter) || letter == ' ');
    if (!this.remainingGuess) this.status = 'failed';
    else if (isWin) this.status = 'finished';
    else this.status = 'playing';
  }

  getPuzzle() {
    let puzzle = '';
    this.word.forEach(letter => {
      if (this.guessedLetters.includes(letter) || letter == ' ') puzzle += letter;
      else puzzle += '_';
    });
    return puzzle;
  }

  makeGuess(guess) {
    if (this.status === 'finished') return;
    guess = guess.toLowerCase();
    const isUnique = this.guessedLetters.includes(guess);
    const isCorrect = this.word.includes(guess);
    if (!isUnique) this.guessedLetters.push(guess);
    if (!isUnique && !isCorrect) this.remainingGuess--;
    this.gameStatus();
  }
}
