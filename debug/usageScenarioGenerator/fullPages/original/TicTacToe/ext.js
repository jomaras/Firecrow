var lastRandom = 0, isRandomGrowing = true;
Math.myRandom = function()
{
    isRandomGrowing ? lastRandom += 0.02
        : lastRandom -= 0.02;

    if(lastRandom >= 1) { lastRandom = 0.99; isRandomGrowing = false; }
    if(lastRandom <= 0) { lastRandom = 0.01; isRandomGrowing = true; }

    return lastRandom;
}
var e, h, i, k = 10,
    m = 10,
    n = 400 - 2 * k,
    o = (660 - n) / 2,
    p = n / 3,
    q = -1,
    s = 1,
    t = Math.floor(Math.random() * 2),
    u = Array(3),
    v, w = false,
    x = true;
    window.onload = function () {

        h = document.getElementById("myCanvas");
        v = document.getElementById("status");
        if (h && h.getContext) if (e = h.getContext("2d")) {
            var a = h.parentNode,
                c = document.createElement("canvas");
            if (c && c.getContext) {
                c.id = "tempView";
                c.width = h.width;
                c.height = h.height;
                a.appendChild(c);
                i = c.getContext("2d");
                w = true;
                i.clearRect(0, 0, h.width, h.height);
                e.clearRect(0, 0, h.width, h.height);
                t = Math.floor(Math.random() * 2);
                e.fillStyle = "#7bc00a";
                e.strokeStyle = "#7bc00a";
                e.lineWidth = 1;
                e.fillRect(o + p, k, m, n);
                e.fillRect(o + 2 * p, k, m, n);
                e.fillRect(o, k + n / 3, n, m);
                e.fillRect(o, k + 2 * (n / 3), n, m);
                for (a = 0; a < 3; a++) {
                    u[a] = Array(3);
                    u[a][0] = -1;
                    u[a][1] = -1;
                    u[a][2] = -1
                }
                y();
                h.onclick = z;
                h.onmousemove = A;
                c.onclick = z;
                c.onmousemove = A;
            }
        }
    };

function B(a) {
    v.innerHTML = '<span class="green">Status:&nbsp;</span> ' + a
}
function A(a) {
    if (s == C(t) && w) {
        var c, b;
        if (a.layerX || a.layerX == 0) {
            c = a.layerX;
            b = a.layerY
        } else if (a.offsetX || a.offsetX == 0) {
            c = a.offsetX;
            b = a.offsetY
        }
        a = D(c, b);
        if (a != -1) if (q != a) if (u[Math.floor((a - 1) / 3)][(a - 1) % 3] == -1) {
            c = E(a, 1);
            b = E(a, 2);
            var d = E(a, 3),
                f = E(a, 4);
            i.fillStyle = "#7bc00a";
            i.strokeStyle = "#7bc00a";
            i.clearRect(0, 0, 660, 400);
            i.fillStyle = "rgba(123,192,10,0.5)";
            i.strokeStyle = "#7bc00a";
            i.lineWidth = 1;
            i.fillRect(c, b, d - c, f - b);
            q = a
        }
    }
}
function z(a) {
    var c, b;
    if (a.layerX || a.layerX == 0) {
        c = a.layerX;
        b = a.layerY
    } else if (a.offsetX || a.offsetX == 0) {
        c = a.offsetX;
        b = a.offsetY
    }
    if (w && s == C(t)) {
        a = D(c, b);
        a != -1 && F(a)
    }
}
function F(a) {
    var c = (a - 1) % 3,
        b = Math.floor((a - 1) / 3);
    if (u[b][c] == -1) {
        u[b][c] = s;
        x = false;
        i.clearRect(0, 0, h.width, h.height);
        if (s == 1) {
            s = 0;
            c = E(a, 1);
            b = E(a, 2);
            var d = E(a, 3);
            a = E(a, 4);
            e.lineWidth = m;
            e.fillStyle = "#FFFFFF";
            e.strokeStyle = "#FFFFFF";
            e.beginPath();
            e.moveTo(c + 20, b + 20);
            e.lineTo(d - 20, a - 20);
            e.moveTo(c + 20, a - 20);
            e.lineTo(d - 20, b + 20);
            e.stroke();
            e.closePath()
        } else {
            s = 1;
            d = E(a, 1);
            c = E(a, 2);
            var f = E(a, 3),
                l = E(a, 4);
            a = 20;
            b = (f - d) / 2;
            b -= a;
            d = d + (f - d) / 2;
            c = c + (l - c) / 2;
            a = 10;
            b -= a;
            e.lineWidth = m;
            e.fillStyle = "#FFFFFF";
            e.strokeStyle = "#FFFFFF";
            e.beginPath();
            e.arc(d, c, b, 0, Math.PI * 2, true);
            e.closePath();
            e.stroke()
        }
        if (G(u)) {
            B(H());
            w = false
        } else y()
    }
}
function H() {
    if (I(u, 1)) {
        if (C(t) == 1) return "Congrats you won!!!";
        return "Sorry the computer won."
    }
    if (I(u, 0)) {
        if (C(t) == 0) return "Congrats you won!!!";
        return "Sorry the computer won."
    }
    return "The Game was Drawn"
}
function C(a) {
    if (a == 1) return 0;
    return 1
}
function J(a) {
    for (var c = Array(a.length), b = 0; b < a.length; b++) {
        c[b] = Array(a.length);
        for (var d = 0; d < a.length; d++) c[b][d] = a[b][d]
    }
    return c
}
function K(a, c) {
    var b = Array(2);
    b[0] = 0;
    b[1] = 0;
    if (I(a, 1)) {
        b[1] = 2 * (10 - c);
        return b
    }
    if (I(a, 0)) {
        b[1] = -2 * (10 - c);
        return b
    }
    return b
}
function L(a, c, b) {
    var d = Array(2),
        f = J(a);
    if (G(a)) return K(a, b);
    for (var l = 0, g = 0; g < a.length; g++) for (var j = 0; j < a.length; j++) if (f[g][j] == -1) {
        f[g][j] = c;
        var r = M(f, C(c), b + 1);
        if (l == 0) {
            d[0] = g * 3 + (j + 1);
            d[1] = r[1];
            l++
        }
        if (d[1] < r[1]) {
            d[0] = g * 3 + (j + 1);
            d[1] = r[1]
        }
        f[g][j] = -1
    }
    return d
}
function M(a, c, b) {
    var d = Array(2),
        f = J(a);
    if (G(a)) return K(a, b);
    for (var l = 0, g = 0; g < a.length; g++) for (var j = 0; j < a.length; j++) if (f[g][j] == -1) {
        f[g][j] = c;
        var r = L(f, C(c), b + 1);
        if (l == 0) {
            d[0] = g * 3 + (j + 1);
            d[1] = r[1];
            l++
        }
        if (d[1] > r[1]) {
            d[0] = g * 3 + (j + 1);
            d[1] = r[1]
        }
        f[g][j] = -1
    }
    return d
}
function G(a) {
    if (I(a, 1)) return true;
    if (I(a, 0)) return true;
    if (N(a, 1) && N(a, 0)) return true;
    return false
}
function N(a, c) {
    for (var b = C(c), d = 0; d < a.length; d++) {
        if (a[d][0] != b && a[d][1] != b && a[d][2] != b && (a[d][0] != b || a[d][1] != b || a[d][2] != b)) return false;
        if (a[0][d] != b && a[1][d] != b && a[2][d] != b && (a[0][d] != b || a[1][d] != b || a[2][d] != b)) return false
    }
    if (a[0][0] != b && a[1][1] != b && a[2][2] != b && (a[0][0] != b || a[1][1] != b || a[2][2] != b)) return false;
    if (a[0][2] != b && a[1][1] != b && a[2][0] != b && (a[0][2] != b || a[1][1] != b || a[2][0] != b)) return false;
    return true
}
function I(a, c) {
    for (var b = 0; b < a.length; b++) {
        if (a[b][0] == c && a[b][1] == c && a[b][2] == c) return true;
        if (a[0][b] == c && a[1][b] == c && a[2][b] == c) return true
    }
    if (a[0][0] == c && a[1][1] == c && a[2][2] == c) return true;
    if (a[0][2] == c && a[1][1] == c && a[2][0] == c) return true;
    return false
}
function y() {
    if (w) if (s == t) {
        B("Computer turns to play");
        if (x) F(5);
        else {
            var a = u,
                c = t,
                b = Array(2);
            b = c == 1 ? L(a, c, 0) : M(a, c, 0);
            F(b[0])
        }
    } else B("Your turn to play")
}
function E(a, c) {
    var b = (a - 1) % 3,
        d = p * b + o,
        f = d + p;
    b = p * ((a - (b + 1)) / 3) + k;
    var l = b + p;
    return c == 1 ? d : c == 2 ? b : c == 3 ? f : l
}
function D(a, c) {
    for (var b = 1; b < 10; b++)
    {
        var d;
        d = E(b, 1);
        var f = E(b, 2),
            l = E(b, 3),
            g = E(b, 4);
        if (a >= d && a <= l)
        {
            if (c >= f && c <= g)
            {
                d = true;
            }
            else
            {
                d = false;
            }
        }
        else
        {
            d = false;
        }
        if (d) return b
    }
    return -1
};