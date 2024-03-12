function startGame() {
    window.location.href = 'game.html'; // Redirect to the Breakout game page
}

const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let dx = 2;
let dy = -2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let gameOver = false;
let gameWon = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    if (bricks.every(row => row.every(cell => cell.status === 0))) {
                        gameWon = true;
                        gameOver = true;
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        drawBricks();
        drawPaddle();
        drawBall();
        collisionDetection();

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
            dx = -dx;
        }

        if (ballY + dy < ballRadius) {
            dy = -dy;
        } else if (ballY + dy > canvas.height - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                gameOver = true;
                setTimeout(() => {
                    if (gameWon) {
                        alert("Congratulations! You won!");
                    } else {
                        alert("Game Over! You lost.");
                    }
                    document.location.reload();
                }, 1000);
            }
        }

        ballX += dx;
        ballY += dy;

        requestAnimationFrame(draw);
    } else {
        if (gameWon) {
            ctx.font = "30px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText("Congratulations! You won!", canvas.width / 2 - 200, canvas.height / 2);
        } else {
            ctx.font = "30px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText("Game Over! You lost.", canvas.width / 2 - 150, canvas.height / 2);
        }
    }
}

draw();
