//HELPER FUNCTIONS

//UI
var toggle = function (t, v) {
    if (v) { t.style.background="#121212"; return false; }
    else { t.style.background="#444444"; return true; }
}

//EVENTS
var eStop = function(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    if ( e.cancelBubble ) {
        e.returnValue = false;
        e.cancelBubble = true;
    }
}

//HELPER FUNCTIONS END

//RENDER STATES
var model = false;
var ssao = false;
var mblur = false;
var spin = false;
var m2x = false;
var cspec = false;
//RENDER STATES END

window.onload = function() {

//INTERNAL ENGINE VARS
    var w = 320;
    var h = 240;
    var wh = w/2;
    var hh = h/2;
    var c = "";
    var cv ="";
    var m = "";
    var om = "";
    var mb = 0;
    var ma = Math;
    var mt = "";
    var deg2rad = ma.PI/180;
    var rotx = 0.0
    var roty = 0.0
    var galpha = 1;
//INTERNAL ENGINE VARS END		


//INIT ENGINE

    //GET CANVAS CONTEXT
    cv = document.getElementById('cv');
    c = cv.getContext('2d');

    //GLOBAL ALPHA
    //there is a bug in firefox 6 on windows 7, when using gradients on custom paths and global alpha is not 1 the canvas crashes
    //transparency has to tbe set trough the gradient colors directly, thus I had to add those helper functions to emulate global alpha
    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

    var gCol = function (hex,a){
        var r = hexToR(hex);
        var g = hexToG(hex);
        var b = hexToB(hex);
        return "rgba("+r+","+g+","+b+","+a+")";
    }

    //GENERATE GRADIENTS
    var gGrad = function (gx,gy,gw,gh,cols) {
        var tg = c.createLinearGradient(gx,gy,gw,gh);
        var tgi = 0;
        for (gi =0;gi<=cols.length-1;gi++) {
            tg.addColorStop(tgi, cols[gi]);
            tgi += 1;
        }
        return tg;
    }

    //REGISTER EVENTS
    cv.onmousedown = function(e) {
        cv.ontouchstart = null;
        if (!e) e = window.event;
        mb = 1;
        eStop(e);
    }

    cv.onmousemove = function(e) {
        if (!e) e = window.event;
        om =[m[0],m[1]];
        m =[e.pageX||e.clientX,e.pageY||e.clientY];
        if (mb==1) {
            if (om[1]>m[1]) rotx -= 3;
            if (om[1]<m[1]) rotx += 3;
            if (om[0]>m[0]) roty -= 3;
            if (om[0]<m[0]) roty += 3;
        }
    }

    cv.ontouchstart = function (e) {
        cv.onmousedown = null;
        if (!e) e = window.event;
        mb = 1;
        eStop(e);
    }

    cv.ontouchmove = function(e) {
        if (!e) e = window.event;
        var touch = e.touches[0];
        om =[m[0],m[1]];
        m =[touch.pageX,touch.pageY];
        if (mb==1) {
            if (om[1]>m[1]) rotx -= 5;
            if (om[1]<m[1]) rotx += 5;
            if (om[0]>m[0]) roty -= 5;
            if (om[0]<m[0]) roty += 5;
        }
    }


    document.ontouchend = function (e) {
        if (!e) e = window.event;
        mb = 0;
        eStop(e);
    }

    document.onmouseup = function(e) {
        if (!e) e = window.event;
        mb = 0;
        eStop(e);
    }

    //ENGINE DATA TYPES
    var vec3 = function(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    var tri = function(p1,p2,p3,c) {
        this[0] = new vec3(p1[0], p1[1], p1[2]);
        this[1] = new vec3(p2[0], p2[1], p2[2]);
        this[2] = new vec3(p3[0], p3[1], p3[2]);
        this['c'] = c;
    }

    var mesh = function(t,px,py,pz,rx,ry,s) {
        this.t = t;
        this.px = px;
        this.py = py;
        this.rx = rx;
        this.ry = ry;
        this.orx = -1;
        this.ory = -1;
        this.s = s;
    }

    //ENGINE FUNCTIONS
    var rot = function (t,a,angle) {
        angle = angle * deg2rad;
        if ( angle > 359 ) { angle = angle - 360; }
        if ( angle < -359 ) { angle = angle + 360 ; }

        var y = 0;
        var z = 0;

        for (p=0;p<=2;p++){
            var ta = t[p][a[0]];
            var tb = t[p][a[1]];
            y = ( ma.cos(angle) * (ta) ) - ( ma.sin(angle) * (tb) );
            z = ( ma.sin(angle) * (ta) ) + ( ma.cos(angle)  * (tb) );
            t[p][a[0]] = y;
            t[p][a[1]] = z;
        }
    }

    var zsort = function (ren) {

        var rs = "";
        var zs = 1;
        var disa = 0;
        var disb = 0;

        do
        {
            zs = 0;
            for (r=0;r<=ren.length-1;r++) {
                if(r<ren.length-1){
                    if (ren[r][0].z<ren[r+1][0].z || ren[r][1].z<ren[r+1][1].z || ren[r][2].z<ren[r+1][2].z) {
                        disa = (ren[r][0].z+ren[r][1].z+ren[r][2].z)/3
                        disb = (ren[r+1][0].z+ren[r+1][1].z+ren[r+1][2].z)/3
                        if (disa<disb ) {
                            rs = ren[r];
                            ren[r] = ren[r+1];
                            ren[r+1] = rs;
                            zs = 1;
                        }
                    }
                }
            }
        }
        while (zs==1);
    }

    var lMesh = function(data) {
        var vi = 0;
        var pc = [];
        var d =[];

        for(ci=0;ci<=data.length-1;ci++) {
            pc[vi] = data[ci];
            if (vi==8) {
                d[ma.floor(ci/9)] = new tri([pc[0],pc[1],pc[2]],[pc[3],pc[4],pc[5]],[pc[6],pc[7],pc[8]],"rgb("+(Math.floor(Math.random()*155)+100)+",0,0)");
                vi = -1;
            }
            vi++;
        }
        return new mesh (d,wh,hh,0,0,0,0,0,0);
    }

    var dTri = function (t,x,y,z,s) {
        var XSCALE = 10;
        var YSCALE = 10;
        var XCenter = x;
        var YCenter = y;
        var db = "";

        c.beginPath();
        var df =["moveTo","lineTo","lineTo"];
        for (i=0;i<=2;i++) {
            var wx = (t[i].x*s)-wh+x;
            var wy = (t[i].y*s)-hh+y;
            var wz = (t[i].z-z);
            var OneOverZ= 1/wz;
            var sx =  wx * XSCALE * OneOverZ + XCenter;
            var sy = wy * YSCALE * OneOverZ + YCenter;
            var sz =  wz;
            if (wz > 0) c[df[i]](sx, sy);
        }

        c.fill();
        c.closePath();
    }

    var dMesh = function (m) {
        for(ci=0;ci<=m.t.length-1;ci++) {
            rot(m.t[ci],["x","z"],m.ry);
            rot(m.t[ci],["y","z"],m.rx);
        }

        zsort(m.t);

        for(ci=0;ci<=m.t.length-1;ci++) {
            var tgx = (m.t[ci][0].x*m.s)+m.px;
            var tgy = (m.t[ci][0].y*m.s)+m.py;
            var tgw = (m.t[ci][2].x*m.s)+m.px;
            var tgh = (m.t[ci][2].y*m.s)+m.py;

            c.fillStyle=gGrad(tgx,tgy,tgw,tgh,[gCol("#222222",galpha),gCol("#DEDEDE",galpha)]);

            dTri(m.t[ci],m.px,m.py,m.pz,m.s);

            rot(m.t[ci],["y","z"],-m.rx);
            rot(m.t[ci],["x","z"],-m.ry);
        }


        m.orx = m.rx;
        m.ory = m.ry;
    }

//INIT ENGINE END

//SETUP SCENE

    //MODEL DATA
    var p_data = [0,-1,0,1,1,1,-1,1,1,0,-1,0,1,1,1,1,1,-1,0,-1,0,1,1,-1,-1,1,-1,0,-1,0,-1,1,-1,-1,1,1,-1,1,1,1,1,-1,-1,1,-1,-1,1,1,1,1,-1,1,1,1];
    var c_data = [-1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,1.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,1.0,-1.0,1.0,-1.0,-1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0,-1.0,-1.0,-1.0,-1.0, 1.0, 1.0,-1.0, 1.0,-1.0,1.0,-1.0, 1.0,-1.0,-1.0, 1.0,-1.0,-1.0,-1.0,-1.0,1.0, 1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,1.0,1.0,1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,-1.0,1.0,1.0, 1.0,1.0,1.0,-1.0,-1.0,1.0,1.0,1.0,1.0,1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,1.0,1.0,1.0,-1.0,1.0,1.0,1.0,-1.0,1.0];

    //LOAD & SETUP MODELS
    var cube = lMesh(c_data);
    cube.px = wh;
    cube.py = hh;
    cube.pz = -3;
    cube.s = 10;

    var pyramid = lMesh(p_data);
    pyramid.px = wh;
    pyramid.py = hh;
    pyramid.pz =-3;
    pyramid.s = 10;

    //SET GLOBAL ROTATION
    rotx=30;
    roty=45;

//SETUP SCENE END


//MAIN RENDER LOOP
    main = function() {

        c.shadowBlur = 0;

        if (mblur) { galpha=0.2; }
        else { galpha=1; }

        if (cspec) {
            var lgrad = c.createLinearGradient(90,0,230,0);
            lgrad.addColorStop(0, gCol('#FF0000', galpha));
            lgrad.addColorStop(0.3, gCol('#FFFF00', galpha));
            lgrad.addColorStop(0.6, gCol('#00FFFF', galpha));
            lgrad.addColorStop(1, gCol('#FF0DFF', galpha));
            c.fillStyle=lgrad;
            c.fillRect(90,0,140,240);
        }
        else {
            c.fillStyle = gCol("#353535", galpha);
            c.fillRect(0,0,320,240);
        }

        if (mblur) { galpha=0.1; }
        else { galpha=0.3; }

        if (ssao) {
            c.shadowBlur    = 5;
            c.shadowColor   = 'rgba(0, 0, 0, 0.5)';
        }

        if (!model){
            pyramid.rx = rotx;
            pyramid.ry = roty;
            pyramid.s = 10;
            dMesh(pyramid);
            if (m2x) {
                pyramid.s = 8;
                dMesh(pyramid);
            }
        }

        if (model){
            cube.rx = rotx;
            cube.ry = roty;
            cube.s = 10;
            dMesh(cube);
            if (m2x) {
                cube.s = 8;
                dMesh(cube);
            }
        }

        if (spin) roty += 2;

        mt = setTimeout(main, 1000/60);
    }

//MAIN RENDER LOOP END

//START RENDERING	
    main();

    document.getElementById("modelLink").onclick = function()
    {
        model=toggle(this,model);
        return false;
    }

    document.getElementById("twoXLink").onclick = function()
    {
        m2x=toggle(this,m2x);
        return false;
    }

    document.getElementById("blurLink").onclick = function()
    {
        mblur=toggle(this,mblur);
        return false;
    }

    document.getElementById("colorsLink").onclick = function()
    {
        cspec=toggle(this,cspec);
    }

    document.getElementById("ssaoLink").onclick = function()
    {
        ssao=toggle(this, ssao);
    }

    document.getElementById("spinLink").onclick = function()
    {
        spin=toggle(this, spin);
    }

}