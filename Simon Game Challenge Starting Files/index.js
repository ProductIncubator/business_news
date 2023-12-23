
const buttonColours = ["red", "blue", "green", "yellow"];
const gamePattern = [];

function nextSequence() { 
  var randomNumber = Math.floor(Math.random() * 3);
  const randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
}


