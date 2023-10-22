import {
  moveDown,
  moveLeft,
  moveRight,
  rotatePieceClockwise,
  checkColision,
} from "./inputHandler.js";
import {
  piece,
  resetGrid,
  clearPiece,
  clearAllPieces,
  createFirstPiece,
  createNextPiece,
} from "./renderer.js";

const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("high-score");
const levelEl = document.getElementById("level");
const startButton = document.getElementById("start-button");
const messageContainer = document.getElementById("message-container");
const retryButton = document.getElementById("retry-button");
const backgroundMusic = document.getElementById("background-music");
const gameOverMusic = document.getElementById("game-over-music");

const initialGameSpeed = 500;

let scoreValue = 0;
let level = 1;
let completedRows = 0;
let gameSpeed = initialGameSpeed;
let gameInterval;
let isGameOver = false;

// TODO Create Unit Tests
// TODO increase game music with speed
// TODO make the start button a pause button during in-game
// TODO make a button to quit game in Game Over screen
// TODO put a sound when pieces land
// TODO show a pop-up with the score of the current full lines

function calculateScore(fullLines) {
  /* 
  Score Grid:
  Single Line Clear: 100 points
  Double Line Clear: 300 points
  Triple Line Clear: 500 points
  Tetris Line Clear: 800 points
  Level Bonus: 100 points per level
  TODO: implement Soft and Hard Drop
  Soft Drop Score: 1 point per cell moved downward
  Hard Drop Score: 2 points per cell dropped
  */
  switch (fullLines.length) {
    case 1:
      scoreValue += 100 + 100 * level;
      break;
    case 2:
      scoreValue += 300 + 100 * level;
      break;
    case 3:
      scoreValue += 500 + 100 * level;
      break;
    case 4:
      scoreValue += 800 + 100 * level;
      break;
    default:
      break;
  }
}

function updateCompletedRows(fullLines) {
  completedRows += fullLines;
}

function updateLevel() {
  // Level increases by 1 when 10 full lines are completed
  if (completedRows >= 10) {
    level++;
    levelEl.textContent = level;
    // Full lines above 10 count to next level countdown
    completedRows = completedRows % 10;
  }
}

function updateScore() {
  // Update the displayed score
  scoreEl.textContent = scoreValue;
  updateLevel();
  // Update game interval delay based on the level
  // Higher level = lower game interval delay
  // Minimum game interval delay = 100
  gameSpeed = Math.max(100, initialGameSpeed - level * 20);
}

function gameOver() {
  // Stops the game
  isGameOver = true;
  clearInterval(gameInterval);
  // Stop the background music (e.g., when the game ends)
  backgroundMusic.pause();
  // Plays game over music
  gameOverMusic.play();
  // Shows message container
  messageContainer.classList.remove("hidden");
  updateHighscore();
  // Enables start button
  startButton.removeAttribute("disabled");
}

function updateHighscore() {
  if (localStorage.getItem("tetris-highscore")) {
    const previousHighscore = localStorage.getItem("tetris-highscore");
    if (scoreValue > previousHighscore) {
      localStorage.setItem("tetris-highscore", scoreValue);
      highscoreEl.textContent = scoreValue;
    }
  }
}

function getHighscore() {
  // Check for highscore on local storage and renders it
  if (localStorage.getItem("tetris-highscore")) {
    const previousHighscore = localStorage.getItem("tetris-highscore");
    highscoreEl.textContent = previousHighscore;
  }
}

function updateGame() {
  // Implements the main game loop
  moveDown(piece);
  // If the piece coliddes at the first move down, it's game over
  if (checkColision(piece.shape)) {
    clearPiece();
    gameOver();
    return;
  }
  // Schedule the next execution of updateGame with the updated gameSpeed
  setTimeout(updateGame, gameSpeed);
}

function startGame() {
  // Hide the message container
  if (!messageContainer.classList.contains("hidden")) {
    messageContainer.classList.add("hidden");
  }
  // Start the background music fromthe beginning
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
  // Initialize game variables and start the game loop
  isGameOver = false;
  scoreEl.textContent = 0;
  getHighscore();
  level = 1;
  gameSpeed = initialGameSpeed;
  resetGrid();
  clearAllPieces();
  createNextPiece();
  createFirstPiece();
  updateGame();
  // Disable the start button so that the user doesn't click ingame
  startButton.setAttribute("disabled", "true");
}

// Event Listeners
startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", startGame);

// On load
getHighscore();

export { isGameOver, updateCompletedRows, calculateScore, updateScore };
