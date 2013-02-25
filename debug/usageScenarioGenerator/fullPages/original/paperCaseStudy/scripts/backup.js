/*************** TIC TAC TOE ****************/
var ticTacToeTable = document.querySelector("#ticTacToeTable");
var ticTacToeCells = document.querySelectorAll("#ticTacToeTable td");
var ticTacToeButton = document.querySelector("#ticTacToeContainer .button");
var ticTacToeLabel = document.querySelector("#ticTacToeLabel");
var ticTacToeSelector = document.querySelector("#ticTacToePlayerSelection");
var ticTacToeDifficultySelector = document.querySelector("#ticTacToeDifficultySelection");

ticTacToeDifficultySelector.onchange = function()
{
    if(ticTacToeDifficultySelector.value == "Easy")
    {
        TicTacToe.difficulty = "Easy";
    }
    else
    {
        TicTacToe.difficulty = "Intermediate";
    }
};

var TicTacToe =
{
    numberOfPlayedGames: 0,
    moves: 0,
    cells: [],
    htmlCells: ticTacToeCells,
    difficulty: "Easy",

    isPlayerX: function() { return this.numberOfPlayedGames % 2 == 1; },

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

        TicTacToe.artificialIntelligence = new TicTacToe.AIConstructor(TicTacToe.isPlayerX() ? "O" : "X");

        TicTacToe.onTurnStart();
    },

    onTurnStart: function()
    {
        if (this.turn === this.artificialIntelligence.side)
        {
            TicTacToe.playComputerMove();
        }
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
            ticTacToeLabel.textContent = "You Lost!";
        }

        TicTacToe.isGameOver = true;
    },

    resetUI: function()
    {
        for(var i = 0; i < TicTacToe.htmlCells.length; i++)
        {
            var ticTacToeCell = TicTacToe.htmlCells[i];
            ticTacToeCell.onclick = null;
            ticTacToeCell.innerHTML = "";
        }
    },

    playComputerMove: function()
    {
        var move = this.artificialIntelligence.calculateMove(this.cells);

        TicTacToe.markComputerMove(TicTacToe.htmlCells[move[1]*3 + move[0]]);

        this.onTurnFinish();
    },

    markHumanMove: function(cell)
    {
        var imagePath = this.isPlayerX() ? "images/X.png"
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

    markComputerMove: function(cell)
    {
        var imagePath = !this.isPlayerX() ? "images/X.png"
                                          : "images/O.png";
        TicTacToe.markMove(cell, imagePath);
    },

    markMove: function(cell, imagePath)
    {
        var image = new Image();

        image.src = imagePath;

        cell.appendChild(image);

        var cellIndex = TicTacToe._indexOfCell(cell);

        TicTacToe.cells[cellIndex.i][cellIndex.j] = imagePath.indexOf("X") != -1 ? "X" : "O";
    },

    AIConstructor: function(side)
    {
        this.infinity = 99;
        this.side = side;

        this.calculateMove = function (grid)
        {
            function isGridEmpty(grid)
            {
                for (var y = 0; y < grid.length; y++)
                {
                    for (var x = 0; x < grid[y].length; x++)
                    {
                        if (grid[y][x] !== 0) // Cell not empty?
                            return false;
                    }
                }

                return true;
            }

            if (isGridEmpty(grid))
            {
                return [1, 1];
            }

            grid = grid.slice(0); // Make a copy.
            grid[0] = grid[0].slice(0);
            grid[1] = grid[1].slice(0);
            grid[2] = grid[2].slice(0);

            var move = this._search(grid, this.side, 0, -this.infinity, +this.infinity);

            if (move === 0)
                throw 'ArtificialIntelligence.calculateMove: drawn game, no move found.';

            return move;
        };

        this._search = function (grid, side, height, alpha, beta)
        {
            var value = this._nodeValue(grid, side);

            if (value !== 0)
            {
                if (value > 0)
                {
                    return value - height;
                }
                else
                {
                    return value + height;
                }
            }

            var moves = this._generateMoves(grid);
            if (moves.length === 0)
                return value; // Draw.

            var bestMove;
            var otherSide = side === 'X' ? 'O' : 'X';

            for (var i = 0; i < moves.length; i++)
            {
                var move = moves[i];

                this._makeMove(grid, move, side);

                var alphaCandidate = -this._search(grid, otherSide, height + 1, -beta, -alpha);

                this._undoMove(grid, move);

                if (beta <= alpha)
                    break;

                if (alphaCandidate > alpha)
                {
                    alpha = alphaCandidate;

                    if (height === 0)
                        bestMove = move;
                }
            }

            return height !== 0 ? alpha : bestMove;
        };

        this._nodeValue = function (grid, side)
        {
            var gameResult = TicTacToe.checkGameOver(grid);
            if (gameResult === null || gameResult['draw'])
            {
                // Game is unfinished or drawn.
                return 0;
            }
            else if (gameResult['winner'] === side)
            {
                // 'side' wins when their play is perfect.
                return this.infinity;
            }
            else
            {
                // 'side' loses when their opponent's play is perfect.
                return -this.infinity;
            }
        };

        this._generateMoves = function (grid)
        {
            var moves = [];
            for (var y = 0; y < grid.length; y++)
            {
                for (var x = 0; x < grid[y].length; x++)
                {
                    if (grid[y][x] === 0)
                        moves.push([x, y]);
                }
            }
            return moves;
        };

        this._makeMove = function (grid, move, side)
        {
            grid[move[1]][move[0]] = side;
        };

        this._undoMove = function (grid, move)
        {
            grid[move[1]][move[0]] = 0;
        };
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