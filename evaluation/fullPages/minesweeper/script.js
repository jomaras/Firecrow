document.getElementById("easyButton").onclick = function(){K(9,9,10);}
document.getElementById("mediumButton").onclick = function(){K(16,16,40);}
document.getElementById("difficultButton").onclick = function(){K(32,16,100);}

var g = Math,h = document.getElementById("game"),i = h.getContext("2d"),j = 1,l = 8,n = 15,o = 4,p = [],q = 0,r = 0,s = 0,t = ["2141B2","135F21","5A212B","121A5A","3D125A","FF9600","8900FF","FFFC0F"];
function u(a) {
    v(a);
    if (a) {
        var b = w(a);
        if (b && b.c <= n && b.f <= l && b.c >= 0 && b.f >= 0)
            if (a = p[b.c][b.f]) {
                i.fillStyle = "rgba(0,0,0,0.6)";
                i.fillRect(b.c * 30, b.f * 30, 30, 30);
                i.fillStyle = "rgba(0,0,0,1)"
            }
    }
    i.font = "24px sans-serif";
    for (b = 0; b < n; b++)for (var c = 0; c < l; c++) {
        var f = b * 30,k = c * 30;
        a = p[b][c];
        if (a.b && !a.h && !a.a) {
            i.fillStyle = "rgba(255,255,255,0.6)";
            i.fillRect(f, k, 30, 30)
        }
        if (a.h && j){
            i.drawImage(x, f, k);
        }
        else if (a.a)
            i.drawImage(y, f, k);
        else if (a.b && a.g > 0) {
            i.fillStyle = "#" + t[a.g - 1];
            i.fillText(a.g, f + 10, k + 24)
        }
    }
    i.stroke()
}
function v() {
    var a = i.createLinearGradient(0, 0, r, s);
    a.addColorStop(0, "#E7EFFD");
    a.addColorStop(1, "#006295");
    i.fillStyle = a;
    i.strokeStyle = "rgba(0,0,0,0.5)";
    i.fillRect(0, 0, r, s);
    for (a = 0; a < n; a++)
        for (var b = 0; b < l; b++)
            i.strokeRect(a * 30, b * 30, 30, 30)
}
function z(a, b) {
    if (!j) {
        var c = p[a][b];
        if (!(c.b && !c.a)) {
            q--;
            if (c.g) {
                c.a = 0;
                c.b = 1;
                if (c.h) {
                    j = 1;
                    A && A(0)
                }
                else
                    z(a, b)
            }
            else
            {
                c.b = 1;
                for (c = a - 1; c <= a + 1; c++)
                    for (var f = b - 1; f <= b + 1; f++)
                        if (f >= 0 && c >= 0 && f < l && c < n)
                            p[c][f].b || z(c, f)
            }
            if (!(q - o))
            {
                j = 1;
                A && A(1)
            }
        }
    }
}
var B = 0;
function w(a) {
    var b = a.pageY - a.target.offsetTop;
    return{c:g.floor((a.pageX - a.target.offsetLeft) / 30),f:g.floor(b / 30)}
}
h.onmousemove = function(a) {
    u(a)
};
h.onmouseout = function() {
    u(0)
};
h.onmouseup = function(a)
{
    if (!B)
    {
        B = 1;
        C()
    }
    var b = w(a),c = p[b.c][b.f];
    if (a.ctrlKey && (c.a || !c.b))
    {
        c.a = !c.a;
        c.b = c.a
    }
    else
        z(b.c, b.f);
    u(0)
};
var D = 0,E = 0,F = 0,G = 0;
function C() {
    D = 1;
    G = (new Date).getTime();
    H()
}
function H() {
    if (D) {
        var a = (new Date).getTime() - G - E * 1E3;
        if (a > 999) {
            E++;
            a = 0
        }
        F = a;
        a = g.floor(F / 10);
        if (a < 10)a = "0" + a;
        I.innerHTML = E + "." + a + "s";
        setTimeout(H, 50)
    }
}
function A(a)
{
    var titleElement = document.getElementById("mainTitle");

    a ? titleElement.textContent += " - You won in " + I.innerHTML
        : titleElement.textContent += "- Sorry - you lost. Try again!";

    D = 0
}
var I = document.getElementById("t"),
    x = new Image;
x.src = "m.png";
var y = new Image;
y.src = "f.png";
C();
K(16, 16, 40);
function K(a, b, c) {
    n = a;
    l = b;
    o = c;
    D = F = E = B = 0;
    I.innerHTML = "0.00s";
    r = n * 30;
    s = l * 30;
    h.width = r;
    h.height = s;
    q = n * l;
    j = 0;
    a = n;
    for (p = []; a--;) {
        b = l;
        for (c = []; b--;)
            c.push({hasMine:0,visible:0,hasFlag:0,g:0});
        p.push(c)
    }
    for (a = o; a--;) {
        b = g.floor(g.random() * (l - 1));
        c = g.floor(g.random() * (n - 1));
        if (p[c][b].h)
            a++;
        else
        {
            p[c][b].h = 1;
            for (var f = c - 1; f <= c + 1; f++)
                for (var k = b - 1; k <= b + 1; k++)
                    k >= 0 && f >= 0 && k < l && f < n && p[f][k].g++
        }
    }
    v(0);
    u(0)
}