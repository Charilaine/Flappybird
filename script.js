
    let board;
    let boardWidth = 1500;
    let boardHeight = 800;
    let context;
    
    let birdWidth = 50;
    let birdHeight = 30;
    let birdX = boardWidth / 8;
    let birdY = boardHeight / 2;
    let birdImg;
    
    let bird = {
        x: birdX,
        y: birdY,
        width: birdWidth,
        height: birdHeight
    };
    
    let pipeArray = [];
    let pipeWidth = 64;
    let pipeHeight = 512;
    let pipeX = boardWidth;
    let pipeY = 0;
    
    let topPipeImg;
    let bottomPipeImg;
    
    let velocityX = -2;
    let velocityY = 0;
    let gravity = 0.4;
    
    let gameOver = false;
    let score = 0;
    let highscore = 0;
    
    window.onload = function () {
        board = document.getElementById("board");
        board.height = boardHeight;
        board.width = boardWidth;
        context = board.getContext("2d");
    
        birdImg = new Image();
        birdImg.src = "Images/flappybird.png";
        birdImg.onload = function () {
            context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        };
    
        topPipeImg = new Image();
        topPipeImg.src = "Images/toppipe.png";
    
        bottomPipeImg = new Image();
        bottomPipeImg.src = "Images/bottompipe.png";
    
        requestAnimationFrame(update);
        setInterval(placePipes, 1500);
        document.addEventListener("keydown", moveBird);
    };
    
    function update() {
        requestAnimationFrame(update);
        if (gameOver) {
            return;
        }
        context.clearRect(0, 0, board.width, board.height);
    
        velocityY += gravity;
        bird.y = Math.max(bird.y + velocityY, 0);
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    
        if (bird.y > board.height) {
            gameOver = true;
            updateHighscore();
        }
    
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    
            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 0.5;
                pipe.passed = true;
                updateHighscore();
            }
    
            if (detectCollision(bird, pipe)) {
                gameOver = true;
                updateHighscore();
            }
        }
    
        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
            pipeArray.shift();
        }
    
        context.fillStyle = "green";
        context.font = "45px sans-serif";
        context.fillText("Score: " + score, 10, 50);
        context.fillText("Highscore: " + highscore, 10, 100);
    
        if (gameOver) {
            context.fillText("GAME OVER", 10, 150);
        }
    }
    
    function placePipes() {
        if (gameOver) {
            return;
        }
    
        let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
        let openingSpace = board.height / 4;
    
        let topPipe = {
            img: topPipeImg,
            x: pipeX,
            y: randomPipeY,
            width: pipeWidth,
            height: pipeHeight,
            passed: false
        };
        pipeArray.push(topPipe);
    
        let bottomPipe = {
            img: bottomPipeImg,
            x: pipeX,
            y: randomPipeY + pipeHeight + openingSpace,
            width: pipeWidth,
            height: pipeHeight,
            passed: false
        };
        pipeArray.push(bottomPipe);
    }
    
    function moveBird(e) {
        if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
            velocityY = -6;
    
            if (gameOver) {
                bird.y = birdY;
                pipeArray = [];
                score = 0;
                gameOver = false;
            }
        }
    }
    
    function detectCollision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }
    
    function updateHighscore() {
        if (score > highscore) {
            highscore = score;
        }
    }
    