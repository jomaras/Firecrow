var PXWIDTH = 100;
var PXHEIGHT = 100;
var REAL_X = 500;
var REAL_Y = 500;
var rotY = 0;
var rotZ = 0;
var _ad2 = [];
var selDot = -1;
var _pos = [-1,-1];
var _mode;
function c() {
    if (this.cv == null) {
        this.cv = document.getElementById('showCanvas');
        this.ct = this.cv.getContext('2d');
    }
    return this;
}

function Point2D() {
    this.p = [0,0];
    this.isNear = function(m) {
        return ((m[0] <= this.p[0] + 6) && (m[0] >= this.p[0] - 6) && (m[1] <= this.p[1] + 6) && (m[1] >= this.p[1] - 6) );
    }
    return this;
}
function Matrix3D() {
    this.v = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0]
    ];

    this.apply = function(pp) {
        var result_vec = []
        for (var ii = 0; ii < 3; ii++) {
            var rv = this.v[ii][3]
            for (var jj = 0; jj < 3; jj++) rv += this.v[ii][jj] * pp[jj]
            result_vec.push(rv)
        }
        return result_vec
    }
    this.rotate = function(pTheta, axe) {
        theta = pTheta * (Math.PI / 180);
        var s = Math.sin(theta)
        var c = Math.cos(theta)
        var m;
        if (axe == 'x')
            m = [
                [1,0, 0,0],
                [0,c,-s,0],
                [0,s, c,0]
            ];
        if (axe == 'y')
            m = [
                [ c,0,-s,0],
                [0,1,0,0],
                [s,0,c,0]
            ];
        if (axe == 'z')
            m = [
                [ c,-s,0,0],
                [s, c,0,0],
                [0, 0,1,0]
            ];
        [
            [c, -s, 0, 0],
            [s, c, 0, 0],
            [0, 0, 1, 0]
        ]
        this.multiply(m);
    }

    this.scale = function(px, py, pz) {
        v[0][0] *= px;
        v[1][1] *= py;
        v[2][2] *= pz;
    }
    this.multiply = function(m) {
        var rv = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        var x1 = m;
        var x2 = this.v;
        for (var i = 0; i < 3; i++) {
            rv[i][3] = x2[i][3]
            for (var j = 0; j < 3; j++) {
                rv[i][3] += x1[j][3] * x2[i][j]
                for (var k = 0; k < 3; k++) {
                    rv[i][j] += x1[k][j] * x2[i][k]
                }
            }
        }
        this.v = rv;
    }
    this.to2d = function(pp) {
        var p3 = this.apply(pp);
        return [p3[0],p3[1]];
    }
    return this;
}

function x2px(pXReal) {
    return Math.floor(((pXReal * PXWIDTH) / REAL_X) + (PXWIDTH / 2));
}
function y2px(pYReal) {
    return Math.floor(((-1 * (PXHEIGHT / REAL_Y)) * pYReal) + (PXHEIGHT / 2));
}

function px2x(pXpx) {
    return Math.floor(pXpx * (REAL_X / PXWIDTH) - (REAL_X / 2));
}
function px2y(pYpx) {
    return Math.floor((REAL_Y / 2) - (pYpx * (REAL_Y / PXHEIGHT)));
}

function drawLine(p1, p2) {
    c().ct.moveTo(x2px(p1[0]), y2px(p1[1]));
    c().ct.lineTo(x2px(p2[0]), y2px(p2[1]));
}

function redraw() {
    c().ct.clearRect(0, 0, PXWIDTH, PXHEIGHT);
    c().ct.save();
    c().ct.strokeStyle = "rgb(0,255,0)";
    c().ct.lineWidth = 1;

    var xform = Matrix3D();

    c().ct.beginPath()
    p = Array();
    var p2 = [];
    for (t = 0; t <= 100; t = t + 1) p[t] = [px2x(b(t / 100, _ad2, 0)),px2y(b(t / 100, _ad2, 1)),0];

    xform.rotate(rotY, 'y');
    xform.rotate(rotZ, 'z');
    for (i = 0; (i * 10) < 360; i++) {
        p2[i] = [];
        if (p.length > 0) {
            p2[i][0] = xform.apply(p[0]);
            c().ct.moveTo(x2px(p2[i][0][0]), y2px(p2[i][0][1]));
        }

        for (j = 1; j < p.length; j++) {
            p2[i][j] = xform.apply(p[j]);
            c().ct.lineTo(x2px(p2[i][j][0]), y2px(p2[i][j][1]));
        }
        xform.rotate(10, 'x');
    }
    for (j = 0; j < p.length; j = j + 10) {
        c().ct.moveTo(x2px(p2[0][j][0]), y2px(p2[0][j][1]));
        for (i = 0; (i * 10) < 360; i++) {
            c().ct.lineTo(x2px(p2[i][j][0]), y2px(p2[i][j][1]));
        }
        c().ct.lineTo(x2px(p2[0][j][0]), y2px(p2[0][j][1]));

    }
    c().ct.stroke();
    c().ct.restore();
}

document.onkeydown = function(event) {
    var keyCode;

    if (event == null) {
        keyCode = window.event.keyCode;
    }
    else {
        keyCode = event.keyCode;
    }
    switch (keyCode) {
        // left
        case 37:
            if (_mode == 1) {
                rotY += 10;
                if (rotY >= 360) rotY = 0;
                redraw();
            }
            break;

        // up
        case 38:
            if (_mode == 1) {
                rotZ += 10;
                if (rotZ <= 0) rotZ = 360;
                redraw();
            }
            break;

        // right
        case 39:
            if (_mode == 1) {
                rotY -= 10;
                if (rotY <= 0) rotY = 360;
                redraw();
            }
            break;

        // down
        case 40:
            if (_mode == 1) {
                rotZ -= 10;
                if (rotZ <= 0) rotZ = 360;
                redraw();
            }
            break;

        case 33:
            if (_mode == 1) {
                REAL_X += 50;
                //REAL_Y+=50;
                redraw();
            }
            break;

        case 34:
            if (_mode == 1) {
                REAL_X -= 50;
                redraw();
            }
            break;

        case 36:
            if (_mode == 1) {
                REAL_Y += 50;
                redraw();
            }
            break;

        case 35:
            if (_mode == 1) {
                REAL_Y -= 50;
                redraw();
            }
            break;

        case 13:
            if (_ad2.length < 2) { return; }
            else {
                _mode = 1;
                document.getElementById('editmode').style.display = 'none';
                document.getElementById('viewmode').style.display = 'block';
                redraw();
            }
            break;

        case 27:
            main();
            break;

        case 46:
            if (_mode == 0) {
                for (i = 0; i < _ad2.length; i++) {
                    if (_ad2[i].isNear(_pos)) _ad2.splice(i, 1);
                }
                drawPoints(_pos);
            }
            break;

        default:
            break;
    }
}

function getPos(ev) {
    if (ev.layerX || ev.layerX == 0) { // Firefox
        x = ev.layerX - c().cv.offsetLeft;
        y = ev.layerY - c().cv.offsetTop;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        x = ev.offsetX - c().cv.offsetLeft;
        ;
        y = ev.offsetY - c().cv.offsetTop;
    }
    return[x,y];
}

function getPath() {
    c().ct.strokeStyle = "rgb(255,255,0)";
    c().ct.lineWidth = 1;
    c().ct.moveTo(0, 250)
    c().ct.lineTo(500, 250);
    c().ct.stroke();
    PXWIDTH = c().cv.width;
    PXHEIGHT = c().cv.height;
    c().ct.clearRect(0, 0, PXWIDTH, PXHEIGHT);
    drawPoints([0][0]);
    c().cv.addEventListener("click",
        function(ev) {
            if (selDot != -1) {
                selDot = -1;
            }
            else {
                var p = new Point2D();
                p.p = getPos(ev);
                _ad2.push(p);
                drawPoints(p.p);
            }
        }, false);

    c().cv.addEventListener("mousemove",
        function(ev) {
            if (_mode == 0) {
                _pos = getPos(ev);
                if (selDot != -1) _ad2[selDot].p = _pos;
                drawPoints(_pos);
            }
        }, false);

    c().cv.addEventListener("mousedown",
        function(ev) {
            var pos = getPos(ev);
            for (i = 0; i < _ad2.length; i++) {
                if (_ad2[i].isNear(pos)) selDot = i;
            }
            drawPoints(pos);
        }, false);
}
function drawPoints(m) {
    c().ct.clearRect(0, 0, PXWIDTH, PXHEIGHT);
    c().ct.save();
    c().ct.strokeStyle = "rgb(255,255,0)";
    c().ct.lineWidth = 1;
    c().ct.moveTo(0, 250)
    c().ct.lineTo(500, 250);
    c().ct.stroke();
    c().ct.beginPath();
    c().ct.strokeStyle = "rgb(0,255,0)";
    c().ct.beginPath();
    if (_ad2.length > 0) {
        c().ct.moveTo(_ad2[0].p[0], _ad2[0].p[1]);
        if (_ad2[0].isNear(m)) c().ct.strokeRect(_ad2[0].p[0] - 6, _ad2[0].p[1] - 6, 12, 12);
    }
    for (i = 1; i < _ad2.length; i++) {
        c().ct.lineTo(_ad2[i].p[0], _ad2[i].p[1]);
        if (_ad2[i].isNear(m)) c().ct.strokeRect(_ad2[i].p[0] - 6, _ad2[i].p[1] - 6, 12, 12);
    }
    if (_ad2.length == 1) {
        c().ct.lineTo(_ad2[0].p[0] + 1, _ad2[0].p[1] + 1);
    }
    c().ct.stroke();
    if (_ad2.length > 2) {
        c().ct.strokeStyle = "rgb(0,255,255)";
        c().ct.beginPath();
        c().ct.moveTo(_ad2[0].p[0], _ad2[0].p[1]);
        for (t = 0; t <= 1; t = t + 0.01) {
            x = b(t, _ad2, 0);
            y = b(t, _ad2, 1);
            c().ct.lineTo(x, y);
        }
        c().ct.stroke();
    }

}
function factorial(n) {
    if ((n == 0) || (n == 1)) return 1
    else {
        var result = (n * factorial(n - 1) );
        return result;
    }
}
function binomial(n, i) {
    return factorial(n) / (factorial(i) * factorial(n - i));
}
function myPow(a, b) {
    if (b == 0) return 1;
    return Math.pow(a, b);
}
function b(t, points, axe) {
    var ac = 0;
    var n = points.length - 1;
    for (i = 0; i <= n; i++) {
        ac += binomial(n, i) * myPow(t, i) * myPow(1 - t, n - i) * points[i].p[axe];
    }
    return ac;
}
function main() {
    _mode = 0;
    document.getElementById('editmode').style.display = 'block';
    document.getElementById('viewmode').style.display = 'none';
    PXWIDTH = c().cv.width;
    PXHEIGHT = c().cv.height;
    REAL_X = 500;
    REAL_Y = 500;
    getPath();
}

window.onload = main;