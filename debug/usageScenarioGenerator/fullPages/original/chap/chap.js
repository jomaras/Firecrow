D = document;
R = .48;
RR4 = 4*R*R;
WK = /WebKit/.test(navigator.appVersion);
Q = 30;
N = "http://www.w3.org/2000/svg";

MO = /iP(hone|od)/.test(navigator.userAgent);
MS = /Microsoft/.test(navigator.appName);
X = MO?0:2;
TB = 2;
LB = X;
BB = 12
RB = 10+X;
ZB = 40;

function cancel(e){
    if(window.event)
        e=window.event;
    if(e.preventDefault)
        e.preventDefault(),e.stopPropagation();
    else
        e.returnValue=e.cancelBubble=true;
}

function fr(l) {
    return F.appendChild(l);
}

function C(n) {
    return fr(D.createElementNS(N, n));
}

function st(e, s) {
    for(k in s)
        e.style.setProperty(k, s[k], "");
    return s;
}

function P(l, x) {
    l.baseVal.value = x * Q;
    return x;
}

GI = 0;
function rg(l, c0, c1, cx, cy, r, fx, fy) {
    gr = C('radialGradient');
    gr.id = 'a'+(GI++)+(new Date).getTime();
    st(sp = gr.appendChild(C('stop')), {color: c0});
    sp.setAttribute('offset','0');
    sp.setAttribute('stop-color',c0);
    st(sp = gr.appendChild(C('stop')), {color: c1});
    sp.setAttribute('offset','100%');
    sp.setAttribute('stop-color',c1);
    st(l, {fill: "url(#" + gr.id + ")"});
    if(WK)
        gr.setAttribute('cx', cx*Q),
            gr.setAttribute('cy', cy*Q),
            gr.setAttribute('r', r*Q),
            gr.setAttribute('fx', fx*Q),
            gr.setAttribute('fy', fy*Q);
    else
        P(gr.cx, cx),
            P(gr.cy, cy),
            P(gr.r, r),
            P(gr.fx, fx),
            P(gr.fy, fy);
    return gr;
}


F = document.body;
if(MO)
    st(F, {margin: 0});
F = C('svg');
v = F.viewBox.baseVal;
v.x = 0* Q;
v.y = (MO?1:0) *Q;
v.height = 14 * Q;
v.width = (2*X +10) * Q;

r = C("rect");
P(r.x, X);
P(r.y, 2);
P(r.width, P(r.height, 10));
P(r.rx, P(r.ry, .1));
st(r, {"stroke-width": .05,
    "stroke": "#100",
    fill: "#fff",
});
MO || rg(r, "#fff", "#000", 0, 0, 200, 0, 0);

s = C("rect");
P(s.y, 3);
P(s.x, 1+X);
P(s.width, P(s.height, 8));
st(s, {fill: "#777"});

WG = rg(F, "#fff", "#bbb", 0, 20, 100, 0, 20);
BG = rg(F, "#000", "#fff", 0, 20, 100, 0, 20);
for(i = 64; i;) {
    r = C("rect");
    P(r.width, P(r.height, .98));
    x = --i % 8;
    y = (i-x)/8;
    P(r.x, x + 1.01+X);
    P(r.y, y + 3.01);
    P(r.rx, P(r.ry, .09));
    st(r, {fill: (x+y)%2 ?
        (MO ? "#fff" : "url(#"+WG.id+")" ):
        (MO? "#000": "url(#"+BG.id+")")});
}


function vec(E, v, p) {
    p = F.createSVGPoint();
    M = F.getScreenCTM();
    if(MS) {
        p.x = E.offsetX;
        p.y = E.offsetY;
        EE = E;

        p.x = p.x/M.a;30*7;
        p.y = p.y/M.a;30*7;
    } else {
        p.x = WK ? E.pageX : E.clientX;
        p.y = WK ? E.pageY : E.clientY;
        if(WK)
            M = F.createSVGMatrix(), M.a = M.d = 200/Q/7, M.e = 8, M.f = 108;
        p = p.matrixTransform(M.inverse());
    }
    p.x = v.x - p.x/Q;
    p.y = v.y - p.y/Q;
    return p;
}

function len(p) {
    return Math.sqrt(p.x*p.x+p.y*p.y);
}

function pck(a) {
    return a[Math.floor(Math.random() * a.length)];
}

CT = [0, 0];
function dc() {
    return "You: " + CT[1] + "\nMachine: " + CT[0];
}

AD = 0;
function mv() {
    bs = [[],[]];
    for(i in u)
        if(!u[i].z)
            bs[u[i].c].push(u[i]);
    if(bs[0].length) {
        if(bs[1].length) {
            if(!cc)
                b = pck(bs[0]),t = pck(bs[1]),
                    l = len(v = {x: t.x - b.x, y: t.y - b.y}),v.x *= R/l,v.y *= R/l,ph(b, v);
        } else
            cc = 0,CT[0]++,AD--,sn("You lose", dc());
    } else {
        CT[1]++;
        if(bs[1].length)
            sn("You win", dc()), cc = 1, AD++;
        else
            CT[0]++, sn("Draw", dc());
    }
    if(AD<-6)
        AD=-6;
    if(AD>6)
        AD=6;
}

G = .1;
function tick(omg) {
    omg = MG;
    CO = MG = 0;
    for(i in u) {
        p = u[i];
        v = p.v;
        L = len(v);
        if(L > G) {
            if(!p.z || !MO)
                MG = CO = 1;
            v.x -= v.x/L*G, v.y -= v.y/L*G;
        }
        else
            v.x = v.y = 0;

        if(p.z)
            if(p.z < ZB)
                CO = 1;
            else
                st(p.l, {visibility: "hidden"});
    }

    if(CO) {
        setTimeout(tick, 40);

        T = 1;
        do {
            pair = 0;
            t = T;
            for(i = 0; i < u.length; i++) {
                p = u[i];
                if(p.z)
                    continue;
                v = p.v;
                for(j = i+1; j < u.length; j++) {
                    q = u[j];
                    if(q.z)
                        continue;
                    w = q.v;

                    fx = w.x - v.x;
                    fy = w.y - v.y;
                    if(fx || fy) {
                        dx = q.x - p.x;
                        dy = q.y - p.y;

                        k = dx*fx + dy*fy;
                        if(k < 0) {
                            a = fx*fx + fy*fy;
                            c = dx*dx + dy*dy - RR4;
                            dis = k*k - a*c;
                            if(dis > 0) {
                                tt = (-k - Math.sqrt(dis))/a;
                                if(tt >= 0 && tt < t)
                                    t = tt,pair = [p, q];
                            }
                        }
                    }
                }
            }

            for(i in u) {
                p = u[i];
                if(p.v.x || p.v.y)
                    p.x += p.v.x*t, p.y += p.v.y*t,p.rd = 0;
                p.z ?
                    (p.z += 1,p.rd = 0):
                    (p.y < TB || p.y > BB || p.x > RB || p.x < LB) &&
                        (p.z = 1, F.insertBefore(p.l, F.firstChild));
            }

            if(pair) {
                p = pair[0], q = pair[1];
                var ex = p.x - q.x;
                var ey = p.y - q.y;
                var e2 = ex*ex + ey*ey;
                var m0 = (ex*p.v.x+ey*p.v.y)/e2;
                var m1 = (ex*q.v.x+ey*q.v.y)/e2;
                var change = 0.75*(m1-m0);
                p.v.x += ex*change;
                p.v.y += ey*change;
                q.v.x -= ex*change;
                q.v.y -= ey*change;
            }

            T -= t;
        } while(T > 0);

        rr();
    }

    if(omg && !MG) {
        cc ^= 1;
        mv();
    }
}

r = C('line');
ra = C('line');
rb = C('line');
AG = rg(r, "#fff", "#35a677", 0, 20, 10, 0, 20);
st(r, st(ra, st(rb, {stroke: "url(#"+AG.id+")"})));
function aim() {
    if(lp) {
        v = lp.lv;
        L = len(v);
        ex = lp.x - v.x/L*(R+0.2);
        ey = lp.y - v.y/L*(R+0.2);
        P(r.x1, ex - v.x*5);
        P(r.y1, ey - v.y*5);
        P(r.x2, ex);
        P(r.y2, ey);
        an = Math.atan(-v.y/v.x);
        sg = v.x>=0 ? -R : R;

        P(ra.x1, ex + sg*Math.sin(an+1.3));
        P(ra.y1, ey + sg*Math.cos(an+1.3));
        P(ra.x2, ex);
        P(ra.y2, ey);
        P(rb.x1, ex + sg*Math.sin(an+1.8));
        P(rb.y1, ey + sg*Math.cos(an+1.8));
        P(rb.x2, ex);
        P(rb.y2, ey);
        st(fr(ra), st(fr(rb),
            st(fr(r), {visibility: "",  "stroke-width": .1 * Q})));
    } else
        st(ra, st(rb, st(r, {visibility: "hidden"})));
}

CO = 0;
function ph(p, v) {
    if(v.x || v.y) {
        v.x *= 6, v.y *= 6,p.v = v;
        if(!CO)
            tick();
    }
}

lp = 0;
if(!MO)
    F.onmousedown = function() {
        if(lp){
            ph(lp, lp.lv);
        }
    };

u = [];
for(i = 16; i--; ) {
    l = C('circle');
    P(l.r, R);
    st(l, {stroke: "#888",
        fill: MO? (i&1?"#fff":"#000"): "url(#" + (i&1 ? WG : BG).id +")",
        "stroke-width": .05*Q,
        visibility: "hidden"});
    v = {
        c: i&1,
        l: l
    };
    if(!MO){
        function mm(p) {
            return function(E) {
                if(MG || 1 != p.c)
                    return;
                p.lv = vec(E, p);
                lp = p;
                aim();
            }
        }

        function md(p) {
            return function(E) {
                if(MG || 1 != p.c)
                    return;
                ph(lp, lp.lv);
            }
        }

        function mo(v) {
            return function(E) {
            }
        }

        l.onmousemove = mm(v);
        l.onmouseout = mo(v);
    }
    u.push(v);
}

MG = 0;
function go() {
    for(i in u) {
        p = u[i];
        st(p.l, {visibility: ""});
        p.x = (i>>1) + 1.5 + X;
        p.y = p.c? 10.5 -Math.max(AD, 0): 3.5-Math.min(AD,0);
        p.rd = 0;
        p.z = 0;
        p.v = {x:0, y:0};
        fr(p.l);
    }

    st(SN, {visibility: "hidden"});
    SU&&ST.removeChild(SU);
    for(i in Su)
        St[i].removeChild(Su[i]);
    Su = [];

    rr();
    mv();
}

function rr() {
    for(i in u) {
        p = u[i];
        if(p.rd)
            continue;
        l = p.l;
        P(l.cx, p.x);
        P(l.cy, p.y);
        P(l.r, R*20/(p.z+20));
        p.rd = 1;
    }
}

function PR(l,x,y,w,h) {
    P(l.x, x);
    P(l.y, y);
    P(l.width,w);
    P(l.height, h);
}

SN = C("rect");
P(SN.rx, P(SN.ry, .6));
P(SN.x, X+.5);
P(SN.y, 4);
P(SN.width, 9);
P(SN.height, 7);
st(SN, {fill: "#8ac", opacity: .9, stroke: "#246", "stroke-width": 0.1*Q});
rg(SN, "#fff", "#8ac", 20, 0, 15, 20, 0);
function cg(e) {
    cancel(e);
    go();
}
SN.onmousedown = cg;
ST = C("text");
ST.onmousedown = cg;

function T(a, v) {
    l = F.createSVGLength();
    l.value = v *Q;
    a.baseVal.appendItem(l);
    return v;
}
T(ST.x, 1.5+X);
T(ST.y, 5.5);
st(ST, {fill: "#fff", "font-size": Q+"px"});

St = [], Su = [];
for(y = 7; y <= 11; y+=.5) {
    Sv = C("text");
    T(Sv.x, 1+X);
    T(Sv.y, y);
    st(Sv, {fill: "#fff", "font-size": Q/2+"px"});
    Sv.onmousedown = cg;
    St.push(Sv);
}

SU =  0;
function sn(t, u) {
    fr(SN);
    fr(ST);
    SU = ST.appendChild(D.createTextNode(t));
    if(u) for(i in u = u.split("\n")) {
        Su.push(St[i].appendChild(D.createTextNode(u[i])));
        fr(St[i]);
    }
    st(ST, st(SN, {visibility: ""}));
}

function pt(e) {
    z = F.createSVGPoint();
    z.x = e.clientX;
    z.y = e.clientY;
    z = z.matrixTransform(F.getScreenCTM().inverse());
    z.x /= Q;
    z.y /= Q;
    return z;
}

function sl(e) {
    g = pt(e);
    m = R*1.8;
    for(i in u) {
        p = u[i];
        if(p.c && (m > (ll = len({x: g.x - p.x, y: g.y - p.y})))) {
            p.lx = p.sx = e.clientX;
            p.ly = p.sy = e.clientY;
            TC = p;
            m = ll;
        }
    }
    if(TC) {
        P(CL.cx, TC.x);
        P(CL.cy, TC.y);
        st(fr(CL), {visibility: ""});
        return TC;
    }
}

document.body.ontouchstart = function(e) {
    MG || cc && sl(e.targetTouches[0]) && cancel(e);
};

CL = C('circle');
st(CL, {fill: "#f48028", opacity: .45, visibility: "hidden"});
P(CL.r, 3);

document.body.ontouchmove = function(e) {
    if(MG || !cc)
        return;
    g = e.targetTouches[0];
    h = pt(g);
    if(TC) {
        d = {x:g.clientX - TC.sx, y: g.clientY - TC.sy};
        vv = len(d);
        if(vv > 100) {
            d.x = (d.x/5 + g.clientX - TC.lx)*R/100;
            d.y = (d.y/5 + g.clientY - TC.ly)*R/100;
            ph(TC, d);
            TC = 0;
            cancel(e);
        } else
            TC.lx = g.clientX, TC.ly = g.clientY;
    } else {
        sl(g);
    }
    TC &&cancel(e);
};

(document.body.ontouchend = function(e) {
    st(CL, {visibility: "hidden"});
    TC = 0;
})();




cc = 1;
sn("Chapaev",
    (MO?
        "Pick a white piece and drag it swiftly\n" +
            "to throw it.":
        "When you move your mouse over a white\n" +
            "piece, you'll see an arrow, that points\n" +
            "in the direction in which it will be thrown\n" +
            "if you click. Length of the arrow signifies\n" +
            "force.") +
        " Objective is to knock all the\n" +
        "black pieces off the board.\n\n" +
        (MO?"Tap":"Click") + " here to start."
);
