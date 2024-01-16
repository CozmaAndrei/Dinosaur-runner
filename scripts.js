const gameContainer = document.querySelector(".gameContainer");
let gameContainerRect = gameContainer.getBoundingClientRect();
const infoContainer = document.querySelector(".infoContainer");
const btnStart = document.querySelector(".btnStart");
const result = document.querySelector(".result");
const score = document.querySelector(".score");
const highScore = document.querySelector(".highScore");
let seconds = 0;
let theBiggestScore = 0;
let setTime;
let gameRunning = false;
let playerPositionJump = 65; // %
let playerPositionFall = 20; // %
const playerPositionVerticalMin = 20; // %
const playerPositionVerticalMax = 65; // %
let playerJump;
let playerFall
let canJump = true
let setObstacleInterval;

btnStart.addEventListener("click", startGame);

function startGame() {
    gameRunning = true;
    result.innerHTML = "";
    seconds = 0;
    btnStart.setAttribute("hidden", "true");
    createPlayer(); 
    createObstacle();
    clearInterval(setTime);
    setTime = setInterval(updateSeconds, 1000);
    setObstacleInterval = setInterval(createObstacle, 4000);
}

function createPlayer() { // red's element
    if (gameRunning === true) {
        const player = document.createElement("div");
        gameContainer.appendChild(player);
        player.classList.add("myPlayer");
        document.addEventListener("keypress", thePlayerJump);
        setInterval(checkCollision, 100);
    }
}

function thePlayerJump(event) {
    if(gameRunning === true && canJump === true) {
        const playerMoves = document.querySelector(".myPlayer");
        clearInterval(playerJump);
        playerPositionJump = 65;
        playerJump = setInterval(() => {
            if (event.key === " " && playerPositionJump > playerPositionVerticalMin) {
                playerPositionJump -= 1;
                playerMoves.style.top = `${playerPositionJump}%`;
                console.log(playerPositionJump)
                console.log(playerPositionVerticalMin)
            } else {
                clearInterval(playerJump);
                theDinoFall();
            }
        }, 10);
        canJump = false;
        setTimeout(() => {
            canJump = true;
        }, 900); 
    }
}

function theDinoFall() {
    const playerMoves = document.querySelector(".myPlayer");
    clearInterval(playerFall);
    playerPositionFall = 20; // %
    playerFall = setInterval(() => {
        if (playerPositionFall < playerPositionVerticalMax) {
            playerPositionFall += 1;
            playerMoves.style.top = `${playerPositionFall}%`;
        } else {
            clearInterval(playerFall);
            playerPositionJump = 65;
        }
    }, 10);  
}

function createObstacle() { // green's element
    const obstacleElement = document.createElement("div");
    gameContainer.appendChild(obstacleElement);
    obstacleElement.classList.add("obstacle");
    obstacleElement.style.top = `${Math.random() * 13 + 60}%`;
    obstacleMove(obstacleElement);
}

function obstacleMove(obstacleElement) {
    let obstaclePosition = 100;
    let setObstaclePosition = setInterval(() => {
        obstaclePosition -= 0.3;
        obstacleElement.style.left = `${obstaclePosition}%`;
        const obstacleRect = obstacleElement.getBoundingClientRect();
        if (obstacleRect.right <= gameContainerRect.left) {
            clearInterval(setObstaclePosition);
            obstacleElement.remove();
        }
    }, 1);
}

function checkCollision() {
    const obstacleObject = document.querySelector(".obstacle");
    const playerObject = document.querySelector(".myPlayer");
    if (obstacleObject && playerObject) {
        const playerRect = playerObject.getBoundingClientRect();
        const obstacleRect = obstacleObject.getBoundingClientRect();
        if (obstacleRect.left <= playerRect.right &&
            obstacleRect.top <= playerRect.bottom &&
            obstacleRect.right >= playerRect.left) {
            playerObject.remove();
            obstacleObject.remove();
            gameRunning = false;
            clearInterval(setObstacleInterval);
            displayMessage();
        }
    }
}

function displayMessage() {
    result.innerHTML = "GAME OVER";
    btnStart.removeAttribute("hidden", "true");
    if (theBiggestScore < seconds) {
        theBiggestScore = seconds;
        highScore.innerHTML = `High Score: ${theBiggestScore}`;
        score.innerHTML = "Score: 0";
        clearInterval(setTime);
    } else {
        clearInterval(setTime)
    }
}

function updateSeconds() {
    ++seconds;
    score.innerHTML = `Score: ${seconds}`;
}
