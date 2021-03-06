function generateWinningNumber(){
	return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
  let m = array.length, t, i;

  while (m){
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
	return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
	return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num){
	if(num < 1 || num > 100 || typeof num !== 'number'){
		throw "That is an invalid guess."
	} else {
		this.playersGuess = num;
	}

	return this.checkGuess();
}

Game.prototype.checkGuess = function(){
	if(this.playersGuess === this.winningNumber){
		$('#hint, #submit').prop("disabled",true);
        $('#subtitle').text("Press the Reset button to play again!")
		return "You Win!";
	} else if(this.pastGuesses.includes(this.playersGuess)){
		return "You have already guessed that number.";
	} else {
		this.pastGuesses.push(this.playersGuess);
		$('#guess-list li:nth-child('+this.pastGuesses.length+')').text(this.playersGuess);
	}

	if(this.pastGuesses.length === 5){
		$('#hint, #submit').prop("disabled",true);
        $('#subtitle').text("Press the Reset button to play again!")
		return "You Lose.";
	}

    if(this.isLower()) {
        $('#subtitle').text("Guess Higher!")
    } else {
        $('#subtitle').text("Guess Lower!")
    }

	if(this.difference() < 10){
		return "You're burning up!";
	} else if(this.difference() < 25){
		return "You're lukewarm.";
	} else if(this.difference() < 50){
		return "You're a bit chilly.";
	} else {
		return "You're ice cold!";
	}
}

function newGame(){
	return new Game();
}

Game.prototype.provideHint = function(){
	return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
}


function makeAGame(game){
	let val = +$('#player-input').val();
	$('#player-input').val("");
	let output = game.playersGuessSubmission(val);
    $('#title').text(output);
}

$(document).ready(function(){
	let game = newGame();

	$('#submit').on('click', function(){
		makeAGame(game);
	})

	$('#player-input').on('keypress', function(event){
		if(event.which === 13){
			makeAGame(game);
		}
	})

	$('#hint').click(function() {
	    var hints = game.provideHint();
	    $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
	});

	$('#reset').click(function() {
	    game = newGame();
	    $('#title').text('Play the Guessing Game!');
	    $('#subtitle').text('Guess a number between 1-100!')
	    $('.guess > li').text('-');
	    $('#hint, #submit').prop("disabled",false);
	})
})