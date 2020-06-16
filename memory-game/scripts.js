//Variables
var cards;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard;
let secondCard;
let pause = false;
let interval;
let score=0;
let numToWin;

//Creates the Grid, and starts the game
function MatchGrid(widthActivity, heightActivity, numOfMatches, timeLimit, theme){
    //Clears Old Game
    var parent1 = document.getElementById('memory-game');
    parent1.innerHTML = "";
    score = 0;
    //Creates New Game
    createActivityArea(widthActivity, heightActivity)
    createCard(numOfMatches);
    numToWin = numOfMatches;
    shuffle();
    cards.forEach(card => card.addEventListener('click', flipCard));
    timer(timeLimit)
}

function createActivityArea(width, height){
    document.getElementById("memory-game").style.width = width;
    document.getElementById("memory-game").style.height = height;
}

function pausefunc() {
    //console.log("Paused")
    pause = true;
}

function unpausefunc() {
    //console.log("unpaused")
    pause = false;
}

function timer(time){
    var display = document.querySelector('#time');
    var timer = time;
    clearInterval(interval)

    interval = setInterval(function() {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        if (!pause){
        --timer;    
        if (timer < 0) {
            console.log("lose")
            clearInterval(interval);
        }
    }
    }, 1000);
}

//Creates Each Card
function createCard(numOfMatches) {
    var i = 0;
    //Creates amount of cards equal to how many matches user wants to play
    while (i < numOfMatches){
    //Creates the Card
    var newCard = document.createElement("div"); 
    newCard.className = "memory-card";
    newCard.dataset.value = i;
    //Front of Card
    var newFrontContent = document.createElement("div"); 
    newFrontContent.innerText = `Front ${i}`;
    newFrontContent.className = "front-face";
    //Back of Card
    var newBackContent = document.createElement("div"); 
    newBackContent.innerText = `Back`;
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
    if(lockBoard) return;
    if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard=this;
    console.log(firstCard)
    return;
  }
    secondCard = this;
    console.log(secondCard)
    checkForMatch();
};


function checkForMatch() {
    console.log(firstCard.dataset.value, secondCard.dataset.value)
    let isMatch = firstCard.dataset.value === secondCard.dataset.value;
    isMatch ? disableCards() : unFlipCards();
};

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    ++score;
    checkForWin();
    resetBoard();
};

function checkForWin() {
 if (score === numToWin){
     console.log("You Win")
     clearInterval(interval)
 }
}

function unFlipCards() {

    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip')
        secondCard.classList.remove('flip')

        resetBoard();
    }, 1300);
};

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
};

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
};

function startGame(){
    new MatchGrid( "80vh", "80vw", 2, 10, "red")
}
