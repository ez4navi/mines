const minefield = document.querySelector("#minefield").children,
      free = document.querySelector("#free"),
      WHITE = "#ffffff", cell = document.querySelectorAll(".cell"),
      checked = [], headline = document.querySelector("body > main > h1"),
      pick = document.querySelector("#pick"),
      newGame = document.querySelector("#new-game");
let bomb, score = 0, balance = 0, gameStatus = false, bet = 0, canPlay = false;

function clearField() {
    for (let i = 0; i < minefield.length; i++) {
        minefield[i].style.background = WHITE;
    }
}

function startGame() {
    gameStatus = true;
    canPlay = false;
}

function endGame() {
    gameStatus = false;
    canPlay = false;
    checked.splice(0,checked.length);
}

function updateScore() {
    document.querySelector("#score").innerHTML = score.toString();
}

function updateBalance() {
    // balance = localStorage.getItem('balance');
    document.querySelector("#balance").innerHTML = balance.toString();
}

function loadBalance() {
    if (localStorage.getItem('balance')) {
        balance = +localStorage.getItem('balance');
        updateBalance();
    } else {
        updateBalance();
    }
}

function loadInfo() {
    loadBalance();
    savedBet();
    checkFree();
}

function checkFree() {
    if (!localStorage.getItem('free')) {
        free.style.visibility = "visible";
    }
}

function saveBalance() {
    localStorage.setItem('balance', balance);
}

function showScore() {
    document.querySelector("#score").innerHTML = score.toString();
}

function spawnRandomBomb() {
    bomb = Math.floor(Math.random() * 9);
}

function updateBet() {
    bet = +document.querySelector("#bet").value;
}

function savedBet() {
    document.querySelector("#bet").value = 0;
}

function checkBet() {
    if (bet > 0 && bet <= balance && !gameStatus) {
        canPlay = true;
    }
}

function getFree() {
    balance += 100;
    free.style.visibility = "hidden";
    localStorage.setItem('free','true');
    updateBalance();
    saveBalance();
}

function trueCell(num) {
    cell[num].style.backgroundImage = "url('checkmark.jpg')";
    cell[num].style.backgroundPosition = "center";
    cell[num].style.backgroundSize = "150px 150px"
}

function failCell(num) {
    cell[num].style.backgroundImage = "url('bomb.jpg')";
    cell[num].style.backgroundPosition = "center";
    cell[num].style.backgroundSize = "150px 150px"
}

function giveScore() {
    let count = Math.round(bet/10)*checked.length;
    score+=count;
    updateScore();
}

function blink() {
    let el = headline;
    let timer = setInterval(function() {
        let red = Math.floor(Math.random() * 256).toString(16);
        let green = Math.floor(Math.random() * 256).toString(16);
        let blue = Math.floor(Math.random() * 256).toString(16);
        el.style.color = "#" + red + green + blue;
    }, 100);
    setTimeout(function () {
        clearInterval(timer);
    }, 2000);
}

function finish() {
    endGame();
    score = 0;
    setTimeout(function () {
        clearField();
        updateScore();
        saveBalance();
        pick.disabled = false;
        newGame.disabled = false;
    }, 2000);
}

function usuallyFinish() {
    balance += score;
    score = 0;
    clearField();
    updateScore();
    updateBalance();
    endGame();
    saveBalance();
}

function happyFinish() {
    blink();
    setTimeout(function () {
        usuallyFinish();
        headline.innerHTML = "EZ BABKI";
        headline.style.color = "#6b8aff";
    }, 2000);
}

window.onload = function() {
    loadInfo();
};

free.onclick = function () {
  getFree();
};

document.querySelector("#bet").addEventListener("keypress", function (evt) {
    if (evt.which !== 8 && evt.which !== 0 && evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
}); //Check input on incorrect bet

newGame.onclick = function () {
    updateBet();
    checkBet();
    if (canPlay) {
        score = bet;
        balance -= bet;
        updateBalance();
        showScore();
        updateScore();
        clearField();
        spawnRandomBomb();
        startGame();
        saveBalance();
    }
};

document.querySelector("#minefield").onclick = function (e) {
    if (gameStatus) {
        if (e.target.id !== bomb.toString() && checked.indexOf(+e.target.id)<0) {
            checked.push(+e.target.id);
            trueCell(+e.target.id);
            if (checked.length === 8) {
                headline.innerHTML = "OMG";
                happyFinish();
            }
            giveScore();
        }

        if (e.target.id === bomb.toString()){
            failCell(+e.target.id);
            finish();
            pick.disabled = "disabled";
            newGame.disabled = "disabled";
        }
    }
};

document.querySelector("#pick").onclick = function () {
  usuallyFinish();
};