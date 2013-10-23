function toggle(which, state)
{
    switch(which)
    {
        case "play":
            if(arguments.length == 1)
                state = !playing;
            
            playing = state;
            
            if(playing) {
                if(flower) startFlowerMoment();
                document.querySelector("#tog_play").text = "pause";
            }
            else {
                playing = false;
                zoomVel = panVel = 0;
                mouseBranch = null;
                document.querySelector("#tog_play").text = "play";
                var toolEl = document.querySelector("#tool_" + paintTool);
                if(toolEl)
                {
                    toolEl.className += " selected";
                }
            }
            break;
        
        case "about":
            if(arguments.length > 1) {
                aboutOn = state;
            }
            else {
                aboutOn = !aboutOn;
                state = aboutOn;
            }
            var about = document.querySelector("#about");
            if(aboutOn && about) {
                var computedStyle =  window.getComputedStyle(about);
                var width =  computedStyle.width.replace("px", "");
                about.style.left = window.innerWidth / 2 - (parseInt(width)+28) / 2;
                about.style.top = window.innerHeight / 2 - 200 / 2;
                about.style.display = "block";
            }
            else {
                var aboutClear = document.querySelector("#aboutclear");
                if(aboutClear)
                {
                    aboutClear.parentNode.removeChild(aboutClear);
                }

                about.style.display = "none";
            }
            break;
            
        case "mutate":
            if(arguments.length > 1) {
                mutate = state;
            }
            else {
                mutate = !mutate;
                state = mutate;
            }
            break;
        
        case "flower":
            if(arguments.length > 1) {
                flower = state;
            }
            else {
                flower = !flower;
                state = flower;
            }
            if(flower) {
                if(playing)
                    startFlowerMoment();
            }
            else {
                endFlowerMoment();
            }
            break;
    }

    var togWhich = document.querySelector("#tog_" + which)
    if(togWhich)
    {
        if(state)
        {
            togWhich.className += " selected";
        }
        else
        {
            togWhich.className = togWhich.className.replace(/selected/gi, "");
        }
    }

    return false;
}


function play()
{
    toggle("play", true);
}
function pause()
{
    toggle("play", false);
}


function set_tool(tool)
{
    playing = false;
    paintTool = tool;
    var atool = document.querySelector("#control a.tool");
    if(atool)
    {
        atool.className += " selected";
    }
    var pTool = document.querySelector("#tool_" + paintTool);
    if(pTool)
    {
        pTool.className += " selected";
    }

    return false;
}

function set_paint_style(style)
{
    playing = false;
    paintStyle = style;
    return false;
}

function reset()
{
    pause();
    initRoot();
    
    fadeBg(0,0,0, 1000);
    
    return false;
}


function fadeBg(r, g, b, dur)
{
    if(fadeBgFading)
        clearInterval(fadeBgTimerId);
    
    fadeBgFrom = clone(bgColor);
    fadeBgStart = (new Date).getTime();
    fadeBgTo = [r, g, b];
    
    fadeBgTimerId = setInterval(function(){
        var time = (new Date).getTime() - fadeBgStart;
        if(time < dur) {
		    for(var i=3; --i >= 0;) {
    		    bgColor[i] = quadOut(time, fadeBgFrom[i], fadeBgTo[i]-fadeBgFrom[i], dur);
		    }
    	}
    	else {
    	    clearInterval(fadeBgTimerId);
    	    bgColor = fadeBgTo;
    	}
    	document.body.style.backgroundColor = "rgb(" + Math.floor(bgColor[0]) + "," + Math.floor(bgColor[1]) + "," + Math.floor(bgColor[2]) + ")";
    }, 13);
}
var fadeBgTimerId, fadeBgFading, fadeBgFrom, fadeBgTo, fadeBgStart;