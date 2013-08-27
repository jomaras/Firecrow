document.getElementById("draw_snow").onclick = function()
{
    draw_snow = !draw_snow;
};

document.getElementById("draw_points").onclick = function()
{
    draw_points = !draw_points;
};

document.getElementById("draw_rects").onclick = function()
{
    draw_rects = !draw_rects
};

document.getElementById("draw_graph").onclick = function()
{
    draw_graph = !draw_graph
};

document.getElementById("draw_olines").onclick = function()
{
    draw_olines = !draw_olines
};
document.getElementById("pull").onclick = function()
{
    snowWay = (snowWay == 'fight')?'flight':'fight'
};
document.getElementById("stuck").onclick = function()
{
    backToOrg = !backToOrg
};

document.getElementById("randomizeButton").onclick = function()
{
    randomize();
};

document.getElementById("slider").onchange = function()
{
    canvas.width = this.value;
    canvas.height = this.value;
    initSnowPos();
    fixPositions('canvas');
};

document.getElementById("slider").onmouseup = function()
{
    fixPositions('menu');
};

function initSnowPos() {
    padding = snowRadius * 2;

    flakes = 0;

    for (var i = -margin; i < canvas.width + margin; i += padding) {
        for (var j = -margin; j < canvas.height + margin; j += padding) {
            //snowX[flakes] = rand(0, canvas.width); snowOX[flakes] = i;
            //snowY[flakes] = rand(0, canvas.height); snowOY[flakes] = j;

            snowX[flakes] = i;
            snowOX[flakes] = i;
            snowY[flakes] = j;
            snowOY[flakes] = j;

            flakes++;
        }
    }
}

//glob
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 600; //window.innerWidth-10;
canvas.height = 600; //window.innerHeight-10;

var margin = 0;

var mouseX = window.innerWidth / 2;
var mouseY = window.innerHeight / 2;
var mouseRadius = 50;

var draw_snow = false;
var draw_graph = false;
var draw_olines = false;
var draw_points = true;
var draw_rects = false;

var flakes = 0;

var snowX = [], snowOX = [];
var snowY = [], snowOY = [];
var snowRadius = 10;
var snowWay = "flight";

initSnowPos();

var backToOrg = true;
var pause = false;

// lib
function circle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.closePath();
}

function dist(x1, y1, x2, y2) {
    dx = Math.abs(x1 - x2);
    dy = Math.abs(y1 - y2);
    return Math.sqrt(dx * dx + dy * dy);
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

/**/
function $(id) {
    return document.getElementById(id);
}
/**/

function fixPositions(fixType) {
    if (fixType == undefined || fixType == "canvas") {
        canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
        canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
    }
    if (fixType == undefined || fixType == "menu") {
        $("menu").style.left = window.innerWidth / 2 + canvas.width / 2 + 5 + "px";
        $("menu").style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
    }
}

function randomize() {
    padding = snowRadius * 2;

    flakes = 0;

    for (var i = -margin; i < canvas.width + margin; i += padding) {
        for (var j = -margin; j < canvas.height + margin; j += padding) {
            snowX[flakes] = rand(0, canvas.width);
            snowOX[flakes] = i;
            snowY[flakes] = rand(0, canvas.height);
            snowOY[flakes] = j;

            //snowX[flakes] = i; snowOX[flakes] = i;
            //snowY[flakes] = j; snowOY[flakes] = j;

            flakes++;
        }
    }
}

// events
canvas.onmousemove = function (e) {
    mouseX = (e.layerX || e.layerX == 0) ? e.layerX : e.offsetX;
    mouseY = (e.layerX || e.layerX == 0) ? e.layerY : e.offsetY;

    /***/
    var posx = 0, posy = 0;
    if (!e) e = window.event;
    if (e.pageX >= 0 || e.pageY >=0) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX  >= 0 || e.clientY >= 0) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    /***/

    var midX = window.innerWidth / 2;
    var midY = window.innerHeight / 2;
    var canX = canvas.width / 2;
    var canY = canvas.height / 2;

    if (posx <= midX - canX) {
        mouseX = midX - canX + 1;
    }
    if (posx >= midX + canX) {
        mouseX = midX + canX - 1;
    }
    if (posy <= midY - canY) {
        mouseY = midY - canY + 1;
    }
    if (posy >= midY + canY) {
        mouseY = midY + canY - 1;
    }
};

document.onkeydown = function (e) {
    key = (window.event) ? event.keyCode : e.keyCode;

    if (key == 27) {
        pause = !pause;
    }

    if (key == 32) {
        if (snowWay == "fight") {
            snowWay = "flight";
        }
        else if (snowWay == "flight") {
            snowWay = "fight";
        }

        $("pull").checked = !$("pull").checked;
    }

    if (key == 49) {
        draw_snow = !draw_snow;
        $("draw_snow").checked = !$("draw_snow").checked;
    }
    if (key == 50) {
        draw_points = !draw_points;
        $("draw_points").checked = !$("draw_points").checked;
    }
    if (key == 51) {
        draw_rects = !draw_rects;
        $("draw_rects").checked = !$("draw_rects").checked;
    }
    if (key == 52) {
        draw_graph = !draw_graph;
        $("draw_graph").checked = !$("draw_graph").checked;
    }
    if (key == 53) {
        draw_olines = !draw_olines;
        $("draw_olines").checked = !$("draw_olines").checked;
    }

    if (key == 17) randomize();

    if (key == 16) { // shift
        backToOrg = !backToOrg;

        $("stuck").checked = !$("stuck").checked;
    }
};

// snow
function moveSnow() {
    for (var i = 0; i < flakes; i++) {
        snowMouseDist = dist(snowX[i], snowY[i], mouseX, mouseY);
        snowOrgDist = dist(snowX[i], snowY[i], snowOX[i], snowOY[i]);
        speed = (snowWay == "fight") ? snowMouseDist / 10 : mouseRadius - snowMouseDist;

        if (snowMouseDist < mouseRadius) {
            moveFlake(i, mouseX, mouseY, snowWay, speed);
        }
        else if (snowOrgDist > 0 && backToOrg) {
            moveFlake(i, snowOX[i], snowOY[i], "fight", snowOrgDist / 10);
        }
    }
}

function moveFlake(n, predX, predY, FF, velocity) {
    dist_x = Math.abs(predX - snowX[n]);
    dist_y = Math.abs(predY - snowY[n]);
    distance = Math.sqrt(dist_x * dist_x + dist_y * dist_y);

    moveX = dist_x * velocity / distance;
    moveY = dist_y * velocity / distance;

    if (FF == "fight") {
        snowX[n] += (predX > snowX[n]) ? moveX : -moveX;
        snowY[n] += (predY > snowY[n]) ? moveY : -moveY;
    }
    else if (FF == "flight") {
        snowX[n] += (predX < snowX[n]) ? moveX : -moveX;
        snowY[n] += (predY < snowY[n]) ? moveY : -moveY;
    }
}

// draw
function drawSnow() {
    for (var i = 0; i < flakes; i++) {
        circle(snowX[i], snowY[i], snowRadius);
    }
}

function drawGraph() {
    padding = snowRadius * 2;
    counter = 0;

    for (var i = margin; i < canvas.width - margin; i += padding) {
        ctx.beginPath();
        ctx.moveTo(snowX[counter], snowY[counter]);

        for (var j = margin; j < canvas.height - margin; j += padding) {
            ctx.lineTo(snowX[counter], snowY[counter]);

            counter++;
        }
        ctx.stroke();
        ctx.closePath();
    }
}

function drawOLines() {
    for (var i = 0; i < flakes; i++) {
        if (dist(snowX[i], snowY[i], snowOX[i], snowOY[i]) < 0.5) {
            ctx.strokeRect(snowOX[i] - 0.5, snowOY[i] - 0.5, 1, 1);
        }
        else {
            ctx.beginPath();
            ctx.moveTo(snowOX[i], snowOY[i]);
            ctx.lineTo(snowX[i], snowY[i]);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function drawPoints() {
    ctx.fillStyle = "#000000";
    for (var i = 0; i < flakes; i++) {
        ctx.fillRect(snowX[i] - 1, snowY[i] - 1, 2, 2);
    }
}

function drawRects() {
    for (var i = 0; i < flakes; i++){
        ctx.strokeRect(snowX[i] - snowRadius, snowY[i] - snowRadius, snowRadius * 2, snowRadius * 2);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveSnow();
    if (draw_snow) drawSnow();
    if (draw_graph) drawGraph();
    if (draw_olines) drawOLines();
    if (draw_points) drawPoints();
    if (draw_rects) drawRects();

    circle(mouseX, mouseY, mouseRadius);
}

fixPositions();

// setInterval("if (!pause) draw();", 1); // Fixed Magnus
setInterval(function()
{
    if (!pause) draw()
}, 10);