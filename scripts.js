//Variables
var cards;
let boardLock = false;
let firstCard;
let secondCard;
let pause = false;
let interval;
let score=0;
let numToWin;
let moves;

//Creates the Grid, and starts the game
function MatchGrid(widthActivity, heightActivity, columns, rows, timeLimit, theme){
    clearGame()
    //Creates New Game
    createActivityArea(widthActivity, heightActivity)
    numToWin = ((columns * rows)/2);
    createCard(numToWin,columns, rows, widthActivity, heightActivity);
    shuffle(numToWin);
    cards.forEach(card => card.addEventListener('click', flipCard));
    timer(timeLimit)
}

//Clears Old Game by removing elements and resetting variables
function clearGame(){
    var timebox = document.getElementsByClassName("time-box");
    timebox[0].style.background = "#3ff266";
    var parent1 = document.getElementById('memory-game');
    var status = document.getElementById('status');
    parent1.innerHTML = "";
    status.innerHTML = "";
    [score, moves] = [0,0];
}

//Creates the activity area ***Needs Work***
function createActivityArea(width, height){
    document.getElementById("memory-game").style.width = width;
    document.getElementById("memory-game").style.height = height;
}

//On Mouse out, pause the game timer
function pausefunc() {
    pause = true;
}

//On Mouse enter, resume the timer
function unpausefunc() {
    pause = false;
}

//Creates a timer in minutes and seconds based on the time imput in seconds
function timer(time){
    var display = document.querySelector('#time');
    var timer = time;
    //Prevents the spamming of Start game
    clearInterval(interval)
    interval = setInterval(function() {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        //Checks pause status every second
        if (!pause){
        --timer;
        //Game lost
        if (timer < 0) {
            var x = document.getElementsByClassName("time-box");
            x[0].style.background = "#F2403F";
            gameStatus("lose")
            disableGame();
            on();
            clearInterval(interval);
        }
    }
    }, 1000);
}

//Displays element to screen based on status of the game
function gameStatus(status){
    var display = document.querySelector('#status');
    if(status === "win"){
    display.textContent = `You won in ${moves} moves!`;
    } else if (status === "lose")
    display.textContent = "You Lose!";
}

//Creates Each Card
function createCard(numToWin, columns, rows, width, height) {
    var i = 0;
    //Creates amount of cards equal to how many matches user wants to play
    while (i < numToWin){
    //Creates the Card
    var newCard = document.createElement("div"); 
    newCard.className = "memory-card";
    newCard.dataset.value = i;
    newCard.style.fontSize = `3rem`;
    newCard.style.width = `calc(calc(100% / ${rows}) - 10px)`;
    console.log(newCard.style.width)
    newCard.style.height = `calc(100% / ${columns})vh`;
    //Front of Card
    var newFrontContent = document.createElement("div"); 
    newFrontContent.innerText = `${i}`;
    newFrontContent.className = "front-face";
    //Back of Card
    var newBackContent = document.createElement("div"); 
    newBackContent.className = "back-face";
    //Appends faces to Card and and creates clone of Card
    newCard.appendChild(newFrontContent);
    newCard.appendChild(newBackContent);
    let match = newCard.cloneNode(true);
    document.getElementById("memory-game").appendChild(newCard);
    document.getElementById("memory-game").appendChild(match);
    i++;
    }
    //Sets created cards to variable to be used. 
    cards = document.querySelectorAll('.memory-card');
};

function flipCard() {
    //Prevents spamming of too many cards
    if(boardLock) return;
    //Prevents clicking on the same card twice
    if (this === firstCard) return;

    this.classList.add('flip');

    //Sets the first card if not already declared
    if (!firstCard) {
        firstCard=this;
        return;
    }
    //Sets the 2nd card and checks for match between the two
        secondCard = this;
        checkForMatch();
};

//Checks the value of each card for a match, adds move to counter
function checkForMatch() {
    ++moves;
    let isMatch = firstCard.dataset.value === secondCard.dataset.value;
    isMatch ? disableCards() : unFlipCards();
};

//Makes a matched pair no longer flippable, also checks for win based on score
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    ++score;
    checkForWin();
    resetBoard();
};

//Disables the game after time runs out, so player can not continue to play
function disableGame() {
    cards.forEach(card => {
        card.removeEventListener('click', flipCard);
    });
    resetBoard();
};

function checkForWin() {
 if (score === numToWin){
     gameStatus("win")
     on();
     clearInterval(interval)
 }
}

//Unflips the cards after timeout
function unFlipCards() {
    boardLock = true;
    setTimeout(() => {
        firstCard.classList.remove('flip')
        secondCard.classList.remove('flip')

        resetBoard();
    }, 800);
};

//Cleans up after each card flip
function resetBoard() {
    boardLock =  false;
    [firstCard, secondCard] = [null, null];
};

//Shuffles the cards based on order for flex
function shuffle(num) {
    cards.forEach(card => {
        let randomNum = Math.floor(Math.random() * (num*2));
        card.style.order = randomNum;
    });
};

function on() {
    document.getElementById("overlay").style.display = "block";
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  }

//Starts the game with the matchgrid object
function startGame(){
    new MatchGrid( "800px", "800px", 4, 8, 5, "red")
}
