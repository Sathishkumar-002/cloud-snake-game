/* =========================
   API URL
========================= */

const API_URL =
    "http://YOUR_EC2_PUBLIC_IP:5000";


/* =========================
   CANVAS
========================= */

const canvas =
    document.getElementById("game");

const ctx =
    canvas.getContext("2d");


/* =========================
   GAME VARIABLES
========================= */

const box = 20;

const boardSize = 20;

let snake = [];

let food = {};

let direction = "RIGHT";

let score = 0;

let game = null;

let playerName = "";

let selectedSpeed = 25;

let gameRunning = false;


/* =========================
   SPEED VALUES
=========================

   25%  = Slow
   50%  = Medium
   75%  = Fast
   100% = Very Fast
========================= */

const speedValues = {

    25: 250,

    50: 180,

    75: 120,

    100: 70

};


/* =========================
   SPEED SELECTION
========================= */

function selectSpeed(
    speed,
    button
) {

    if (gameRunning) {

        return;

    }


    selectedSpeed = speed;


    const buttons =
        document.querySelectorAll(
            ".speed-btn"
        );


    buttons.forEach(
        btn => {

            btn.classList.remove(
                "active"
            );

        }
    );


    button.classList.add(
        "active"
    );


    document.getElementById(
        "message"
    ).innerText =
        "Speed selected: " +
        speed +
        "%";

}


/* =========================
   START GAME
========================= */

function startGame() {

    playerName =
        document
            .getElementById(
                "playerName"
            )
            .value
            .trim();


    if (playerName === "") {

        alert(
            "Please enter your name"
        );

        return;

    }


    clearInterval(game);


    score = 0;

    gameRunning = true;


    document.getElementById(
        "score"
    ).innerText = 0;


    snake = [

        {
            x: 200,
            y: 200
        }

    ];


    direction = "RIGHT";


    createFood();


    game =
        setInterval(

            drawGame,

            speedValues[
                selectedSpeed
            ]

        );


    document.getElementById(
        "message"
    ).innerText =
        "Game Started! 🐍 Speed: " +
        selectedSpeed +
        "%";


    document.querySelector(
        ".start-btn"
    ).disabled = true;


    document
        .querySelectorAll(
            ".speed-btn"
        )
        .forEach(
            button => {

                button.disabled = true;

            }
        );

}


/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "ArrowUp"
        ) {

            event.preventDefault();

            moveUp();

        }


        if (
            event.key ===
            "ArrowDown"
        ) {

            event.preventDefault();

            moveDown();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            event.preventDefault();

            moveLeft();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            event.preventDefault();

            moveRight();

        }

    }
);


/* =========================
   FOUR ARROW FUNCTIONS
========================= */

function moveUp() {

    if (
        direction !==
        "DOWN"
    ) {

        direction = "UP";

    }

}


function moveDown() {

    if (
        direction !==
        "UP"
    ) {

        direction = "DOWN";

    }

}


function moveLeft() {

    if (
        direction !==
        "RIGHT"
    ) {

        direction = "LEFT";

    }

}


function moveRight() {

    if (
        direction !==
        "LEFT"
    ) {

        direction = "RIGHT";

    }

}


/* =========================
   CREATE FOOD
========================= */

function createFood() {

    food = {

        x:
            Math.floor(
                Math.random() *
                boardSize
            ) * box,

        y:
            Math.floor(
                Math.random() *
                boardSize
            ) * box

    };


    /* Prevent food from
       spawning on snake */

    for (
        let part of snake
    ) {

        if (

            food.x === part.x &&
            food.y === part.y

        ) {

            createFood();

            return;

        }

    }

}


/* =========================
   DRAW GAME
========================= */

function drawGame() {

    ctx.fillStyle =
        "black";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    /* =====================
       DRAW SNAKE
    ===================== */

    for (
        let i = 0;
        i < snake.length;
        i++
    ) {

        ctx.fillStyle =
            i === 0
                ? "#00ff88"
                : "#00aa55";


        ctx.fillRect(

            snake[i].x,

            snake[i].y,

            box,

            box

        );

    }


    /* =====================
       DRAW FOOD
    ===================== */

    ctx.fillStyle =
        "red";


    ctx.fillRect(

        food.x,

        food.y,

        box,

        box

    );


    /* =====================
       NEW HEAD
    ===================== */

    let head = {

        x: snake[0].x,

        y: snake[0].y

    };


    if (
        direction ===
        "UP"
    ) {

        head.y -= box;

    }


    if (
        direction ===
        "DOWN"
    ) {

        head.y += box;

    }


    if (
        direction ===
        "LEFT"
    ) {

        head.x -= box;

    }


    if (
        direction ===
        "RIGHT"
    ) {

        head.x += box;

    }


    /* =====================
       GAME OVER
    ===================== */

    if (

        head.x < 0 ||

        head.y < 0 ||

        head.x >= canvas.width ||

        head.y >= canvas.height ||

        collision(
            head,
            snake
        )

    ) {

        gameOver();

        return;

    }


    snake.unshift(head);


    /* =====================
       FOOD EATEN
    ===================== */

    if (

        head.x === food.x &&

        head.y === food.y

    ) {

        score++;


        document.getElementById(
            "score"
        ).innerText =
            score;


        createFood();

    }

    else {

        snake.pop();

    }

}


/* =========================
   COLLISION
========================= */

function collision(
    head,
    body
) {

    for (
        let i = 0;
        i < body.length;
        i++
    ) {

        if (

            head.x ===
                body[i].x &&

            head.y ===
                body[i].y

        ) {

            return true;

        }

    }


    return false;

}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    clearInterval(game);


    gameRunning = false;


    document.getElementById(
        "message"
    ).innerText =
        "Game Over! Saving score...";


    document.querySelector(
        ".start-btn"
    ).disabled = false;


    document
        .querySelectorAll(
            ".speed-btn"
        )
        .forEach(
            button => {

                button.disabled =
                    false;

            }
        );


    saveScore();

}


/* =========================
   SAVE SCORE
========================= */

function saveScore() {

    fetch(

        API_URL +
        "/api/score",

        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify({

                    player:
                        playerName,

                    score:
                        score

                })

        }

    )

    .then(

        response =>
            response.json()

    )

    .then(

        data => {

            console.log(
                data
            );


            document.getElementById(
                "message"
            ).innerText =
                "Score saved successfully! ✅";


            loadLeaderboard();

        }

    )

    .catch(

        error => {

            console.error(
                "Score Error:",
                error
            );


            document.getElementById(
                "message"
            ).innerText =
                "Score saving failed ❌";

        }

    );

}


/* =========================
   LOAD LEADERBOARD
========================= */

function loadLeaderboard() {

    fetch(

        API_URL +
        "/api/scores"

    )

    .then(

        response =>
            response.json()

    )

    .then(

        data => {

            const leaderboard =
                document.getElementById(
                    "leaderboard"
                );


            leaderboard.innerHTML =
                "";


            if (
                data.length === 0
            ) {

                leaderboard.innerHTML = `

                    <tr>

                        <td colspan="3">
                            No scores yet
                        </td>

                    </tr>

                `;

                return;

            }


            data.forEach(

                (item, index) => {

                    const row =
                        document
                            .createElement(
                                "tr"
                            );


                    row.innerHTML = `

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${item.player}
                        </td>

                        <td>
                            ${item.score}
                        </td>

                    `;


                    leaderboard.appendChild(
                        row
                    );

                }

            );

        }

    )

    .catch(

        error => {

            console.error(
                "Leaderboard Error:",
                error
            );

        }

    );

}


/* =========================
   LOAD LEADERBOARD
   WHEN PAGE OPENS
========================= */

loadLeaderboard();