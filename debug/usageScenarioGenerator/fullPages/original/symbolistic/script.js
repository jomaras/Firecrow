(function (w, k) {
    var lastRandom = 0, isRandomGrowing = true;
    Math.random = function()
    {
        isRandomGrowing ? lastRandom += 0.02
            : lastRandom -= 0.02;

        if(lastRandom >= 1) { lastRandom = 0.99; isRandomGrowing = false; }
        if(lastRandom <= 0) { lastRandom = 0.01; isRandomGrowing = true; }

        return lastRandom;
    }
    var t = ["!", "@", "$", "&amp;", "/", "{", "(", "[", ")", "]", "=", "}", "+", "?", "\\", "^", "Â¨", "*", "Ă…", "â", "â‹", "â§", "â¨", "âŠ•", "âŠ—", "â—Š", "Â¤", "Âˇ", "Âż", "Ă—", "Ă·", "Â°", "Â¬", "â ", "âŞ", "â´", "âĽ", "âŠĄ"],
        x = 3,
        i = [],
        C = [],
        q = [],
        m = 0,
        h = null,
        f = function (e) {
            return w.getElementById(e)
        }, z = f("start"),
        b = z.getElementsByClassName("sp").item(0),
        g = f("gameover"),
        n = g.getElementsByClassName("sp").item(0),
        p = f("sClick"),
        j = f("tiles"),
        s = f("points"),
        v = w.getElementsByClassName(".sp");

    function a(E, e) {
        return new RegExp("(^| )" + e + "( |$)").test(E.className) ? true : false
    }
    function o(e, E) {
        e.className = (!e.className ? E : e.className + " " + E)
    }
    function r(e, E) {
        e.className = e.className.replace(E, "").replace(/^\s+|\s+$/g, "")
    }
    function y(F, E, e) {
        if (F.attachEvent) {
            F["e" + E + e] = e;
            F[E + e] = function () {
                F["e" + E + e](k.event)
            };
            F.attachEvent("on" + E, F[E + e])
        } else {
            F.addEventListener(E, e, false)
        }
    }
    var d = {};
    try {
        if ("localStorage" in k && k.localStorage !== null && k.localStorage !== undefined) {
            o(g, "localstorage");
            d.localStorage = true
        }
    } catch (B) {
        d.localStorage = false
    }
    function u(F) {
        C = [];
        q = [];
        i = [];
        r(j, "correct");
        var H = 2,
            G = "";
        while (H--) {
            do {
                var E = t[Math.floor(Math.random() * t.length)]
            } while (C.indexOf(E) !== -1);
            i.push(E);
            C.push(E);
            G += "<span>" + E + "</span>"
        }
        while (C.length < F) {
            do {
                var E = t[Math.floor(Math.random() * t.length)]
            } while (C.indexOf(E) !== -1);
            C.push(E)
        }
        f("answer").innerHTML = G;
        j.innerHTML = "";
        while (C.length > 0) {
            var E = C[Math.floor(Math.random() * C.length)];
            var e = w.createElement("button");
            e.innerHTML = E;
            j.appendChild(e);
            C.splice(C.indexOf(E), 1)
        }
    }
    y(j, "mousedown", function (e) {
        var F = (e.srcElement !== undefined ? e.srcElement : e.target);
        if (F.tagName !== "BUTTON") {
            return
        }
        p.play();
        if (q.indexOf(F.innerHTML) == -1) {
            o(F, "selected");
            q.push(F.innerHTML)
        } else {
            r(F, "selected");
            q.splice(q.indexOf(F.innerHTML), 1)
        }
        if (i.length != q.length) {
            return
        }
        var E = i.length;
        while (E--) {
            if (q.indexOf(i[E]) == -1) {
                return
            }
        }
        o(j, "correct");
        h.addTime(2);
        m += 10;
        setTimeout(function () {
            s.innerHTML = m
        }, 200);
        setTimeout(function () {
            u(++x)
        }, 400)
    }, false);

    function c() {
        w.body.className = "s-p";
        x = 3;
        m = 0;
        u(x);
        f("stopwatch").innerHTML = "20:00:00";
        h = new l(f("stopwatch"))
    }
    y(f("bS"), "click", function (e) {
        p.play();
        c()
    }, false);

    function A() {
        if (d.localStorage === true) {
            var e = k.localStorage;
            if (e.getItem("highscore") === undefined) {
                e.setItem("highscore", 0)
            }
            if (e.getItem("highscore") < m) {
                o(g, "highscore");
                e.setItem("highscore", m)
            }
            f("goHighPoints").innerHTML = e.getItem("highscore")
        }
        f("goPoints").innerHTML = m;
        f("goSeconds").innerHTML = (m / 10 * 2) + 20;
        f("twBrag").href = "http://twitter.com/home?status=Just massed " + m + " points in Symbol Shapes! Can you match me? http://mintusability.com/symbolistic";
        if (m < 1) {
            g.getElementsByTagName("h2").item(0).innerHTML = "You got them... Wait. Are you alive?"
        }
        w.body.className = "s-go";
        D()
    }
    y(f("bA"), "click", function (e) {
        p.play();
        r(g, "highscore");
        c()
    }, false);

    function D() {
        if (w.body.className == "s-w") {
            b.setAttribute("style", "margin-top: -" + (z.getElementsByTagName("div").item(0).offsetHeight / 2) + "px")
        } else {
            if (w.body.className == "s-go") {
                n.setAttribute("style", "margin-top: -" + (g.getElementsByTagName("div").item(0).offsetHeight / 2) + "px")
            }
        }
    }
    y(k, "resize", D);
    D();

    function l(E) {
        var I = (new Date()).valueOf() + 20000,
            G = "",
            F = (e ? 1000 : 10),
            e = navigator.userAgent.match(/iPad/i) != null;
        r(E, "low");
        var H = setInterval(function () {
            var J = I - (new Date()).valueOf(),
                L = new Date(J).toString().replace(/.*(\d{2}:\d{2}).*/, "$1"),
                K = "000";
            if (!e) {
                K = String(J % 1000);
                while (K.length < 3) {
                    K = "0" + K
                }
            }
            if (J < 0) {
                clearInterval(H);
                L = "00:00";
                K = "000";
                A()
            }
            if (G == "" && J < 5000) {
                G = "low";
                o(E, "low")
            } else {
                if (G == "low" && J > 5000) {
                    G = "";
                    r(E, "low")
                }
            }
            E.innerHTML = L + ":" + K.substr(0, K.length - 1);
            delete(L)
        }, F);
        return {
            addTime: function (J) {
                I += J * 1000;
                o(E, "moar");
                setTimeout(function () {
                    r(E, "moar")
                }, 500)
            }
        }
    }
})(document, window);