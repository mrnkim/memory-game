"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
let COLORS = [];
function createRandColors() {
  COLORS = [];
  // let numCards = Math.floor(Math.random() * 10) + 4;

  for (let i = 0; i < 6; i++) {
    let randomR = Math.floor(Math.random() * 256);
    let randomG = Math.floor(Math.random() * 256);
    let randomB = Math.floor(Math.random() * 256);

    let randColor = `rgb(${randomR}, ${randomG}, ${randomB})`;
    COLORS.push(randColor);
    COLORS.push(randColor);
  }
  return COLORS;
}

/** Create card for every color in colors (each will appear twice)
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */
function createCards() {
  let colors = shuffle(COLORS);
  const gameBoard = document.getElementById("game");
  for (let i = 0; i < colors.length; i++) {
    // missing code here ...
    const newDiv = document.createElement("div");
    newDiv.setAttribute("data-color", `${colors[i]}`);
    newDiv.classList.add("back-face");
    gameBoard.append(newDiv);
    newDiv.addEventListener("click", flipCard);
  }
}

/** Shuffle array items in-place and return shuffled array. */
function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

let hasFlippedCard = false;
let lockBoard = false;
let result = document.querySelector("#result");
result.classList.add("hidden");
let move = 0;
let score = 0;
let firstCard;
let secondCard;

/** Flip a card face-up. */
function flipCard(evt) {
  // ... you need to write this ...
  if (lockBoard) return;
  if (evt.target === firstCard) return;

  evt.target.classList.add("flipped");
  evt.target.classList.add("front-face");
  evt.target.classList.remove("back-face");
  evt.target.style.backgroundColor = evt.target.dataset.color;

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = evt.target;
  } else {
    move++;
    let moveBoard = document.querySelector("#moves");
    moveBoard.innerHTML = ` ${move}`;

    secondCard = evt.target;
    checkForMatch();
  }
}

function checkForMatch() {
  if (firstCard.dataset.color === secondCard.dataset.color) {
    lockBoard = true;

    score++;
    let scoreBoard = document.querySelector("#score");
    scoreBoard.innerHTML = `${Math.floor((score / 6) * 100)}%`;

    if (score === 6) {
      let lowestMoves = localStorage.getItem("lowestMoves");
      if (lowestMoves === 0 || lowestMoves === null || move < lowestMoves) {
        result.classList.remove("hidden");
        result.innerHTML =
          "<p> Congratulations! <br> You've just set the record! </p>";
        localStorage.setItem("lowestMoves", move);
        lowestMoves = move;
        const lowestMoveScoreBoard =
          document.getElementById("lowest-move-score");
        lowestMoveScoreBoard.innerHTML = `${lowestMoves}`;
      } else {
        result.classList.remove("hidden");
        result.innerHTML =
          "<p> Congratulations! <br> You've found all matches. </p>";
      }
    } else {
      setTimeout(function () {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        reset();
      }, FOUND_MATCH_WAIT_MSECS);
    }
  } else {
    unFlipCard();
  }
}

/** Flip a card face-down. */
function unFlipCard() {
  lockBoard = true;
  setTimeout(function () {
    firstCard.classList.remove("flipped");
    firstCard.classList.remove("front-face");
    firstCard.classList.add("back-face");
    firstCard.style.backgroundColor = "white";
    secondCard.classList.remove("flipped");
    secondCard.classList.remove("front-face");
    secondCard.classList.add("back-face");
    secondCard.style.backgroundColor = "white";
    reset();
  }, FOUND_MATCH_WAIT_MSECS);
}

function reset() {
  lockBoard = false;
  hasFlippedCard = false;
  firstCard = null;
  secondCard = null;
}

//Adding start button
let start = document.querySelector("#start");
start.addEventListener("click", startGame);

function startGame() {
  result.classList.add("hidden");

  createRandColors();
  createCards();
  start.classList.add("hidden");
  reStart.classList.remove("hidden");
  let lowestMoves = localStorage.getItem("lowestMoves");
  const lowestMoveScoreBoard = document.getElementById("lowest-move-score");
  if (lowestMoves !== null) {
    lowestMoveScoreBoard.innerHTML = `${lowestMoves}`;
  }
}

//Adding restart button
let reStart = document.querySelector("#reStart");
reStart.addEventListener("click", reStartGame);

function reStartGame() {
  reset();
  move = 0;
  score = 0;
  result.classList.add("hidden");

  let moveBoard = document.querySelector("#moves");
  moveBoard.innerHTML = `${move}`;

  let scoreBoard = document.querySelector("#score");
  scoreBoard.innerHTML = `${score}`;

  let existingCards = document.querySelectorAll("#game div");
  for (let card of existingCards) {
    card.remove();
  }

  startGame();
}
