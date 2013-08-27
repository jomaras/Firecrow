var levelInfo = document.getElementById("levelInfo");
var cI = document.getElementById("cI");
var info = document.getElementById("info");
var c = document.getElementById("c");
document.onmousemove = function mouseMove(e) {
    mX = e.pageX;
    mY = e.pageY
};
document.onmousedown = function(e) {
    mC = true
};
document.onmouseup = function (e) {
    mC = false
};
document.onkeydown = function (e) {
    key = e.keyCode;
    kO[key] = true;
    if (key == 27)
    {
        pa = !pa
    }
};
document.onkeyup = function keyUp(e) {
    kO[e.keyCode] = false
};
function $(id) {
    return document.getElementById(id)
}
function aB(x, y, ang, rad) {
    ang += d2r(rand(-5, 5));
    bX[bs] = x;
    bY[bs] = y;
    bE[bs] = true;
    bR[bs] = 2;
    bV[bs] = 15;
    bDX[bs] = bV[bs] * Math.cos(ang);
    bDY[bs] = bV[bs] * Math.sin(ang);
    bs++;
}
function dG(maX, maY, ang, w, h, oX, oY, lW) {
    c.save();
    c.translate(maX, maY);
    c.rotate(ang);
    c.lineWidth = lW;
    c.fillStyle = "#00ffff";
    c.fillRect(oX - w / 2, oY - h / 2, w, h);
    c.strokeStyle = "#000000";
    c.strokeRect(oX - w / 2, oY - h / 2, w, h);
    c.restore();
}
function dB(bX, bY, tX, tY, rad, sid, lW) {
    dR = d2r(360 / sid);
    ang = Math.atan2(tY - bY, tX - bX);
    x1 = bX + rad * Math.cos(ang);
    y1 = bY + rad * Math.sin(ang);
    c.beginPath();
    c.moveTo(x1, y1);
    for (o = ang; o < d2r(360) + ang; o += dR)c.lineTo(bX + rad * Math.cos(o), bY + rad * Math.sin(o));
    c.lineTo(x1, y1);
    c.fillStyle = "#9a9a9a";
    c.fill();
    c.lineWidth = lW;
    c.strokeStyle = "#000000";
    c.stroke();
    c.closePath();
}
function rPU() {
    do{
        puX = rand(puR, 600 - puR);
        puY = rand(puR, 600 - puR);
    } while (dist(puX, puY, boX, boY) > boR - puR);
    rnd = rand(1, 1000);
    if (rnd > 50)puT = 0; else if (rnd > 5)puT = 1; else puT = 2;
}
function cir(x, y, rad, color, lW, stro) {
    c.beginPath();
    c.lineWidth = lW;
    c.arc(x, y, rad, 0, Math.PI * 2, true);
    if (!stro) {
        c.fillStyle = color;
        c.fill();
    }
    c.strokeStyle = "#000000";
    c.stroke();
    c.closePath();
}
function d2r(deg) {
    return deg * Math.PI / 180;
}
function rand(min, max) {
    return Math.random() * (max - min) + min;
}
function round(number, decimals) {
    x10 = Math.pow(10, decimals);
    return Math.round(number * x10) / x10;
}
function dist(x1, y1, x2, y2) {
    dx = Math.abs(x1 - x2);
    dy = Math.abs(y1 - y2);
    return Math.sqrt(dx * dx + dy * dy);
}
function draw() {
    if (!gO && !pa) {
        c.clearRect(0, 0, 600, 600);
        rI = rand(1, 10000);
        if (rI < 10)rPU();
        if (rI < 150 + l * 10) {
            enE[es] = true;
            enR[es] = 40;
            do{
                enX[es] = rand(enR[es] - 100, 600 - enR[es] + 100);
                enY[es] = rand(enR[es] - 100, 600 - enR[es] + 100);
            } while (dist(enX[es], enY[es], pcX, pcY) < enR[es] + pcR + 200);
            enV[es] = 2;
            enS[es] = rand(1 + l * 1.5, 10 + l * 1.5);
            es++;
        }
        if (rI < 100) {
            tX = [];
            tY = [];
            tDX = [];
            tDY = [];
            tR = [];
            tV = [];
            n = 0;
            for (i = 0; i < bs; i++) {
                if (bE[i]) {
                    tX[n] = bX[i];
                    tY[n] = bY[i];
                    tDX[n] = bDX[i];
                    tDY[n] = bDY[i];
                    tR[n] = bR[i];
                    tV[n] = bV[i];
                    n++;
                }
            }
            bs = n;
            for (i = 0; i < n; i++) {
                bX[i] = tX[i];
                bY[i] = tY[i];
                bDX[i] = tDX[i];
                bDY[i] = tDY[i];
                bE[i] = true;
                bR[i] = tR[i];
                bV[i] = tV[i];
            }
            tX = [];
            tY = [];
            tR = [];
            tS = [];
            tV = [];
            n = 0;
            for (i = 0; i < es; i++) {
                if (enE[i]) {
                    tX[n] = enX[i];
                    tY[n] = enY[i];
                    tR[n] = enR[i];
                    tS[n] = enS[i];
                    tV[n] = enV[i];
                    n++;
                }
            }
            for (i = 0; i < n; i++) {
                enX[i] = tX[i];
                enY[i] = tY[i];
                enE[i] = true;
                enR[i] = tR[i];
                enS[i] = tS[i];
                enV[i] = tV[i];
            }
            es = n;
            tX = [];
            tY = [];
            tR = [];
            n = 0;
            for (i = 0; i < cs; i++) {
                if (cE[i]) {
                    tX[n] = cX[i];
                    tY[n] = cY[i];
                    tR[n] = cR[i];
                    n++;
                }
            }
            cs = n;
            for (i = 0; i < cs; i++) {
                cX[i] = tX[i];
                cY[i] = tY[i];
                cE[i] = true;
                cR[i] = tR[i];
            }
        }
        if (pcS < 1)gO = true;
        ve = (kO[16]) ? pcV + 4 : pcV;
        moX = 0;
        moY = 0;
        if (kO[39] || kO[68]){
            moX = ve;
        }
        if (kO[37] || kO[65]){
            moX = -ve;
        }
        if (kO[38] || kO[87]){
            moY = ve;
        }
        if (kO[40] || kO[83]) {
            moY = -ve;
        }
        cMR = (kO[32]) ? 600 : pcR + 200;
        if (dist(boX, boY, pcX, pcY) < boR - pcR) {
            for (i = 0; i < bs; i++) {
                if (bE[i]) {
                    bX[i] -= moX;
                    bY[i] += moY;
                }
            }
            for (i = 0; i < es; i++) {
                if (enE[i]) {
                    enX[i] -= moX;
                    enY[i] += moY;
                }
            }
            for (i = 0; i < cs; i++) {
                if (cE[i]) {
                    cX[i] -= moX;
                    cY[i] += moY;
                }
            }
            boX -= moX;
            boY += moY;
            puX -= moX;
            puY += moY;
        }
        else {
            pcX += moX / 10;
            pcY -= moY / 10;
            pcS *= 0.99;
        }
        cir(boX, boY, boR, "", 5, true);
        for (i = 0; i < bs; i++) {
            if (bE[i]) {
                for (j = 0; j < es; j++) {
                    if (enE[j]) {
                        if (dist(bX[i], bY[i], enX[j], enY[j]) < bR[i] + enR[j]) {
                            bE[i] = false;
                            enS[j] -= bR[i] / 50;
                            enV[j] *= 0.99;
                            if (rand(0, 100) < 60) {
                                cE[cs] = true;
                                cR[cs] = rand(2, 3);
                                cX[cs] = rand(enX[j] - enR[j], enX[j] + enR[j]);
                                cY[cs] = rand(enY[j] - enR[j], enY[j] + enR[j]);
                                cs++;
                            }
                            if (enS[j] < 2) {
                                enE[j] = false;
                                ks++;
                            }
                        }
                        if (dist(bX[i], bY[i], mX, mY) > 600){
                            bE[i] = false;
                        }
                    }
                }
            }
        }
        for (i = 0; i < bs; i++) {
            if (bE[i]) {
                c.fillStyle = "#000000";
                c.fillRect(bX[i] - bR[i], bY[i] - bR[i], bR[i] * 2, bR[i] * 2);
                bX[i] += bDX[i];
                bY[i] += bDY[i];
            }
        }
        for (i = 0; i < cs; i++) {
            if (cE[i]) {
                dis = dist(cX[i], cY[i], pcX, pcY);
                if (dis < cR[i] + pcR / 2) {
                    cE[i] = false;
                    ps++;
                    pcS += 0.001;
                }
                if (dis > 600) {
                    cE[i] = false;
                }
            }
        }
        for (i = 0; i < cs; i++) {
            if (cE[i]) {
                c.fillStyle = "#00ff00";
                c.fillRect(cX[i] - cR[i], cY[i] - cR[i], cR[i] * 2, cR[i] * 2);
                if (dist(cX[i], cY[i], pcX, pcY) < cMR) {
                    disX = Math.abs(pcX - cX[i]);
                    disY = Math.abs(pcY - cY[i]);
                    dis = Math.sqrt(disX * disX + disY * disY);
                    movX = disX * 10 / dis;
                    movY = disY * 10 / dis;
                    cX[i] += (cX[i] < pcX) ? movX : -movX;
                    cY[i] += (cY[i] < pcY) ? movY : -movY;
                }
            }
        }
        for (i = 0; i < es; i++) {
            if (enE[i]) {
                dis = dist(enX[i], enY[i], pcX, pcY);
                if (dis < enR[i] + pcR) {
                    pcS -= 0.03;
                    enS[i] += 0.03;
                }
                if (dis > 600)enE[i] = false;
            }
        }
        for (i = 0; i < es; i++) {
            if (enE[i]) {
                if (enS[i] < 30)dB(enX[i], enY[i], pcX, pcY, enR[i], enS[i], 2); else cir(enX[i], enY[i], enR[i], "#9a9a9a", 2);
                disX = Math.abs(pcX - enX[i]);
                disY = Math.abs(pcY - enY[i]);
                dis = Math.sqrt(disX * disX + disY * disY);
                movX = disX * enV[i] / dis;
                movY = disY * enV[i] / dis;
                enX[i] += (enX[i] < pcX) ? movX : -movX;
                enY[i] += (enY[i] < pcY) ? movY : -movY;
            }
        }
        if (dist(pcX, pcY, puX, puY) < pcR + puR) {
            if (puT == 0) {
                rPC++;
                pcS++;
            }
            else if (puT == 1) {
                gPC++;
                pcG += 2;
            }
            else if (puT == 2 && pcR > 5) {
                bPC++;
                boR *= 1.5;
            }
            rPU();
        }
        if (puT == 0)color = "#ff0000"; else if (puT == 1)color = "#00ff00"; else if (puT == 2)color = "#0000ff";
        cir(puX, puY, puR, color, 3);
        if (pcS < 30)dB(pcX, pcY, mX, mY, pcR, pcS, 2); else cir(pcX, pcY, pcR, "#9a9a9a", 2);
        if (!kO[16] && !kO[32]) {
            if (pcG > 18){
                pcG = 18;
            }
            w = pcR;
            h = w / 8;
            oX = w / 2 - h;
            oY = 0;
            aR = 0;
            for (i = 0; i < pcG / 2; i++) {
                ang = Math.atan2(mY - pcY, mX - pcX);
                xE = (pcR + aR) * Math.cos(ang + d2r(70 - i * 40));
                yE = (pcR + aR) * Math.sin(ang + d2r(70 - i * 40));
                ang = Math.atan2(mY - (pcY + yE), mX - (pcX + xE));
                if (mC)
                    aB(pcX + xE + (w - h) * Math.cos(ang), pcY + yE + (w - h) * Math.sin(ang), ang, h - 3);
                dG(pcX + xE, pcY + yE, ang, w, h, oX, oY, 2);
                ang = Math.atan2(mY - pcY, mX - pcX);
                xE = (pcR + aR) * Math.cos(ang - d2r(70 - i * 40));
                yE = (pcR + aR) * Math.sin(ang - d2r(70 - i * 40));
                ang = Math.atan2(mY - (pcY + yE), mX - (pcX + xE));
                if (mC)
                    aB(pcX + xE + (w - h) * Math.cos(ang), pcY + yE + (w - h) * Math.sin(ang), ang, h - 3);
                dG(pcX + xE, pcY + yE, ang, w, h, oX, oY, 2);
            }
        }
        if (ks >= lK) {
            ks = 0;
            lK += lKA;
            l++;
        }
        cI.innerHTML = ps;
        levelInfo.innerHTML = "";
        info.innerHTML = ""
    } else if (pa) {
        for (i = 0; i < kO.length; i++)kO[i] = undefined;
        info.style.left = 150;
        info.style.top = 150;
        info.innerHTML = "PAUSE";
        levelInfo.style.left = 150;
        levelInfo.style.top = 150;
        levelInfo.innerHTML = "LEVEL " + l;
    } else {
        if (tP++ == 0) {
            info.style.left = 150;
            info.style.top = 150;
            info.innerHTML = "GAME OVER - Press enter to reset<br/>";
        }
        if (kO[13]) {
            for (i = 0; i < kO.length; i++)kO[i] = undefined;
            clearInterval(dI);
            init();
        }
    }
}
cI = $("cI");
info = $("info");
c = $("c").getContext("2d");
var mX,mY,mC,kO,pcX,pcY,pcR,pcS,pcG,pcGT,pcV,es,enX,enY,enE,enR,enS,enV,puX,puY,puR,puT,bs,bX,bY,bDX,bDY,bE,bR,bV,cs,cX,cY,cE,cR,cEN,cMR,ps,boX,boY,boR,l,ks,lK,lKA,rPC,gPC,bPC,uN,tP,gO,pa,is_chrome,fps,dI;
function init() {
    mX = 0;
    mY = 0;
    mC = false;
    kO = [];
    pcX = 300;
    pcY = 300;
    pcR = 30;
    pcS = 3;
    pcG = 2;
    pcGT = 0;
    pcV = 8;
    es = 0;
    enX = [];
    enY = [];
    enE = [];
    enR = [];
    enS = [];
    enV = [];
    puX = -10;
    puY = -10;
    puR = 10;
    puT = 0;
    bs = 0;
    bX = [];
    bY = [];
    bDX = [];
    bDY = [];
    bE = [];
    bR = [];
    bV = [];
    cs = 0;
    cX = [];
    cY = [];
    cE = [];
    cR = [];
    cEN = 10;
    cMR = 230;
    ps = 0;
    boX = pcX;
    boY = pcY;
    boR = 500;
    l = 1;
    ks = 0;
    lK = 5;
    lKA = 5;
    rPC = 0;
    gPC = 0;
    bPC = 0;
    uN = "";
    tP = 0;
    gO = false;
    pa = false;
    is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    fps = (is_chrome) ? 100 : 1000;
    dI = setInterval(draw, 1000 / fps);
}
init();