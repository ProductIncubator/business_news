
const buttonColours = ["red", "blue", "green", "yellow"];
const gamePattern = [];

function nextSequence() { 
  var randomNumber = Math.floor(Math.random() * 3);
  const randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  flashElement(randomChosenColour);
  playAudio(randomChosenColour);

}

function flashElement(name) {
      $("#"+name).fadeIn(500).delay(500).fadeOut(500);
    }

function playAudio(name) {
  var audio = new Audio(name+'.mp3');
  audio.play();
 }
