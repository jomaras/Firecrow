// Just A Grip of Code Compiled From Various Files
// Check http://code.google.com/p/chrome-canopy/source/browse/#svn/trunk/www/js for something more human readable ;)
function lerp(a, b, u) {
    return a + (b - a) * u;
}

function map(v, in_min, in_max, out_min, out_max) {
    return out_min + (out_max - out_min) * ((v - in_min) / (in_max - in_min));
}

var lastRandom = 0;
var directionPositive = true;
Math.random = function()
{
    lastRandom = directionPositive ? lastRandom + 0.01
                                   : lastRandom - 0.01;

    if(lastRandom >= 1)
    {
        directionPositive = false;
    }

    if(lastRandom <= 0)
    {
        directionPositive = true;
    }

    return lastRandom;
};

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function randInt2(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

function rand(max) {
    return Math.random() * max;
}

function rand2(min, max) {
    return min + Math.random() * (max - min);
}

function clamp(v, min, max) {
    return v < min ? min : (v > max ? max : v);
}

function wrap(v, min, max) {
    if (v < min) return max - (min - v) % (max - min);
    else if (v >= max) return (v - min) % (max - min) + min;
    else return v;
}

function distSq(x1, y1, x2, y2) {
    var xo = x2 - x1;
    var yo = y2 - y1;
    return xo * xo + yo * yo;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(distSq(x1, y1, x2, y2));
}

function rotx(x, angle) {
    return x * Math.cos(angle);
}

function roty(y, angle) {
    return y * Math.sin(angle);
}

function bezierPoint(a, b, c, d, t) {
    var t1 = 1.0 - t;
    return a * t1 * t1 * t1 + 3 * b * t * t1 * t1 + 3 * c * t * t * t1 + d * t * t * t;
}

function segIntersection(p1, p2, p3, p4) {
    var bx = p2.x - p1.x;
    var by = p2.y - p1.y;
    var dx = p4.x - p3.x;
    var dy = p4.y - p3.y;
    var b_dot_d_perp = bx * dy - by * dx;
    if (b_dot_d_perp == 0) return null;
    var cx = p3.x - p1.x;
    var cy = p3.y - p1.y;
    var t = (cx * dy - cy * dx) / b_dot_d_perp;
    if (t < 0 || t > 1) return null;
    var u = (cx * by - cy * bx) / b_dot_d_perp;
    if (u < 0 || u > 1) return null;
    return new Vec2(p1.x + t * bx, p1.y + t * by);
}

function segCircIntersects(l1, l2, cp, cr) {
    var u = ((cp.x - l1.x) * (l2.x - l1.x) + (cp.y - l1.y) * (l2.y - l1.y)) / ((l2.x - l1.x) * (l2.x - l1.x) + (l2.y - l1.y) * (l2.y - l1.y));
    if (u < 0) return Vec2.distSq(l1, cp) < cr * cr;
    if (u > 1) return Vec2.distSq(l2, cp) < cr * cr;
    var ox = l1.x + (l2.x - l1.x) * u - cp.x;
    var oy = l1.y + (l2.y - l1.y) * u - cp.y;
    return ox * ox + oy * oy <= cr * cr;
}

function curveSegmentBez(v1, v2, v3, v4, s) {
    return [new Vec2(v2.x + (s * v3.x - s * v1.x) / 6, v2.y + (s * v3.y - s * v1.y) / 6), new Vec2(v3.x + (s * v2.x - s * v4.x) / 6, v3.y + (s * v2.y - s * v4.y) / 6), new Vec2(v3.x, v3.y)];
}

function semiBezier(t, x0, y0, x1, y1, x2, y2, x3, y3) {
    if (t == 0.0) {
        return [x0, y0, x0, y0, x0, y0];
    } else if (t == 1.0) {
        return [x1, y1, x2, y2, x3, y3];
    }
    var qx1 = x0 + (x1 - x0) * t;
    var qy1 = y0 + (y1 - y0) * t;
    var qx2 = x1 + (x2 - x1) * t;
    var qy2 = y1 + (y2 - y1) * t;
    var qx3 = x2 + (x3 - x2) * t;
    var qy3 = y2 + (y3 - y2) * t;
    var rx2 = qx1 + (qx2 - qx1) * t;
    var ry2 = qy1 + (qy2 - qy1) * t;
    var rx3 = qx2 + (qx3 - qx2) * t;
    var ry3 = qy2 + (qy3 - qy2) * t;
    var bx3 = rx2 + (rx3 - rx2) * t;
    var by3 = ry2 + (ry3 - ry2) * t;
    return [qx1, qy1, rx2, ry2, bx3, by3];
}

function clone(obj) {
    if (obj == null || typeof (obj) != 'object') return obj;
    var temp = new obj.constructor();
    for (var key in obj)
    temp[key] = clone(obj[key]);
    return temp;
}
Array.prototype.indexOf = function (elem) {
    for (var i = 0; i < this.length; i++)
    if (this[i] === elem) return i;
    return -1;
}

function quadIn(t, b, c, d) {
    return c * (t /= d) * t + b;
}

function quadOut(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
}

function quadInOut(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

function linearNone(t, b, c, d) {
    return c * t / d + b;
}

function Vec2(_x, _y) {
    this.x = _x;
    this.y = _y;
}
Vec2.prototype = {
    set: function (_x, _y) {
        this.x = _x;
        this.y = _y;
    },
    add: function (v) {
        this.x += v.x;
        this.y += v.y;
    },
    add2: function (_x, _y) {
        this.x += _x;
        this.y += _y === undefined ? _x : _y;
    },
    mul2: function (_x, _y) {
        this.x *= _x;
        this.y *= _y === undefined ? _x : _y;
    },
    transform: function (origin, mv, sc, rot) {
        var xo = (this.x - origin.x + mv.x) * sc;
        var yo = (this.y - origin.y + mv.y) * sc;
        if (rot) {
            this.x = origin.x + (xo * Math.cos(rot) - yo * Math.sin(rot));
            this.y = origin.y + (xo * Math.sin(rot) + yo * Math.cos(rot));
        } else {
            this.x = origin.x + xo;
            this.y = origin.y + yo;
        }
    },
    normalize: function () {
        var m = Math.sqrt(this.x * this.x + this.y * this.y);
        if (m != 0) {
            this.x /= m;
            this.y /= m;
        }
    },
    equals: function (v) {
        return x == v.x && y == v.y;
    }
};
Vec2.dist = function (v1, v2) {
    return Math.sqrt(Vec2.distSq(v1, v2));
};
Vec2.distSq = function (v1, v2) {
    return distSq(v1.x, v1.y, v2.x, v2.y);
};
Vec2.mag = function (v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
};
Vec2.angle = function (v) {
    return Math.atan2(v.y, v.x);
};
Vec2.copy = function (v) {
    return new Vec2(v.x, v.y);
};
Vec2.fromAngOff = function (x, y, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return new Vec2(x * c - y * s, x * s + y * c);
};

function Rect2(p1, p2) {
    this.min = new Vec2(p1.x, p1.y);
    this.max = p2 === undefined ? new Vec2(p1.x, p1.y) : new Vec2(p2.x, p2.y);
    this.extent = new Vec2();
    this.center = new Vec2();
    this.hyp = 0;
    this.updateExtent();
}
Rect2.prototype = {
    draw: function () {
        g.rect(this.min.x, this.min.y, this.extent.x, this.extent.y);
    },
    enclose: function (x, y) {
        if (x < this.min.x) this.min.x = x;
        if (y < this.min.y) this.min.y = y;
        if (x > this.max.x) this.max.x = x;
        if (y > this.max.y) this.max.y = y;
    },
    contains: function (x, y) {
        return x > this.min.x && x < this.max.x && y > this.min.y && y < this.max.y;
    },
    containsRect: function (rect) {
        return (rect.min.x > this.min.x && rect.min.x < this.max.x && rect.min.y > this.min.y && rect.min.y < this.max.y && rect.max.x > this.min.x && rect.max.x < this.max.x && rect.max.y > this.min.y && rect.max.y < this.max.y);
    },
    updateExtent: function () {
        this.extent.set(this.max.x - this.min.x, this.max.y - this.min.y);
        this.center.set(this.min.x + this.extent.x / 2, this.min.y + this.extent.y / 2);
        this.hyp = Vec2.mag(this.extent);
    },
    transform: function (origin, mv, sc) {
        this.min.transform(origin, mv, sc);
        this.max.transform(origin, mv, sc);
        this.center.transform(origin, mv, sc);
        this.extent.mul2(sc);
        this.hyp *= sc;
    }
};
Rect2.intersects = function (r1, r2) {
    return r1.min.x < r2.max.x && r1.max.x > r2.min.x && r1.min.y < r2.max.y && r1.max.y > r2.min.y;
};

function Brush(canvas) {
    if (typeof canvas == "string") canvas = document.getElementById(canvas);
    return buildBrush(canvas);
}

function buildBrush(canvas) {
    var g = {};
    var gfx = canvas.getContext("2d");
    g.canvas = canvas;
    g.gfx = gfx;
    g.frameRate = 30;
    g.frameCount = 0;
    g.draw = undefined;
    var doFill = true;
    var doStroke = true;
    var loopId = 0;
    var loopStarted = false;
    var startMillis = (new Date).getTime();
    g.size = function (_w, _h) {
        g.canvas.width = g.width = _w;
        g.canvas.height = g.height = _h;
    }
    g.loopOn = function (drawFunk) {
        if (loopStarted) clearInterval(loopId);
        g.draw = drawFunk;
        loopId = setInterval(function () {
            try {
                g.draw();
                g.frameCount++;
            } catch (e) {
                clearInterval(loopId);
                throw e;
            }
        }, 1000 / g.frameRate);
        loopStarted = true;
    };
    g.setFrameRate = function (fps) {
        g.frameRate = fps;
    };
    g.millis = function () {
        return (new Date).getTime() - startMillis;
    };
    g.beginPath = function () {
        gfx.beginPath();
    };
    g.endPath = function () {
        if (doFill) gfx.fill();
        if (doStroke) gfx.stroke();
        gfx.closePath();
    };
    g.moveTo = function (x, y) {
        gfx.moveTo(x, y);
        g.lastx = x;
        g.lasty = y;
    };
    g.lineTo = function (x, y) {
        gfx.lineTo(x, y);
        g.lastx = x;
        g.lasty = y;
    };
    g.bezierTo = function (t, x1, y1, x2, y2, x3, y3) {
        if (t == 1.0) {
            gfx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
            g.lastx = x3;
            g.lasty = y3;
        } else {
            var semi = semiBezier(t, g.lastx, g.lasty, x1, y1, x2, y2, x3, y3);
            gfx.bezierCurveTo.apply(gfx, semi);
            g.lastx = semi[4];
            g.lasty = semi[5];
        }
    };
    g.circle = function (x, y, radius) {
        g.beginPath();
        gfx.arc(x, y, radius, 0, Math.PI * 2, false);
        g.endPath();
    };
    g.rect = function (x, y, w, h) {
        g.beginPath();
        gfx.rect(x, y, width, height);
        g.endPath();
    };
    g.erase = function () {
        gfx.clearRect(0, 0, g.width, g.height);
    };
    g.push = function () {
        gfx.save();
    };
    g.pop = function () {
        gfx.restore();
    };
    g.lineWidth = function (w) {
        gfx.lineWidth = w;
    };
    g.stroke = function () {
        doStroke = true;
        gfx.strokeStyle = g.color.apply(this, arguments) + "";
    };
    g.fill = function () {
        doFill = true;
        gfx.fillStyle = g.color.apply(this, arguments) + "";
    };
    g.noStroke = function () {
        doStroke = false;
    };
    g.noFill = function () {
        doFill = false;
    };
    g.color = function (_r, _g, _b, _a) {
        if (arguments.length == 2) _a = _g;
        else if (arguments.length < 4) _a = 255;
        if (arguments.length < 3) {
            _g = _r;
            _b = _r;
        }
        return "rgba(" + _r + "," + _g + "," + _b + "," + (_a / 255) + ")";
    };
    return g;
}

function Leaf(pos, rot, len) {
    this.pos = pos;
    this.rot = rot;
    this.vel = new Vec2(0, 0);
    this.rotvel = 0;
    var l2 = len * rand2(0.2, 0.3);
    this.bez = [new Vec2(0, 0), new Vec2(len * 0.333, l2), new Vec2(len * 0.666, l2), new Vec2(len, 0), new Vec2(len * 0.666, -l2), new Vec2(len * 0.333, -l2), new Vec2(0, 0)];
}
Leaf.prototype = {
    attached: true,
    udeath: 0,
    update: function () {
        if (!this.attached) {
            this.udeath = Math.min(1, (g.millis() - this.detachTime) / this.pruneDelay);
            if (this.udeath == 1) {
                this.prune();
            } else {
                this.pos.add(this.vel);
                this.rot += this.rotvel;
            }
        }
    },
    draw: function (scale) {
        if (!this.attached) scale *= 1 - this.udeath;
        g.push();
        g.gfx.translate(this.pos.x, this.pos.y);
        g.gfx.rotate(this.rot);
        g.gfx.scale(scale, scale);
        g.beginPath();
        g.gfx.moveTo(this.bez[0].x, this.bez[0].y);
        g.gfx.bezierCurveTo(this.bez[1].x, this.bez[1].y, this.bez[2].x, this.bez[2].y, this.bez[3].x, this.bez[3].y);
        g.gfx.bezierCurveTo(this.bez[4].x, this.bez[4].y, this.bez[5].x, this.bez[5].y, this.bez[6].x, this.bez[6].y);
        g.endPath();
        g.pop();
    },
    transform: function (origin, mv, sc) {
        this.pos.transform(origin, mv, sc);
        this.vel.mul2(sc);
        for (var i = this.bez.length; --i >= 0;)
        this.bez[i].mul2(sc);
    },
    detach: function () {
        var mag = rand2(0.025, 0.1);
        this.vel.set(rotx(this.bez[3].x, this.rot) * mag, roty(this.bez[3].x, this.rot) * mag);
        this.rotvel = rand2(-0.1, 0.1);
        this.attached = false;
        this.detachTime = g.millis();
        this.pruneDelay = randInt2(500, 1000);
    },
    prune: function () {
        if (this.parent) this.parent.removeLeaf(this);
    }
}

function Branch(ops) {
    this.growDur = randInt2(250, 750);
    this.birthTime = g.millis();
    this.cv = [];
    this.nrm = [];
    this.bez = [];
    this.sub = [];
    this.leaves = [];
    if (ops) {
        for (var key in ops) {
            this[key] = ops[key];
        }
    }
}
Branch.prototype = {
    color: [255, 255, 255, 255],
    style: SPIKE,
    ugrow: 0,
    uease: 0,
    finished: false,
    gen: function (ops) {
        this.cv = [];
        this.weight = ops.weight;
        var
        ncv1 = ops.ncv - 1,
            ang = ops.angle,
            angv = 0,
            cv1 = clone(ops.pos),
            cv2;
        this.pushCv(cv1);
        for (var i = 0; i < ncv1; i++) {
            cv2 = new Vec2(cv1.x + rotx(ops.len / ncv1, ang), cv1.y + roty(ops.len / ncv1, ang));
            angv += rand2(-ops.crook, ops.crook);
            ang += angv;
            if (this.style == FLOWER) {
                ang += wrap(ang + Math.PI * 0.5, -Math.PI, Math.PI) * -0.2;
            }
            var is = findIntersection(cv1, cv2);
            if (is && i != 0) {
                this.pushCv(is);
                break;
            } else {
                this.pushCv(cv2);
            }
            cv1 = cv2;
        }
        this.bake();
        if (flower && flowerMoment && this.twigRule) {
            var tr = this.twigRule;
            var n = Math.floor(tr.nbr[0]);
            for (var i = 0; i < n; i++) {
                var side = Math.round(1 - tr.side[i % tr.side.length])
                this.leaf((i + 1) / (n + 1), side ? tr.angle[i % tr.angle.length] : Math.PI - tr.angle[i % tr.angle.length]);
            }
        }
    },
    update: function () {
        var time = g.millis() - this.birthTime;
        this.ugrow = time > this.growDur ? 1 : linearNone(time, 0, 1, this.growDur);
        this.uease = time > this.growDur ? 1 : quadOut(time, 0, 1, this.growDur);
        if (this.parent) this.ugrow = Math.max(0, this.ugrow - (1 - Math.min(1, this.parent.ugrow / this.upos)));
        if (this.twigRule && this.sub.length == 0 && this.ugrow >= 1 && this.bounds.hyp >= minLengthToSpawn && this.bounds.hyp < viewBounds.hyp) {
            this.multiTwig();
        }
        for (var i = this.leaves.length; --i >= 0;)
        this.leaves[i].update();
    },
    draw: function () {
        this.color[3] = Math.min(255, map(this.bounds.hyp, maxLength * 0.8, maxLength, 255, 0));
        Branch.draw_spike(this);
        for (var i = this.leaves.length; --i >= 0;)
        this.leaves[i].draw(this.uease);
    },
    pushCv: function (v) {
        this.cv.push(v);
    },
    popCv: function () {
        return this.cv.pop();
    },
    addSub: function (br) {
        br.parent = this;
        this.sub.push(br);
    },
    removeSub: function (br) {
        br.parent = null;
        var i = this.sub.indexOf(br);
        if (i >= 0) this.sub.splice(i, 1);
    },
    addLeaf: function (leaf) {
        leaf.parent = this;
        this.leaves.push(leaf);
    },
    removeLeaf: function (leaf) {
        leaf.parent = null;
        var i = this.leaves.indexOf(leaf);
        if (i >= 0) this.leaves.splice(i, 1);
    },
    transform: function (origin, mv, sc) {
        for (var i = this.cv.length; --i >= 0;)
        this.cv[i].transform(origin, mv, sc);
        for (var i = this.bez.length; --i >= 0;)
        this.bez[i].transform(origin, mv, sc);
        this.bounds.transform(origin, mv, sc);
        for (var i = this.leaves.length; --i >= 0;)
        this.leaves[i].transform(origin, mv, sc);
    },
    bake: function () {
        this.updateNormals();
        this.updateBezier();
        this.updateBounds();
    },
    updateBezier: function () {
        var s = 1;
        var cvl1 = this.cv.length - 1;
        this.bez = [clone(this.cv[0])];
        this.bez.push.apply(this.bez, curveSegmentBez(this.cv[0], this.cv[0], this.cv[1], this.cv[2], s));
        for (var i = 1; i < cvl1 - 1; i++) {
            this.bez.push.apply(this.bez, curveSegmentBez(this.cv[i - 1], this.cv[i], this.cv[i + 1], this.cv[i + 2], s));
        }
        this.bez.push.apply(this.bez, curveSegmentBez(this.cv[cvl1 - 2], this.cv[cvl1 - 1], this.cv[cvl1], this.cv[cvl1], s));
    },
    updateNormals: function () {
        this.nrm = [];
        for (var i = 0, cvl = this.cv.length; i < cvl; i++) {
            this.nrm[i] = new Vec2(0, 0);
            if (i > 0) this.nrm[i].add2(-(this.cv[i].y - this.cv[i - 1].y), this.cv[i].x - this.cv[i - 1].x);
            if (i < cvl - 1) this.nrm[i].add2(-(this.cv[i + 1].y - this.cv[i].y), this.cv[i + 1].x - this.cv[i].x);
            this.nrm[i].normalize();
        }
    },
    updateBounds: function () {
        this.bounds = new Rect2(this.cv[0]);
        for (var i = this.cv.length; --i >= 0;) {
            this.bounds.enclose(this.cv[i].x, this.cv[i].y);
        }
        this.bounds.updateExtent();
    },
    twig: function (u, style, genops) {
        var nu = new Branch({
            upos: u,
            style: style
        });
        if (style == SPIKE) nu.twigRule = this.getMutatedRule(mutate ? 0.15 : 0);
        genops.pos = this.uPnt(u);
        genops.angle += Vec2.angle(this.uNrm(u));
        genops.len *= this.bounds.hyp * (1 - u);
        nu.gen(genops);
        this.addSub(nu);
        addBranch(nu);
        return nu;
    },
    leaf: function (u, angle) {
        var nu = new Leaf(this.uPnt(u), Vec2.angle(this.uNrm(u)) + angle, this.bounds.hyp * (1 - u) * rand2(0.2, 0.3));
        this.addLeaf(nu);
    },
    multiTwig: function () {
        var n = Math.floor(this.twigRule.nbr[0]);
        if (branches.length + n < maxBranches) {
            for (var i = this.leaves.length; --i >= 0;)
            this.leaves[i].detach();
            var tr = this.twigRule;
            for (var i = 0; i < n; i++) {
                var side = Math.round(tr.side[i % tr.side.length]);
                var u = (i + 1) / (n + 1);
                var style = tr.style[i % tr.style.length];
                this.twig(u, style, {
                    angle: side ? tr.angle[i % tr.angle.length] : Math.PI - tr.angle[i % tr.angle.length],
                    crook: tr.crook[i % tr.crook.length],
                    len: tr.len[i % tr.len.length],
                    weight: this.weight,
                    ncv: Math.floor(tr.ncv[i % tr.ncv.length])
                });
            }
            this.twigRule = null;
        }
    },
    getMutatedRule: function (mutation) {
        if (arguments.length == 0) mutation = 0;
        var rule;
        if (mutation == 0) {
            rule = clone(this.twigRule);
        } else {
            rule = {};
            for (var key in this.twigRule) {
                if (key == "style" || key == "side" || key == "flower") {
                    rule[key] = clone(this.twigRule[key]);
                } else {
                    var limits = Branch.ruleLimits[key];
                    rule[key] = [];
                    for (var i = 0, rl = this.twigRule[key].length; i < rl; i++) {
                        rule[key].push(clamp(this.twigRule[key][i] + rand2(-mutation, mutation) * (limits[1] - limits[0]), limits[0], limits[1]));
                    }
                }
            }
        }
        rule.flower = false;
        return rule;
    },
    pollenate: function () {
        if (this.twigRule) {
            this.twigRule.flower = true;
        }
    },
    prune: function () {
        if (this.parent) this.parent.removeSub(this);
        for (var i = this.sub.length; --i >= 0;)
        this.sub[i].parent = null;
        for (var i = this.leaves.length; --i >= 0;)
        this.leaves[i].parent = null;
        this.sub = null;
        this.leaves = null;
    },
    uPnt: function (u) {
        u *= this.cv.length - 1;
        var iu = Math.floor(u);
        var fu = u - iu;
        if (fu == 0) return new Vec2(this.cv[iu].x, this.cv[iu].y);
        var b = iu * 3;
        return new Vec2(bezierPoint(this.bez[b].x, this.bez[b + 1].x, this.bez[b + 2].x, this.bez[b + 3].x, fu), bezierPoint(this.bez[b].y, this.bez[b + 1].y, this.bez[b + 2].y, this.bez[b + 3].y, fu));
    },
    uNrm: function (u) {
        u *= this.cv.length - 1;
        var iu = Math.floor(u);
        var fu = u - iu;
        if (fu == 0) return new Vec2(this.nrm[iu].x, this.nrm[iu].y);
        return new Vec2(lerp(this.nrm[iu].x, this.nrm[iu + 1].x, fu), lerp(this.nrm[iu].y, this.nrm[iu + 1].y, fu));
    }
};
Branch.draw_spike = function (br) {
    if (br.cv.length > 0 && br.uease > 0) {
        var u = br.uease * (br.cv.length - 1);
        var uint = Math.floor(u);
        var uf = u - uint;
        var w = br.weight * br.bounds.hyp;
        var nrmx = [];
        var nrmy = [];
        for (var i = 0; i <= uint; i++) {
            var th = Math.max(0, 1 - i / (br.cv.length - 1) - (1 - br.uease)) * w;
            nrmx.push(br.nrm[i].x * th);
            nrmy.push(br.nrm[i].y * th);
        }
        g.noStroke();
        g.fill.apply(g, br.color);
        g.beginPath();
        g.moveTo(br.cv[0].x + nrmx[0], br.cv[0].y + nrmy[0]);
        for (var i = 0; i < uint; i++) {
            var b = i * 3 + 1;
            var th = w * (1 - br.uease);
            g.gfx.bezierCurveTo(br.bez[b].x + nrmx[i], br.bez[b].y + nrmy[i], br.bez[b + 1].x + nrmx[i + 1], br.bez[b + 1].y + nrmy[i + 1], br.bez[b + 2].x + nrmx[i + 1], br.bez[b + 2].y + nrmy[i + 1]);
        }
        if (uf > 0) {
            var b = uint * 3;
            var tip = semiBezier(uf, br.bez[b].x, br.bez[b].y, br.bez[b + 1].x, br.bez[b + 1].y, br.bez[b + 2].x, br.bez[b + 2].y, br.bez[b + 3].x, br.bez[b + 3].y);
            g.gfx.bezierCurveTo(tip[0] + nrmx[uint], tip[1] + nrmy[uint], tip[2], tip[3], tip[4], tip[5]);
            g.gfx.bezierCurveTo(tip[2], tip[3], tip[0] - nrmx[uint], tip[1] - nrmy[uint], br.bez[b].x - nrmx[uint], br.bez[b].y - nrmy[uint]);
        }
        for (var i = uint; --i >= 0;) {
            var b = i * 3;
            g.gfx.bezierCurveTo(br.bez[b + 2].x - nrmx[i + 1], br.bez[b + 2].y - nrmy[i + 1], br.bez[b + 1].x - nrmx[i], br.bez[b + 1].y - nrmy[i], br.bez[b].x - nrmx[i], br.bez[b].y - nrmy[i]);
        }
        g.gfx.bezierCurveTo(br.bez[0].x - nrmx[0] - nrmy[0], br.bez[0].y - nrmy[0] + nrmx[0], br.bez[0].x + nrmx[0] - nrmy[0], br.bez[0].y + nrmy[0] + nrmx[0], br.bez[0].x + nrmx[0], br.bez[0].y + nrmy[0]);
        g.endPath();
    }
};
Branch.ruleLimits = {
    nbr: [6, 20],
    ncv: [6, 32],
    angle: [-Math.PI * 0.35, Math.PI * 0.35],
    crook: [0, Math.PI / 9],
    side: [0, 1],
    len: [0.5, 1.0]
};
var
canvas, container, g, mouse = new Vec2(0, 0),
    viewBounds, cullBounds, viewBoundsMax = new Vec2(1000, 500),
    root, branches = [],
    mouseBranch, maxLength, minLengthToSpawn = 50,
    maxBranches = 100,
    origin, zoomVel = 0,
    panVel = 0,
    bgColor = [0, 0, 0],
    playing = false,
    mutate = false,
    flower = false,
    aboutOn = false,
    NONE = "none",
    PAINT = "paint",
    ERASE = "erase",
    SPIKE = "spike",
    STROKE = "stroke",
    FLOWER = "flower",
    paintTool, paintStyle, paintRadius = 20,
    flowerMoment = false,
    flowerMomentId;
window.onload = function justInit() {
    canvas = document.getElementById("my_canvas");
    container = document.getElementById("my_container");
    canvas.onmousedown = onMouseDown;
    canvas.onmouseup = onMouseUp;
    canvas.onmousemove = onMouseMove;
    document.onkeydown = onKeyDown;
    g = new Brush(canvas);
    g.setFrameRate(30);
    g.loopOn(justDraw);
    sizeToWindow();
    origin = new Vec2(viewBounds.center.x, viewBounds.center.y);
    window.onresize = sizeToWindow;
    set_tool(NONE);
    set_paint_style(SPIKE);
    toggle("mutate", false);
    toggle("flower", false);
    initRoot();
    var hash = window.location.hash.substring(1);
    if (hash == "play") toggle("play", true);
    else toggle("about", true);

    document.getElementById("tog_play").onclick = function()
    {
        return toggle('play');
    };

    document.getElementById("tog_flower").onclick = function()
    {
        return toggle('flower');
    };

    document.getElementById("tog_mutate").onclick = function()
    {
        return toggle('mutate');
    };

    document.getElementById("reset").onclick = function()
    {
        return reset();
    };

    document.getElementById("tog_about").onclick = function()
    {
        return toggle('about');
    };
};

function initRoot() {
    clearBranches();
    root = new Branch({
        style: paintStyle,
        twigRule: {
            nbr: [8],
            ncv: [16, 16, 16, 16],
            angle: [rand2(-Math.PI, Math.PI) * 0.33],
            crook: [0.1],
            side: [0, 1],
            style: [SPIKE],
            len: [1, 1, 1, 1],
            flower: false
        }
    });
    root.gen({
        pos: new Vec2(g.width * rand2(0.25, 0.75), g.height),
        angle: -Math.PI / 2,
        crook: 0.05,
        len: g.height,
        weight: 0.04,
        ncv: 16
    });
    addBranch(root);
}

function sizeToWindow() {
    var winw = window.innerWidth;
    var winh = window.innerHeight;
    viewBounds = new Rect2(new Vec2(0, 0), new Vec2(Math.min(winw, viewBoundsMax.x), Math.min(winh, viewBoundsMax.y)));
    cullBounds = new Rect2(new Vec2(viewBounds.min.x - 50, viewBounds.min.y - 50), new Vec2(viewBounds.max.x + 50, viewBounds.max.y + 50));
    maxLength = viewBounds.hyp * 10;
    g.size(viewBounds.extent.x, viewBounds.extent.y);
    container.style.left = winw / 2 - viewBounds.extent.x / 2;
    container.style.top = winh / 2 - viewBounds.extent.y / 2;
}

function justDraw() {
    g.erase();
    g.noFill();
    g.stroke(0);
    for (var i = 0, brl = branches.length; i < brl; i++) {
        branches[i].update();
        branches[i].draw();
    }
    if (mouseBranch) {
        mouseBranch.update();
        mouseBranch.draw();
    }
    sortByClosestToMouse();
    var closest = branches[0];
    if (closest) {
        var ccv = closest.cv[Math.floor(closest.cv.length / 2)];
        origin.set(lerp(origin.x, ccv.x, 0.25), lerp(origin.y, ccv.y, 0.25));
    }
    if (playing && closest) {
        var move = new Vec2((viewBounds.center.x - origin.x) * panVel, (viewBounds.center.y - origin.y) * panVel);
        for (var i = branches.length; --i >= 0;) {
            branches[i].transform(origin, move, 1 + zoomVel);
        }
        var speedy = mouse.down && closest.style != FLOWER;
        zoomVel *= 0.9;
        zoomVel += lerp(0.001, speedy ? 0.01 : 0.002, branches.length / maxBranches);
        panVel *= 0.9;
        panVel += lerp(0.001, speedy ? 0.005 : 0.002, branches.length / maxBranches);
    }
    cullOffscreen();
}

function startFlowerMoment() {
    if (flowerMoment) clearTimeout(flowerMomentId);
    if (playing) {
        flowerMoment = true;
        flowerMomentId = setTimeout(endFlowerMoment, randInt2(5000, 20000));
        fadeBg(randInt(130), randInt(130), randInt(130), 1000);
    }
}

function endFlowerMoment() {
    if (flowerMoment) {
        flowerMoment = false;
        clearTimeout(flowerMomentId);
    }
    if (flower) flowerMomentId = setTimeout(startFlowerMoment, randInt2(8000, 12000));
}

function onMouseDown(e) {
    mouse.down = true;
}

function onMouseMove(e) {
    mouse.set(e.pageX - container.offsetLeft, e.pageY - container.offsetTop);
}

function onMouseUp(e) {
    mouse.down = false;
}

function onKeyDown(e) {
    switch (String.fromCharCode(e.keyCode).toLowerCase()) {
        case ' ':
        case 'p':
            toggle('play');
            break;
        case 'n':
            reset();
            break;
        case 'm':
            toggle('mutate');
            break;
        case 'b':
            toggle('flower');
            break;
        case 'a':
            toggle('about');
            break;
    }
}

function addBranch(br) {
    branches.push(br);
}

function removeBranch(br) {
    removeBranchByIndex(branches.indexOf(br));
}

function removeBranchByIndex(i) {
    branches[i].prune();
    if (i >= 0) branches.splice(i, 1);
}

function clearBranches() {
    for (var i = branches.length; --i >= 0;)
    branches[i].prune();
    branches = [];
}

function cullOffscreen() {
    for (var i = branches.length; --i >= 0;) {
        var br = branches[i];
        if (!Rect2.intersects(cullBounds, br.bounds) || br.bounds.hyp > maxLength) {
            removeBranchByIndex(i);
        }
    }
}

function findIntersection(p1, p2) {
    var bounds = new Rect2(new Vec2(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)), new Vec2(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)));
    for (var i = branches.length; --i >= 0;) {
        var br = branches[i];
        if (Rect2.intersects(bounds, br.bounds)) {
            for (var j = br.cv.length - 1; --j >= 0;) {
                var is = segIntersection(p1, p2, br.cv[j], br.cv[j + 1]);
                if (is !== null) return is;
            }
        }
    }
    return null;
}

function sortByClosestToMouse() {
    for (var i = branches.length; --i >= 0;) {
        var ctr_cv = branches[i].cv[Math.floor(branches[i].cv.length / 2)];
        branches[i].distToMouse = Vec2.distSq(mouse, ctr_cv);
    }
    branches.sort(sortMouseDist);
}

function sortMouseDist(a, b) {
    return b.distToMouse < a.distToMouse && b.bounds.hyp < viewBounds.hyp ? 1 : -1;
}

function toggle(which, state) {
    switch (which) {
        case "play":
            if (arguments.length == 1) state = !playing;
            playing = state;
            if (playing) {
                if (flower) startFlowerMoment();
                document.getElementById("tog_play").textContent = "pause";
            } else {
                playing = false;
                zoomVel = panVel = 0;
                mouseBranch = null;
                document.getElementById("tog_play").textContent = "play";
            }
            break;
        case "about":
            if (arguments.length > 1) {
                aboutOn = state;
            } else {
                aboutOn = !aboutOn;
                state = aboutOn;
            }
            break;
        case "mutate":
            if (arguments.length > 1) {
                mutate = state;
            } else {
                mutate = !mutate;
                state = mutate;
            }
            break;
        case "flower":
            if (arguments.length > 1) {
                flower = state;
            } else {
                flower = !flower;
                state = flower;
            }
            if (flower) {
                if (playing) startFlowerMoment();
            } else {
                endFlowerMoment();
            }
            break;
    }
    if (state)
    {
        var togElement = document.querySelector("#tog_" + which);
        if(togElement != null)
        {
            togElement.classList.add("selected");
        }
    }
    else
    {
        var togElement = document.querySelector("#tog_" + which);
        if(togElement != null)
        {
            togElement.classList.remove("selected");
        }
    }
    return false;
}

function play() {
    toggle("play", true);
}

function pause() {
    toggle("play", false);
}

function set_tool(tool) {
    playing = false;
    paintTool = tool;
    var toolElement = document.querySelector("#control a.tool");
    var paintToolElement = document.querySelector("#tool_" + paintTool);

    if(toolElement != null)
    {
        toolElement.classList.remove("selected");
    }

    if(paintToolElement != null)
    {
        paintToolElement.classList.add("selected");
    }

    return false;
}

function set_paint_style(style) {
    playing = false;
    paintStyle = style;
    return false;
}

function reset() {
    pause();
    initRoot();
    fadeBg(0, 0, 0, 1000);
    return false;
}

function fadeBg(r, g, b, dur) {
    if (fadeBgFading) clearInterval(fadeBgTimerId);
    fadeBgFrom = clone(bgColor);
    fadeBgStart = (new Date).getTime();
    fadeBgTo = [r, g, b];
    fadeBgTimerId = setInterval(function () {
        var time = (new Date).getTime() - fadeBgStart;
        if (time < dur) {
            for (var i = 3; --i >= 0;) {
                bgColor[i] = quadOut(time, fadeBgFrom[i], fadeBgTo[i] - fadeBgFrom[i], dur);
            }
        } else {
            clearInterval(fadeBgTimerId);
            bgColor = fadeBgTo;
        }
    }, 13);
}
var fadeBgTimerId, fadeBgFading, fadeBgFrom, fadeBgTo, fadeBgStart;