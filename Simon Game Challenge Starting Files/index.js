const buttons = document.querySelectorAll('.btn');
const levelTitle = document.getElementById('level-title');
let gamePattern = [];
let userClickedPattern = [];
const buttonColors = ['red', 'blue', 'green', 'yellow'];
let level = 0;
let started = false;

function nextSequence() {
  level++;
  levelTitle.textContent = `Level ${level}`;
  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  setTimeout(() => {
    flashButton(randomChosenColor);
  }, 1000);
}

function flashButton(color) {
  const button = document.getElementById(color);
  button.classList.add('pressed');
  playSound(color);
  setTimeout(() => {
    button.classList.remove('pressed');
  }, 100);
}

function playSound(name) {
  const audio = new Audio(`sounds/${name}.mp3`);
  audio.play();
}

function handleButtonClick(event) {
  if (started) {
    const userChosenColor = event.target.id;
    userClickedPattern.push(userChosenColor);
    flashButton(userChosenColor);
    playSound(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
  }
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      userClickedPattern = [];
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound('wrong');
    document.body.classList.add('game-over');
    levelTitle.textContent = 'Game Over! Press A Key to Restart';
    started = false;
    setTimeout(() => {
      document.body.classList.remove('game-over');
      startOver();
    }, 2000);
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

document.addEventListener('keydown', function () {
  if (!started) {
    started = true;
    nextSequence();
  }
});

buttons.forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});
