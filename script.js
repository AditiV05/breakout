const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");
const modal = document.getElementById("game-over-modal");
const finalScoreDisplay = document.getElementById("final-score");
const playAgainBtn = document.getElementById("play-again-btn");

let score = 0;
let gameLoop;
let paddle;
let ball;
let blocks = [];

class Paddle {
  constructor() {
    this.positionX = 160;
    this.element = document.createElement("div");
    this.element.classList.add("paddle");
    gameBoard.appendChild(this.element);
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.positionX}px`;
  }

  move(direction) {
    if (direction === "left" && this.positionX > 0) {
      this.positionX -= 20;
    } else if (direction === "right" && this.positionX < 320) {
      this.positionX += 20;
    }
    this.updatePosition();
  }
}

class Ball {
  constructor() {
    this.positionX = 200;
    this.positionY = 460;
    this.velocityX = 2;
    this.velocityY = -2;
    this.element = document.createElement("div");
    this.element.classList.add("ball");
    gameBoard.appendChild(this.element);
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.positionX}px`;
    this.element.style.top = `${this.positionY}px`;
  }

  move() {
    this.positionX += this.velocityX;
    this.positionY += this.velocityY;

    if (this.positionX <= 0 || this.positionX >= 390) {
      this.velocityX *= -1;
    }

    if (this.positionY <= 0) {
      this.velocityY *= -1;
    }

    if (
      this.positionY + 10 >= 490 &&
      this.positionX >= paddle.positionX &&
      this.positionX <= paddle.positionX + 80
    ) {
      this.velocityY *= -1;
    }

    this.checkBlockCollision();

    if (this.positionY >= 500) {
      clearInterval(gameLoop);
      modal.classList.add("show");
      finalScoreDisplay.textContent = score;
    }

    this.updatePosition();
  }

  checkBlockCollision() {
    blocks.forEach((block, index) => {
      if (
        this.positionX + 10 >= block.positionX &&
        this.positionX <= block.positionX + 50 &&
        this.positionY + 10 >= block.positionY &&
        this.positionY <= block.positionY + 20
      ) {
        block.element.remove();
        blocks.splice(index, 1);
        this.velocityY *= -1;
        score++;
        scoreDisplay.textContent = score;

        if (blocks.length === 0) {
          clearInterval(gameLoop);
          modal.classList.add("show");
          finalScoreDisplay.textContent = `You Won! Score: ${score}`;
        }
      }
    });
  }
}

class Block {
  constructor(x, y) {
    this.positionX = x;
    this.positionY = y;
    this.element = document.createElement("div");
    this.element.classList.add("block");
    this.element.style.left = `${this.positionX}px`;
    this.element.style.top = `${this.positionY}px`;
    gameBoard.appendChild(this.element);
  }
}

function createBlocks() {
  const rows = 5;
  const cols = 8;
  blocks = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = new Block(col * 50, row * 20);
      blocks.push(block);
    }
  }
}

function restartGame() {
  score = 0;
  scoreDisplay.textContent = score;
  modal.classList.remove("show");
  clearInterval(gameLoop);
  startGame();
}

function startGame() {
  gameBoard.innerHTML = "";
  paddle = new Paddle();
  ball = new Ball();
  createBlocks();

  gameLoop = setInterval(() => {
    ball.move();
  }, 20);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    paddle.move("left");
  } else if (event.key === "ArrowRight") {
    paddle.move("right");
  }
});

restartBtn.addEventListener("click", restartGame);
playAgainBtn.addEventListener("click", restartGame);

startGame();
