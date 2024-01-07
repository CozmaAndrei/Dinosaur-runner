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
let dinoPositionJump = 80; // %
let dinoPositionFall = 40; // %
const dinoPositionVerticalMin = 40; // %
const dinoPositionVerticalMax = 80; // %
let dinoJump;
let dinoFall
let canJump = true
let setObstacleInterval;

btnStart.addEventListener("click", startGame);

function startGame() {
    gameRunning = true;
    result.innerHTML = "";
    seconds = 0;
    btnStart.setAttribute("hidden", "true");
    createDino(); 
    createObstacle();
    clearInterval(setTime);
    setTime = setInterval(updateSeconds, 1000);
    setObstacleInterval = setInterval(createObstacle, 4000);
}

function createDino() { // red's element
    if (gameRunning === true) {
        const dino = document.createElement("div");
        gameContainer.appendChild(dino);
        dino.classList.add("myDino");
        document.addEventListener("keypress", jump);
        setInterval(checkCollision, 100);
    }
}

function jump(event) {
    if(gameRunning === true && canJump === true) {
        const dinoMoves = document.querySelector(".myDino");
        clearInterval(dinoJump);
        dinoPositionJump = 80;
        dinoJump = setInterval(() => {
            if (event.key === " " && dinoPositionJump > dinoPositionVerticalMin) {
                dinoPositionJump -= 1;
                dinoMoves.style.top = `${dinoPositionJump}%`;
                console.log(dinoPositionJump)
                console.log(dinoPositionVerticalMin)
            } else {
                clearInterval(dinoJump);
                fall();
            }
        }, 10);
        canJump = false;
        setTimeout(() => {
            canJump = true;
        }, 800); 
    }
}

function fall() {
    const dinoMoves = document.querySelector(".myDino");
    clearInterval(dinoFall);
    dinoPositionFall = 40; // %
    dinoFall = setInterval(() => {
        if (dinoPositionFall < dinoPositionVerticalMax) {
            dinoPositionFall += 1;
            dinoMoves.style.top = `${dinoPositionFall}%`;
            console.log(dinoPositionVerticalMax)
            console.log(dinoPositionFall)
        } else {
            clearInterval(dinoFall);
            dinoPositionJump = 80;
        }
    }, 10);  
}

function createObstacle() { // green's element
    const obstacleElement = document.createElement("div");
    gameContainer.appendChild(obstacleElement);
    obstacleElement.classList.add("obstacle");
    obstacleMove(obstacleElement);
}

function obstacleMove(obstacleElement) {
    let obstaclePosition = 100;
    let setObstaclePosition = setInterval(() => {
        obstaclePosition -= 0.1;
        obstacleElement.style.left = `${obstaclePosition}%`;
        const treeRect = obstacleElement.getBoundingClientRect();
        if (treeRect.right <= gameContainerRect.left) {
            clearInterval(setObstaclePosition);
            obstacleElement.remove();
        }
    }, 1);
}

function checkCollision() {
    const obstacleObject = document.querySelector(".obstacle");
    const dinoObject = document.querySelector(".myDino");
    if (obstacleObject && dinoObject) {
        const dinoRect = dinoObject.getBoundingClientRect();
        const treeRect = obstacleObject.getBoundingClientRect();
        if (treeRect.left <= dinoRect.right &&
            treeRect.top <= dinoRect.bottom &&
            treeRect.right >= dinoRect.left) {
            dinoObject.remove();
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
