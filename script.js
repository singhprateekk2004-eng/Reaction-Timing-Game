/* =========================================
   REACTION BATTLE
   PHASE 1 - SINGLE PLAYER
========================================= */


/* =========================================
   GAME SETTINGS
========================================= */

const TOTAL_ROUNDS = 5;

const MIN_DELAY = 1000;
const MAX_DELAY = 3500;


/* =========================================
   GAME STATE
========================================= */

let currentRound = 0;

let score = 0;

let reactionTimes = [];

let targetVisible = false;

let targetStartTime = 0;

let targetTimer = null;

let countdownTimer = null;

let gameRunning = false;


/* =========================================
   GET HTML ELEMENTS
========================================= */

const startScreen =
    document.getElementById("startScreen");

const gameScreen =
    document.getElementById("gameScreen");

const resultScreen =
    document.getElementById("resultScreen");


const startButton =
    document.getElementById("startButton");

const nextRoundButton =
    document.getElementById("nextRoundButton");

const playAgainButton =
    document.getElementById("playAgainButton");


const roundNumber =
    document.getElementById("roundNumber");

const scoreElement =
    document.getElementById("score");

const bestTimeElement =
    document.getElementById("bestTime");

const averageTimeElement =
    document.getElementById("averageTime");


const gameArea =
    document.getElementById("gameArea");

const gameMessage =
    document.getElementById("gameMessage");

const countdown =
    document.getElementById("countdown");

const target =
    document.getElementById("target");


const roundResult =
    document.getElementById("roundResult");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const resultIcon =
    document.getElementById("resultIcon");


const finalScore =
    document.getElementById("finalScore");

const finalAverage =
    document.getElementById("finalAverage");

const finalBest =
    document.getElementById("finalBest");


const performanceTitle =
    document.getElementById("performanceTitle");

const performanceText =
    document.getElementById("performanceText");

const historyList =
    document.getElementById("historyList");


/* =========================================
   SCREEN MANAGEMENT
========================================= */

function showScreen(screen) {

    startScreen.classList.remove("active");

    gameScreen.classList.remove("active");

    resultScreen.classList.remove("active");

    screen.classList.add("active");
}


/* =========================================
   START GAME
========================================= */

function startGame() {

    clearTimers();

    currentRound = 0;

    score = 0;

    reactionTimes = [];

    targetVisible = false;

    targetStartTime = 0;

    gameRunning = true;

    scoreElement.textContent = "0";

    bestTimeElement.textContent = "—";

    averageTimeElement.textContent = "—";

    roundResult.classList.add("hidden");

    target.classList.add("hidden");

    countdown.classList.add("hidden");

    gameMessage.textContent =
        "Get ready...";

    showScreen(gameScreen);

    startNextRound();
}


/* =========================================
   START NEXT ROUND
========================================= */

function startNextRound() {

    currentRound++;

    if (currentRound > TOTAL_ROUNDS) {

        finishGame();

        return;
    }


    roundNumber.textContent =
        currentRound;

    roundResult.classList.add("hidden");

    target.classList.add("hidden");

    countdown.classList.add("hidden");

    gameMessage.classList.remove("hidden");

    gameMessage.textContent =
        "Get ready...";


    targetVisible = false;

    startCountdown();
}


/* =========================================
   COUNTDOWN
========================================= */

function startCountdown() {

    let count = 3;

    countdown.textContent = count;

    countdown.classList.remove("hidden");

    gameMessage.classList.add("hidden");


    countdownTimer =
        setInterval(() => {

            count--;

            if (count > 0) {

                countdown.textContent =
                    count;

                // Restart animation
                countdown.style.animation = "none";

                void countdown.offsetWidth;

                countdown.style.animation =
                    "countdownPulse 0.8s ease";

            } else {

                clearInterval(countdownTimer);

                countdown.classList.add("hidden");

                waitForTarget();
            }

        }, 1000);
}


/* =========================================
   WAIT FOR TARGET
========================================= */

function waitForTarget() {

    gameMessage.classList.remove("hidden");

    gameMessage.textContent =
        "Wait for it...";


    const delay =
        Math.floor(
            Math.random() *
            (MAX_DELAY - MIN_DELAY + 1)
        ) + MIN_DELAY;


    targetTimer =
        setTimeout(() => {

            showTarget();

        }, delay);
}


/* =========================================
   SHOW TARGET
========================================= */

function showTarget() {

    targetVisible = true;

    targetStartTime =
        performance.now();


    gameMessage.classList.add("hidden");


    /* Generate random position */

    const areaWidth =
        gameArea.clientWidth;

    const areaHeight =
        gameArea.clientHeight;


    const targetSize = 90;

    const padding = 60;


    const randomX =
        Math.random() *
        (areaWidth - padding * 2) +
        padding;


    const randomY =
        Math.random() *
        (areaHeight - padding * 2) +
        padding;


    target.style.left =
        `${randomX}px`;

    target.style.top =
        `${randomY}px`;


    target.classList.remove("hidden");
}


/* =========================================
   TARGET CLICK
========================================= */

function handleTargetClick(event) {

    event.stopPropagation();


    if (!targetVisible) {

        return;
    }


    const reactionTime =
        Math.round(
            performance.now() -
            targetStartTime
        );


    targetVisible = false;

    target.classList.add("hidden");


    score++;

    reactionTimes.push(reactionTime);


    updateScoreboard();


    showRoundResult(reactionTime);
}


/* =========================================
   EARLY CLICK
========================================= */

function handleGameAreaClick(event) {

    if (!gameRunning) {
        return;
    }


    if (targetVisible) {
        return;
    }


    if (
        event.target === target ||
        target.contains(event.target)
    ) {
        return;
    }


    gameMessage.textContent =
        "Too early! Wait for the target.";


    gameMessage.style.color =
        "#fb7185";


    setTimeout(() => {

        gameMessage.style.color =
            "#94a3b8";

    }, 800);
}


/* =========================================
   UPDATE SCOREBOARD
========================================= */

function updateScoreboard() {

    scoreElement.textContent =
        score;


    if (reactionTimes.length > 0) {

        const best =
            Math.min(...reactionTimes);

        const average =
            Math.round(
                reactionTimes.reduce(
                    (total, time) =>
                        total + time,
                    0
                ) /
                reactionTimes.length
            );


        bestTimeElement.textContent =
            `${best} ms`;

        averageTimeElement.textContent =
            `${average} ms`;
    }
}


/* =========================================
   SHOW ROUND RESULT
========================================= */

function showRoundResult(reactionTime) {

    resultIcon.textContent =
        "⚡";


    if (reactionTime < 250) {

        resultTitle.textContent =
            "Lightning Fast!";

        resultIcon.textContent =
            "🔥";

    } else if (reactionTime < 400) {

        resultTitle.textContent =
            "Excellent!";

    } else if (reactionTime < 600) {

        resultTitle.textContent =
            "Great Reaction!";

    } else {

        resultTitle.textContent =
            "Good Try!";

    }


    resultText.textContent =
        `Your reaction time was ${reactionTime} ms`;


    if (currentRound === TOTAL_ROUNDS) {

        nextRoundButton.textContent =
            "See Results";

    } else {

        nextRoundButton.textContent =
            "Next Round";
    }


    roundResult.classList.remove("hidden");
}


/* =========================================
   NEXT ROUND BUTTON
========================================= */

function goToNextRound() {

    roundResult.classList.add("hidden");

    startNextRound();
}


/* =========================================
   FINISH GAME
========================================= */

function finishGame() {

    gameRunning = false;

    targetVisible = false;

    target.classList.add("hidden");

    clearTimers();


    const totalScore =
        score;


    const average =
        Math.round(
            reactionTimes.reduce(
                (total, time) =>
                    total + time,
                0
            ) /
            reactionTimes.length
        );


    const best =
        Math.min(...reactionTimes);


    finalScore.textContent =
        `${totalScore} / ${TOTAL_ROUNDS}`;

    finalAverage.textContent =
        `${average} ms`;

    finalBest.textContent =
        `${best} ms`;


    createPerformanceMessage(average);

    createHistory();

    showScreen(resultScreen);
}


/* =========================================
   PERFORMANCE MESSAGE
========================================= */

function createPerformanceMessage(average) {

    if (average < 250) {

        performanceTitle.textContent =
            "⚡ Lightning Reflexes";

        performanceText.textContent =
            "Your reaction speed is seriously fast!";

    } else if (average < 400) {

        performanceTitle.textContent =
            "🔥 Excellent Performance";

        performanceText.textContent =
            "You have a very quick reaction speed.";

    } else if (average < 600) {

        performanceTitle.textContent =
            "👏 Nice Work";

        performanceText.textContent =
            "Good job! Keep practicing to get faster.";

    } else {

        performanceTitle.textContent =
            "💪 Keep Practicing";

        performanceText.textContent =
            "Practice makes your reactions faster.";
    }
}


/* =========================================
   CREATE ROUND HISTORY
========================================= */

function createHistory() {

    historyList.innerHTML = "";


    reactionTimes.forEach(
        (time, index) => {

            const item =
                document.createElement("div");

            item.className =
                "history-item";


            item.innerHTML = `
                <span>Round ${index + 1}</span>
                <strong>${time} ms</strong>
            `;


            historyList.appendChild(item);
        }
    );
}


/* =========================================
   PLAY AGAIN
========================================= */

function playAgain() {

    startGame();
}


/* =========================================
   CLEAR TIMERS
========================================= */

function clearTimers() {

    if (targetTimer) {

        clearTimeout(targetTimer);

        targetTimer = null;
    }


    if (countdownTimer) {

        clearInterval(countdownTimer);

        countdownTimer = null;
    }
}


/* =========================================
   EVENT LISTENERS
========================================= */

startButton.addEventListener(
    "click",
    startGame
);


nextRoundButton.addEventListener(
    "click",
    goToNextRound
);


playAgainButton.addEventListener(
    "click",
    playAgain
);


target.addEventListener(
    "click",
    handleTargetClick
);


gameArea.addEventListener(
    "click",
    handleGameAreaClick
);