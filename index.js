// DOM SELECTORS
const titleText = document.querySelector(`h1`);
const subText = document.querySelector(`h2`);
const restart = document.querySelector(`#restart`);
const hint = document.querySelector(`#hint`);
const guessOne = document.querySelector(`#guess-one`);
const guessTwo = document.querySelector(`#guess-two`);
const guessThree = document.querySelector(`#guess-three`);
const guessFour = document.querySelector(`#guess-four`);
const guessFive = document.querySelector(`#guess-five`);
const submitButton = document.querySelector(`#submit-button`);
const submittedGuess = document.querySelector(`#guess`);

// HELPER FUNCTIONS
const generateWinningNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.ceil(max);

    return Math.floor(Math.random() * (max - min) + min);
}

const shuffle = (arr) => {
    let m = arr.length;
    let t;
    let i;

    while (m) {
        i = Math.floor(Math.random() * m--);

        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }

    return arr;
}

const newGame = () => {
    return {
        playersGuess: null,
        pastGuesses: [],
        winningNumber: generateWinningNumber(1, 101)
    }
}

const difference = (object) => {
    return Math.abs(object.playersGuess - object.winningNumber);
}

const isLower = (object) => {
    if (object.playersGuess < object.winningNumber) {
        return true;
    } else {
        return false;
    }
}

const playerGuessSubmission = (num, object) => {
    if (num >= 1 && num <= 100 && typeof num === `number`) {
        object.playersGuess = num;
        return checkGuess(object);
    } else {
        subText.innerText = `This is an invalid guess`;
        throw `This is an invalid guess.`;
    }
}

const checkGuess = (object) => {
    const guess = object.playersGuess;
    const winningNum = object.winningNumber;
    const pastGuesses = object.pastGuesses;

    if (guess === winningNum) {
        submitButton.disabled = true;
        hint.disabled = true;
        subText.innerText = `Restart game to play again`;
        return titleText.innerText = `You Win!`;
    }

    else if (pastGuesses.indexOf(guess) !== -1 && pastGuesses.length < 5) {
        return subText.innerText = `You have already guessed that number`;
    }

    else if (guess !== winningNum && pastGuesses.indexOf(guess) === -1) {
        object.pastGuesses.push(guess);

        if (pastGuesses.length >= 5) {
            submitButton.disabled = true;
            hint.disabled = true;
            guessFive.innerText = pastGuesses[4];
            subText.innerText = `Restart game to try again`;
            return titleText.innerText = `You lose`;
        }

        else if (pastGuesses.length < 5) {
            if (pastGuesses.length === 1) {
                guessOne.innerText = pastGuesses[0];
            } else if (pastGuesses.length === 2) {
                guessTwo.innerText = pastGuesses[1];
            } else if (pastGuesses.length === 3) {
                guessThree.innerText = pastGuesses[2];
            } else if (pastGuesses.length === 4) {
                guessFour.innerText = pastGuesses[3];
            }

            const diff = difference(object);

            if (isLower(object)) {
                titleText.innerText = `Go higher!`;
            } else {
                titleText.innerText = `Go lower!`;
            }

            if (diff < 10) {
                return subText.innerText = `You are burning up!`;
            } else if (diff < 25) {
                return subText.innerText = `You are lukewarm...`;
            } else if (diff < 50) {
                return subText.innerText = `You are a bit chilly...`;
            } else if (diff < 100) {
                return subText.innerText = `You are ice cold...`;
            }
        }
    }
}

const provideHint = (object) => {
    let result = [];

    while (result.length < 2) {
        result.push(generateWinningNumber(1, 101));
    }

    result.push(object.winningNumber);

    return shuffle(result);
}

const restartGame = () => {
    titleText.innerText = `Number Guesser`;
    subText.innerText = `Guess a number between 1-100`;
    guessOne.innerText = `-`;
    guessTwo.innerText = `-`;
    guessThree.innerText = `-`;
    guessFour.innerText = `-`;
    guessFive.innerText = `-`;
    return newGame();
}

// STATE
let game = newGame();

// EVENT LISTENERS
submitButton.addEventListener(`click`, () => {
    const guess = parseInt(submittedGuess.value);
    submittedGuess.value = ``;
    playerGuessSubmission(guess, game);
})

hint.addEventListener(`click`, () => {
    const pastGuesses = game.pastGuesses;
    if (pastGuesses.length < 4) {
        subText.innerText = `You must make four guess before receiving a hint`;
    } else {
        hintArr = provideHint(game);
        subText.innerText = `The winning number is either ` + hintArr[0] + `, ` + hintArr[1] + `, or ` + hintArr[2] + `...`;
    }
})

restart.addEventListener(`click`, () => {
    submitButton.disabled = false;
    hint.disabled = false;
    game = restartGame();
})