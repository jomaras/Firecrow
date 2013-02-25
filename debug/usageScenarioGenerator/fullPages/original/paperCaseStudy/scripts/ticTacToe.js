/*************** TIC TAC TOE ****************/
var ticTacToeTable = document.querySelector("#ticTacToeTable");
var ticTacToeCells = document.querySelectorAll("#ticTacToeTable td");
var ticTacToeButton = document.querySelector("#ticTacToeContainer .button");
var ticTacToeLabel = document.querySelector("#ticTacToeLabel");

var TicTacToe =
{
    numberOfPlayedGames: 0,
    moves: 0,
    cells: [],
    htmlCells: ticTacToeCells,

    startTickTackToeGame: function()
    {
        TicTacToe.resetUI();

        TicTacToe.isGameOver = false;
        ticTacToeLabel.textContent = "Playing";

        TicTacToe.numberOfPlayedGames++;

        for(var i = 0; i < TicTacToe.htmlCells.length; i++)
        {
            var ticTacToeCell = TicTacToe.htmlCells[i];

            ticTacToeCell.onclick = function()
            {
                if(this.children.length != 0 || TicTacToe.isGameOver)
                {
                    return;
                }

                TicTacToe.markHumanMove(this);
                TicTacToe.onTurnFinish();
            };
        };

        TicTacToe.moves = 0;
        TicTacToe.cells = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        TicTacToe.turn = "X";

        TicTacToe.onTurnStart();
    },

    switchTurn: function ()
    {
        this.turn = this.turn === 'X' ? 'O' : 'X';
    },

    onTurnFinish: function ()
    {
        this.gameResult = TicTacToe.checkGameOver(TicTacToe.cells);
        this.switchTurn();

        if (this.gameResult !== null)
        {
            this.onGameOver();
        }
        else
        {
            this.moves++;
            this.onTurnStart();
        }
    },

    onGameOver: function ()
    {
        if (this.gameResult['draw'])
        {
            ticTacToeLabel.textContent = "Draw!";
        }
        else
        {
            if(this.turn == "O")
            {
                ticTacToeLabel.textContent = "X WON!";
            }
            else
            {
                ticTacToeLabel.textContent = "O WON!";
            }

        }

        TicTacToe.isGameOver = true;
    },

    resetUI: function()
    {
        for(var i = 0; i < TicTacToe.htmlCells.length; i++)
        {
            var ticTacToeCell = TicTacToe.htmlCells[i];
            ticTacToeCell.innerHTML = "";
        }
    },

    getRandomInt: function (min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    markHumanMove: function(cell)
    {
        var imagePath = this.turn == "X" ? "images/X.png"
                                         : "images/O.png";

        TicTacToe.markMove(cell, imagePath);
    },

    _indexOfCell: function(cell)
    {
        for(var i = 0; i < TicTacToe.htmlCells.length; i++)
        {
            if(TicTacToe.htmlCells[i] == cell)
            {
                return {i: Math.floor(i/3), j: i%3 };
            }
        }
    },

    markMove: function(cell, imagePath)
    {
        var image = new Image();

        image.src = imagePath;

        cell.appendChild(image);

        var cellIndex = TicTacToe._indexOfCell(cell);

        TicTacToe.cells[cellIndex.i][cellIndex.j] = imagePath.indexOf("X") != -1 ? "X" : "O";
    },

    checkGameOver: function(grid)
    {
        // All possible winning combination patterns.
        var patterns =
        [
            [[0, 2], [0, 1], [0, 0]], // Left.
            [[0, 0], [1, 0], [2, 0]], // Top.
            [[2, 0], [2, 1], [2, 2]], // Right.
            [[2, 2], [1, 2], [0, 2]], // Bottom.
            [[0, 1], [1, 1], [2, 1]], // Horizontal middle.
            [[1, 0], [1, 1], [1, 2]], // Vertical middle.
            [[0, 0], [1, 1], [2, 2]], // Top-left to bottom-right.
            [[0, 2], [1, 1], [2, 0]]  // Bottom-left to top-right.
        ];

        for (var i = 0; i < patterns.length; i++)
        {
            var accumulative = '';

            for (var j = 0; j < patterns[i].length; j++)
            {
                var point = patterns[i][j];
                accumulative += grid[point[1]][point[0]];
            }

            if (accumulative === 'XXX' || accumulative === 'OOO')
                return {'draw': false, 'winner': accumulative[0], 'pattern': patterns[i]};
        }

        for (var y = 0; y < grid.length; y++)
        {
            for (var x = 0; x < grid[y].length; x++)
            {
                if (grid[y][x] === 0)
                    return null; // No draw yet, a move can still be made.
            }
        }

        return {'draw': true};
    }
};

ticTacToeButton.onclick = TicTacToe.startTickTackToeGame;