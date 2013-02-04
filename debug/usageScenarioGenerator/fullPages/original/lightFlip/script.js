function lightFlip(a, b, c) {
    function p(b, c) {
        b.fillStyle = "rgba(255,254,186,1)";
        $(c).each(function (c, d) {
            var e = d.x * a.innerWidth;
            var f = d.y * a.innerHeight;
            b.fillRect(e, f, 5, 5)
        })
    }
    function o(a) {
        for (var b = 0; b < 3; b++) {
            var c = "rgba(255,254,186," + (1 - b * .33) + ")";
            a.strokeStyle = c;
            a.fillStyle = c;
            a.beginPath();
            a.arc(200, 200, 50 + 25 * b, 0, Math.PI * 2, true);
            a.closePath();
            a.stroke();
            a.fill()
        }
    }
    function n() {
        var a = [];
        for (var b = 0; b < 100; b++) {
            a.push({
                x: Math.random(),
                y: Math.random()
            })
        }
        return a
    }
    function m(b) {
        if ($("table").find(".light").length === 0) {
            a.alert("You have won in " + b + " moves.");
            location.reload(true)
        }
    }
    function l(a) {
        if (a.hasClass("light")) {
            a.removeClass("light");
            a.addClass("dark")
        } else {
            a.removeClass("dark");
            a.addClass("light")
        }
    }
    function k() {
        var a = $("table");
        var c = 5;
        g = 0;
        $("tr").remove();
        for (var d = 0; d < c; d++) {
            var e = $(b.createElement("tr"));
            for (var f = 0; f < c; f++) {
                var h = $(b.createElement("td"));
                h.addClass(Math.random() >= .5 ? "light" : "dark");
                e.append(h)
            }
            a.append(e)
        }
        j($("#instructions"))
    }
    function j(b) {
        var c = Math.min(a.innerWidth / 2, a.innerHeight / 2);
        c = Math.max(c, 320);
        b.css("width", c);
        b.css("height", c);
        b.css("margin-left", c / -2)
    }
    function i() {
        $("#sky").attr("width", a.innerWidth);
        $("#sky").attr("height", a.innerHeight);
        if (Math.max(a.innerWidth, a.innerHeight > 320)) {
            o(e);
            p(e, f)
        }
        j($("table"));
        if ($("#instructions")) {
            j($("#instructions"))
        }
    }
    var d = b.getElementById("sky");
    var e = d.getContext("2d");
    var f = n();
    var g = 0;
    var h = 5;
    i();
    k();
    $("#reset").click(function () {
        k()
    });
    $("table").delegate("td", "click", function () {
        l($(this));
        g++;
        var a = $(this).index();
        var b = $(this).parent().index();
        if (b - 1 >= 0) {
            l($("table").find("tr:eq(" + (b - 1) + ") td:eq(" + a + ")"))
        }
        if (b + 1 < h) {
            l($("table").find("tr:eq(" + (b + 1) + ") td:eq(" + a + ")"))
        }
        if (a - 1 >= 0) {
            l($("table").find("tr:eq(" + b + ") td:eq(" + (a - 1) + ")"))
        }
        if (a + 1 < h) {
            l($("table").find("tr:eq(" + b + ") td:eq(" + (a + 1) + ")"))
        }
        m(g)
    });
    $("#instructions").click(function () {
        $("#instructions").remove()
    });
    $(a).resize(i)
}
$(document).ready(function () {
    lightFlip(window, document)
})