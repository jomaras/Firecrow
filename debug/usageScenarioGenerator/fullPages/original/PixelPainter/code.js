function cLum(a) {
    for (var b = 0; b < a.length; b++) a[b] <= 0.03928 ? a[b] = a[b] / 12.92 : a[b] = Math.pow((a[b] + 0.055) / 1.055, 2.4);
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}
function cCon(a, b) {
    var c = cLum([a[0] / 255, a[1] / 255, a[2] / 255]),
        d = cLum([b[0] / 255, b[1] / 255, b[2] / 255]),
        e = c >= d ? (c + 0.05) / (d + 0.05) : (d + 0.05) / (c + 0.05);
    return Math.round(e * 100) / 100
}
function cStrNorm(a) {
    var b; {
        if (a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)) return a;
        if (b = a.match(/^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/)) {
            b.shift();
            return "rgb(" + $.map(b, function (a) {
                return parseInt(a, 16).toString()
            }).join(", ") + ")"
        }
        if ("getComputedStyle" in window) {
            document.body.style.color = a;
            return cStrNorm(window.getComputedStyle(document.body, null).color)
        }
        if (document.body.currentStyle) {
            document.body.style.color = a;
            return cStrNorm(document.body.currentStyle.color)
        }
        return a
    }
}
function cStrParse(a) {
    var b = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/); {
        if (b) {
            b.shift();
            return $.map(b, function (a) {
                return parseInt(a, 10)
            })
        }
        return cStrParse(cStrNorm(a))
    }
}
$(document).ready(function () {
    var a = 1,
        b = 2,
        c = 4,
        d = 8,
        e = [c, d, a, b],
        f = a,
        g = 16,
        h = 32,
        i = 32,
        j = h * g,
        k = i * g,
        l = new Array(i),
        m = $("#pixels"),
        n = $("#grid").get(0).getContext("2d"),
        o = $("#preview").get(0),
        p = o.getContext("2d"),
        q = "localStorage" in window && window.localStorage !== null,
        r = "PixelPainter:",
        s = "background-color",
        t = cStrParse("rgb(255,255,255)"),
        u = $("#color div"),
        v = "rgb(0,0,0)";

    function w(a) {
        v = cStrNorm(a);
        var b = cStrParse(v),
            c = cCon(b, t),
            d = $.map(b, function (a) {
                var b = a.toString(16);
                return b.length == 1 ? "0" + b : b
            });
        u.css(s, v);
        u.css("text-shadow", c < 4 || c > 10 ? "none" : "0 0 3px rgba(0, 0, 0, 0.7)");
        u.css("color", c >= 4 ? "white" : "black");
        u.text("#" + d.join("").toUpperCase())
    }
    function x(a, b) {
        a.color = b;
        if (b === undefined) {
            $(a).css(s, "");
            p.clearRect(a.i, a.j, 1, 1)
        } else {
            $(a).css(s, b);
            p.fillStyle = b;
            p.fillRect(a.i, a.j, 1, 1)
        }
        if (q) {
            var c = r + a.i + ":" + a.j;
            b === undefined ? delete localStorage[c] : localStorage[c] = b
        }
    }
    function y(a, b, c, d) {
        var e = [],
            f = l[b][a].get(0);
        e.push(f);
        while (e.length > 0) {
            f = e.shift();
            f.color === c && x(f, d);
            var g = [
                [f.j - 1, f.i],
                [f.j, f.i + 1],
                [f.j + 1, f.i],
                [f.j, f.i - 1]
            ];
            for (var h = 0; h < 4; h++) {
                var f = (l[g[h][0]] || {})[g[h][1]];
                if (f !== undefined) {
                    f = f.get(0);
                    if (f.color === c) {
                        x(f, d);
                        e.push(f)
                    }
                }
            }
        }
    }
    m.click(function (e) {
        var g = e.target;
        f == a ? x(g, v) : f == b ? y(g.i, g.j, g.color, v) : f == c ? x(g, undefined) : f == d && g.color !== undefined && w(g.color)
    });
    for (var z = 0; z < i; z++) {
        l[z] = new Array(h);
        for (var A = 0; A < h; A++) {
            var B = document.createElement("div"),
                C = $(B).width(g).height(g).addClass("pixel");
            if (q) {
                var D = localStorage[r + A.toString() + ":" + z.toString()];
                if (typeof D == "string") {
                    B.color = D;
                    C.css(s, D);
                    p.fillStyle = D;
                    p.fillRect(A, z, 1, 1)
                }
            }
            l[z][A] = C;
            C.appendTo(m);
            B.i = A;
            B.j = z
        }
    }
    n.strokeStyle = "rgba(100, 100, 100, 0.3)";
    for (var E = g; E < j; E += g) {
        n.beginPath();
        n.moveTo(E - 0.5, 0);
        n.lineTo(E - 0.5, k);
        n.stroke();
        n.closePath()
    }
    for (var F = g; F < k; F += g) {
        n.beginPath();
        n.moveTo(0, F - 0.5);
        n.lineTo(j, F - 0.5);
        n.stroke();
        n.closePath()
    }
    $("#clear, #view_png, #tools li, #palette li").each(function () {
        var a = $(this);
        a.attr("title", a.text())
    });
    $("#clear").click(function () {
        $(".pixel").css("background", "");
        p.clearRect(0, 0, h, i);
        if (q) for (var a = 0; a < i; a++) for (var b = 0; b < h; b++) {
            var c = r + b + ":" + a;
            delete localStorage[c]
        }
    });
    $("#view_png").click(function () {
        document.location.href = o.toDataURL("image/png")
    });
    $("#tools").click(function (a) {
        var b = $(a.target).closest("li");
        if (b.length > 0) {
            f = e[b.index()];
            $("#tools .selected").removeClass("selected");
            b.addClass("selected")
        }
    });
    $("#palette").click(function (a) {
        var b = $(a.target).closest("li");
        b.length > 0 && w(b.css(s))
    });
    $("#palette li").each(function () {
        var a = $(this);
        a.css("background", a.text())
    });
    $("#color").click(function () {
        var a = prompt("Please enter a color, e.g. red, #00FF00, rgb(0, 0, 255)", u.text());
        typeof a == "string" && $.trim(a) !== "" && w(a)
    });
    w("HotPink")
})