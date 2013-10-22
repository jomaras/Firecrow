/*!
 * jQuery Form Plugin
 * version: 3.14 (30-JUL-2012)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses:
 *    http://malsup.github.com/mit-license.txt
 *    http://malsup.github.com/gpl-license-v2.txt
 */
(function (e) {
    var c = {};
    c.fileapi = e("<input type='file'/>").get(0).files !== undefined;
    c.formdata = window.FormData !== undefined;
    e.fn.ajaxSubmit = function (g) {
        if (!this.length) {
            d("ajaxSubmit: skipping submit process - no element selected");
            return this
        }
        var f, w, i, l = this;
        if (typeof g == "function") {
            g = {
                success: g
            }
        }
        f = this.attr("method");
        w = this.attr("action");
        i = (typeof w === "string") ? e.trim(w) : "";
        i = i || window.location.href || "";
        if (i) {
            i = (i.match(/^([^#]+)/) || [])[1]
        }
        g = e.extend(true, {
            url: i,
            success: e.ajaxSettings.success,
            type: f || "GET",
            iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
        }, g);
        var r = {};
        this.trigger("form-pre-serialize", [this, g, r]);
        if (r.veto) {
            d("ajaxSubmit: submit vetoed via form-pre-serialize trigger");
            return this
        }
        if (g.beforeSerialize && g.beforeSerialize(this, g) === false) {
            d("ajaxSubmit: submit aborted via beforeSerialize callback");
            return this
        }
        var j = g.traditional;
        if (j === undefined) {
            j = e.ajaxSettings.traditional
        }
        var o = [];
        var z, A = this.formToArray(g.semantic, o);
        if (g.data) {
            g.extraData = g.data;
            z = e.param(g.data, j)
        }
        if (g.beforeSubmit && g.beforeSubmit(A, this, g) === false) {
            d("ajaxSubmit: submit aborted via beforeSubmit callback");
            return this
        }
        this.trigger("form-submit-validate", [A, this, g, r]);
        if (r.veto) {
            d("ajaxSubmit: submit vetoed via form-submit-validate trigger");
            return this
        }
        var u = e.param(A, j);
        if (z) {
            u = (u ? (u + "&" + z) : z)
        }
        if (g.type.toUpperCase() == "GET") {
            g.url += (g.url.indexOf("?") >= 0 ? "&" : "?") + u;
            g.data = null
        } else {
            g.data = u
        }
        var C = [];
        if (g.resetForm) {
            C.push(function () {
                l.resetForm()
            })
        }
        if (g.clearForm) {
            C.push(function () {
                l.clearForm(g.includeHidden)
            })
        }
        if (!g.dataType && g.target) {
            var h = g.success || function () {};
            C.push(function (q) {
                var k = g.replaceTarget ? "replaceWith" : "html";
                e(g.target)[k](q).each(h, arguments)
            })
        } else {
            if (g.success) {
                C.push(g.success)
            }
        }
        g.success = function (F, q, G) {
            var E = g.context || this;
            for (var D = 0, k = C.length; D < k; D++) {
                C[D].apply(E, [F, q, G || l, l])
            }
        };
        var y = e("input:file:enabled[value]", this);
        var m = y.length > 0;
        var x = "multipart/form-data";
        var t = (l.attr("enctype") == x || l.attr("encoding") == x);
        var s = c.fileapi && c.formdata;
        d("fileAPI :" + s);
        var n = (m || t) && !s;
        if (g.iframe !== false && (g.iframe || n)) {
            if (g.closeKeepAlive) {
                e.get(g.closeKeepAlive, function () {
                    B(A)
                })
            } else {
                B(A)
            }
        } else {
            if ((m || t) && s) {
                p(A)
            } else {
                e.ajax(g)
            }
        }
        for (var v = 0; v < o.length; v++) {
            o[v] = null
        }
        this.trigger("form-submit-notify", [this, g]);
        return this;

        function p(q) {
            var k = new FormData();
            for (var D = 0; D < q.length; D++) {
                k.append(q[D].name, q[D].value)
            }
            if (g.extraData) {
                for (var G in g.extraData) {
                    if (g.extraData.hasOwnProperty(G)) {
                        k.append(G, g.extraData[G])
                    }
                }
            }
            g.data = null;
            var F = e.extend(true, {}, e.ajaxSettings, g, {
                contentType: false,
                processData: false,
                cache: false,
                type: "POST"
            });
            if (g.uploadProgress) {
                F.xhr = function () {
                    var H = jQuery.ajaxSettings.xhr();
                    if (H.upload) {
                        H.upload.onprogress = function (L) {
                            var K = 0;
                            var I = L.loaded || L.position;
                            var J = L.total;
                            if (L.lengthComputable) {
                                K = Math.ceil(I / J * 100)
                            }
                            g.uploadProgress(L, I, J, K)
                        }
                    }
                    return H
                }
            }
            F.data = null;
            var E = F.beforeSend;
            F.beforeSend = function (I, H) {
                H.data = k;
                if (E) {
                    E.call(this, I, H)
                }
            };
            e.ajax(F)
        }

        function B(ab) {
            var G = l[0],
                F, X, R, Z, U, I, M, K, L, V, Y, P;
            var J = !! e.fn.prop;
            if (e(":input[name=submit],:input[id=submit]", G).length) {
                alert('Error: Form elements must not have name or id of "submit".');
                return
            }
            if (ab) {
                for (X = 0; X < o.length; X++) {
                    F = e(o[X]);
                    if (J) {
                        F.prop("disabled", false)
                    } else {
                        F.removeAttr("disabled")
                    }
                }
            }
            R = e.extend(true, {}, e.ajaxSettings, g);
            R.context = R.context || R;
            U = "jqFormIO" + (new Date().getTime());
            if (R.iframeTarget) {
                I = e(R.iframeTarget);
                V = I.attr("name");
                if (!V) {
                    I.attr("name", U)
                } else {
                    U = V
                }
            } else {
                I = e('<iframe name="' + U + '" src="' + R.iframeSrc + '" />');
                I.css({
                    position: "absolute",
                    top: "-1000px",
                    left: "-1000px"
                })
            }
            M = I[0];
            K = {
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: "n/a",
                getAllResponseHeaders: function () {},
                getResponseHeader: function () {},
                setRequestHeader: function () {},
                abort: function (ae) {
                    var af = (ae === "timeout" ? "timeout" : "aborted");
                    d("aborting upload... " + af);
                    this.aborted = 1;
                    if (M.contentWindow.document.execCommand) {
                        try {
                            M.contentWindow.document.execCommand("Stop")
                        } catch (ag) {}
                    }
                    I.attr("src", R.iframeSrc);
                    K.error = af;
                    if (R.error) {
                        R.error.call(R.context, K, af, ae)
                    }
                    if (Z) {
                        e.event.trigger("ajaxError", [K, R, af])
                    }
                    if (R.complete) {
                        R.complete.call(R.context, K, af)
                    }
                }
            };
            Z = R.global;
            if (Z && 0 === e.active++) {
                e.event.trigger("ajaxStart")
            }
            if (Z) {
                e.event.trigger("ajaxSend", [K, R])
            }
            if (R.beforeSend && R.beforeSend.call(R.context, K, R) === false) {
                if (R.global) {
                    e.active--
                }
                return
            }
            if (K.aborted) {
                return
            }
            L = G.clk;
            if (L) {
                V = L.name;
                if (V && !L.disabled) {
                    R.extraData = R.extraData || {};
                    R.extraData[V] = L.value;
                    if (L.type == "image") {
                        R.extraData[V + ".x"] = G.clk_x;
                        R.extraData[V + ".y"] = G.clk_y
                    }
                }
            }
            var Q = 1;
            var N = 2;

            function O(af) {
                var ae = af.contentWindow ? af.contentWindow.document : af.contentDocument ? af.contentDocument : af.document;
                return ae
            }
            var E = e("meta[name=csrf-token]").attr("content");
            var D = e("meta[name=csrf-param]").attr("content");
            if (D && E) {
                R.extraData = R.extraData || {};
                R.extraData[D] = E
            }

            function W() {
                var ag = l.attr("target"),
                    ae = l.attr("action");
                G.setAttribute("target", U);
                if (!f) {
                    G.setAttribute("method", "POST")
                }
                if (ae != R.url) {
                    G.setAttribute("action", R.url)
                }
                if (!R.skipEncodingOverride && (!f || /post/i.test(f))) {
                    l.attr({
                        encoding: "multipart/form-data",
                        enctype: "multipart/form-data"
                    })
                }
                if (R.timeout) {
                    P = setTimeout(function () {
                        Y = true;
                        T(Q)
                    }, R.timeout)
                }

                function ah() {
                    try {
                        var aj = O(M).readyState;
                        d("state = " + aj);
                        if (aj && aj.toLowerCase() == "uninitialized") {
                            setTimeout(ah, 50)
                        }
                    } catch (ak) {
                        d("Server abort: ", ak, " (", ak.name, ")");
                        T(N);
                        if (P) {
                            clearTimeout(P)
                        }
                        P = undefined
                    }
                }
                var af = [];
                try {
                    if (R.extraData) {
                        for (var ai in R.extraData) {
                            if (R.extraData.hasOwnProperty(ai)) {
                                if (e.isPlainObject(R.extraData[ai]) && R.extraData[ai].hasOwnProperty("name") && R.extraData[ai].hasOwnProperty("value")) {
                                    af.push(e('<input type="hidden" name="' + R.extraData[ai].name + '">').attr("value", R.extraData[ai].value).appendTo(G)[0])
                                } else {
                                    af.push(e('<input type="hidden" name="' + ai + '">').attr("value", R.extraData[ai]).appendTo(G)[0])
                                }
                            }
                        }
                    }
                    if (!R.iframeTarget) {
                        I.appendTo("body");
                        if (M.attachEvent) {
                            M.attachEvent("onload", T)
                        } else {
                            M.addEventListener("load", T, false)
                        }
                    }
                    setTimeout(ah, 15);
                    G.submit()
                } finally {
                    G.setAttribute("action", ae);
                    if (ag) {
                        G.setAttribute("target", ag)
                    } else {
                        l.removeAttr("target")
                    }
                    e(af).remove()
                }
            }
            if (R.forceSync) {
                W()
            } else {
                setTimeout(W, 10)
            }
            var ac, ad, aa = 50,
                H;

            function T(aj) {
                if (K.aborted || H) {
                    return
                }
                try {
                    ad = O(M)
                } catch (am) {
                    d("cannot access response document: ", am);
                    aj = N
                }
                if (aj === Q && K) {
                    K.abort("timeout");
                    return
                } else {
                    if (aj == N && K) {
                        K.abort("server abort");
                        return
                    }
                } if (!ad || ad.location.href == R.iframeSrc) {
                    if (!Y) {
                        return
                    }
                }
                if (M.detachEvent) {
                    M.detachEvent("onload", T)
                } else {
                    M.removeEventListener("load", T, false)
                }
                var ah = "success",
                    al;
                try {
                    if (Y) {
                        throw "timeout"
                    }
                    var ag = R.dataType == "xml" || ad.XMLDocument || e.isXMLDoc(ad);
                    d("isXml=" + ag);
                    if (!ag && window.opera && (ad.body === null || !ad.body.innerHTML)) {
                        if (--aa) {
                            d("requeing onLoad callback, DOM not available");
                            setTimeout(T, 250);
                            return
                        }
                    }
                    var an = ad.body ? ad.body : ad.documentElement;
                    K.responseText = an ? an.innerHTML : null;
                    K.responseXML = ad.XMLDocument ? ad.XMLDocument : ad;
                    if (ag) {
                        R.dataType = "xml"
                    }
                    K.getResponseHeader = function (aq) {
                        var ap = {
                            "content-type": R.dataType
                        };
                        return ap[aq]
                    };
                    if (an) {
                        K.status = Number(an.getAttribute("status")) || K.status;
                        K.statusText = an.getAttribute("statusText") || K.statusText
                    }
                    var ae = (R.dataType || "").toLowerCase();
                    var ak = /(json|script|text)/.test(ae);
                    if (ak || R.textarea) {
                        var ai = ad.getElementsByTagName("textarea")[0];
                        if (ai) {
                            K.responseText = ai.value;
                            K.status = Number(ai.getAttribute("status")) || K.status;
                            K.statusText = ai.getAttribute("statusText") || K.statusText
                        } else {
                            if (ak) {
                                var af = ad.getElementsByTagName("pre")[0];
                                var ao = ad.getElementsByTagName("body")[0];
                                if (af) {
                                    K.responseText = af.textContent ? af.textContent : af.innerText
                                } else {
                                    if (ao) {
                                        K.responseText = ao.textContent ? ao.textContent : ao.innerText
                                    }
                                }
                            }
                        }
                    } else {
                        if (ae == "xml" && !K.responseXML && K.responseText) {
                            K.responseXML = S(K.responseText)
                        }
                    }
                    try {
                        ac = k(K, ae, R)
                    } catch (aj) {
                        ah = "parsererror";
                        K.error = al = (aj || ah)
                    }
                } catch (aj) {
                    d("error caught: ", aj);
                    ah = "error";
                    K.error = al = (aj || ah)
                }
                if (K.aborted) {
                    d("upload aborted");
                    ah = null
                }
                if (K.status) {
                    ah = (K.status >= 200 && K.status < 300 || K.status === 304) ? "success" : "error"
                }
                if (ah === "success") {
                    if (R.success) {
                        R.success.call(R.context, ac, "success", K)
                    }
                    if (Z) {
                        e.event.trigger("ajaxSuccess", [K, R])
                    }
                } else {
                    if (ah) {
                        if (al === undefined) {
                            al = K.statusText
                        }
                        if (R.error) {
                            R.error.call(R.context, K, ah, al)
                        }
                        if (Z) {
                            e.event.trigger("ajaxError", [K, R, al])
                        }
                    }
                } if (Z) {
                    e.event.trigger("ajaxComplete", [K, R])
                }
                if (Z && !--e.active) {
                    e.event.trigger("ajaxStop")
                }
                if (R.complete) {
                    R.complete.call(R.context, K, ah)
                }
                H = true;
                if (R.timeout) {
                    clearTimeout(P)
                }
                setTimeout(function () {
                    if (!R.iframeTarget) {
                        I.remove()
                    }
                    K.responseXML = null
                }, 100)
            }
            var S = e.parseXML || function (ae, af) {
                    if (window.ActiveXObject) {
                        af = new ActiveXObject("Microsoft.XMLDOM");
                        af.async = "false";
                        af.loadXML(ae)
                    } else {
                        af = (new DOMParser()).parseFromString(ae, "text/xml")
                    }
                    return (af && af.documentElement && af.documentElement.nodeName != "parsererror") ? af : null
                };
            var q = e.parseJSON || function (ae) {
                    return window["eval"]("(" + ae + ")")
                };
            var k = function (aj, ah, ag) {
                var af = aj.getResponseHeader("content-type") || "",
                    ae = ah === "xml" || !ah && af.indexOf("xml") >= 0,
                    ai = ae ? aj.responseXML : aj.responseText;
                if (ae && ai.documentElement.nodeName === "parsererror") {
                    if (e.error) {
                        e.error("parsererror")
                    }
                }
                if (ag && ag.dataFilter) {
                    ai = ag.dataFilter(ai, ah)
                }
                if (typeof ai === "string") {
                    if (ah === "json" || !ah && af.indexOf("json") >= 0) {
                        ai = q(ai)
                    } else {
                        if (ah === "script" || !ah && af.indexOf("javascript") >= 0) {
                            e.globalEval(ai)
                        }
                    }
                }
                return ai
            }
        }
    };
    e.fn.ajaxForm = function (f) {
        f = f || {};
        f.delegation = f.delegation && e.isFunction(e.fn.on);
        if (!f.delegation && this.length === 0) {
            var g = {
                s: this.selector,
                c: this.context
            };
            if (!e.isReady && g.s) {
                d("DOM not ready, queuing ajaxForm");
                e(function () {
                    e(g.s, g.c).ajaxForm(f)
                });
                return this
            }
            d("terminating; zero elements found by selector" + (e.isReady ? "" : " (DOM not ready)"));
            return this
        }
        if (f.delegation) {
            e(document).off("submit.form-plugin", this.selector, b).off("click.form-plugin", this.selector, a).on("submit.form-plugin", this.selector, f, b).on("click.form-plugin", this.selector, f, a);
            return this
        }
        return this.ajaxFormUnbind().bind("submit.form-plugin", f, b).bind("click.form-plugin", f, a)
    };

    function b(g) {
        var f = g.data;
        if (!g.isDefaultPrevented()) {
            g.preventDefault();
            e(this).ajaxSubmit(f)
        }
    }

    function a(j) {
        var i = j.target;
        var g = e(i);
        if (!(g.is(":submit,input:image"))) {
            var f = g.closest(":submit");
            if (f.length === 0) {
                return
            }
            i = f[0]
        }
        var h = this;
        h.clk = i;
        if (i.type == "image") {
            if (j.offsetX !== undefined) {
                h.clk_x = j.offsetX;
                h.clk_y = j.offsetY
            } else {
                if (typeof e.fn.offset == "function") {
                    var k = g.offset();
                    h.clk_x = j.pageX - k.left;
                    h.clk_y = j.pageY - k.top
                } else {
                    h.clk_x = j.pageX - i.offsetLeft;
                    h.clk_y = j.pageY - i.offsetTop
                }
            }
        }
        setTimeout(function () {
            h.clk = h.clk_x = h.clk_y = null
        }, 100)
    }
    e.fn.ajaxFormUnbind = function () {
        return this.unbind("submit.form-plugin click.form-plugin")
    };
    e.fn.formToArray = function (w, f) {
        var u = [];
        if (this.length === 0) {
            return u
        }
        var k = this[0];
        var o = w ? k.getElementsByTagName("*") : k.elements;
        if (!o) {
            return u
        }
        var q, p, m, x, l, s, h;
        for (q = 0, s = o.length; q < s; q++) {
            l = o[q];
            m = l.name;
            if (!m) {
                continue
            }
            if (w && k.clk && l.type == "image") {
                if (!l.disabled && k.clk == l) {
                    u.push({
                        name: m,
                        value: e(l).val(),
                        type: l.type
                    });
                    u.push({
                        name: m + ".x",
                        value: k.clk_x
                    }, {
                        name: m + ".y",
                        value: k.clk_y
                    })
                }
                continue
            }
            x = e.fieldValue(l, true);
            if (x && x.constructor == Array) {
                if (f) {
                    f.push(l)
                }
                for (p = 0, h = x.length; p < h; p++) {
                    u.push({
                        name: m,
                        value: x[p]
                    })
                }
            } else {
                if (c.fileapi && l.type == "file" && !l.disabled) {
                    if (f) {
                        f.push(l)
                    }
                    var g = l.files;
                    if (g.length) {
                        for (p = 0; p < g.length; p++) {
                            u.push({
                                name: m,
                                value: g[p],
                                type: l.type
                            })
                        }
                    } else {
                        u.push({
                            name: m,
                            value: "",
                            type: l.type
                        })
                    }
                } else {
                    if (x !== null && typeof x != "undefined") {
                        if (f) {
                            f.push(l)
                        }
                        u.push({
                            name: m,
                            value: x,
                            type: l.type,
                            required: l.required
                        })
                    }
                }
            }
        }
        if (!w && k.clk) {
            var r = e(k.clk),
                t = r[0];
            m = t.name;
            if (m && !t.disabled && t.type == "image") {
                u.push({
                    name: m,
                    value: r.val()
                });
                u.push({
                    name: m + ".x",
                    value: k.clk_x
                }, {
                    name: m + ".y",
                    value: k.clk_y
                })
            }
        }
        return u
    };
    e.fn.formSerialize = function (f) {
        return e.param(this.formToArray(f))
    };
    e.fn.fieldSerialize = function (g) {
        var f = [];
        this.each(function () {
            var l = this.name;
            if (!l) {
                return
            }
            var j = e.fieldValue(this, g);
            if (j && j.constructor == Array) {
                for (var k = 0, h = j.length; k < h; k++) {
                    f.push({
                        name: l,
                        value: j[k]
                    })
                }
            } else {
                if (j !== null && typeof j != "undefined") {
                    f.push({
                        name: this.name,
                        value: j
                    })
                }
            }
        });
        return e.param(f)
    };
    e.fn.fieldValue = function (l) {
        for (var k = [], h = 0, f = this.length; h < f; h++) {
            var j = this[h];
            var g = e.fieldValue(j, l);
            if (g === null || typeof g == "undefined" || (g.constructor == Array && !g.length)) {
                continue
            }
            if (g.constructor == Array) {
                e.merge(k, g)
            } else {
                k.push(g)
            }
        }
        return k
    };
    e.fieldValue = function (f, m) {
        var h = f.name,
            s = f.type,
            u = f.tagName.toLowerCase();
        if (m === undefined) {
            m = true
        }
        if (m && (!h || f.disabled || s == "reset" || s == "button" || (s == "checkbox" || s == "radio") && !f.checked || (s == "submit" || s == "image") && f.form && f.form.clk != f || u == "select" && f.selectedIndex == -1)) {
            return null
        }
        if (u == "select") {
            var o = f.selectedIndex;
            if (o < 0) {
                return null
            }
            var q = [],
                g = f.options;
            var k = (s == "select-one");
            var p = (k ? o + 1 : g.length);
            for (var j = (k ? o : 0); j < p; j++) {
                var l = g[j];
                if (l.selected) {
                    var r = l.value;
                    if (!r) {
                        r = (l.attributes && l.attributes.value && !(l.attributes.value.specified)) ? l.text : l.value
                    }
                    if (k) {
                        return r
                    }
                    q.push(r)
                }
            }
            return q
        }
        return e(f).val()
    };
    e.fn.clearForm = function (f) {
        return this.each(function () {
            e("input,select,textarea", this).clearFields(f)
        })
    };
    e.fn.clearFields = e.fn.clearInputs = function (f) {
        var g = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function () {
            var i = this.type,
                h = this.tagName.toLowerCase();
            if (g.test(i) || h == "textarea") {
                this.value = ""
            } else {
                if (i == "checkbox" || i == "radio") {
                    this.checked = false
                } else {
                    if (h == "select") {
                        this.selectedIndex = -1
                    } else {
                        if (f) {
                            if ((f === true && /hidden/.test(i)) || (typeof f == "string" && e(this).is(f))) {
                                this.value = ""
                            }
                        }
                    }
                }
            }
        })
    };
    e.fn.resetForm = function () {
        return this.each(function () {
            if (typeof this.reset == "function" || (typeof this.reset == "object" && !this.reset.nodeType)) {
                this.reset()
            }
        })
    };
    e.fn.enable = function (f) {
        if (f === undefined) {
            f = true
        }
        return this.each(function () {
            this.disabled = !f
        })
    };
    e.fn.selected = function (f) {
        if (f === undefined) {
            f = true
        }
        return this.each(function () {
            var g = this.type;
            if (g == "checkbox" || g == "radio") {
                this.checked = f
            } else {
                if (this.tagName.toLowerCase() == "option") {
                    var h = e(this).parent("select");
                    if (f && h[0] && h[0].type == "select-one") {
                        h.find("option").selected(false)
                    }
                    this.selected = f
                }
            }
        })
    };
    e.fn.ajaxSubmit.debug = false;

    function d() {
        if (!e.fn.ajaxSubmit.debug) {
            return
        }
        var f = "[jquery.form] " + Array.prototype.join.call(arguments, "");
        if (window.console && window.console.log) {
            window.console.log(f)
        } else {
            if (window.opera && window.opera.postError) {
                window.opera.postError(f)
            }
        }
    }
})(jQuery);