/*
 Page:           rating.js
 Created:        Aug 2006
 Last Mod:       Mar 11 2007
 Handles actions and requests for rating bars.
 ---------------------------------------------------------
 ryan masuga, masugadesign.com
 ryan@masugadesign.com
 Licensed under a Creative Commons Attribution 3.0 License.
 http://creativecommons.org/licenses/by/3.0/
 See readme.txt for full credit details.
 --------------------------------------------------------- */
function changeText( div2show, text ) {
    // Detect Browser
    var IE = (document.all) ? 1 : 0;
    var DOM = 0;
    if (parseInt(navigator.appVersion) >=5) {DOM=1};

    // Grab the content from the requested "div" and show it in the "container"
    if (DOM) {
        var viewer = document.getElementById(div2show);
        viewer.innerHTML = text;
    }  else if(IE) {
        document.all[div2show].innerHTML = text;
    }
}

/* =============================================================== */
var ratingAction = {
    'a.rater' : function(element){
        element.onclick = function(){

            var parameterString = this.href.replace(/.*\?(.*)/, "$1"); // onclick="sndReq('j=1&q=2&t=127.0.0.1&c=5');
            var parameterTokens = parameterString.split("&"); // onclick="sndReq('j=1,q=2,t=127.0.0.1,c=5');
            var parameterList = new Array();

            for (j = 0; j < parameterTokens.length; j++) {
                var parameterName = parameterTokens[j].replace(/(.*)=.*/, "$1"); // j
                var parameterValue = parameterTokens[j].replace(/.*=(.*)/, "$1"); // 1
                parameterList[parameterName] = parameterValue;
            }
            var theratingID = parameterList['q'];
            var theVote = parameterList['j'];
            var theuserIP = parameterList['t'];
            var theunits = parameterList['c'];

            //for testing	alert('sndReq('+theVote+','+theratingID+','+theuserIP+','+theunits+')'); return false;
            return false;
        }
    }

};
Behaviour.register(ratingAction);