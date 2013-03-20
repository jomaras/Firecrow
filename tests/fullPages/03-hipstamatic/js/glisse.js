/*
 * jQuery Glisse plugin
 * v1.1
 * ---
 * @author: Victor
 * @authorurl: http://victorcoulon.fr
 * @twitter: http://twitter.com/_victa
 *
 * Based on jQuery Plugin Boilerplate 1.3
 *
 */ (function (a)
{
    a.glisse = function (b, c)
    {
        var d = this;
        d.settings = {}, d.els = {};
        var e = a(b),
            f = {
                dataName: "data-glisse-big",
                speed: 300,
                changeSpeed: 1e3,
                effect: "bounce",
                mobile: !1,
                fullscreen: !1,
                disablindRightClick: !1
            }, g, h, i = !1,
            j = {}, k = [];
        d.init = function ()
        {
            d.settings = a.extend(
                {}, f, c), a.MobileDevice = navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/Android/i), a.Tablet = navigator.userAgent.match(/iPad/i), g = a(e).attr(d.settings.dataName), h = e.attr("rel") || null, d.settings.mobile = a.Tablet || a.MobileDevice ? !0 : !1, e.on("click", function ()
            {
                m(), q(), o(g), r(), s(), l(), a(document).keydown(function (a)
                {
                    a.keyCode.toString() === "27" && n(), a.keyCode.toString() === "39" && p("next"), a.keyCode.toString() === "37" && p("prev")
                }), d.settings.disablindRightClick && d.els.content.on("contextmenu", function (a)
                {
                    return !1
                }), d.settings.mobile && (mobile = {
                    touching: !1,
                    nx: 0,
                    oX: 0,
                    scrollX: null
                }, document.ontouchmove = function (a)
                {
                    x(a)
                }, document.ontouchstart = function (a)
                {
                    x(a)
                }, document.ontouchend = function (a)
                {
                    x(a)
                }, !! isSupportFixed())
            })
        };
        var l = function ()
            {
                function i(a)
                {
                    k.push(a)
                }
                var c, e = [],
                    f, g = this;
                a('img[rel="' + h + '"]').each(function (b, c)
                {
                    e.push(a(this).attr(d.settings.dataName))
                });
                for (f = 0; f < e.length; f += 1) c = jQuery("<img>").attr("src", e[f]), c.load(i(e[f]))
            }, m = function ()
            {
                e.addClass("active");
                var c = u("transition") + "transition",
                    f = "opacity " + d.settings.speed + "ms ease, " + u("transform") + "transform " + d.settings.speed + "ms ease";
                d.els.wrapper = a(document.createElement("div")).attr("id", "glisse-wrapper"), d.els.overlay = a(document.createElement("div")).attr("id", "glisse-overlay").css(c, f), d.els.spinner = a(document.createElement("div")).attr("id", "glisse-spinner"), d.els.close = a(document.createElement("span")).attr("id", "glisse-close").css(c, f), d.els.content = a(document.createElement("div")).attr("id", "glisse-overlay-content").css(c, f).css(u("transform") + "transform", "scale(0)"), d.els.controls = a(document.createElement("div")).attr("id", "glisse-controls").css(c, f), d.els.controlNext = a(document.createElement("span")).attr("class", "glisse-next").append(a(document.createElement("a")).html("&#62;").attr("href", "#")), d.els.controlLegend = a(document.createElement("span")).attr("class", "glisse-legend"), d.els.controlPrev = a(document.createElement("span")).attr("class", "glisse-prev").append(a(document.createElement("a")).html("&#60;").attr("href", "#")), d.els.overlay.append(d.els.spinner), d.els.controls.append(d.els.controlNext, d.els.controlLegend, d.els.controlPrev), d.els.wrapper.append(d.els.overlay, d.els.close, d.els.content, d.els.controls), a("body").append(d.els.wrapper), v.observe("glisse-overlay", function ()
                {
                    d.els.overlay.css("opacity", 1)
                }), v.observe("glisse-close", function ()
                {
                    d.els.close.css("opacity", 1)
                }), v.observe("glisse-controls", function ()
                {
                    d.els.controls.css("opacity", 1)
                }), d.els.controls.delegate("a", "click", function (b)
                {
                    b.preventDefault();
                    var c = a(this).parent().hasClass("glisse-next") ? "next" : "prev";
                    p(c)
                }), d.els.overlay.on("click", function ()
                {
                    n()
                }), d.els.content.on("click", function ()
                {
                    n()
                }), d.els.close.on("click", function ()
                {
                    n()
                });
                if (d.settings.fullscreen)
                {
                    var g = document.documentElement;
                    g.requestFullscreen ? g.requestFullscreen() : g.mozRequestFullScreen ? (g.mozRequestFullScreen(), console.log("ok")) : g.webkitRequestFullScreen && g.webkitRequestFullScreen()
                }
            }, n = function ()
            {
                d.els.content.css(
                    {
                        opacity: 0
                    }).css(u("transform") + "transform", "scale(1.2)"), d.els.overlay.css(
                    {
                        opacity: 0
                    }), d.els.close.css(
                    {
                        opacity: 0
                    }), d.els.controls.css(
                    {
                        opacity: 0
                    }), setTimeout(function ()
                {
                    d.els.content.remove(), d.els.overlay.remove(), d.els.close.remove(), d.els.controls.remove(), d.els.wrapper.remove(), a("#glisse-transition-css").remove()
                }, d.settings.speed), g = a(e).attr(d.settings.dataName), e.removeClass("active"), document.ontouchmove = function (a)
                {
                    return !0
                }, document.ontouchstart = function (a)
                {
                    return !0
                }, document.ontouchend = function (a)
                {
                    return !0
                }, a(document).unbind("keydown"), d.settings.fullscreen && (document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen())
            }, o = function (c)
            {
                t(!0);
                var e = c,
                    f = a("<img/>",
                        {
                            src: e
                        }).appendTo(d.els.content);
                d.els.content.css(
                    {
                        backgroundImage: "url(" + e + ")"
                    }), f.load(function ()
                {
                    f.remove(), t(!1), d.els.content.css(
                        {
                            visibility: "visible",
                            opacity: 1
                        }).css(u("transform") + "transform", "scale(1)")
                })
            }, p = function (c)
            {
                var e = a('img[data-glisse-big="' + g + '"]'),
                    f = a("img[rel=" + h + "]").index(e),
                    j = a("img[rel=" + h + "]").length,
                    l = !0;
                if (f === 0 && c === "prev" || f === j - 1 && c === "next") l = !1;
                if (l && i === !1)
                {
                    i = !0;
                    var m = c === "next" ? a("img[rel=" + h + "]").eq(f + 1) : a("img[rel=" + h + "]").eq(f - 1);
                    if (d.settings.mobile) c !== "next" ? d.els.content.css(u("transform") + "transform", "translateX(2000px)") : d.els.content.css(u("transform") + "transform", "translateX(-2000px)");
                    else
                    {
                        d.els.content.addClass("glisse-transitionOut-" + c);
                        var n = u("transition") + "transition",
                            o = "opacity " + d.settings.speed + "ms ease, " + u("transform") + "transform " + d.settings.speed + "ms ease";
                        d.els.content.css(n, "")
                    }
                    g = m.attr(d.settings.dataName), k.indexOf(g) === -1 && t(!0), e.removeClass("active"), m.addClass("active"), r(), s(), setTimeout(function ()
                    {
                        d.settings.mobile && d.els.content.css(u("transform") + "transform", "translateX(0px)").css("display", "none");
                        var b = g,
                            e = a("<img/>",
                                {
                                    src: b
                                }).appendTo(d.els.content);
                        d.els.content.css(
                            {
                                backgroundImage: "url(" + b + ")"
                            }), e.load(function ()
                        {
                            e.remove(), k.indexOf(g) === -1 && t(!1), d.settings.mobile && d.els.content.css("display", "block"), d.els.content.removeClass("glisse-transitionOut-" + c).addClass("glisse-transitionIn-" + c), setTimeout(function ()
                            {
                                d.els.content.removeClass("glisse-transitionIn-" + c).css(n, o), i = !1
                            }, d.settings.changeSpeed)
                        })
                    }, d.settings.changeSpeed)
                }
                else l === !1 && i === !1 && (d.settings.mobile && d.els.content.css(u("transform") + "transform", "translateX(0px)"), d.els.content.addClass("shake"), setTimeout(function ()
                {
                    d.els.content.removeClass("shake")
                }, 600))
            }, q = function ()
            {
                var c = u("transform"),
                    e = u("animation"),
                    f = [];
                w(d.settings.effect) || (d.settings.effect = "bounce");
                switch (d.settings.effect)
                {
                    case "bounce":
                        f = ["@" + e + "keyframes outLeft {", "0% { " + c + "transform: translateX(0);}", "20% { opacity: 1;" + c + "transform: translateX(20px);}", "100% { opacity: 0;" + c + "transform: translateX(-2000px);}", "}", "@" + e + "keyframes inLeft {", "0% {opacity: 0;" + c + "transform: translateX(-2000px);}", "60% {opacity: 1;" + c + "transform: translateX(30px);}", "80% {" + c + "transform: translateX(-10px);}", "100% {" + c + "transform: translateX(0);}", "}", "@" + e + "keyframes outRight {", "0% {" + c + "transform: translateX(0);}", "20% {opacity: 1;" + c + "transform: translateX(-20px);}", "100% {opacity: 0;" + c + "transform: translateX(2000px);}", "}", "@" + e + "keyframes inRight {", "0% {opacity: 0;" + c + "transform: translateX(2000px);}", "60% {opacity: 1;" + c + "transform: translateX(-30px);}", "80% {" + c + "transform: translateX(10px);}", "100% {" + c + "transform: translateX(0);}", "}"].join("");
                        break;
                    case "fadeBig":
                        f = ["@" + e + "keyframes outLeft {", "0% { opacity: 1;" + c + "transform: translateX(0);}", "100% {opacity: 0;" + c + "transform: translateX(-2000px);}", "}", "@" + e + "keyframes inLeft {", "0% { opacity: 0;" + c + "transform: translateX(-2000px);}", "100% {opacity: 1;" + c + "transform: translateX(0);}", "}", "@" + e + "keyframes outRight {", "0% { opacity: 1;" + c + "transform: translateX(0);}", "100% {opacity: 0;" + c + "transform: translateX(2000px);}", "}", "@" + e + "keyframes inRight {", "0% { opacity: 0;" + c + "transform: translateX(2000px);}", "100% {opacity: 1;" + c + "transform: translateX(0);}", "}"].join("");
                        break;
                    case "fade":
                        f = ["@" + e + "keyframes outLeft {", "0% { opacity: 1;" + c + "transform: translateX(0);}", "100% {opacity: 0;" + c + "transform: translateX(-200px);}", "}", "@" + e + "keyframes inLeft {", "0% { opacity: 0;" + c + "transform: translateX(-200px);}", "100% {opacity: 1;" + c + "transform: translateX(0);}", "}", "@" + e + "keyframes outRight {", "0% { opacity: 1;" + c + "transform: translateX(0);}", "100% {opacity: 0;" + c + "transform: translateX(200px);}", "}", "@" + e + "keyframes inRight {", "0% { opacity: 0;" + c + "transform: translateX(200px);}", "100% {opacity: 1;" + c + "transform: translateX(0);}", "}"].join("");
                        break;
                    case "roll":
                        f = ["@" + e + "keyframes outLeft {", "0% { opacity: 1;" + c + "transform: translateX(0px) rotate(0deg);}", "100% {opacity: 0;" + c + "transform: translateX(-100%) rotate(-120deg);}", "}", "@" + e + "keyframes inLeft {", "0% { opacity: 0;" + c + "transform: translateX(-100%) rotate(-120deg);}", "100% {opacity: 1;" + c + "transform:  translateX(0px) rotate(0deg);}", "}", "@" + e + "keyframes outRight {", "0% { opacity: 1;" + c + "transform:translateX(0px) rotate(0deg);}", "100% {opacity: 0;" + c + "transform:translateX(100%) rotate(120deg);}", "}", "@" + e + "keyframes inRight {", "0% { opacity: 0;" + c + "transform: translateX(100%) rotate(120deg);}", "100% {opacity: 1;" + c + "transform:  translateX(0px) rotate(0deg);}", "}"].join("");
                        break;
                    case "rotate":
                        f = ["@" + e + "keyframes outRight {", "0% { opacity: 1;" + c + "transform: rotate(0deg);" + c + "transform-origin:left bottom;}", "100% {opacity: 0;" + c + "transform: rotate(-90deg);" + c + "transform-origin:left bottom;}", "}", "@" + e + "keyframes inLeft {", "0% { opacity: 0;" + c + "transform: rotate(90deg);" + c + "transform-origin:left bottom;}", "100% {opacity: 1;" + c + "transform: rotate(0deg);" + c + "transform-origin:left bottom;}", "}", "@" + e + "keyframes outLeft {", "0% { opacity: 1;" + c + "transform: rotate(0deg);" + c + "transform-origin:right bottom;}", "100% {opacity: 0;" + c + "transform: rotate(90deg);" + c + "transform-origin:right bottom;}", "}", "@" + e + "keyframes inRight {", "0% { opacity: 0;" + c + "transform: rotate(-90deg);" + c + "transform-origin:right bottom;}", "100% {opacity: 1;" + c + "transform: rotate(0deg);" + c + "transform-origin:right bottom;}", "}"].join("");
                        break;
                    case "flipX":
                        f = ["@" + e + "keyframes outLeft {", "0% {" + c + "transform: perspective(400px) rotateX(0deg);opacity: 1;}", "100% {" + c + "transform: perspective(400px) rotateX(90deg);opacity: 0;}", "}", "@" + e + "keyframes inLeft {", "0% {" + c + "transform: perspective(400px) rotateX(90deg);opacity: 0;}", "40% {" + c + "transform: perspective(400px) rotateX(-10deg);}", "70% {" + c + "transform: perspective(400px) rotateX(10deg);}", "100% {" + c + "transform: perspective(400px) rotateX(0deg);opacity: 1;}", "}", "@" + e + "keyframes outRight {", "0% {" + c + "transform: perspective(400px) rotateX(0deg);opacity: 1;}", "100% {" + c + "transform: perspective(400px) rotateX(90deg);opacity: 0;}", "}", "@" + e + "keyframes inRight {", "0% {" + c + "transform: perspective(400px) rotateX(90deg);opacity: 0;}", "40% {" + c + "transform: perspective(400px) rotateX(-10deg);}", "70% {" + c + "transform: perspective(400px) rotateX(10deg);}", "100% {" + c + "transform: perspective(400px) rotateX(0deg);opacity: 1;}", "}"].join("");
                        break;
                    case "flipY":
                        f = ["@" + e + "keyframes outLeft {", "0% {" + c + "transform: perspective(400px) rotateY(0deg);opacity: 1;}", "100% {" + c + "transform: perspective(400px) rotateY(90deg);opacity: 0;}", "}", "@" + e + "keyframes inLeft {", "0% {" + c + "transform: perspective(400px) rotateY(90deg);opacity: 0;}", "40% {" + c + "transform: perspective(400px) rotateY(-10deg);}", "70% {" + c + "transform: perspective(400px) rotateY(10deg);}", "100% {" + c + "transform: perspective(400px) rotateY(0deg);opacity: 1;}", "}", "@" + e + "keyframes outRight {", "0% {" + c + "transform: perspective(400px) rotateY(0deg);opacity: 1;}", "100% {" + c + "transform: perspective(400px) rotateY(-90deg);opacity: 0;}", "}", "@" + e + "keyframes inRight {", "0% {" + c + "transform: perspective(400px) rotateY(90deg);opacity: 0;}", "40% {" + c + "transform: perspective(400px) rotateY(-10deg);}", "70% {" + c + "transform: perspective(400px) rotateY(10deg);}", "100% {" + c + "transform: perspective(400px) rotateY(0deg);opacity: 1;}", "}"].join("")
                }
                var g = [".glisse-transitionOut-next {", e + "animation: " + d.settings.changeSpeed + "ms ease;", e + "animation-name: outLeft;", e + "animation-fill-mode: both;", "}", ".glisse-transitionIn-prev {", e + "animation: " + d.settings.changeSpeed + "ms ease;", e + "animation-name: inLeft;", e + "animation-fill-mode: both;", "}", ".glisse-transitionOut-prev {", e + "animation: " + d.settings.changeSpeed + "ms ease;", e + "animation-name: outRight;", e + "animation-fill-mode: both;", "}", ".glisse-transitionIn-next {", e + "animation: " + d.settings.changeSpeed + "ms ease;", e + "animation-name: inRight;", e + "animation-fill-mode: both;", "}"].join("");
                document.getElementById("glisse-css") ? a("#glisse-css").html(f + g) : a('<style type="text/css" id="glisse-css">' + f + g + "</style>").appendTo("head")
            }, r = function ()
            {
                var c = a('img[data-glisse-big="' + g + '"]');
                c.parent().next().find("img[rel=" + h + "]").length ? d.els.controls.find(".glisse-next").removeClass("ended") : d.els.controls.find(".glisse-next").addClass("ended"), c.parent().prev().find("img[rel=" + h + "]").length ? d.els.controls.find(".glisse-prev").removeClass("ended") : d.els.controls.find(".glisse-prev").addClass("ended")
            }, s = function ()
            {
                var c = d.els.controls.find(".glisse-legend"),
                    e = a('img[data-glisse-big="' + g + '"]'),
                    f = e.attr("title");
                c.html(f ? f : "")
            }, t = function (b)
            {
                b ? d.els.overlay.addClass("loading") : d.els.overlay.removeClass("loading")
            }, u = function (b)
            {
                var c = ["Moz", "Khtml", "Webkit", "O", "ms"],
                    d = document.createElement("div"),
                    e = b.charAt(0).toUpperCase() + b.slice(1);
                for (var f = c.length; f--;) if (c[f] + e in d.style) return "-" + c[f].toLowerCase() + "-";
                return !1
            }, v = function ()
            {
                return {
                    observe: function (a, b)
                    {
                        var c = setInterval(function ()
                        {
                            document.getElementById(a) && (b(document.getElementById(a)), clearInterval(c))
                        }, 60)
                    }
                }
            }(),
            w = function (b)
            {
                var c = ["bounce", "fadeBig", "fade", "roll", "rotate", "flipX", "flipY"];
                if (typeof b == "string" && isNaN(b) && c.indexOf(b) !== -1) return !0
            }, x = function (b)
            {
                if (b.type == "touchstart")
                {
                    mobile.touching = !0;
                    if (b.touches.length == 1)
                    {
                        d.els.content.css(u("transition") + "transition", "");
                        var c = b.touches[0];
                        c.target.onclick && c.target.onclick(), mobile.oX = c.pageX, mobile.nX = 0, mobile.scrollX = 0
                    }
                }
                else if (b.type == "touchmove")
                {
                    b.preventDefault(), mobile.scrollX = null;
                    if (b.touches.length == 1)
                    {
                        var c = b.touches[0];
                        mobile.nX = c.pageX, mobile.oX > mobile.nX ? mobile.scrollX = -(mobile.oX - mobile.nX) : mobile.nX > mobile.oX && (mobile.scrollX = mobile.nX - mobile.oX), d.els.content.css(u("transform") + "transform", "translateX(" + mobile.scrollX + "px)")
                    }
                }
                else if (b.type == "touchend" || b.type == "touchcancel")
                {
                    mobile.touching = !1;
                    var e = u("transition") + "transition",
                        f = "opacity " + d.settings.speed + "ms ease, " + u("transform") + "transform " + d.settings.speed + "ms ease";
                    d.els.content.css(e, f), mobile.scrollX > 140 ? p("prev") : mobile.scrollX < -140 ? p("next") : d.els.content.css(u("transform") + "transform", "translateX(0px)")
                }
            };
        d.changeEffect = function (a)
        {
            w(a) && (d.settings.effect = a, q())
        }, d.init()
    }, a.fn.glisse = function (b)
    {
        return this.each(function ()
        {
            if (undefined === a(this).data("glisse"))
            {
                var c = new a.glisse(this, b);
                a(this).data("glisse", c)
            }
        })
    }
})(jQuery);