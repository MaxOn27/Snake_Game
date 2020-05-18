// variables
const stageHeight = 480;
const stageWidth = 480;
const snake = [];
let apple;
const direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
};
const baseSnakeSize = 3;
const snakeStartCoord = { x: 0, y: 0 };
const cellSize = 32;
let score = 0;

window.onload = () => {
    //Creating application
    const app = new PIXI.Application({
        width: stageWidth,
        height: stageHeight,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
    });
    document.body.appendChild(app.view);
    const container = new PIXI.Container();
    app.stage.addChild(container);

    let isGameRunning = false;

    //Score pointer
    let scoreText = new PIXI.Text('Score: ' + score, {
        fontFamily: 'Arial',
        fontSize: 24,
        align: 'center',
        x: 10,
        y: 10,
    });
    app.stage.addChild(scoreText);

    let snakeDirection = direction.RIGHT;
    let prevSnakeDirection = snakeDirection;
    let isAppleEaten = false;

    //Uploading Textures
    const headTexture = PIXI.Texture.from('img/head.png');
    const appleTexture = PIXI.Texture.from('img/apple.png');
    const bodyTexture = PIXI.Texture.from('img/body.png');
    const turnTexture = PIXI.Texture.from('img/bodyTurn.png');
    const startTexture = PIXI.Texture.from('img/start.png');
    const tailTexture = PIXI.Texture.from('img/tail.png');

    let button = new PIXI.Sprite(startTexture);
    button.anchor.set(0.5);
    button.x = app.view.width / 2.5;
    button.y = app.view.height / 2.5;
    button.scale.set(0.5, 0.5);
    button.interactive = true;
    button.buttonMode = true;
    container.addChild(button);
    button.on('click', start);

    //Snake controlling
    document.addEventListener('keydown', onKeyDown);

    //start
    function start() {
        if (button) {
            
            container.removeChild(button);
            //Snake

            //Apple
            apple = new PIXI.Sprite(appleTexture);
            apple.anchor.set(0.5);
            apple.x = app.view.width / 2;
            apple.y = app.view.height / 2;
            apple.scale.set(0.5, 0.5);
            container.addChild(apple);
            appleSpawn();
            createBaseSnake();
            isGameRunning = true;
        }
    }

    //Snake velocity
    let timer = 0;
    app.ticker.add((delta) => {
        if (timer >= 200) {
            if (isGameRunning) {
                moveSnake();
            }
            timer = 0;
        } else {
            timer += app.ticker.elapsedMS;
        }
    });

    function createBaseSnake() {
        for (let i = baseSnakeSize - 1; i >= 0; i--) {
            let texture = '';

            if (i === 0) {
                texture = tailTexture;
            } else if (i === baseSnakeSize - 1) {
                texture = headTexture;
            } else {
                texture = bodyTexture;
            }

            let snakePart = new PIXI.Sprite(texture);
            snakePart.anchor.set(0.5);
            snakePart.x = (snakeStartCoord.x + i) * cellSize + cellSize / 2;
            snakePart.y = snakeStartCoord.y * cellSize + cellSize / 2;
            snakePart.scale.set(0.5, 0.5);
            container.addChild(snakePart);
            snake.push(snakePart);
        }
    }

    //Game over
    function checkNextEl(dir) {
        let nexCoords = {};
        switch (dir) {
            case direction.RIGHT:
                nexCoords.x = snake[0].x + cellSize;
                nexCoords.y = snake[0].y;
                break;
            case direction.LEFT:
                nexCoords.x = snake[0].x - cellSize;
                nexCoords.y = snake[0].y;
                break;
            case direction.UP:
                nexCoords.x = snake[0].x;
                nexCoords.y = snake[0].y - cellSize;
                break;
            case direction.DOWN:
                nexCoords.x = snake[0].x;
                nexCoords.y = snake[0].y + cellSize;
                break;
        }
        snake.forEach(function (val, i) {
            if (val.x === nexCoords.x && val.y === nexCoords.y) {
                isGameRunning = false;
                const style = new PIXI.TextStyle({
                    textAlign: 'center',
                    fontFamily: 'Arial',
                    fontSize: 36,
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    stroke: '#4a1850',
                    strokeThickness: 5,
                    dropShadow: true,
                    dropShadowColor: '#000000',
                    dropShadowBlur: 4,
                    dropShadowAngle: Math.PI / 6,
                    dropShadowDistance: 10,
                    wordWrap: true,
                    wordWrapWidth: 440,
                });
                let GameOver = new PIXI.Text('GAME OVER', style);
                GameOver.anchor.set(0.5);
                GameOver.x = app.view.width / 2.5;
                GameOver.y = app.view.height / 2.5;
                app.stage.addChild(GameOver);
            }
        });
    }

    function moveSnake() {
        let tail = '';
        checkNextEl(snakeDirection);
        if (isGameRunning) {
            switch (snakeDirection) {
                case direction.RIGHT:
                    if (snakeDirection === prevSnakeDirection) {
                        snake[0].texture = bodyTexture;
                        snake[0].angle = 0;
                    } else {
                        snake[0].texture = turnTexture;
                        if (prevSnakeDirection === direction.UP) {
                            snake[0].angle = 0;
                        } else if (prevSnakeDirection === direction.DOWN) {
                            snake[0].angle = 270;
                        }
                    }

                    if (!isAppleEaten) {
                        tail = snake.pop();
                    } else {
                        tail = new PIXI.Sprite(tailTexture);
                        tail.anchor.set(0.5);
                        tail.scale.set(0.5, 0.5);
                        container.addChild(tail);
                        isAppleEaten = false;
                    }
                    tail.texture = headTexture;
                    tail.angle = 0;
                    if (snake[0].x + cellSize > stageWidth) {
                        tail.x = cellSize / 2;
                    } else {
                        tail.x = snake[0].x + cellSize;
                    }
                    tail.y = snake[0].y;
                    snake.unshift(tail);

                    snake[snake.length - 1].texture = tailTexture;

                    if (snake[snake.length - 2].texture !== turnTexture) {
                        snake[snake.length - 1].angle =
                            snake[snake.length - 2].angle;
                    }
                    break;
                case direction.LEFT:
                    if (snakeDirection === prevSnakeDirection) {
                        snake[0].texture = bodyTexture;
                        snake[0].angle = 180;
                    } else {
                        snake[0].texture = turnTexture;
                        if (prevSnakeDirection === direction.UP) {
                            snake[0].angle = 90;
                        } else if (prevSnakeDirection === direction.DOWN) {
                            snake[0].angle = 180;
                        }
                    }

                    if (!isAppleEaten) {
                        tail = snake.pop();
                    } else {
                        tail = new PIXI.Sprite(tailTexture);
                        tail.anchor.set(0.5);
                        tail.scale.set(0.5, 0.5);
                        container.addChild(tail);
                        isAppleEaten = false;
                    }
                    tail.texture = headTexture;
                    tail.angle = 180;
                    if (snake[0].x - cellSize <= 0) {
                        tail.x = stageWidth - cellSize / 2;
                    } else {
                        tail.x = snake[0].x - cellSize;
                    }
                    tail.y = snake[0].y;
                    snake.unshift(tail);

                    snake[snake.length - 1].texture = tailTexture;
                    if (snake[snake.length - 2].texture !== turnTexture) {
                        snake[snake.length - 1].angle =
                            snake[snake.length - 2].angle;
                    }
                    break;
                case direction.UP:
                    if (snakeDirection === prevSnakeDirection) {
                        snake[0].texture = bodyTexture;
                        snake[0].angle = 270;
                    } else {
                        snake[0].texture = turnTexture;
                        if (prevSnakeDirection === direction.LEFT) {
                            snake[0].angle = 270;
                        } else if (prevSnakeDirection === direction.RIGHT) {
                            snake[0].angle = 180;
                        }
                    }

                    if (!isAppleEaten) {
                        tail = snake.pop();
                    } else {
                        tail = new PIXI.Sprite(tailTexture);
                        tail.anchor.set(0.5);
                        tail.scale.set(0.5, 0.5);
                        container.addChild(tail);
                        isAppleEaten = false;
                    }
                    tail.texture = headTexture;
                    tail.angle = 270;

                    if (snake[0].y - cellSize <= 0) {
                        tail.y = stageHeight - cellSize / 2;
                    } else {
                        tail.y = snake[0].y - cellSize;
                    }
                    tail.x = snake[0].x;
                    snake.unshift(tail);

                    snake[snake.length - 1].texture = tailTexture;
                    if (snake[snake.length - 2].texture !== turnTexture) {
                        snake[snake.length - 1].angle =
                            snake[snake.length - 2].angle;
                    }
                    break;
                case direction.DOWN:
                    if (snakeDirection === prevSnakeDirection) {
                        snake[0].texture = bodyTexture;
                        snake[0].angle = 90;
                    } else {
                        snake[0].texture = turnTexture;
                        if (prevSnakeDirection === direction.LEFT) {
                            snake[0].angle = 0;
                        } else if (prevSnakeDirection === direction.RIGHT) {
                            snake[0].angle = 90;
                        }
                    }

                    if (!isAppleEaten) {
                        tail = snake.pop();
                    } else {
                        tail = new PIXI.Sprite(tailTexture);
                        tail.anchor.set(0.5);
                        tail.scale.set(0.5, 0.5);
                        container.addChild(tail);
                        isAppleEaten = false;
                    }
                    tail.texture = headTexture;
                    tail.angle = 90;
                    tail.x = snake[0].x;
                    tail.y = snake[0].y + cellSize;

                    if (snake[0].y + cellSize > stageHeight) {
                        tail.y = cellSize / 2;
                    } else {
                        tail.y = snake[0].y + cellSize;
                    }
                    snake.unshift(tail);

                    snake[snake.length - 1].texture = tailTexture;
                    if (snake[snake.length - 2].texture !== turnTexture) {
                        snake[snake.length - 1].angle =
                            snake[snake.length - 2].angle;
                    }
                    break;
            }

            prevSnakeDirection = snakeDirection;

            checkPosition();
        }
    }

    function appleSpawn() {
        let randomX = randomInteger(0, 14);
        let randomY = randomInteger(0, 14);

        apple.x = cellSize / 2 + cellSize * randomX;
        apple.y = cellSize / 2 + cellSize * randomY;
    }

    function randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    function checkPosition() {
        if (
            apple.position.x === snake[0].position.x &&
            apple.position.y === snake[0].position.y
        ) {
            isAppleEaten = true;
            appleSpawn();
            score += 100;
            scoreText.text = 'Score: ' + score;
        }
    }

    function onKeyDown(key) {
        if (
            (key.keyCode === 87 || key.keyCode === 38) &&
            snakeDirection !== direction.DOWN
        ) {
            snakeDirection = direction.UP;
        }

        if (
            (key.keyCode === 83 || key.keyCode === 40) &&
            snakeDirection !== direction.UP
        ) {
            snakeDirection = direction.DOWN;
        }

        if (
            (key.keyCode === 65 || key.keyCode === 37) &&
            snakeDirection !== direction.RIGHT
        ) {
            snakeDirection = direction.LEFT;
        }

        if (
            (key.keyCode === 68 || key.keyCode === 39) &&
            snakeDirection !== direction.LEFT
        ) {
            snakeDirection = direction.RIGHT;
        }
    }
};
