/* imagesLoaded */
(function (c, q) {
    var m = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    c.fn.imagesLoaded = function (f) {
        function n() {
            var b = c(j),
                a = c(h);
            d && (h.length ? d.reject(e, b, a) : d.resolve(e));
            c.isFunction(f) && f.call(g, e, b, a)
        }

        function p(b) {
            k(b.target, "error" === b.type)
        }

        function k(b, a) {
            b.src === m || -1 !== c.inArray(b, l) || (l.push(b), a ? h.push(b) : j.push(b), c.data(b, "imagesLoaded", {
                isBroken: a,
                src: b.src
            }), r && d.notifyWith(c(b), [a, e, c(j), c(h)]), e.length === l.length && (setTimeout(n), e.unbind(".imagesLoaded",
                p)))
        }
        var g = this,
            d = c.isFunction(c.Deferred) ? c.Deferred() : 0,
            r = c.isFunction(d.notify),
            e = g.find("img").add(g.filter("img")),
            l = [],
            j = [],
            h = [];
        c.isPlainObject(f) && c.each(f, function (b, a) {
            if ("callback" === b) f = a;
            else if (d) d[b](a)
        });
        e.length ? e.bind("load.imagesLoaded error.imagesLoaded", p).each(function (b, a) {
            var d = a.src,
                e = c.data(a, "imagesLoaded");
            if (e && e.src === d) k(a, e.isBroken);
            else if (a.complete && a.naturalWidth !== q) k(a, 0 === a.naturalWidth || 0 === a.naturalHeight);
            else if (a.readyState || a.complete) a.src = m, a.src = d
        }) :
            n();
        return d ? d.promise(g) : g
    }
})(jQuery);

/*!
* jQuery Cycle2; ver: 20130327
* http://jquery.malsup.com/cycle2/
* Copyright (c) 2013 M. Alsup; Dual licensed: MIT/GPL
*/
(function (a) {
    function c(a) {
        return (a || "").toLowerCase()
    }
    "use strict";
    var b = "20130323";
    a.fn.cycle = function (b) {
        var d;
        return this.length === 0 && !a.isReady ? (d = {
            s: this.selector,
            c: this.context
        }, a.fn.cycle.log("requeuing slideshow (dom not ready)"), a(function () {
            a(d.s, d.c).cycle(b)
        }), this) : this.each(function () {
            var d, e, f, g, h = a(this),
                i = a.fn.cycle.log;
            if (h.data("cycle.opts")) return;
            if (h.data("cycle-log") === !1 || b && b.log === !1 || e && e.log === !1) i = a.noop;
            i("--c2 init--"), d = h.data();
            for (var j in d) d.hasOwnProperty(j) && /^cycle[A-Z]+/.test(j) && (g = d[j], f = j.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, c), i(f + ":", g, "(" + typeof g + ")"), d[f] = g);
            e = a.extend({}, a.fn.cycle.defaults, d, b || {}), e.timeoutId = 0, e.paused = e.paused || !1, e.container = h, e._maxZ = e.maxZ, e.API = a.extend({
                _container: h
            }, a.fn.cycle.API), e.API.log = i, e.API.trigger = function (a, b) {
                return e.container.trigger(a, b), e.API
            }, h.data("cycle.opts", e), h.data("cycle.API", e.API), e.API.trigger("cycle-bootstrap", [e, e.API]), e.API.addInitialSlides(), e.API.preInitSlideshow(), e.slides.length && e.API.initSlideshow()
        })
    }, a.fn.cycle.API = {
        opts: function () {
            return this._container.data("cycle.opts")
        },
        addInitialSlides: function () {
            var b = this.opts(),
                c = b.slides;
            b.slideCount = 0, b.slides = a(), c = c.jquery ? c : b.container.find(c), b.random && c.sort(function () {
                return Math.random() - .5
            }), b.API.add(c)
        },
        preInitSlideshow: function () {
            var b = this.opts();
            b.API.trigger("cycle-pre-initialize", [b]);
            var c = a.fn.cycle.transitions[b.fx];
            c && a.isFunction(c.preInit) && c.preInit(b), b._preInitialized = !0
        },
        postInitSlideshow: function () {
            var b = this.opts();
            b.API.trigger("cycle-post-initialize", [b]);
            var c = a.fn.cycle.transitions[b.fx];
            c && a.isFunction(c.postInit) && c.postInit(b)
        },
        initSlideshow: function () {
            var b = this.opts(),
                c = b.container,
                d;
            b.API.calcFirstSlide(), b.container.css("position") == "static" && b.container.css("position", "relative"), a(b.slides[b.currSlide]).css("opacity", 1).show(), b.API.stackSlides(b.slides[b.currSlide], b.slides[b.nextSlide], !b.reverse), b.pauseOnHover && (b.pauseOnHover !== !0 && (c = a(b.pauseOnHover)), c.hover(function () {
                b.API.pause(!0)
            }, function () {
                b.API.resume(!0)
            })), b.timeout && (d = b.API.getSlideOpts(b.nextSlide), b.API.queueTransition(d, b.timeout + b.delay)), b._initialized = !0, b.API.updateView(!0), b.API.trigger("cycle-initialized", [b]), b.API.postInitSlideshow()
        },
        pause: function (b) {
            var c = this.opts(),
                d = c.API.getSlideOpts(),
                e = c.hoverPaused || c.paused;
            b ? c.hoverPaused = !0 : c.paused = !0, e || (c.container.addClass("cycle-paused"), c.API.trigger("cycle-paused", [c]).log("cycle-paused"), d.timeout && (clearTimeout(c.timeoutId), c.timeoutId = 0, c._remainingTimeout -= a.now() - c._lastQueue, c._remainingTimeout < 0 && (c._remainingTimeout = undefined)))
        },
        resume: function (a) {
            var b = this.opts(),
                c = !b.hoverPaused && !b.paused,
                d;
            a ? b.hoverPaused = !1 : b.paused = !1, c || (b.container.removeClass("cycle-paused"), b.API.queueTransition(b.API.getSlideOpts(), b._remainingTimeout), b.API.trigger("cycle-resumed", [b, b._remainingTimeout]).log("cycle-resumed"))
        },
        add: function (b, c) {
            var d = this.opts(),
                e = d.slideCount,
                f = !1,
                g;
            a.type(b) == "string" && (b = a.trim(b)), a(b).each(function (b) {
                var e, f = a(this);
                c ? d.container.prepend(f) : d.container.append(f), d.slideCount++, e = d.API.buildSlideOpts(f), c ? d.slides = a(f).add(d.slides) : d.slides = d.slides.add(f), d.API.initSlide(e, f, --d._maxZ), f.data("cycle.opts", e), d.API.trigger("cycle-slide-added", [d, e, f])
            }), d.API.updateView(!0), f = d._preInitialized && e < 2 && d.slideCount >= 1, f && (d._initialized ? d.timeout && (g = d.slides.length, d.nextSlide = d.reverse ? g - 1 : 1, d.timeoutId || d.API.queueTransition(d)) : d.API.initSlideshow())
        },
        calcFirstSlide: function () {
            var a = this.opts(),
                b;
            b = parseInt(a.startingSlide || 0, 10);
            if (b >= a.slides.length || b < 0) b = 0;
            a.currSlide = b, a.reverse ? (a.nextSlide = b - 1, a.nextSlide < 0 && (a.nextSlide = a.slides.length - 1)) : (a.nextSlide = b + 1, a.nextSlide == a.slides.length && (a.nextSlide = 0))
        },
        calcNextSlide: function () {
            var a = this.opts(),
                b;
            a.reverse ? (b = a.nextSlide - 1 < 0, a.nextSlide = b ? a.slideCount - 1 : a.nextSlide - 1, a.currSlide = b ? 0 : a.nextSlide + 1) : (b = a.nextSlide + 1 == a.slides.length, a.nextSlide = b ? 0 : a.nextSlide + 1, a.currSlide = b ? a.slides.length - 1 : a.nextSlide - 1)
        },
        calcTx: function (b, c) {
            var d = b,
                e;
            return c && d.manualFx && (e = a.fn.cycle.transitions[d.manualFx]), e || (e = a.fn.cycle.transitions[d.fx]), e || (e = a.fn.cycle.transitions.fade, d.API.log('Transition "' + d.fx + '" not found.  Using fade.')), e
        },
        prepareTx: function (a, b) {
            var c = this.opts(),
                d, e, f, g, h;
            if (c.slideCount < 2) {
                c.timeoutId = 0;
                return
            }
            a && (!c.busy || c.manualTrump) && (c.API.stopTransition(), c.busy = !1, clearTimeout(c.timeoutId), c.timeoutId = 0);
            if (c.busy) return;
            if (c.timeoutId === 0 && !a) return;
            e = c.slides[c.currSlide], f = c.slides[c.nextSlide], g = c.API.getSlideOpts(c.nextSlide), h = c.API.calcTx(g, a), c._tx = h, a && g.manualSpeed !== undefined && (g.speed = g.manualSpeed), c.nextSlide != c.currSlide && (a || !c.paused && !c.hoverPaused && c.timeout) ? (c.API.trigger("cycle-before", [g, e, f, b]), h.before && h.before(g, e, f, b), d = function () {
                c.busy = !1;
                if (!c.container.data("cycle.opts")) return;
                h.after && h.after(g, e, f, b), c.API.trigger("cycle-after", [g, e, f, b]), c.API.queueTransition(g), c.API.updateView(!0)
            }, c.busy = !0, h.transition ? h.transition(g, e, f, b, d) : c.API.doTransition(g, e, f, b, d), c.API.calcNextSlide(), c.API.updateView()) : c.API.queueTransition(g)
        },
        doTransition: function (b, c, d, e, f) {
            var g = b,
                h = a(c),
                i = a(d),
                j = function () {
                    i.animate(g.animIn || {
                        opacity: 1
                    }, g.speed, g.easeIn || g.easing, f)
                };
            i.css(g.cssBefore || {}), h.animate(g.animOut || {}, g.speed, g.easeOut || g.easing, function () {
                h.css(g.cssAfter || {}), g.sync || j()
            }), g.sync && j()
        },
        queueTransition: function (b, c) {
            var d = this.opts(),
                e = c !== undefined ? c : b.timeout;
            if (d.nextSlide === 0 && --d.loop === 0) {
                d.API.log("terminating; loop=0"), d.timeout = 0, e ? setTimeout(function () {
                    d.API.trigger("cycle-finished", [d])
                }, e) : d.API.trigger("cycle-finished", [d]), d.nextSlide = d.currSlide;
                return
            }
            e && (d._lastQueue = a.now(), c === undefined && (d._remainingTimeout = b.timeout), !d.paused && !d.hoverPaused && (d.timeoutId = setTimeout(function () {
                d.API.prepareTx(!1, !d.reverse)
            }, e)))
        },
        stopTransition: function () {
            var a = this.opts();
            a.slides.filter(":animated").length && (a.slides.stop(!1, !0), a.API.trigger("cycle-transition-stopped", [a])), a._tx && a._tx.stopTransition && a._tx.stopTransition(a)
        },
        advanceSlide: function (a) {
            var b = this.opts();
            return clearTimeout(b.timeoutId), b.timeoutId = 0, b.nextSlide = b.currSlide + a, b.nextSlide < 0 ? b.nextSlide = b.slides.length - 1 : b.nextSlide >= b.slides.length && (b.nextSlide = 0), b.API.prepareTx(!0, a >= 0), !1
        },
        buildSlideOpts: function (b) {
            var d = this.opts(),
                e, f, g = b.data() || {};
            for (var h in g) g.hasOwnProperty(h) && /^cycle[A-Z]+/.test(h) && (e = g[h], f = h.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, c), d.API.log("[" + (d.slideCount - 1) + "]", f + ":", e, "(" + typeof e + ")"), g[f] = e);
            g = a.extend({}, a.fn.cycle.defaults, d, g), g.slideNum = d.slideCount;
            try {
                delete g.API, delete g.slideCount, delete g.currSlide, delete g.nextSlide, delete g.slides
            } catch (i) {}
            return g
        },
        getSlideOpts: function (b) {
            var c = this.opts();
            b === undefined && (b = c.currSlide);
            var d = c.slides[b],
                e = a(d).data("cycle.opts");
            return a.extend({}, c, e)
        },
        initSlide: function (b, c, d) {
            var e = this.opts();
            c.css(b.slideCss || {}), d > 0 && c.css("zIndex", d), isNaN(b.speed) && (b.speed = a.fx.speeds[b.speed] || a.fx.speeds._default), b.sync || (b.speed = b.speed / 2), c.addClass(e.slideClass)
        },
        updateView: function (a) {
            var b = this.opts();
            if (!b._initialized) return;
            var c = b.API.getSlideOpts(),
                d = b.slides[b.currSlide];
            if (!a) {
                b.API.trigger("cycle-update-view-before", [b, c, d]);
                if (b.updateView < 0) return
            }
            b.slideActiveClass && b.slides.removeClass(b.slideActiveClass).eq(b.currSlide).addClass(b.slideActiveClass), a && b.hideNonActive && b.slides.filter(":not(." + b.slideActiveClass + ")").hide(), b.API.trigger("cycle-update-view", [b, c, d, a]), b.API.trigger("cycle-update-view-after", [b, c, d])
        },
        getComponent: function (b) {
            var c = this.opts(),
                d = c[b];
            return typeof d == "string" ? /^\s*\>/.test(d) ? c.container.find(d) : a(d) : d.jquery ? d : a(d)
        },
        stackSlides: function (b, c, d) {
            var e = this.opts();
            b || (b = e.slides[e.currSlide], c = e.slides[e.nextSlide], d = !e.reverse), a(b).css("zIndex", e.maxZ);
            var f, g = e.maxZ - 2,
                h = e.slideCount;
            if (d) {
                for (f = e.currSlide + 1; f < h; f++) a(e.slides[f]).css("zIndex", g--);
                for (f = 0; f < e.currSlide; f++) a(e.slides[f]).css("zIndex", g--)
            } else {
                for (f = e.currSlide - 1; f >= 0; f--) a(e.slides[f]).css("zIndex", g--);
                for (f = h - 1; f > e.currSlide; f--) a(e.slides[f]).css("zIndex", g--)
            }
            a(c).css("zIndex", e.maxZ - 1)
        },
        getSlideIndex: function (a) {
            return this.opts().slides.index(a)
        }
    }, a.fn.cycle.log = function () {

    }, a.fn.cycle.version = function () {
        return "Cycle2: " + b
    }, a.fn.cycle.transitions = {
        custom: {},
        none: {
            before: function (a, b, c, d) {
                a.API.stackSlides(c, b, d), a.cssBefore = {
                    opacity: 1,
                    display: "block"
                }
            }
        },
        fade: {
            before: function (b, c, d, e) {
                var f = b.API.getSlideOpts(b.nextSlide).slideCss || {};
                b.API.stackSlides(c, d, e), b.cssBefore = a.extend(f, {
                    opacity: 0,
                    display: "block"
                }), b.animIn = {
                    opacity: 1
                }, b.animOut = {
                    opacity: 0
                }
            }
        },
        fadeout: {
            before: function (b, c, d, e) {
                var f = b.API.getSlideOpts(b.nextSlide).slideCss || {};
                b.API.stackSlides(c, d, e), b.cssBefore = a.extend(f, {
                    opacity: 1,
                    display: "block"
                }), b.animOut = {
                    opacity: 0
                }
            }
        },
        scrollHorz: {
            before: function (a, b, c, d) {
                a.API.stackSlides(b, c, d);
                var e = a.container.css("overflow", "hidden").width();
                a.cssBefore = {
                    left: d ? e : -e,
                    top: 0,
                    opacity: 1,
                    display: "block"
                }, a.cssAfter = {
                    zIndex: a._maxZ - 2,
                    left: 0
                }, a.animIn = {
                    left: 0
                }, a.animOut = {
                    left: d ? -e : e
                }
            }
        }
    }, a.fn.cycle.defaults = {
        allowWrap: !0,
        autoSelector: ".cycle-slideshow[data-cycle-auto-init!=false]",
        delay: 0,
        easing: null,
        fx: "fade",
        hideNonActive: !0,
        loop: 0,
        manualFx: undefined,
        manualSpeed: undefined,
        manualTrump: !0,
        maxZ: 100,
        pauseOnHover: !1,
        reverse: !1,
        slideActiveClass: "cycle-slide-active",
        slideClass: "cycle-slide",
        slideCss: {
            position: "absolute",
            top: 0,
            left: 0
        },
        slides: "> img",
        speed: 500,
        startingSlide: 0,
        sync: !0,
        timeout: 4e3,
        updateView: -1
    }, a(document).ready(function () {
        a(a.fn.cycle.defaults.autoSelector).cycle()
    })
})(jQuery),
    function (a) {
        function b(b, d) {
            var e, f, g, h = d.autoHeight;
            if (h == "container") f = a(d.slides[d.currSlide]).outerHeight(), d.container.height(f);
            else if (d._autoHeightRatio) d.container.height(d.container.width() / d._autoHeightRatio);
            else if (h === "calc" || a.type(h) == "number" && h >= 0) {
                h === "calc" ? g = c(b, d) : h >= d.slides.length ? g = 0 : g = h;
                if (g == d._sentinelIndex) return;
                d._sentinelIndex = g, d._sentinel && d._sentinel.remove(), e = a(d.slides[g].cloneNode(!0)), e.removeAttr("id name rel").find("[id],[name],[rel]").removeAttr("id name rel"), e.css({
                    position: "static",
                    visibility: "hidden",
                    display: "block"
                }).prependTo(d.container).addClass("cycle-sentinel cycle-slide"), e.find("*").css("visibility", "hidden"), d._sentinel = e
            }
        }

        function c(b, c) {
            var d = 0,
                e = -1;
            return c.slides.each(function (b) {
                var c = a(this).height();
                c > e && (e = c, d = b)
            }), d
        }

        function d(b, c, d, e, f) {
            var g = a(e).outerHeight(),
                h = c.sync ? c.speed / 2 : c.speed;
            c.container.animate({
                height: g
            }, h)
        }

        function e(c, f) {
            f._autoHeightOnResize && (a(window).off("resize orientationchange", f._autoHeightOnResize), f._autoHeightOnResize = null), f.container.off("cycle-slide-added cycle-slide-removed", b), f.container.off("cycle-destroyed", e), f.container.off("cycle-before", d), f._sentinel && (f._sentinel.remove(), f._sentinel = null)
        }
        "use strict", a.extend(a.fn.cycle.defaults, {
            autoHeight: 0
        }), a(document).on("cycle-initialized", function (c, f) {
            function k() {
                b(c, f)
            }
            var g = f.autoHeight,
                h = a.type(g),
                i = null,
                j;
            if (h !== "string" && h !== "number") return;
            f.container.on("cycle-slide-added cycle-slide-removed", b), f.container.on("cycle-destroyed", e), g == "container" ? f.container.on("cycle-before", d) : h === "string" && /\d+\:\d+/.test(g) && (j = g.match(/(\d+)\:(\d+)/), j = j[1] / j[2], f._autoHeightRatio = j), h !== "number" && (f._autoHeightOnResize = function () {
                clearTimeout(i), i = setTimeout(k, 50)
            }, a(window).on("resize orientationchange", f._autoHeightOnResize)), setTimeout(k, 30)
        })
    }(jQuery),
    function (a) {
        "use strict", a.extend(a.fn.cycle.defaults, {
            caption: "> .cycle-caption",
            captionTemplate: "{{slideNum}} / {{slideCount}}",
            overlay: "> .cycle-overlay",
            overlayTemplate: "<div>{{title}}</div><div>{{desc}}</div>",
            captionModule: "caption"
        }), a(document).on("cycle-update-view", function (b, c, d, e) {
            if (c.captionModule !== "caption") return;
            var f;
            a.each(["caption", "overlay"], function () {
                var a = this,
                    b = d[a + "Template"],
                    f = c.API.getComponent(a);
                f.length && b ? (f.html(c.API.tmpl(b, d, c, e)), f.show()) : f.hide()
            })
        }), a(document).on("cycle-destroyed", function (b, c) {
            var d;
            a.each(["caption", "overlay"], function () {
                var a = this,
                    b = c[a + "Template"];
                c[a] && b && (d = c.API.getComponent("caption"), d.empty())
            })
        })
    }(jQuery),
    function (a) {
        "use strict";
        var b = a.fn.cycle;
        a.fn.cycle = function (c) {
            var d, e, f, g = a.makeArray(arguments);
            return a.type(c) == "number" ? this.cycle("goto", c) : a.type(c) == "string" ? this.each(function () {
                var h;
                d = c, f = a(this).data("cycle.opts");
                if (f === undefined) {
                    b.log('slideshow must be initialized before sending commands; "' + d + '" ignored');
                    return
                }
                d = d == "goto" ? "jump" : d, e = f.API[d];
                if (a.isFunction(e)) return h = a.makeArray(g), h.shift(), e.apply(f.API, h);
                b.log("unknown command: ", d)
            }) : b.apply(this, arguments)
        }, a.extend(a.fn.cycle, b), a.extend(b.API, {
            next: function () {
                var a = this.opts();
                if (a.busy && !a.manualTrump) return;
                var b = a.reverse ? -1 : 1;
                if (a.allowWrap === !1 && a.currSlide + b >= a.slideCount) return;
                a.API.advanceSlide(b), a.API.trigger("cycle-next", [a]).log("cycle-next")
            },
            prev: function () {
                var a = this.opts();
                if (a.busy && !a.manualTrump) return;
                var b = a.reverse ? 1 : -1;
                if (a.allowWrap === !1 && a.currSlide + b < 0) return;
                a.API.advanceSlide(b), a.API.trigger("cycle-prev", [a]).log("cycle-prev")
            },
            destroy: function () {
                var a = this.opts();
                clearTimeout(a.timeoutId), a.timeoutId = 0, a.API.stop(), a.API.trigger("cycle-destroyed", [a]).log("cycle-destroyed"), a.container.removeData("cycle.opts"), a.retainStylesOnDestroy || (a.container.removeAttr("style"), a.slides.removeAttr("style"), a.slides.removeClass("cycle-slide-active"))
            },
            jump: function (a) {
                var b, c = this.opts();
                if (c.busy && !c.manualTrump) return;
                var d = parseInt(a, 10);
                if (isNaN(d) || d < 0 || d >= c.slides.length) {
                    c.API.log("goto: invalid slide index: " + d);
                    return
                }
                if (d == c.currSlide) {
                    c.API.log("goto: skipping, already on slide", d);
                    return
                }
                c.nextSlide = d, clearTimeout(c.timeoutId), c.timeoutId = 0, c.API.log("goto: ", d, " (zero-index)"), b = c.currSlide < c.nextSlide, c.API.prepareTx(!0, b)
            },
            stop: function () {
                var b = this.opts(),
                    c = b.container;
                clearTimeout(b.timeoutId), b.timeoutId = 0, b.API.stopTransition(), b.pauseOnHover && (b.pauseOnHover !== !0 && (c = a(b.pauseOnHover)), c.off("mouseenter mouseleave")), b.API.trigger("cycle-stopped", [b]).log("cycle-stopped")
            },
            reinit: function () {
                var a = this.opts();
                a.API.destroy(), a.container.cycle()
            },
            remove: function (b) {
                var c = this.opts(),
                    d, e, f = [],
                    g = 1;
                for (var h = 0; h < c.slides.length; h++) d = c.slides[h], h == b ? e = d : (f.push(d), a(d).data("cycle.opts").slideNum = g, g++);
                e && (c.slides = a(f), c.slideCount--, a(e).remove(), b == c.currSlide && c.API.advanceSlide(1), c.API.trigger("cycle-slide-removed", [c, b, e]).log("cycle-slide-removed"), c.API.updateView())
            }
        }), a(document).on("click.cycle", "[data-cycle-cmd]", function (b) {
            b.preventDefault();
            var c = a(this),
                d = c.data("cycle-cmd"),
                e = c.data("cycle-context") || ".cycle-slideshow";
            a(e).cycle(d, c.data("cycle-arg"))
        })
    }(jQuery),
    function (a) {
        function b(be, c) {
            var d;
            if (be._hashFence) {
                be._hashFence = !1;
                return
            }
            d = window.location.hash.substring(1), be.slides.each(function (e) {
                if (a(this).data("cycle-hash") == d) return c === !0 ? be.startingSlide = e : (be.nextSlide = e, be.API.prepareTx(!0, !1)), !1
            })
        }
        "use strict", a(document).on("cycle-pre-initialize", function (c, d) {
            b(d, !0), d._onHashChange = function () {
                b(d, !1)
            }, a(window).on("hashchange", d._onHashChange)
        }), a(document).on("cycle-update-view", function (a, b, c) {
            c.hash && (b._hashFence = !0, window.location.hash = c.hash)
        }), a(document).on("cycle-destroyed", function (b, c) {
            c._onHashChange && a(window).off("hashchange", c._onHashChange)
        })
    }(jQuery),
    function (a) {
        "use strict", a.extend(a.fn.cycle.defaults, {
            loader: !1
        }), a(document).on("cycle-bootstrap", function (b, c) {
            function e(b, e) {
                function i(b) {
                    var g;
                    c.loader == "wait" ? (f.push(b), h === 0 && (f.sort(j), d.apply(c.API, [f, e]), c.container.removeClass("cycle-loading"))) : (g = a(c.slides[c.currSlide]), d.apply(c.API, [b, e]), g.show(), c.container.removeClass("cycle-loading"))
                }

                function j(a, b) {
                    return a.data("index") - b.data("index")
                }
                var f = [];
                if (a.type(b) == "string") b = a.trim(b);
                else if (a.type(b) === "array")
                    for (var g = 0; g < b.length; g++) b[g] = a(b[g])[0];
                b = a(b);
                var h = b.length;
                if (!h) return;
                b.hide().appendTo("body").each(function (b) {
                    function l() {
                        --g === 0 && (--h, i(j))
                    }
                    var g = 0,
                        j = a(this),
                        k = j.is("img") ? j : j.find("img");
                    j.data("index", b), k = k.filter(":not(.cycle-loader-ignore)").filter(':not([src=""])');
                    if (!k.length) {
                        --h, f.push(j);
                        return
                    }
                    g = k.length, k.each(function () {
                        this.complete ? l() : a(this).load(function () {
                            l()
                        }).error(function () {
                                --g === 0 && (c.API.log("slide skipped; img not loaded:", this.src), --h === 0 && c.loader == "wait" && d.apply(c.API, [f, e]))
                            })
                    })
                }), h && c.container.addClass("cycle-loading")
            }
            var d;
            if (!c.loader) return;
            d = c.API.add, c.API.add = e
        })
    }(jQuery),
    function (a) {
        function b(be, c, d) {
            var e, f = be.API.getComponent("pager");
            f.each(function () {
                var f = a(this);
                if (c.pagerTemplate) {
                    var g = be.API.tmpl(c.pagerTemplate, c, be, d[0]);
                    e = a(g).appendTo(f)
                } else e = f.children().eq(be.slideCount - 1);
                e.on(be.pagerEvent, function (a) {
                    a.preventDefault(), be.API.page(f, a.currentTarget)
                })
            })
        }

        function c(a, b) {
            var c = this.opts();
            if (c.busy && !c.manualTrump) return;
            var d = a.children().index(b),
                e = d,
                f = c.currSlide < e;
            if (c.currSlide == e) return;
            c.nextSlide = e, c.API.prepareTx(!0, f), c.API.trigger("cycle-pager-activated", [c, a, b])
        }
        "use strict", a.extend(a.fn.cycle.defaults, {
            pager: "> .cycle-pager",
            pagerActiveClass: "cycle-pager-active",
            pagerEvent: "click.cycle",
            pagerTemplate: "<span>&bull;</span>"
        }), a(document).on("cycle-bootstrap", function (a, c, d) {
            d.buildPagerLink = b
        }), a(document).on("cycle-slide-added", function (a, b, d, e) {
            b.pager && (b.API.buildPagerLink(b, d, e), b.API.page = c)
        }), a(document).on("cycle-slide-removed", function (b, c, d, e) {
            if (c.pager) {
                var f = c.API.getComponent("pager");
                f.each(function () {
                    var b = a(this);
                    a(b.children()[d]).remove()
                })
            }
        }), a(document).on("cycle-update-view", function (b, c, d) {
            var e;
            c.pager && (e = c.API.getComponent("pager"), e.each(function () {
                a(this).children().removeClass(c.pagerActiveClass).eq(c.currSlide).addClass(c.pagerActiveClass)
            }))
        }), a(document).on("cycle-destroyed", function (a, b) {
            var c;
            b.pager && b.pagerTemplate && (c = b.API.getComponent("pager"), c.empty())
        })
    }(jQuery),
    function (a) {
        "use strict", a.extend(a.fn.cycle.defaults, {
            next: "> .cycle-next",
            nextEvent: "click.cycle",
            disabledClass: "disabled",
            prev: "> .cycle-prev",
            prevEvent: "click.cycle",
            swipe: !1
        }), a(document).on("cycle-initialized", function (a, b) {
            b.API.getComponent("next").on(b.nextEvent, function (a) {
                a.preventDefault(), b.API.next()
            }), b.API.getComponent("prev").on(b.prevEvent, function (a) {
                a.preventDefault(), b.API.prev()
            });
            if (b.swipe) {
                var c = b.swipeVert ? "swipeUp.cycle" : "swipeLeft.cycle swipeleft.cycle",
                    d = b.swipeVert ? "swipeDown.cycle" : "swipeRight.cycle swiperight.cycle";
                b.container.on(c, function (a) {
                    b.API.next()
                }), b.container.on(d, function () {
                    b.API.prev()
                })
            }
        }), a(document).on("cycle-update-view", function (a, b, c, d) {
            if (b.allowWrap) return;
            var e = b.disabledClass,
                f = b.API.getComponent("next"),
                g = b.API.getComponent("prev"),
                h = b._prevBoundry || 0,
                i = b._nextBoundry || b.slideCount - 1;
            b.currSlide == i ? f.addClass(e).prop("disabled", !0) : f.removeClass(e).prop("disabled", !1), b.currSlide === h ? g.addClass(e).prop("disabled", !0) : g.removeClass(e).prop("disabled", !1)
        }), a(document).on("cycle-destroyed", function (a, b) {
            b.API.getComponent("prev").off(b.nextEvent), b.API.getComponent("next").off(b.prevEvent), b.container.off("swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle")
        })
    }(jQuery),
    function (a) {
        "use strict", a.extend(a.fn.cycle.defaults, {
            progressive: !1
        }), a(document).on("cycle-pre-initialize", function (b, c) {
            if (!c.progressive) return;
            var d = c.API,
                e = d.next,
                f = d.prev,
                g = d.prepareTx,
                h = a.type(c.progressive),
                i, j;
            if (h == "array") i = c.progressive;
            else if (a.isFunction(c.progressive)) i = c.progressive(c);
            else if (h == "string") {
                j = a(c.progressive), i = a.trim(j.html());
                if (!i) return;
                if (/^(\[)/.test(i)) try {
                    i = a.parseJSON(i)
                } catch (k) {
                    d.log("error parsing progressive slides", k);
                    return
                } else i = i.split(new RegExp(j.data("cycle-split") || "\n")), i[i.length - 1] || i.pop()
            }
            g && (d.prepareTx = function (a, b) {
                var d, e;
                if (a || i.length === 0) {
                    g.apply(c.API, [a, b]);
                    return
                }
                b && c.currSlide == c.slideCount - 1 ? (e = i[0], i = i.slice(1), c.container.one("cycle-slide-added", function (a, b) {
                    setTimeout(function () {
                        b.API.advanceSlide(1)
                    }, 50)
                }), c.API.add(e)) : !b && c.currSlide === 0 ? (d = i.length - 1, e = i[d], i = i.slice(0, d), c.container.one("cycle-slide-added", function (a, b) {
                    setTimeout(function () {
                        b.currSlide = 1, b.API.advanceSlide(-1)
                    }, 50)
                }), c.API.add(e, !0)) : g.apply(c.API, [a, b])
            }), e && (d.next = function () {
                var a = this.opts();
                if (i.length && a.currSlide == a.slideCount - 1) {
                    var b = i[0];
                    i = i.slice(1), a.container.one("cycle-slide-added", function (a, b) {
                        e.apply(b.API), b.container.removeClass("cycle-loading")
                    }), a.container.addClass("cycle-loading"), a.API.add(b)
                } else e.apply(a.API)
            }), f && (d.prev = function () {
                var a = this.opts();
                if (i.length && a.currSlide === 0) {
                    var b = i.length - 1,
                        c = i[b];
                    i = i.slice(0, b), a.container.one("cycle-slide-added", function (a, b) {
                        b.currSlide = 1, b.API.advanceSlide(-1), b.container.removeClass("cycle-loading")
                    }), a.container.addClass("cycle-loading"), a.API.add(c, !0)
                } else f.apply(a.API)
            })
        })
    }(jQuery),
    function (a) {
        "use strict", a.extend(a.fn.cycle.defaults, {
            tmplRegex: "{{((.)?.*?)}}"
        }), a.extend(a.fn.cycle.API, {
            tmpl: function (b, c) {
                var d = new RegExp(c.tmplRegex || a.fn.cycle.defaults.tmplRegex, "g"),
                    e = a.makeArray(arguments);
                return e.shift(), b.replace(d, function (b, c) {
                    var d, f, g, h, i = c.split(".");
                    for (d = 0; d < e.length; d++) {
                        g = e[d];
                        if (!g) continue;
                        if (i.length > 1) {
                            h = g;
                            for (f = 0; f < i.length; f++) g = h, h = h[i[f]] || c
                        } else h = g[c]; if (a.isFunction(h)) return h.apply(g, e);
                        if (h !== undefined && h !== null && h != c) return h
                    }
                    return c
                })
            }
        })
    }(jQuery);

/*! Backstretch - v2.0.3 - 2012-11-30
* http://srobbin.com/jquery-plugins/backstretch/
* Copyright (c) 2012 Scott Robbin; Licensed MIT */
(function (e, t, n) {
    "use strict";
    e.fn.backstretch = function (r, s) {
        return (r === n || r.length === 0) && e.error("No images were supplied for Backstretch"), e(t).scrollTop() === 0 && t.scrollTo(0, 0), this.each(function () {
            var t = e(this),
                n = t.data("backstretch");
            n && (s = e.extend(n.options, s), n.destroy(!0)), n = new i(this, r, s), t.data("backstretch", n)
        })
    }, e.backstretch = function (t, n) {
        return e("body").backstretch(t, n).data("backstretch")
    }, e.expr[":"].backstretch = function (t) {
        return e(t).data("backstretch") !== n
    }, e.fn.backstretch.defaults = {
        centeredX: !0,
        centeredY: !0,
        duration: 5e3,
        fade: 0
    };
    var r = {
        wrap: {
            left: 0,
            top: 0,
            overflow: "hidden",
            margin: 0,
            padding: 0,
            height: "100%",
            width: "100%",
            zIndex: -999999
        },
        img: {
            position: "absolute",
            display: "none",
            margin: 0,
            padding: 0,
            border: "none",
            width: "auto",
            height: "auto",
            maxWidth: "none",
            zIndex: -999999
        }
    }, i = function (n, i, o) {
        this.options = e.extend({}, e.fn.backstretch.defaults, o || {}), this.images = e.isArray(i) ? i : [i], e.each(this.images, function () {
            e("<img />")[0].src = this
        }), this.isBody = n === document.body, this.$container = e(n), this.$wrap = e('<div class="backstretch"></div>').css(r.wrap).appendTo(this.$container), this.$root = this.isBody ? s ? e(t) : e(document) : this.$container;
        if (!this.isBody) {
            var u = this.$container.css("position"),
                a = this.$container.css("zIndex");
            this.$container.css({
                position: u === "static" ? "relative" : u,
                zIndex: a === "auto" ? 0 : a,
                background: "none"
            }), this.$wrap.css({
                zIndex: -999998
            })
        }
        this.$wrap.css({
            position: this.isBody && s ? "fixed" : "absolute"
        }), this.index = 0, this.show(this.index), e(t).on("resize.backstretch", e.proxy(this.resize, this)).on("orientationchange.backstretch", e.proxy(function () {
            this.isBody && t.pageYOffset === 0 && (t.scrollTo(0, 1), this.resize())
        }, this))
    };
    i.prototype = {
        resize: function () {
            try {
                var e = {
                        left: 0,
                        top: 0
                    }, n = this.isBody ? this.$root.width() : this.$root.innerWidth(),
                    r = n,
                    i = this.isBody ? t.innerHeight ? t.innerHeight : this.$root.height() : this.$root.innerHeight(),
                    s = r / this.$img.data("ratio"),
                    o;
                s >= i ? (o = (s - i) / 2, this.options.centeredY && (e.top = "-" + o + "px")) : (s = i, r = s * this.$img.data("ratio"), o = (r - n) / 2, this.options.centeredX && (e.left = "-" + o + "px")), this.$wrap.css({
                    width: n,
                    height: i
                }).find("img:not(.deleteable)").css({
                        width: r,
                        height: s
                    }).css(e)
            } catch (u) {}
            return this
        },
        show: function (t) {
            if (Math.abs(t) > this.images.length - 1) return;
            this.index = t;
            var n = this,
                i = n.$wrap.find("img").addClass("deleteable"),
                s = e.Event("backstretch.show", {
                    relatedTarget: n.$container[0]
                });
            return clearInterval(n.interval), n.$img = e("<img />").css(r.img).bind("load", function (t) {
                var r = this.width || e(t.target).width(),
                    o = this.height || e(t.target).height();
                e(this).data("ratio", r / o), e(this).fadeIn(n.options.speed || n.options.fade, function () {
                    i.remove(), n.paused || n.cycle(), n.$container.trigger(s, n)
                }), n.resize()
            }).appendTo(n.$wrap), n.$img.attr("src", n.images[t]), n
        },
        next: function () {
            return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0)
        },
        prev: function () {
            return this.show(this.index === 0 ? this.images.length - 1 : this.index - 1)
        },
        pause: function () {
            return this.paused = !0, this
        },
        resume: function () {
            return this.paused = !1, this.next(), this
        },
        cycle: function () {
            return this.images.length > 1 && (clearInterval(this.interval), this.interval = setInterval(e.proxy(function () {
                this.paused || this.next()
            }, this), this.options.duration)), this
        },
        destroy: function (n) {
            e(t).off("resize.backstretch orientationchange.backstretch"), clearInterval(this.interval), n || this.$wrap.remove(), this.$container.removeData("backstretch")
        }
    };
    var s = function () {
        var e = navigator.userAgent,
            n = navigator.platform,
            r = e.match(/AppleWebKit\/([0-9]+)/),
            i = !! r && r[1],
            s = e.match(/Fennec\/([0-9]+)/),
            o = !! s && s[1],
            u = e.match(/Opera Mobi\/([0-9]+)/),
            a = !! u && u[1],
            f = e.match(/MSIE ([0-9]+)/),
            l = !! f && f[1];
        return !((n.indexOf("iPhone") > -1 || n.indexOf("iPad") > -1 || n.indexOf("iPod") > -1) && i && i < 534 || t.operamini && {}.toString.call(t.operamini) === "[object OperaMini]" || u && a < 7458 || e.indexOf("Android") > -1 && i && i < 533 || o && o < 6 || "palmGetResource" in t && i && i < 534 || e.indexOf("MeeGo") > -1 && e.indexOf("NokiaBrowser/8.5.0") > -1 || l && l <= 6)
    }()
})(jQuery, window);

/*! jQuery UI - v1.10.2 - 2013-04-08
* http://jqueryui.com
* Includes: jquery.ui.effect.js
* Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

(function (t, e) {
    var i = "ui-effects-";
    t.effects = {
        effect: {}
    },
        function (t, e) {
            function i(t, e, i) {
                var s = u[e.type] || {};
                return null == t ? i || !e.def ? null : e.def : (t = s.floor ? ~~t : parseFloat(t), isNaN(t) ? e.def : s.mod ? (t + s.mod) % s.mod : 0 > t ? 0 : t > s.max ? s.max : t)
            }

            function s(i) {
                var s = l(),
                    n = s._rgba = [];
                return i = i.toLowerCase(), f(h, function (t, a) {
                    var o, r = a.re.exec(i),
                        h = r && a.parse(r),
                        l = a.space || "rgba";
                    return h ? (o = s[l](h), s[c[l].cache] = o[c[l].cache], n = s._rgba = o._rgba, !1) : e
                }), n.length ? ("0,0,0,0" === n.join() && t.extend(n, a.transparent), s) : a[i]
            }

            function n(t, e, i) {
                return i = (i + 1) % 1, 1 > 6 * i ? t + 6 * (e - t) * i : 1 > 2 * i ? e : 2 > 3 * i ? t + 6 * (e - t) * (2 / 3 - i) : t
            }
            var a, o = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
                r = /^([\-+])=\s*(\d+\.?\d*)/,
                h = [{
                    re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                    parse: function (t) {
                        return [t[1], t[2], t[3], t[4]]
                    }
                }, {
                    re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                    parse: function (t) {
                        return [2.55 * t[1], 2.55 * t[2], 2.55 * t[3], t[4]]
                    }
                }, {
                    re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                    parse: function (t) {
                        return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)]
                    }
                }, {
                    re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                    parse: function (t) {
                        return [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16)]
                    }
                }, {
                    re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                    space: "hsla",
                    parse: function (t) {
                        return [t[1], t[2] / 100, t[3] / 100, t[4]]
                    }
                }],
                l = t.Color = function (e, i, s, n) {
                    return new t.Color.fn.parse(e, i, s, n)
                }, c = {
                    rgba: {
                        props: {
                            red: {
                                idx: 0,
                                type: "byte"
                            },
                            green: {
                                idx: 1,
                                type: "byte"
                            },
                            blue: {
                                idx: 2,
                                type: "byte"
                            }
                        }
                    },
                    hsla: {
                        props: {
                            hue: {
                                idx: 0,
                                type: "degrees"
                            },
                            saturation: {
                                idx: 1,
                                type: "percent"
                            },
                            lightness: {
                                idx: 2,
                                type: "percent"
                            }
                        }
                    }
                }, u = {
                    "byte": {
                        floor: !0,
                        max: 255
                    },
                    percent: {
                        max: 1
                    },
                    degrees: {
                        mod: 360,
                        floor: !0
                    }
                }, d = l.support = {}, p = t("<p>")[0],
                f = t.each;
            p.style.cssText = "background-color:rgba(1,1,1,.5)", d.rgba = p.style.backgroundColor.indexOf("rgba") > -1, f(c, function (t, e) {
                e.cache = "_" + t, e.props.alpha = {
                    idx: 3,
                    type: "percent",
                    def: 1
                }
            }), l.fn = t.extend(l.prototype, {
                parse: function (n, o, r, h) {
                    if (n === e) return this._rgba = [null, null, null, null], this;
                    (n.jquery || n.nodeType) && (n = t(n).css(o), o = e);
                    var u = this,
                        d = t.type(n),
                        p = this._rgba = [];
                    return o !== e && (n = [n, o, r, h], d = "array"), "string" === d ? this.parse(s(n) || a._default) : "array" === d ? (f(c.rgba.props, function (t, e) {
                        p[e.idx] = i(n[e.idx], e)
                    }), this) : "object" === d ? (n instanceof l ? f(c, function (t, e) {
                        n[e.cache] && (u[e.cache] = n[e.cache].slice())
                    }) : f(c, function (e, s) {
                        var a = s.cache;
                        f(s.props, function (t, e) {
                            if (!u[a] && s.to) {
                                if ("alpha" === t || null == n[t]) return;
                                u[a] = s.to(u._rgba)
                            }
                            u[a][e.idx] = i(n[t], e, !0)
                        }), u[a] && 0 > t.inArray(null, u[a].slice(0, 3)) && (u[a][3] = 1, s.from && (u._rgba = s.from(u[a])))
                    }), this) : e
                },
                is: function (t) {
                    var i = l(t),
                        s = !0,
                        n = this;
                    return f(c, function (t, a) {
                        var o, r = i[a.cache];
                        return r && (o = n[a.cache] || a.to && a.to(n._rgba) || [], f(a.props, function (t, i) {
                            return null != r[i.idx] ? s = r[i.idx] === o[i.idx] : e
                        })), s
                    }), s
                },
                _space: function () {
                    var t = [],
                        e = this;
                    return f(c, function (i, s) {
                        e[s.cache] && t.push(i)
                    }), t.pop()
                },
                transition: function (t, e) {
                    var s = l(t),
                        n = s._space(),
                        a = c[n],
                        o = 0 === this.alpha() ? l("transparent") : this,
                        r = o[a.cache] || a.to(o._rgba),
                        h = r.slice();
                    return s = s[a.cache], f(a.props, function (t, n) {
                        var a = n.idx,
                            o = r[a],
                            l = s[a],
                            c = u[n.type] || {};
                        null !== l && (null === o ? h[a] = l : (c.mod && (l - o > c.mod / 2 ? o += c.mod : o - l > c.mod / 2 && (o -= c.mod)), h[a] = i((l - o) * e + o, n)))
                    }), this[n](h)
                },
                blend: function (e) {
                    if (1 === this._rgba[3]) return this;
                    var i = this._rgba.slice(),
                        s = i.pop(),
                        n = l(e)._rgba;
                    return l(t.map(i, function (t, e) {
                        return (1 - s) * n[e] + s * t
                    }))
                },
                toRgbaString: function () {
                    var e = "rgba(",
                        i = t.map(this._rgba, function (t, e) {
                            return null == t ? e > 2 ? 1 : 0 : t
                        });
                    return 1 === i[3] && (i.pop(), e = "rgb("), e + i.join() + ")"
                },
                toHslaString: function () {
                    var e = "hsla(",
                        i = t.map(this.hsla(), function (t, e) {
                            return null == t && (t = e > 2 ? 1 : 0), e && 3 > e && (t = Math.round(100 * t) + "%"), t
                        });
                    return 1 === i[3] && (i.pop(), e = "hsl("), e + i.join() + ")"
                },
                toHexString: function (e) {
                    var i = this._rgba.slice(),
                        s = i.pop();
                    return e && i.push(~~(255 * s)), "#" + t.map(i, function (t) {
                        return t = (t || 0).toString(16), 1 === t.length ? "0" + t : t
                    }).join("")
                },
                toString: function () {
                    return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
                }
            }), l.fn.parse.prototype = l.fn, c.hsla.to = function (t) {
                if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];
                var e, i, s = t[0] / 255,
                    n = t[1] / 255,
                    a = t[2] / 255,
                    o = t[3],
                    r = Math.max(s, n, a),
                    h = Math.min(s, n, a),
                    l = r - h,
                    c = r + h,
                    u = .5 * c;
                return e = h === r ? 0 : s === r ? 60 * (n - a) / l + 360 : n === r ? 60 * (a - s) / l + 120 : 60 * (s - n) / l + 240, i = 0 === l ? 0 : .5 >= u ? l / c : l / (2 - c), [Math.round(e) % 360, i, u, null == o ? 1 : o]
            }, c.hsla.from = function (t) {
                if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];
                var e = t[0] / 360,
                    i = t[1],
                    s = t[2],
                    a = t[3],
                    o = .5 >= s ? s * (1 + i) : s + i - s * i,
                    r = 2 * s - o;
                return [Math.round(255 * n(r, o, e + 1 / 3)), Math.round(255 * n(r, o, e)), Math.round(255 * n(r, o, e - 1 / 3)), a]
            }, f(c, function (s, n) {
                var a = n.props,
                    o = n.cache,
                    h = n.to,
                    c = n.from;
                l.fn[s] = function (s) {
                    if (h && !this[o] && (this[o] = h(this._rgba)), s === e) return this[o].slice();
                    var n, r = t.type(s),
                        u = "array" === r || "object" === r ? s : arguments,
                        d = this[o].slice();
                    return f(a, function (t, e) {
                        var s = u["object" === r ? t : e.idx];
                        null == s && (s = d[e.idx]), d[e.idx] = i(s, e)
                    }), c ? (n = l(c(d)), n[o] = d, n) : l(d)
                }, f(a, function (e, i) {
                    l.fn[e] || (l.fn[e] = function (n) {
                        var a, o = t.type(n),
                            h = "alpha" === e ? this._hsla ? "hsla" : "rgba" : s,
                            l = this[h](),
                            c = l[i.idx];
                        return "undefined" === o ? c : ("function" === o && (n = n.call(this, c), o = t.type(n)), null == n && i.empty ? this : ("string" === o && (a = r.exec(n), a && (n = c + parseFloat(a[2]) * ("+" === a[1] ? 1 : -1))), l[i.idx] = n, this[h](l)))
                    })
                })
            }), l.hook = function (e) {
                var i = e.split(" ");
                f(i, function (e, i) {
                    t.cssHooks[i] = {
                        set: function (e, n) {
                            var a, o, r = "";
                            if ("transparent" !== n && ("string" !== t.type(n) || (a = s(n)))) {
                                if (n = l(a || n), !d.rgba && 1 !== n._rgba[3]) {
                                    for (o = "backgroundColor" === i ? e.parentNode : e;
                                         ("" === r || "transparent" === r) && o && o.style;) try {
                                        r = t.css(o, "backgroundColor"), o = o.parentNode
                                    } catch (h) {}
                                    n = n.blend(r && "transparent" !== r ? r : "_default")
                                }
                                n = n.toRgbaString()
                            }
                            try {
                                e.style[i] = n
                            } catch (h) {}
                        }
                    }, t.fx.step[i] = function (e) {
                        e.colorInit || (e.start = l(e.elem, i), e.end = l(e.end), e.colorInit = !0), t.cssHooks[i].set(e.elem, e.start.transition(e.end, e.pos))
                    }
                })
            }, l.hook(o), t.cssHooks.borderColor = {
                expand: function (t) {
                    var e = {};
                    return f(["Top", "Right", "Bottom", "Left"], function (i, s) {
                        e["border" + s + "Color"] = t
                    }), e
                }
            }, a = t.Color.names = {
                aqua: "#00ffff",
                black: "#000000",
                blue: "#0000ff",
                fuchsia: "#ff00ff",
                gray: "#808080",
                green: "#008000",
                lime: "#00ff00",
                maroon: "#800000",
                navy: "#000080",
                olive: "#808000",
                purple: "#800080",
                red: "#ff0000",
                silver: "#c0c0c0",
                teal: "#008080",
                white: "#ffffff",
                yellow: "#ffff00",
                transparent: [null, null, null, 0],
                _default: "#ffffff"
            }
        }(jQuery),
        function () {
            function i(e) {
                var i, s, n = e.ownerDocument.defaultView ? e.ownerDocument.defaultView.getComputedStyle(e, null) : e.currentStyle,
                    a = {};
                if (n && n.length && n[0] && n[n[0]])
                    for (s = n.length; s--;) i = n[s], "string" == typeof n[i] && (a[t.camelCase(i)] = n[i]);
                else
                    for (i in n) "string" == typeof n[i] && (a[i] = n[i]);
                return a
            }

            function s(e, i) {
                var s, n, o = {};
                for (s in i) n = i[s], e[s] !== n && (a[s] || (t.fx.step[s] || !isNaN(parseFloat(n))) && (o[s] = n));
                return o
            }
            var n = ["add", "remove", "toggle"],
                a = {
                    border: 1,
                    borderBottom: 1,
                    borderColor: 1,
                    borderLeft: 1,
                    borderRight: 1,
                    borderTop: 1,
                    borderWidth: 1,
                    margin: 1,
                    padding: 1
                };
            t.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (e, i) {
                t.fx.step[i] = function (t) {
                    ("none" !== t.end && !t.setAttr || 1 === t.pos && !t.setAttr) && (jQuery.style(t.elem, i, t.end), t.setAttr = !0)
                }
            }), t.fn.addBack || (t.fn.addBack = function (t) {
                return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
            }), t.effects.animateClass = function (e, a, o, r) {
                var h = t.speed(a, o, r);
                return this.queue(function () {
                    var a, o = t(this),
                        r = o.attr("class") || "",
                        l = h.children ? o.find("*").addBack() : o;
                    l = l.map(function () {
                        var e = t(this);
                        return {
                            el: e,
                            start: i(this)
                        }
                    }), a = function () {
                        t.each(n, function (t, i) {
                            e[i] && o[i + "Class"](e[i])
                        })
                    }, a(), l = l.map(function () {
                        return this.end = i(this.el[0]), this.diff = s(this.start, this.end), this
                    }), o.attr("class", r), l = l.map(function () {
                        var e = this,
                            i = t.Deferred(),
                            s = t.extend({}, h, {
                                queue: !1,
                                complete: function () {
                                    i.resolve(e)
                                }
                            });
                        return this.el.animate(this.diff, s), i.promise()
                    }), t.when.apply(t, l.get()).done(function () {
                        a(), t.each(arguments, function () {
                            var e = this.el;
                            t.each(this.diff, function (t) {
                                e.css(t, "")
                            })
                        }), h.complete.call(o[0])
                    })
                })
            }, t.fn.extend({
                addClass: function (e) {
                    return function (i, s, n, a) {
                        return s ? t.effects.animateClass.call(this, {
                            add: i
                        }, s, n, a) : e.apply(this, arguments)
                    }
                }(t.fn.addClass),
                removeClass: function (e) {
                    return function (i, s, n, a) {
                        return arguments.length > 1 ? t.effects.animateClass.call(this, {
                            remove: i
                        }, s, n, a) : e.apply(this, arguments)
                    }
                }(t.fn.removeClass),
                toggleClass: function (i) {
                    return function (s, n, a, o, r) {
                        return "boolean" == typeof n || n === e ? a ? t.effects.animateClass.call(this, n ? {
                            add: s
                        } : {
                            remove: s
                        }, a, o, r) : i.apply(this, arguments) : t.effects.animateClass.call(this, {
                            toggle: s
                        }, n, a, o)
                    }
                }(t.fn.toggleClass),
                switchClass: function (e, i, s, n, a) {
                    return t.effects.animateClass.call(this, {
                        add: i,
                        remove: e
                    }, s, n, a)
                }
            })
        }(),
        function () {
            function s(e, i, s, n) {
                return t.isPlainObject(e) && (i = e, e = e.effect), e = {
                    effect: e
                }, null == i && (i = {}), t.isFunction(i) && (n = i, s = null, i = {}), ("number" == typeof i || t.fx.speeds[i]) && (n = s, s = i, i = {}), t.isFunction(s) && (n = s, s = null), i && t.extend(e, i), s = s || i.duration, e.duration = t.fx.off ? 0 : "number" == typeof s ? s : s in t.fx.speeds ? t.fx.speeds[s] : t.fx.speeds._default, e.complete = n || i.complete, e
            }

            function n(e) {
                return !e || "number" == typeof e || t.fx.speeds[e] ? !0 : "string" != typeof e || t.effects.effect[e] ? t.isFunction(e) ? !0 : "object" != typeof e || e.effect ? !1 : !0 : !0
            }
            t.extend(t.effects, {
                version: "1.10.2",
                save: function (t, e) {
                    for (var s = 0; e.length > s; s++) null !== e[s] && t.data(i + e[s], t[0].style[e[s]])
                },
                restore: function (t, s) {
                    var n, a;
                    for (a = 0; s.length > a; a++) null !== s[a] && (n = t.data(i + s[a]), n === e && (n = ""), t.css(s[a], n))
                },
                setMode: function (t, e) {
                    return "toggle" === e && (e = t.is(":hidden") ? "show" : "hide"), e
                },
                getBaseline: function (t, e) {
                    var i, s;
                    switch (t[0]) {
                        case "top":
                            i = 0;
                            break;
                        case "middle":
                            i = .5;
                            break;
                        case "bottom":
                            i = 1;
                            break;
                        default:
                            i = t[0] / e.height
                    }
                    switch (t[1]) {
                        case "left":
                            s = 0;
                            break;
                        case "center":
                            s = .5;
                            break;
                        case "right":
                            s = 1;
                            break;
                        default:
                            s = t[1] / e.width
                    }
                    return {
                        x: s,
                        y: i
                    }
                },
                createWrapper: function (e) {
                    if (e.parent().is(".ui-effects-wrapper")) return e.parent();
                    var i = {
                            width: e.outerWidth(!0),
                            height: e.outerHeight(!0),
                            "float": e.css("float")
                        }, s = t("<div></div>").addClass("ui-effects-wrapper").css({
                            fontSize: "100%",
                            background: "transparent",
                            border: "none",
                            margin: 0,
                            padding: 0
                        }),
                        n = {
                            width: e.width(),
                            height: e.height()
                        }, a = document.activeElement;
                    try {
                        a.id
                    } catch (o) {
                        a = document.body
                    }
                    return e.wrap(s), (e[0] === a || t.contains(e[0], a)) && t(a).focus(), s = e.parent(), "static" === e.css("position") ? (s.css({
                        position: "relative"
                    }), e.css({
                        position: "relative"
                    })) : (t.extend(i, {
                        position: e.css("position"),
                        zIndex: e.css("z-index")
                    }), t.each(["top", "left", "bottom", "right"], function (t, s) {
                        i[s] = e.css(s), isNaN(parseInt(i[s], 10)) && (i[s] = "auto")
                    }), e.css({
                        position: "relative",
                        top: 0,
                        left: 0,
                        right: "auto",
                        bottom: "auto"
                    })), e.css(n), s.css(i).show()
                },
                removeWrapper: function (e) {
                    var i = document.activeElement;
                    return e.parent().is(".ui-effects-wrapper") && (e.parent().replaceWith(e), (e[0] === i || t.contains(e[0], i)) && t(i).focus()), e
                },
                setTransition: function (e, i, s, n) {
                    return n = n || {}, t.each(i, function (t, i) {
                        var a = e.cssUnit(i);
                        a[0] > 0 && (n[i] = a[0] * s + a[1])
                    }), n
                }
            }), t.fn.extend({
                effect: function () {
                    function e(e) {
                        function s() {
                            t.isFunction(a) && a.call(n[0]), t.isFunction(e) && e()
                        }
                        var n = t(this),
                            a = i.complete,
                            r = i.mode;
                        (n.is(":hidden") ? "hide" === r : "show" === r) ? (n[r](), s()) : o.call(n[0], i, s)
                    }
                    var i = s.apply(this, arguments),
                        n = i.mode,
                        a = i.queue,
                        o = t.effects.effect[i.effect];
                    return t.fx.off || !o ? n ? this[n](i.duration, i.complete) : this.each(function () {
                        i.complete && i.complete.call(this)
                    }) : a === !1 ? this.each(e) : this.queue(a || "fx", e)
                },
                show: function (t) {
                    return function (e) {
                        if (n(e)) return t.apply(this, arguments);
                        var i = s.apply(this, arguments);
                        return i.mode = "show", this.effect.call(this, i)
                    }
                }(t.fn.show),
                hide: function (t) {
                    return function (e) {
                        if (n(e)) return t.apply(this, arguments);
                        var i = s.apply(this, arguments);
                        return i.mode = "hide", this.effect.call(this, i)
                    }
                }(t.fn.hide),
                toggle: function (t) {
                    return function (e) {
                        if (n(e) || "boolean" == typeof e) return t.apply(this, arguments);
                        var i = s.apply(this, arguments);
                        return i.mode = "toggle", this.effect.call(this, i)
                    }
                }(t.fn.toggle),
                cssUnit: function (e) {
                    var i = this.css(e),
                        s = [];
                    return t.each(["em", "px", "%", "pt"], function (t, e) {
                        i.indexOf(e) > 0 && (s = [parseFloat(i), e])
                    }), s
                }
            })
        }(),
        function () {
            var e = {};
            t.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (t, i) {
                e[i] = function (e) {
                    return Math.pow(e, t + 2)
                }
            }), t.extend(e, {
                Sine: function (t) {
                    return 1 - Math.cos(t * Math.PI / 2)
                },
                Circ: function (t) {
                    return 1 - Math.sqrt(1 - t * t)
                },
                Elastic: function (t) {
                    return 0 === t || 1 === t ? t : -Math.pow(2, 8 * (t - 1)) * Math.sin((80 * (t - 1) - 7.5) * Math.PI / 15)
                },
                Back: function (t) {
                    return t * t * (3 * t - 2)
                },
                Bounce: function (t) {
                    for (var e, i = 4;
                         ((e = Math.pow(2, --i)) - 1) / 11 > t;);
                    return 1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2)
                }
            }), t.each(e, function (e, i) {
                t.easing["easeIn" + e] = i, t.easing["easeOut" + e] = function (t) {
                    return 1 - i(1 - t)
                }, t.easing["easeInOut" + e] = function (t) {
                    return .5 > t ? i(2 * t) / 2 : 1 - i(-2 * t + 2) / 2
                }
            })
        }()
})(jQuery);