// grab the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var fishImage = new Image();
fishImage.src = "IMG_6571-removebg-preview.png"

var balloonImage = new Image();
balloonImage.src = "IMG_6577-removebg-preview.png"

var seaweedImage = new Image();
seaweedImage.src = "Screenshot_2026-11-15_175736-removebg-preview.png"

var balloons = [];
var ROWS = 3;
var COLS = 9;

var cakeImage = new Image();
cakeImage.src = "IMG_6575-removebg-preview.png"

var cake = {
    x: 360,
    y: -20,
    w: 150,
    h: 180
};

var startScreen = document.getElementById("startScreen");
var gameRunning = false;
var explosionActive = false;
var gameOver = false;

var fishScreenActive = false;
var eatPrompt = document.getElementById("eatPrompt");
var btnEat = document.getElementById("btnEat");
var gameOverMessage = document.getElementById("gameOverMessage");
var fishInstruction = document.getElementById("fishInstruction");
var oopsMessage = document.getElementById("oopsMessage");

var btnStart = document.getElementById("btnStart");
var btnRestart = document.getElementById("btnRestart");

var parts = [];

var paddle = {
    x: 0,
    y: 560,
    width: 200,
    height: 45,
    spd: 8
};

var fish = {
    x: 200, y: 200,
    vx: 4, vy: -4,
    radius: 43,
    sqX: 1,
    sqY: 1
};

var keys = { left: false, right: false };

canvas.addEventListener("click", function(e) {
    if (!fishScreenActive || explosionActive) return;

    var rect = canvas.getBoundingClientRect();

    var mouseX = (e.clientX - rect.left) * canvas.width / rect.width;
    var mouseY = (e.clientY - rect.top) * canvas.height / rect.height;

    var dx = mouseX - fish.x;
    var dy = mouseY - fish.y;

    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < fish.radius) {
        fish.radius += 12;

        if (fish.radius >= 140) {
            explosionActive = true;

            createParticles(fish.x, fish.y, 80, 18, ["pink", "purple", "yellow", "cyan", "green"]);
        }
    }
});

document.addEventListener("keydown", function(e) {

    if (e.key == "ArrowLeft" || e.key == "a") keys.left = true;
    if (e.key == "ArrowRight" || e.key == "d") keys.right = true;
});

document.addEventListener("keyup", function(e) {

    if (e.key == "ArrowLeft" || e.key == "a") keys.left = false;
    if (e.key == "ArrowRight" || e.key == "d") keys.right = false;
});

window.addEventListener("resize", function() {
    resizeCanvas();
});

// button handlers
btnStart.onclick = function() {
    startScreen.style.display = "none";
    btnRestart.style.display = "block";

    parts = [];
    gameOver = false;
    explosionActive = false;

    gameRunning = true;

    resizeCanvas();
    buildBalloons();
    resetFish();
};

btnRestart.onclick = function() {
    location.reload();
};

btnEat.onclick = function() {
    fishInstruction.style.display = "block";
    eatPrompt.style.display = "none";

    fishScreenActive = true;
    explosionActive = false;
    parts = [];

    fish.x = canvas.width / 2;
    fish.y = canvas.height / 2;
    fish.vx = 4;
    fish.vy = -4;
    fish.radius = 43;
    fish.sqX = 1;
    fish.sqY = 1;
};


function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function buildBalloons() {
    balloons = []; // clear first
    var spacing = 8;
    var balloonW = (canvas.width - 60) / COLS - spacing;
    var balloonH = 50;
    for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
            var bx = 20 + c * (balloonW + spacing);
            var by = 150 + r * (balloonH + spacing);
            balloons.push({ x: bx, y: by, w: balloonW, h: balloonH, alive: true });
        }
    }
}

function resetFish() {
    fish.x = canvas.width / 2;
    fish.y = canvas.height / 1.2;
    fish.vx = 4;
    fish.vy = -4;
    fish.sqX = 1;
    fish.sqY = 1;
    paddle.x = canvas.width / 2 - paddle.width / 2;
}


function createParticles(x, y, count, speed, colors) {
    for (var i = 0; i < count; i++) {
        parts.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed,
            alpha: 1,
            col: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function updateAndDrawParticles() {
    var stillAlive = [];
    for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha > 0) {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.col;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            stillAlive.push(p);
        }
    }
    ctx.globalAlpha = 1;
    parts = stillAlive;
}

function doImpact(dir) {
    if (dir == "horiz") {
        fish.sqX = 0.65;
        fish.sqY = 1.35;
    } else {
        fish.sqX = 1.35;
        fish.sqY = 0.65;
    }

    createParticles(fish.x, fish.y, 12, 6, ["DeepPink"]);
}

function drawBalloons() {
    for (var i = 0; i < balloons.length; i++) {
        var b = balloons[i];

        if (!b.alive) continue;

        ctx.drawImage(
            balloonImage,
            b.x,
            b.y,
            b.w,
            b.h
        );
    }
}

function drawPaddle() {
    ctx.drawImage(
        seaweedImage, 
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height
    );
}


function drawFish() {
    ctx.save();
    ctx.translate(fish.x, fish.y);
    ctx.scale(fish.sqX, fish.sqY);
    ctx.drawImage(
        fishImage,
        -fish.radius,
        -fish.radius,
        fish.radius * 2,
        fish.radius * 2
    );
    ctx.restore();
}

function drawCake() {
    ctx.drawImage(
        cakeImage,
        cake.x,
        cake.y,
        cake.w,
        cake.h
    );
}

function updatePaddle() {
    if (keys.left) paddle.x -= paddle.spd;
    if (keys.right) paddle.x += paddle.spd;
    // clamp to screen
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function updateFish() {
    fish.x += fish.vx;
    fish.y += fish.vy;

    // wall bounces
    if (fish.x - fish.radius < 0 || fish.x + fish.radius > canvas.width) {
        fish.vx *= -1;
        doImpact("horiz");
    }
    if (fish.y - fish.radius < 0) {
        fish.vy *= -1;
        doImpact("vert");
    }

    // paddle collision
    // check if fish is at paddle height and within x range and moving downward
    if (fish.vy > 0 &&
        fish.y + fish.radius >= paddle.y &&
        fish.x > paddle.x &&
        fish.x < paddle.x + paddle.width)
    {
        // angle depends on where it hits the paddle
        var hitPos = (fish.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        fish.vx = hitPos * 5;
        fish.vy = fish.vy * -1;
        doImpact("vert");
    }

        // fell off the bottom - game over
    if (fish.y > canvas.height - fish.radius / 3) {
        gameRunning = false;
        gameOver = true;

        gameOverMessage.style.display = "block";
    }

    fish.sqX += (1 - fish.sqX) * 0.15;
    fish.sqY += (1 - fish.sqY) * 0.15;
}

function checkBalloonCollisions() {
    for (var i = 0; i < balloons.length; i++) {
        var b = balloons[i];
        if (!b.alive) continue;

        // nearest point on balloon rect to fish center
        var nearX = Math.max(b.x, Math.min(fish.x, b.x + b.w));
        var nearY = Math.max(b.y, Math.min(fish.y, b.y + b.h));

        var distX = fish.x - nearX;
        var distY = fish.y - nearY;
        var dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < fish.radius) {
            b.alive = false;
            fish.vy *= -1;
            doImpact("vert");
            createParticles(b.x + b.w / 2, b.y + b.h / 2, 12, 6, ["pink"]);
            break;
        }
    }
}

function checkCakeCollision() {

    if (gameOver) return;

    var nearX = Math.max(cake.x, Math.min(fish.x, cake.x + cake.w));
    var nearY = Math.max(cake.y, Math.min(fish.y, cake.y + cake.h));

    var distX = fish.x - nearX;
    var distY = fish.y - nearY;

    var dist = Math.sqrt(distX * distX + distY * distY);

    if (dist < fish.radius * 0.5) {

    gameOver = true;
    gameRunning = false;
    parts = [];
    createParticles(cake.x + cake.w / 2, cake.y + cake.h / 2, 70, 15, ["pink", "purple", "yellow", "cyan", "green"]);
    setTimeout(function() {
            eatPrompt.style.display = "flex";
        }, 1500);
    }
}

function gameLoop() {

    requestAnimationFrame(gameLoop);

    if (!gameRunning && !explosionActive && !fishScreenActive && !gameOver) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Special fish-growing screen
    if (fishScreenActive) {

        if (explosionActive) {
            updateAndDrawParticles();

            if (parts.length == 0) {
                explosionActive = false;
                fishScreenActive = false;
                        
                oopsMessage.style.display = "block";
            }
        } else {
            drawFish();
        }

        return;
    }

    if (gameOver && !fishScreenActive) {
    updateAndDrawParticles();
    return;
    }

    drawCake();

    if (explosionActive) {
        updateAndDrawParticles();

        if (parts.length == 0) {
            explosionActive = false;
        }

        return;
    }

    updatePaddle();
    updateFish();

    checkBalloonCollisions();
    checkCakeCollision();

    updateAndDrawParticles();
    drawBalloons();
    drawPaddle();
    drawFish();

}


// init
resizeCanvas();
buildBalloons();
resetFish();
gameLoop()
