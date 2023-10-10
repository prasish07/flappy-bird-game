// canvas variable
const container = document.querySelector(".container");
let canvas;
let canvasWidth = 360;
let canvasHeight = 640;
let context;
let pipesTimes = 2500;

// game variables

let score = 0;

// bird variables
let birdWidth = 34; //
let birdHeight = 24;
let birdX = canvasWidth / 8;
let birdY = canvasHeight / 2;
let birdImg;

// bird object
let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// pipes variable
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = canvasWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics in the game
// speed with which the tree move from right to left
let velocityX = -1.5;
let velocityY = 0;
let gravity = 0.2;

// game over variable
let gameOver = false;
let gameOverImg;

gameOverImg = new Image();
gameOverImg.src = "assets/gameover.png";

const start = () => {
  canvas = document.getElementById("canvas");
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  context = canvas.getContext("2d");

  // Drawing the bird
  birdImg = new Image();
  birdImg.src = "assets/flappybird.png";
  birdImg.onload = () => {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "assets/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "assets/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, pipesTimes);
  document.addEventListener("keydown", jump);
  document.addEventListener("click", jump);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    gameOverText();
    return;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);

  velocityY += gravity;
  bird.y = Math.max(velocityY + bird.y, 0);
  //   Drawing the bird with each frame
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > canvasHeight) {
    gameOver = true;
  }

  //   Drawing pipe
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    // increase the score
    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      pipe.passed = true;
      score = score + 0.5;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }
  //   this to remove the element which has gone over the canvas frame
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  context.fillStyle = "black";
  context.font = "24px Verdana";
  context.fillText(`Score: ${score}`, 10, 620);
  if (score >= 10) {
    velocityX = -2.5;
  }
}

function placePipes() {
  if (gameOver) {
    gameOverText();
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = pipeHeight / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  //   bottom pipe
  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);

  pipeArray.push(topPipe);
}

function jump(e) {
  velocityY = -4;
  if (gameOver) {
    restartGame();
  }
}

function detectCollision(a, b) {
  if (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  ) {
    console.log(a, b);
    return true;
  }
  return false;
}

function gameOverText() {
  context.drawImage(gameOverImg, 5, canvasHeight / 2.9, 350, 70);
  context.fillText(`Final score: ${score}`, 100, 330);
  context.fillText(`Click to play again`, 65, 380);
}

window.onload = start();

function restartGame() {
  // Reset game variables
  gameOver = false;
  score = 0;
  bird.y = birdY;
  pipeArray = [];
}
