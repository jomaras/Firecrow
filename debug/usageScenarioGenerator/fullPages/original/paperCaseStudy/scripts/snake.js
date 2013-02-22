var snakeCanvas = document.getElementById("snakeCanvas");

var snakeStartButton = document.querySelector("#snakeContainer .startButton");
var snakeRestartButton = document.querySelector("#snakeContainer .restartButton");
var snakeDifficultySelector = document.querySelector("#snakeDifficultySelector");

snakeDifficultySelector.onchange = function()
{
    if(snakeDifficultySelector.value == "Normal")
    {
        Snake.difficulty = 1;
    }
    else if (snakeDifficultySelector.value == "Hard")
    {
        Snake.difficulty = 2;
    }
}

var _FC_lastRandom = 0, _FC_isRandomGrowing = true;
Math.myRandom = function()
{
    _FC_isRandomGrowing ? _FC_lastRandom += 0.02
                        : _FC_lastRandom -= 0.02;

    if(_FC_lastRandom >= 1) { _FC_lastRandom = 0.99; _FC_isRandomGrowing = false; }
    if(_FC_lastRandom <= 0) { _FC_lastRandom = 0.01; _FC_isRandomGrowing = true; }

    return _FC_lastRandom;
};

var Snake =
{
    snakeModel: { x: 20, y: 20, length: 2 },
    isActive: false,
    lastTimeoutId: -1,
    difficulty: 1,
    size: 20,

    startSnake: function()
    {
        clearTimeout(Snake.lastTimeoutId);

        var canvas = snakeCanvas, ctx = canvas.getContext('2d'),
            score = 0, level = 0, direction = 0,
            snake = new Array(3),
            speed = 500;

        Snake.isActive = true;

        // Initialize the matrix.
        var map = new Array(40);
        for (var i = 0; i < map.length; i++)
        {
            map[i] = new Array(40);
        }

        // Add the snake
        map = generateSnake(map);

        // Add the food
        map = generateFood(map);

        drawGame();

        document.onkeydown = function(e)
        {
            if (e.keyCode === 87 && direction !== 3)
            {
                direction = 2; // w
            }
            else if (e.keyCode === 83 && direction !== 2)
            {
                direction = 3; // s
            }
            else if (e.keyCode === 65 && direction !== 0)
            {
                direction = 1; // a
            }
            else if (e.keyCode === 68 && direction !== 1)
            {
                direction = 0; // d
            }
        };

        function drawGame()
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Traverse all the body pieces of the snake, starting from the last one
            for (var i = snake.length - 1; i >= 0; i--)
            {
                if (i === 0)
                {
                    switch(direction)
                    {
                        case 0: // Right
                            snake[0] = { x: snake[0].x + 1, y: snake[0].y }
                            break;
                        case 1: // Left
                            snake[0] = { x: snake[0].x - 1, y: snake[0].y }
                            break;
                        case 2: // Up
                            snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
                            break;
                        case 3: // Down
                            snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
                            break;
                    }

                    // Check that it's not out of bounds. If it is show the game over popup
                    // and exit the function.
                    if (snake[0].x < 0 || snake[0].x >= Snake.size || snake[0].y < 0 || snake[0].y >= Snake.size)
                    {
                        showGameOver();
                        return;
                    }

                    // Detect if we hit food and increase the score if we do,
                    // generating a new food position in the process, and also
                    // adding a new element to the snake array.
                    if (map[snake[0].x][snake[0].y] === 1)
                    {
                        score += 10;
                        map = generateFood(map);

                        // Add a new body piece to the array
                        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                        map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;

                        // If the score is a multiplier of 20
                        // increase the level, which will make it go faster.
                        if ((score % 20) == 0)
                        {
                            level += 1;
                        }

                        // Let's also check that the head is not hitting other part of its body
                        // if it does, we also need to end the game.
                    }
                    else if (map[snake[0].x][snake[0].y] === 2)
                    {
                        showGameOver();
                        return;
                    }

                    map[snake[0].x][snake[0].y] = 2;
                    map[snake[0].x][snake[0].y] = 3;
                }
                else
                {
                    // Remember that when they move, the body pieces move to the place
                    // where the previous piece used to be. If it's the last piece, it
                    // also needs to clear the last position from the matrix
                    if (i === (snake.length - 1))
                    {
                        map[snake[i].x][snake[i].y] = null;
                    }

                    snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
                    map[snake[i].x][snake[i].y] = 2;
                }
            }

            drawMain();

            // Start cycling the matrix
            for (var x = 0; x < map.length; x++)
            {
                for (var y = 0; y < map[0].length; y++)
                {
                    if (map[x][y] === 1)
                    {
                        ctx.fillStyle = 'gold';
                        drawHexagon(x * Snake.size, y * Snake.size + Snake.size, Snake.size);
                    }
                    else if (map[x][y] === 2)
                    {
                        ctx.fillStyle = 'green';
                        drawHexagon(x * Snake.size, y * Snake.size + Snake.size, Snake.size);
                    }
                    else if (map[x][y] === 3)
                    {
                        ctx.fillStyle = 'blue';
                        drawTriangle(x * Snake.size, y * Snake.size + Snake.size, Snake.size, direction);
                    }
                }
            }

            if (Snake.isActive)
            {
                Snake.lastTimeoutId = setTimeout(drawGame, speed - (level * 50 * Snake.difficulty));
            }
        }

        function drawMain()
        {
            ctx.lineWidth = 2; // Our border will have a thickness of 2 pixels
            ctx.strokeStyle = 'black'; // The border will also be black

            // The border is drawn on the outside of the rectangle, so we'll
            // need to move it a bit to the right and up. Also, we'll need
            // to leave a 20 pixels space on the top to draw the interface.
            ctx.strokeRect(2, 20, canvas.width - 4, canvas.height - 24);

            ctx.fillStyle = 'black';
            ctx.font = '12px sans-serif';
            ctx.fillText('Score: ' + score + ' - Level: ' + level, 2, 12);
        }

        function drawTriangle(x, y, size, direction)
        {
            ctx.beginPath();

            if(direction == 0)//right
            {
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y + size/2);
                ctx.lineTo(x, y + size);
            }
            else if(direction == 1)//Left
            {
                ctx.moveTo(x + size, y);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x, y + size/2);
            }
            else if(direction == 2)//Up
            {
                ctx.moveTo(x, y + size);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x + size/2, y);
            }
            else if(direction == 3)//Down
            {
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size/2, y + size);
            }

            ctx.closePath();
            ctx.fill();
        }


        function drawCircle(x, y, r)
        {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2*Math.PI);
            ctx.stroke();
        }

        function drawHexagon(startX, startY, dimension)
        {
            ctx.beginPath();
            ctx.moveTo(startX + 0.33*dimension, startY);
            ctx.lineTo(startX + 0.66*dimension, startY);
            ctx.lineTo(startX + dimension, startY + 0.33*dimension);
            ctx.lineTo(startX + dimension, startY + 0.66*dimension);
            ctx.lineTo(startX + 0.66*dimension, startY + dimension);
            ctx.lineTo(startX + 0.33*dimension, startY + dimension);
            ctx.lineTo(startX, startY + 0.66*dimension);
            ctx.lineTo(startX, startY + 0.33*dimension);
            ctx.closePath();
            ctx.fill();
        }

        function generateFood(map)
        {
            // Generate a random position for the rows and the columns.
            var rndX = Math.round(Math.myRandom() * 19),
                rndY = Math.round(Math.myRandom() * 19);

            // We also need to watch so as to not place the food
            // on the a same matrix position occupied by a part of the
            // snake's body.
            while (map[rndX][rndY] === 2) {
                rndX = Math.round(Math.myRandom() * 19);
                rndY = Math.round(Math.myRandom() * 19);
            }

            map[rndX][rndY] = 1;

            return map;
        }

        function generateSnake(map)
        {
            // Generate a random position for the row and the column of the head.
            var rndX = Math.round(Math.myRandom() * 19),
                rndY = Math.round(Math.myRandom() * 19);

            // Let's make sure that we're not out of bounds as we also need to make space to accomodate the
            // other two body pieces
            while ((rndX - snake.length) < 0) {
                rndX = Math.round(Math.myRandom() * 19);
            }

            for (var i = 0; i < snake.length; i++)
            {
                snake[i] = { x: rndX - i, y: rndY };
                map[rndX - i][rndY] = 2;
            }

            return map;
        }

        function showGameOver()
        {
            // Disable the game.
            Snake.isActive = false;

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'black';
            ctx.font = '16px sans-serif';

            ctx.fillText('Game Over!', ((canvas.width / 2) - 44), 50);

            ctx.font = '12px sans-serif';

            ctx.fillText('Your Score Was: ' + score, ((canvas.width / 2) - 70), 70);
        }
    },

    pauseSnake: function()
    {
        snakeStartButton.onclick = Snake.resumeSnake;
        snakeStartButton.textContent = "Resume";
    },

    resumeSnake: function()
    {
        snakeStartButton.textContent = "Pause";
        snakeStartButton.onclick = Snake.pauseSnake;
    }
};

snakeStartButton.onclick = Snake.startSnake;