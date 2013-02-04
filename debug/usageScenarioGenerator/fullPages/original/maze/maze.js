var lastRandom = 0, isRandomGrowing = true;
Math.random = function()
{
    isRandomGrowing ? lastRandom += 0.02
                    : lastRandom -= 0.02;

    if(lastRandom >= 1) { lastRandom = 0.99; isRandomGrowing = false; }
    if(lastRandom <= 0) { lastRandom = 0.01; isRandomGrowing = true; }

    return lastRandom;
}
/*var oldRandom = Math.random;
Math.random = function()
{
    var rand = oldRandom();
    console.log(rand);
    return rand;
}*/
var canvas, ctx, currentPos, maze, path, time, timer, gameInProgress, startTime;
var scale = 25;
var offsets = {
    "left": {
        x: -1,
        y: 0
    },
    "up": {
        x: 0,
        y: -1
    },
    "right": {
        x: 1,
        y: 0
    },
    "down": {
        x: 0,
        y: 1
    }
};
var levelSize = [10, 8, 4, 2];
var completeMessages = ["Complete!", "Done!", "Super!", "Bam!", "Woot!", "Yay!", "Sweet!"];
var rand = new Rand();

function Cell(x, y) {
    this.visited = false;
    this.up = true;
    this.right = true;
    this.down = true;
    this.left = true;
    this.x = x;
    this.y = y;
}
function Rand() {
    this.randomInt = function (x) {
        return Math.floor(Math.random() * x);
    };
    this.pickRand = function (al)
    {
        var value = al[this.randomInt(al.length)];
        console.log(value);
        return value;
    };
}

function Maze(width, height) {
    this.m = [];
    this.width = width;
    this.height = height;
    this.start = {
        x: 0,
        y: 0
    };
    this.end = {
        x: this.width - 1,
        y: this.height - 1
    };
    this.c;
    this.nextC;
    this.stack = [];
    this.initMaze = function () {
        for (y = 0; y < height; y++) {
            this.m.push(new Array());
            for (x = 0; x < width; x++) {
                this.m[y].push(new Cell(x, y));
            }
        }
    };
    this.getNeighbors = function (x, y) {
        var n = [];
        var c = this.getCell(x, y);
        if (y != 0) {
            n.push(this.getCell(x, y - 1));
        }
        if (y != height - 1) {
            n.push(this.getCell(x, y + 1));
        }
        if (x != 0) {
            n.push(this.getCell(x - 1, y));
        }
        if (x != width - 1) {
            n.push(this.getCell(x + 1, y));
        }
        return n;
    };
    this.availableNeighbors = function (x, y) {
        var list = [];
        var neighbors = this.getNeighbors(x, y);
        for (i = 0; i < neighbors.length; i++) {
            if (!neighbors[i].visited) list.push(neighbors[i]);
        }
        return list;
    };
    this.randomNeighbor = function (x, y) {
        return rand.pickRand(this.availableNeighbors(x, y));
    };
    this.breakWall = function (c1, c2) {
        if (c1.x == c2.x) {
            if (c1.y < c2.y) {
                c1.down = false;
                c2.up = false;
            }
            if (c1.y > c2.y) {
                c1.up = false;
                c2.down = false;
            }
        } else if (c1.y == c2.y) {
            if (c1.x < c2.x) {
                c1.right = false;
                c2.left = false;
            }
            if (c1.x > c2.x) {
                c1.left = false;
                c2.right = false;
            }
        }
    };
    this.getCell = function (x, y) {
        return this.m[y][x];
    };
    this.inBounds = function (x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return true;
        }
        return false;
    };
    this.isDeadEnd = function (x, y) {
        var neighbors = this.getNeighbors(x, y);
        for (i = 0; i < neighbors.length; i++) {
            if (!neighbors[i].visited) return false;
        }
        return true;
    };
    this.isStart = function (x, y) {
        if (this.start.x === x && this.start.y === y) return true;
        return false;
    };
    this.isEnd = function (x, y) {
        if (this.end.x === x && this.end.y === y) return true;
        return false;
    };
    this.generateMaze = function () {
        this.c = this.getCell(rand.randomInt(this.width), rand.randomInt(this.height));
        this.c.visited = true;
        this.mazeDo();
        while (this.stack.length !== 0) {
            if (this.isDeadEnd(this.c.x, this.c.y) || this.isEnd(this.c.x, this.c.y) || this.isStart(this.c.x, this.c.y)) {
                this.nextC = this.stack.pop();
                this.c = this.nextC;
            } else {
                this.mazeDo();
            }
        }
    };
    this.mazeDo = function () {
        this.nextC = this.randomNeighbor(this.c.x, this.c.y);
        this.nextC.visited = true;
        this.breakWall(this.c, this.nextC);
        this.stack.push(this.c);
        this.c = this.nextC;
    };
    this.initMaze();
    this.generateMaze();
}

function setup(height, width) {
    height = Math.floor(height);
    width = Math.floor(width);
    maze = new Maze(height, width);
    currentPos = {
        x: 0,
        y: 0
    };
    path = [];
    path.push(currentPos);
    canvas.width = maze.width * scale + 3;
    canvas.height = maze.height * scale + 3;
    $("#a").width(maze.width * scale + 3);
    draw();
}

function start() {
    startTime = new Date();
    timer = setInterval(timeTick, 100);
    showTime();
    showSteps();
    gameInProgress = true;
    $('#game-info').show();
}

function unlockGame() {
    $("form").show();
    $("#next").remove();
    center($("#win"));
    localStorage.setItem("unlocked", true);
}

function draw() {
    drawPath();
    drawMaze();
}

function move(direction) {
    var newPos = {
        x: currentPos.x + offsets[direction].x,
        y: currentPos.y + offsets[direction].y
    };
    if (gameInProgress && maze.inBounds(newPos.x, newPos.y)) {
        if (maze.getCell(currentPos.x, currentPos.y)[direction] === false) {
            path.push(newPos);
            currentPos = newPos;
            draw();
            showSteps()
            if (maze.isEnd(newPos.x, newPos.y)) {
                levelWon();
            }
        }
    }
}

function levelWon() {
    clearInterval(timer);
    gameInProgress = false;
    $("#win h2").html(rand.pickRand(completeMessages));
    center($("#win").show());
}

function center(e) {
    e.css('top', $("#maze").offset().top + $("#maze").height() / 2 - e.outerHeight() / 2).css('left', $("body").width() / 2 - e.outerWidth() / 2)
}

function drawPath() {
    ctx.fillStyle = "#d7edff";
    for (i = 0; i < path.length - 1; i++) {
        ctx.fillRect(path[i].x * scale + 2, path[i].y * scale + 2, scale, scale);
    }
    ctx.fillStyle = "#67b9e8";
    ctx.fillRect(currentPos.x * scale + 2, currentPos.y * scale + 2, scale - 2, scale - 2);
}

function drawMaze() {
    ctx.fillStyle = "#65c644";
    ctx.fillRect(maze.end.x * scale, maze.end.y * scale, scale, scale);
    for (y = 0; y < maze.height; y++) {
        for (x = 0; x < maze.width; x++) {
            drawCell(x, y);
        }
    }
}

function drawCell(x, y) {
    var curCell = maze.getCell(x, y);
    var originx = x * scale;
    var originy = y * scale;
    if (curCell.up && !maze.isStart(curCell.x, curCell.y)) line(originx, originy, originx + scale, originy);
    if (curCell.down && !maze.isEnd(curCell.x, curCell.y)) line(originx, originy + scale, originx + scale, originy + scale);
    if (curCell.right) line(originx + scale, originy, originx + scale, originy + scale);
    if (curCell.left) line(originx, originy, originx, originy + scale);
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = "#ee4646";
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.moveTo(x1 + 1, y1 + 1);
    ctx.lineTo(x2 + 1, y2 + 1);
    ctx.stroke();
}

function showTime() {
    deltaTime = Math.floor(((new Date).getTime() - startTime.getTime()) / 1000);
    $("#time, .time").html(deltaTime + " second" + (deltaTime !== 1 ? "s" : ""));
}

function showSteps() {
    $("#steps, .steps").html(path.length - 1 + " step" + (path.length !== 2 ? "s" : ""));
}

function timeTick() {
    showTime();
}
$().ready(function () {
    canvas = document.getElementById('maze');
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        var newLevelSize = levelSize.pop();
        setup(newLevelSize * 1.33, newLevelSize);
        if (localStorage.getItem("unlocked") !== null) {
            unlockGame();
            $("#win").show();
        } else {
            start();
        }
    } else {
        return;
    }
    $("#f").submit(function () {
        $('#win, #end-game').hide();
        setup($('#w').val(), $('#h').val());
        start();
        return false;
    });
    $("#next").click(function () {
        var newLevelSize = levelSize.pop();
        if (newLevelSize != null) {
            setup(newLevelSize * 1.33, newLevelSize);
            start();
            $("#win").hide();
        } else {
            unlockGame();
        }
        return false;
    });
    $('#h, #win').bind('keypress', function (e) {
        return (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) ? false : true;
    });
    $(window).resize(function () {
        center($("#win"));
    });
});
$(window).keydown(function (e) {
    var keyCode = e.keyCode || e.which,
        keyCodes = {
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            65: "left",
            87: "up",
            68: "right",
            83: "down"
        };
    if (keyCodes[keyCode] !== null && keyCodes[keyCode] !== undefined) {
        move(keyCodes[keyCode]);
        return false;
    } else if (keyCode === 13 || keyCode === 32) {
        $('#win button:visible:last').trigger('click');
        return false;
    }
});