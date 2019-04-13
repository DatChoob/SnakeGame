//Update these variables 
// width/height of each square in the grid
let scale = 10;
let canvasWidth = 500;
let canvasHeight = 500;

var food;
let snake;
let poisons = new Array();
let scoreSpan;
let ticks = 0;


function setup() {
    createCanvas(canvasWidth, canvasHeight);
    createFood();
    snake = new Snake();
    frameRate(15);
    scoreSpan = createSpan(snake.total).size(100, 100);
}

function draw() {
    background(color(204, 204, 255));
    if (snake.eat(food)) {
        createFood();
    }
    if (snake.eatPoison(poisons)) {
        snake.died();
        poisons = [];
    }

    drawPoisons();
    drawFood();

    snake.death();
    snake.update();
    snake.draw();
    scoreSpan.html(snake.total);
    ticks++;

    if (ticks % 50 == 0) {
        poisons.push(createPoison());
    }
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        snake.changeDirection(0, -1);
    } else if (keyCode === DOWN_ARROW) {
        snake.changeDirection(0, 1);
    } else if (keyCode === RIGHT_ARROW) {
        snake.changeDirection(1, 0);
    } else if (keyCode === LEFT_ARROW) {
        snake.changeDirection(-1, 0);
    }
}

function drawFood() {
    fill(0, 255, 100);
    rect(food.x, food.y, scale, scale);
}
function drawPoisons() {
    fill(255, 0, 0);

    for (let j = 0; j < poisons.length; j++) {
        rect(poisons[j].x, poisons[j].y, scale, scale);
    }
}
function createFood() {
    food = createVector(floor(random(canvasWidth / scale)), floor(random(canvasHeight / scale)));
    food.mult(scale);
}

function createPoison() {
    poison = createVector(floor(random(canvasWidth / scale)), floor(random(canvasHeight / scale)));
    poison.mult(scale);
    return poison;
}



class Snake {


    constructor() {
        this.position = createVector(floor(random(canvasWidth / scale)), floor(random(canvasHeight / scale)));
        this.speed = createVector(0, -1);
        this.tail = []
        this.total = 0;

    }


    changeDirection(x, y) {
        this.speed = createVector(x, y);
    }

    eat(foodPosition) {
        let collision = (
            this.position.x < foodPosition.x + scale &&
            this.position.x + scale > foodPosition.x &&
            this.position.y < foodPosition.y + scale &&
            this.position.y + scale > foodPosition.y);

        if (collision) {
            this.total++;
            return true;
        } else {
            return false;
        }
    }
    eatPoison(poisons) {
        for (let i = 0; i < poisons.length; i++) {
            let collision = (
                this.position.x < poisons[i].x + scale &&
                this.position.x + scale > poisons[i].x &&
                this.position.y < poisons[i].y + scale &&
                this.position.y + scale > poisons[i].y);

            if (collision) {
                return true;
            }
        }
        return false;
    }


    death() {
        for (var i = 0; i < this.tail.length; i++) {
            var pos = this.tail[i];
            var d = dist(this.position.x, this.position.y, pos.x, pos.y);
            if (d < 1) {
                this.died();
            }
        }
    }
    died() {
        alert("YOU FAILED");
        this.total = 0;
        this.tail = [];
    }

    update() {
        for (var i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        if (this.total >= 1) {
            this.tail[this.total - 1] = createVector(this.position.x, this.position.y);
        }

        this.position.x = this.position.x + (this.speed.x * scale);
        this.position.y = this.position.y + (this.speed.y * scale);
        if (this.position.x < - scale / 2) {
            this.position.x = canvasWidth - scale / 2;
        } else if (this.position.x > canvasWidth - scale / 2) {
            this.position.x = 0;
        } else if (this.position.y < - scale / 2) {
            this.position.y = canvasHeight - scale / 2;
        } else if (this.position.y > canvasHeight - scale / 2) {
            this.position.y = 0;
        }
 
        this.position.x = constrain(this.position.x, 0, width - scale);
        this.position.y = constrain(this.position.y, 0, height - scale);
    }


    draw() {
        fill(0, 0, 0);
        rect(this.position.x, this.position.y, scale, scale);
        this.tail.forEach((tailBlock, index) => {
            rect(tailBlock.x, tailBlock.y, scale, scale);
        });
    }

}