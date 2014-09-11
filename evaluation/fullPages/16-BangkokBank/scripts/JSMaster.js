var tNews;
var liName = 1;
var diffScroll;
var busyscroll=0;
var oldDocumentHeight;
var varDivFooterHeight;
var durationSlideMenu =200;
var opacitySlideMenu = 0.92;
var _Wheight;
var _Dheight;
var _Sheight;
var open = false;
var delayMenu =100;
var MenuUp=100;
var timeOutShowMenuPB, timeOutShowMenuBB, timeOutShowMenuAB, timeOutShowMenuIB = 0;
var timeOutHideMenuPB, timeOutHideMenuBB, timeOutHideMenuAB, timeOutHideMenuIB = 0;
var timeOutShowMenu, timeOutHideMenu, timeOutShowSubMenu, timeOutHideSubMenu = 0;
var page = document.title.length > 1 ? document.title : "Untitled";
var quickAccessPos;
var currentPage, urlCurrPageNew, currentSubPageNew, mnuID, Current_Sub_Channel, currentSubMen, Current_Channel;
var statusPage = 0;
var mnuID;
var varLeftDefault = 0;
var varLeft = 1004;
var language = "";
var URLPath = "";
var ChHome = new Array();
var arrayPB = new Array();
var arrayBB = new Array();
var arrayAB = new Array();
var arrayIB = new Array();
arrayPB[0] = "pages";
arrayPB[1] = "dailybanking";
arrayPB[2] = "buildyourwealth";
arrayPB[3] = "specialservices";
arrayPB[4] = "waysyoucanbank";
arrayBB[0] = "pages";
arrayBB[1] = "businesssolution";
arrayBB[2] = "smes";
arrayBB[3] = "corporations";
arrayBB[4] = "ratesandreports";
arrayAB[0] = "pages";
arrayAB[1] = "investorrelations";
arrayAB[2] = "aboutus";
arrayIB[0] = "pages";
arrayIB[1] = "internationalrelations";
arrayIB[2] = "internationalbranches";
var $bbla = jQuery.noConflict();
var timeOutBanner = 0;
var idBannerCurrent = 1;
var idBannerNew = 2;
var idBigBanner = 0;
var timeOutBigBanner = 0;
var timerNews = 0;
var idLiNews = 0;
var newIDBanner = 0;
var statusSharePrices = "off";
var topmenuload = 0;
JSRequest={
	QueryString : null,
	FileName : null,
	PathName : null,
	EnsureSetup : function()
	{
		if (JSRequest.QueryString !=null) return;
		JSRequest.QueryString=new Array();
		var queryString=window.location.search.substring(1);
		var pairs=queryString.split("&");
		for (var i=0;i<pairs.length;i++)
		{
			var p=pairs[i].indexOf("=");
			if (p > -1)
			{
				var key=pairs[i].substring(0,p);
				var value=pairs[i].substring(p+1);
				JSRequest.QueryString[key]=value;
			}
		}
		var path=JSRequest.PathName=window.location.pathname;
		var p=path.lastIndexOf("/");
		if (p > -1)
		{
			JSRequest.FileName=path.substring(p+1);
		}
		else
		{
			JSRequest.PageName=path;
		}
	}
};
JSRequest.EnsureSetup();
displaytype = JSRequest.QueryString["pure"];
if(displaytype==1)
{
	document.write("<style>#divHeader{display:none;} #divFooterMenu2012{display:none;} #DivRightPanel{display:none;} #ulLeftNav{display:none;} #divSiteMapPanel{display:none;} #DivLeftMenu {position: relative;z-index: 0;float: left;width: 174px;padding:0px;display: block;top: 0px;margin-bottom: 10px;margin-right: 15px;}#DivOBLogon {position: relative;z-index: 1;width: 180px;display: none;top: 0px;margin-right: 15px;float: left;} #DivContentArea {position: relative;z-index: 0;display: block;float: right;width: 570px;}</style>");
}

$bbla(document).ready(function(a) {
    init();
    $bbla("#li" + mnuID).find("a").css("color", "#FF7E00");
    $bbla("#li" + mnuID).find("a").addClass("select");
    mouseOverSubMenu();
    ChangeBackground();
    ActiveChannel(mnuID);
    ft_BannerContentSlideUp();
    $bbla("#divSharePrices_Content").slideUp();
    ft_closeSharePrices();
    $bbla("#divOnlineService_Switch, #imgOnlineServicesMore").click(function() {
        window.location = "/OnlineBanking"
    })
});
$bbla("#divShowAllPB, #divShowAllBB, #divShowAllAB, #divShowAllIB").live("mouseover", function() {
    smnuSlideLeftRight(0)
});
$bbla("#liPB").live("click", function() {
	if (ChHome[0] == 1) {
    		window.location = "/" + URLPath + "/PersonalBanking";
    		ChHome[0] = 0;
    	} else {
        timeOutShowMenuPB = setTimeout('mnuSlideDown("PB")', delayMenu);
        showPin("PB");
        clearTimeout(timeOutHideMenuPB)  
        ChHome[0] = 1;  
     } 
     ChHome[1] = 0;
     ChHome[2] = 0;
     ChHome[3] = 0;
});
$bbla("#liBB").live("click", function() {
	if (ChHome[1] == 1) {
    		window.location = "/" + URLPath + "/BusinessBanking";
    		ChHome[1] = 0;
    	} else {
        timeOutShowMenuPB = setTimeout('mnuSlideDown("BB")', delayMenu);
        showPin("BB");
        clearTimeout(timeOutHideMenuPB)   
        ChHome[1] = 1; 
     }    
     ChHome[0] = 0;
     ChHome[2] = 0;
     ChHome[3] = 0;
});
$bbla("#liAB").live("click", function() {
	if (ChHome[2] == 1) {
    		window.location = "/" + URLPath + "/AboutBangkokBank";
    		ChHome[2] = 0;
    	} else {
        timeOutShowMenuPB = setTimeout('mnuSlideDown("AB")', delayMenu);
        showPin("AB");
        clearTimeout(timeOutHideMenuPB)
        ChHome[2] = 1; 
     }   
     ChHome[0] = 0;
     ChHome[1] = 0;
     ChHome[3] = 0;
});
$bbla("#liIB").live("click", function() {
	if (ChHome[3] == 1) {
    		window.location = "/" + URLPath + "/InternationalNetwork";
    		ChHome[3] = 0;
    	} else {
        timeOutShowMenuPB = setTimeout('mnuSlideDown("IB")', delayMenu);
        showPin("IB");
        clearTimeout(timeOutHideMenuPB)
        ChHome[3] = 1; 
     } 
     ChHome[0] = 0;
     ChHome[1] = 0;
     ChHome[2] = 0;
});

$bbla("#liPB,#divContainerPB").live({
    mouseenter: function() {
        timeOutShowMenuPB = setTimeout('mnuSlideDown("PB")', delayMenu);
        showPin("PB");
        clearTimeout(timeOutHideMenuPB)
    },
    mouseleave: function() {
        timeOutHideMenuPB = setTimeout('mnuSlideUp("PB")', delayMenu);
        hidePin("PB");
        clearTimeout(timeOutShowMenuPB)
    }
});
$bbla("#liBB,#divContainerBB").live({
    mouseenter: function() {
        timeOutShowMenuBB = setTimeout('mnuSlideDown("BB")', delayMenu);
        showPin("BB");
        clearTimeout(timeOutHideMenuBB)
    },
    mouseleave: function() {
        timeOutHideMenuBB = setTimeout('mnuSlideUp("BB")', delayMenu);
        hidePin("BB");
        clearTimeout(timeOutShowMenuBB)
    }
});
$bbla("#liAB,#divContainerAB").live({
    mouseenter: function() {
        timeOutShowMenuAB = setTimeout('mnuSlideDown("AB")', delayMenu);
        showPin("AB");
        clearTimeout(timeOutHideMenuAB)
    },
    mouseleave: function() {
        timeOutHideMenuAB = setTimeout('mnuSlideUp("AB")', delayMenu);
        hidePin("AB");
        clearTimeout(timeOutShowMenuAB)
    }
});

$bbla("#liIB,#divContainerIB").live({
    mouseenter: function() {
        timeOutShowMenuIB = setTimeout('mnuSlideDown("IB")', delayMenu);
        showPin("IB");
        clearTimeout(timeOutHideMenuIB)
    },
    mouseleave: function() {
        timeOutHideMenuIB = setTimeout('mnuSlideUp("IB")', delayMenu);
        hidePin("IB");
        clearTimeout(timeOutShowMenuIB)
    }
});

$bbla(".subMenu_0, .subMenu_1, .subMenu_2, .subMenu_3, .subMenu_4").live({
    mouseenter: function() {
        var a = ($bbla(this).attr("id")).substring(4, 5);
        timeOutShowSubMenu = setTimeout("smnuSlideLeftRight(" + a + ")", durationSlideMenu)
    },
    mouseleave: function() {
        clearTimeout(timeOutShowSubMenu)
    }
});
function isScrollBottom() {
    var b = $bbla(document).height();
    var a = $bbla(window).height() + $bbla(window).scrollTop();
    return(b == a)
}
function init() {
    oldDocumentHeight = $bbla(document).height();
    currentPage = document.URL.split("/");
    language = checkLanguage(document.URL, 1);
    URLPath = checkLanguage(document.URL, 0);
    urlCurrPageNew = currentPage[4].toLowerCase().replace(" ", "").replace("%20", "");
    currentSubPageNew = currentPage[5].toLowerCase().replace(" ", "").replace("%20", "");
    switch (urlCurrPageNew) {
        case "personalbanking":
            mnuID = "PB";
            break;
        case "businessbanking":
            mnuID = "BB";
            break;
        case "aboutbangkokbank":
            mnuID = "AB";
            break;
        case "internationalnetwork":
            mnuID = "IB";
            break
    }
    $bbla('li[id*="liNews"]').hide();
    diffScroll = ($bbla(document).height() - $bbla(window).height());
    varDivFooterHeight = "-" + $bbla("#divFooter").height() + "px";
    $bbla("#divContainerPB").css("top", -$bbla("#divContainerPB").height() - 80);
    $bbla("#divContainerBB").css("top", -$bbla("#divContainerBB").height() - 80);
    $bbla("#divContainerAB").css("top", -$bbla("#divContainerAB").height() - 80);
    $bbla("#divContainerIB").css("top", -$bbla("#divContainerIB").height() - 80);
    $bbla("#divFooter").css("margin-top", "50px");
    if ($bbla("#ulLeftNav").length) {
        quickAccessPos = $bbla("#ulLeftNav").offset().left
    }
    for (k = 1; k <= 5; k++) {
        $bbla(".subMenu_" + k).append("<div id='divPlus" + k + "' style='display:inline'></div>")
    }
}
function ActiveChannel(a) {
    switch (a) {
        case "PB":
            $bbla("#liPB").css("background-image", 'url("' + language + 'images/TopMenu_Blue_1.png")');
            break;
        case "BB":
            $bbla("#liBB").css("background-image", 'url("' + language + 'images/TopMenu_Blue_2.png")');
            break;
        case "AB":
            $bbla("#liAB").css("background-image", 'url("' + language + 'images/TopMenu_Blue_3.png")');
            break;
        case "IB":
            $bbla("#liIB").css("background-image", 'url("' + language + 'images/TopMenu_Blue_4.png")');
            break
    }
}
function MainMenu() {}
function showPin(h) {
    var a = window.location.pathname;
    var f = a.toLowerCase();
    var l = f.indexOf("/bangkokbankthai/");
    var g = f.indexOf("/onlinebankingthai/");
    var b;
    if ((l >= 0) || (g >= 0)) {
        b = 65
    }
    else {
        b = 29
    }
    var c = $bbla("#li" + h).width();
    var e = $bbla("#li" + h).position();
    var d = e.left + Math.round(c / 2) + b;
    $bbla("#divPin").css("left", d.toString() + "px");
    switch (h) {
        case "PB":
            $bbla("#liPB").css("background-image", 'url("' + language + 'images/TopMenu_Orange_1.png")');
            break;
        case "BB":
            $bbla("#liBB").css("background-image", 'url("' + language + 'images/TopMenu_Orange_2.png")');
            break;
        case "AB":
            $bbla("#liAB").css("background-image", 'url("' + language + 'images/TopMenu_Orange_3.png")');
            break;
        case "IB":
            $bbla("#liIB").css("background-image", 'url("' + language + 'images/TopMenu_Orange_4.png")');
            break
    }
}
function hidePin(a) {
    $bbla("#divPin").css("left", "-250em");
    switch (a) {
        case "PB":
            $bbla("#liPB").css("background-image", 'url("' + language + 'images/TopMenu_LightBlue_1.png")');
            break;
        case "BB":
            $bbla("#liBB").css("background-image", 'url("' + language + 'images/TopMenu_LightBlue_2.png")');
            break;
        case "AB":
            $bbla("#liAB").css("background-image", 'url("' + language + 'images/TopMenu_LightBlue_3.png")');
            break;
        case "IB":
            $bbla("#liIB").css("background-image", 'url("' + language + 'images/TopMenu_LightBlue_4.png")');
            break
    }
    ActiveChannel(mnuID)
}
function mnuSlideDown(objID) {
    if (statusPage == 0) {
        statusPage = 1;
        if (currentSubPageNew == "pages") {
            $bbla("#divContainer" + objID).find("#clsContent0").css("left", varLeftDefault);
            $bbla("#divContainer" + objID).find("#clsContent1").css("left", varLeft);
            $bbla("#divContainer" + objID).find("#clsContent2").css("left", varLeft);
            $bbla("#divContainer" + objID).find("#clsContent3").css("left", varLeft);
            $bbla("#divContainer" + objID).find("#clsContent4").css("left", varLeft);
            Current_Sub_Channel = 0;
            Current_Channel = objID
        }
        else {
            if (mnuID == objID) {
                var arrayLenght;
                arrayLength = eval("array" + mnuID).length;
                for (i = 0; i < arrayLength; i++) {
                    var mnuSubMenu = eval("array" + mnuID + "[" + i + "]");
                    if (mnuSubMenu == currentSubPageNew) {
                        $bbla("#divContainer" + objID).find("#clsContent" + i).css("left", varLeftDefault);
                        $bbla("#divContainer" + objID).find(".subMenu_" + i).css("border-bottom", "none");
                        $bbla("#divContainer" + objID).find(".subMenu_" + i).css("color", "#FF7E00");
                        $bbla(".subMenu_" + i).find("#divPlus" + i).css("display", "none");
                        Current_Sub_Channel = i;
                        Current_Channel = objID
                    }
                    else {
                        $bbla("#divContainer" + objID).find("#clsContent" + i).css("left", varLeft);
                        $bbla("#divContainer" + objID).find(".subMenu_" + i).css("border-bottom", "");
                        $bbla("#divContainer" + objID).find(".subMenu_" + i).css("color", "")
                    }
                }
            }
            else {
                $bbla("#divContainer" + objID).find(".subMenu_1").css("border-bottom", "");
                $bbla("#divContainer" + objID).find(".subMenu_1").css("color", "");
                $bbla("#divContainer" + objID).find(".subMenu_2").css("border-bottom", "");
                $bbla("#divContainer" + objID).find(".subMenu_2").css("color", "");
                $bbla("#divContainer" + objID).find(".subMenu_3").css("border-bottom", "");
                $bbla("#divContainer" + objID).find(".subMenu_3").css("color", "");
                $bbla("#divContainer" + objID).find(".subMenu_4").css("border-bottom", "");
                $bbla("#divContainer" + objID).find(".subMenu_4").css("color", "");
                $bbla("#divContainer" + objID).find(".subMenu_5").css("border-bottom", "");
                $bbla("#divContainer" + objID).find(".subMenu_5").css("color", "");
                $bbla("#divContainer" + objID).find("#clsContent0").css("left", varLeftDefault);
                $bbla("#divContainer" + objID).find("#clsContent1").css("left", varLeft);
                $bbla("#divContainer" + objID).find("#clsContent2").css("left", varLeft);
                $bbla("#divContainer" + objID).find("#clsContent3").css("left", varLeft);
                $bbla("#divContainer" + objID).find("#clsContent4").css("left", varLeft);
                Current_Sub_Channel = 0;
                Current_Channel = objID
            }
        }
        $bbla("#divContainer" + Current_Channel).stop().animate({
                top: -50,
                opacity: opacitySlideMenu
            },
            50 );

        $bbla("#divFrameLevel1").stop().animate({
            height: 460,
            opacity: 1
        },
        durationSlideMenu, function() {
            $bbla("#divContainer" + Current_Channel).stop().animate({
                top: -50,
                opacity: opacitySlideMenu
            },
            0 )
        })
    }
}
function checkLanguage(d, e) {
    var c, b;
    var be = 0;
    var bt = 0;
    var oe = 0;
    var ot = 0;
    c = d.toLowerCase();
    oe = c.indexOf("/onlinebanking/");
    be = c.indexOf("/bangkokbank/");
    ot = c.indexOf("/onlinebankingthai/");
    bt = c.indexOf("/bangkokbankthai/");
    if (be >= 0 || oe >= 0) {
        if (e == 1) {
            b = "Eng"
        }
        else {
            if (oe >= 1) {
                b = "OnlineBanking"
            }
            else {
                b = "BangkokBank"
            }
        }
    }
    else {
        if (e == 1) {
            b = "Thai"
        }
        else {
            if (ot >= 1) {
                b = "OnlineBankingThai"
            }
            else {
                b = "BangkokBankThai"
            }
        }
    }
    return b
}
function mnuSlideUp(a) {
    statusPage = 0;
    $bbla("#li" + a).css("color", "");
    $bbla("#divFrameLevel1").stop().animate({
        height: 0,
        opacity: 1
    },
    MenuUp);
    $bbla("#divContainer" + a).stop().animate({
        top: -$bbla("#divContainer" + a).height() - 80,
        opacity: 0.1
    },
    delayMenu);
    setColorForDeActiveSubMenu(Current_Channel, Current_Sub_Channel);
    $bbla("#divContainer" + a).find("#clsContent0").css("left", varLeftDefault);
    $bbla("#divContainer" + a).find("#clsContent1").css("left", varLeft);
    $bbla("#divContainer" + a).find("#clsContent2").css("left", varLeft);
    $bbla("#divContainer" + a).find("#clsContent3").css("left", varLeft);
    $bbla("#divContainer" + a).find("#clsContent4").css("left", varLeft)
}
function mouseOverSubMenu() {}
function smnuSlideLeftRight(a) {
 if (busyscroll == 0) {    
	   busyscroll = 1;
	    setColorForDeActiveSubMenu(Current_Channel, Current_Sub_Channel);
	    setColorForActiveSubMenu(Current_Channel, a);
	    if (a != Current_Sub_Channel) {
	        var c, b;
	        if (a > Current_Sub_Channel) {
	            $bbla("#divContainer" + Current_Channel).find("#clsContent" + a).css("left", "1004px");
	            c = 0;
	            b = -1004
	        }
	        else {
	            $bbla("#divContainer" + Current_Channel).find("#clsContent" + a).css("left", "-1004px");
	            c = 0;
	            b = 1004
	        }
	        $bbla("#divContainer" + Current_Channel).find("#clsContent" + Current_Sub_Channel).stop().animate({
	            left: b,
	            opacity: 1
	        },
	        0 , function() {
	                  	$bbla("#divContainer" + Current_Channel).find("#clsContent" + a).stop().animate({
		                left: c,
		                opacity: 1
		            },
		            durationSlideMenu , function() {
		                Current_Sub_Channel = a
		            });
	        })
	    }	            
    busyscroll = 0;
    }

}
function setColorForActiveSubMenu(a, b) {
    $bbla(".subMenu_" + b).find("#divPlus" + b).css("display", "none");
    $bbla("#divContainer" + a).find(".subMenu_" + b).css("border-bottom", "none");
    $bbla("#divContainer" + a).find(".subMenu_" + b).css("color", "#ff7E00")
}
function setColorForDeActiveSubMenu(a, b) {
    $bbla(".subMenu_" + b).find("#divPlus" + b).css("display", "inline");
    $bbla("#divContainer" + a).find(".subMenu_" + b).css("border-bottom", "thin solid #829dd4");
    $bbla("#divContainer" + a).find(".subMenu_" + b).css("color", "")
}
function ChangeBackground() {
    $bbla("#divBGMain").css("background", "#FFFFFF url(BGMain_" + urlCurrPageNew + ".png) center repeat-x fixed")
}
var frameWidth;
var delayForSlideMenu = 300;
var j = 0;
var oldJ, startPage, currentMouseOver;
var oldPageID = 0;
var currentPage, currentPageNew, currentSubPageNew, currentMainMenuID, currentSubMenuID;
if (typeof(WPSC) == "undefined") {
    WPSC = new Object();
    WPSC.Init = function() {};
    WPSC.WebPartPage = new Object();
    WPSC.WebPartPage.Parts = new Object();
    WPSC.WebPartPage.Parts.Register = function() {}
}
function initMenu() {
    currentPage = document.URL.split("/");
    currentPageNew = currentPage[4].toLowerCase().replace(" ", "").replace("%20", "");
    currentSubPageNew = currentPage[5].toLowerCase().replace(" ", "").replace("%20", "");
    startPage = 0;
    for (k = 1; k <= 5; k++) {
        $bbla(".subMenu_" + k).append("<div id='divPlus" + k + "' style='display:inline'> +</div>")
    }
    $bbla("classContent").css("height", "0px")
}
function setCurrentMenu() {
    switch (currentPageNew) {
        case "personalbanking":
            currentMainMenuID = "PB";
            break;
        case "businessbanking":
            currentMainMenuID = "BB";
            break;
        case "aboutbangkokbank":
            currentMainMenuID = "AB";
            break;
        case "internationalnetwork":
            currentMainMenuID = "IB";
            break;
        default:
    }
    $bbla(".classContent").css("left", "1004px");
    setCurrentSubMenu()
}
function setCurrentSubMenu() {
    if (currentSubPageNew != "pages") {
        var a;
        switch (currentSubPageNew) {
            case "buildyourwealth":
                a = 1;
                break;
            case "dailybanking":
                a = 2;
                break;
            case "specialservices":
                a = 3;
                break;
            case "waysyoucanbank":
                a = 4;
                break;
            default:
        }
        $bbla("#divContainer" + currentMainMenuID).find("#clsContent0").css("left", "1004px");
        $bbla("#divContainer" + currentMainMenuID).find("#clsContent" + a).css("left", "0px");
        currentSubMenuID = a
    }
    else {
        $bbla("#divContainer" + currentMainMenuID).find("#clsContent0").css("left", "0px")
    }
}
function clickMenu() {}
function menuMove(c, a) {
    if (a != oldPageID) {
        var b, d;
        c = "divContainer" + c + "";
        if (a > oldPageID) {
            $bbla("#" + c + "").find("#clsContent" + a).css("left", "1004px");
            b = 0;
            d = -1004
        }
        else {
            $bbla("#" + c + "").find("#clsContent" + a).css("left", "-1004px");
            b = 0;
            d = 1004
        }
        $bbla("#" + c + "").find("#clsContent" + oldPageID).stop().animate({
            left: d
        },
        500);
        $bbla("#" + c + "").find("#clsContent" + a).stop().animate({
            left: b
        },
        function() {
            addBottomLine(c);
            $bbla("#divPlus" + a).hide();
            $bbla("#divPlus" + oldJ).show();
            oldJ = a;
            oldPageID = a
        })
    }
}
function addBottomLine(b) {
    var a = 0;
    for (a = 0; a <= 5; a++) {
        $bbla(".subMenu_" + a + "").css("border-bottom", "2px #829dd4 solid");
        $bbla(".subMenu_" + a + "").css("color", "")
    }
    $bbla("#" + b + "").find(".subMenu_" + j + "").css("border-bottom", "none");
    $bbla("#" + b + "").find(".subMenu_" + j + "").css("color", "#ff8500")
}
function checkSubCurrentPage() {
    var a;
    switch (currentSubPageNew) {
        case "buildyourwealth":
            a = 1;
            break;
        case "dailybanking":
            a = 2;
            break;
        case "specialservices":
            a = 3;
            break;
        case "waysyoucanbank":
            a = 4;
            break;
        default:
    }
    $bbla("#divContainerPB").find("#clsContent" + a).css("left", 0);
    currentSubMenuID = a
}
var timeOutBanner = 0;
var idBanner = 0;
var idBigBanner = 0;
var timeOutBigBanner = 0;
var timerNews = 0;
var idLiNews = 0;
var currentIDBanner = 0;
function init_style() {
    $("#imgBigPromotion1").attr("src", "images/bigPromotion1.png");
    $("#imgBigPromotion2").attr("src", "images/bigPromotion2.png");
    $("#imgBigPromotion3").attr("src", "images/bigPromotion3.png");
    $("#imgBigPromotion4").attr("src", "images/bigPromotion4.png");
    $("#imgBigPromotion5").attr("src", "images/bigPromotion5.png");
    $("#imgBigPromotion6").attr("src", "images/bigPromotion6.png");
    $("#imgPromotion1").attr("src", "images/banner1.png");
    $("#imgPromotion2").attr("src", "images/banner2.png");
    $("#imgPromotion3").attr("src", "images/banner3.png");
    $("#imgPromotion4").attr("src", "images/banner5.png");
    $("#imgPromotion5").attr("src", "images/banner6.png");
    $("#imgPromotion6").attr("src", "images/banner7.png");
    $("#imgPromotion7").attr("src", "images/banner9.png");
    $("#imgPromotion8").attr("src", "images/banner10.png");
    $("#imgPromotion9").attr("src", "images/banner11.png");
    $("#imgPromotionFix").attr("src", "images/banner5.png");
    $("#imgBullet1").attr("src", "images/bullet_off.jpg");
    $("#imgBullet2").attr("src", "images/bullet_off.jpg");
    $("#imgBullet3").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet1").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet2").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet3").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet4").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet5").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet6").attr("src", "images/bullet_off.jpg");
    $("#divBanner1").show();
    $("#divBanner2").hide();
    $("#divBanner3").hide();
    $("#divBigBanner1").fadeTo(0, 1);
    $("#divBigBanner2").fadeTo(0, 0);
    $("#divBigBanner3").fadeTo(0, 0);
    $("#divBigBanner4").fadeTo(0, 0);
    $("#divBigBanner5").fadeTo(0, 0);
    $("#divBigBanner6").fadeTo(0, 0);
    timeOutBanner = setTimeout("changeBanner(" + idBanner + ")", 5000);
    timeOutBigBanner = setTimeout("changeBigBanner(" + idBigBanner + ")", 5000);
    timerNews = setTimeout("changeNews(" + idLiNews + ")", 2000);
    $("#imgBullet1").attr("src", "images/bullet_on.jpg");
    $("#imgBullet1").bind("click", function() {
        clearTimeout(timeOutBanner);
        timeOutBanner = setTimeout("changeBanner(0)", 1)
    });
    tab_QuickAccess_News();
    clickBullet()
}
function changeBanner(a) {
    a = parseInt(a) + 1;
    $("#divBanner" + a).fadeOut(2000);
    if (a == 3) {
        a = 0
    }
    currentIDBanner = a + 1;
    $("#divBanner" + (a + 1)).fadeTo(2000, 1);
    $("#imgBullet1").attr("src", "images/bullet_off.jpg");
    $("#imgBullet2").attr("src", "images/bullet_off.jpg");
    $("#imgBullet3").attr("src", "images/bullet_off.jpg");
    $("#imgBullet" + (a + 1)).attr("src", "images/bullet_on.jpg");
    timeOutBanner = setTimeout("changeBanner(" + a + ")", 10000)
}
function clickBullet() {
    $("#imgBullet1, #imgBullet2, #imgBullet3").click(function() {
        var a = $(this).attr("alt");
        clearTimeout(timeOutBanner);
        changeBannerClick(a, currentIDBanner)
    })
}
function changeBannerClick(a, b) {
    $("#divBanner" + b).fadeOut(1000);
    $("#divBanner" + a).fadeTo(1000, 1);
    timeOutBanner = setTimeout("changeBanner(" + a + ")", 5000)
}
function changeBigBanner(b) {
    var a;
    b = b + 1;
    $("#divBigBanner" + b).fadeOut(2000, function() {
        $("#divBigBanner" + (b)).find("p").css("top", 415)
    });
    if ($("#divBigBanner" + (b + 1)).find("img").attr("src") == null) {
        b = 0
    }
    $("#divBigBanner" + (b + 1)).fadeTo(2000, 1, function() {
        $("#divBigBanner" + (b + 1)).children("p").stop().animate({
            top: 315
        },
        300)
    });
    $("#imgBigBullet1").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet2").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet3").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet4").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet5").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet6").attr("src", "images/bullet_off.jpg");
    $("#imgBigBullet" + (b + 1)).attr("src", "images/bullet_on.jpg");
    timeOutBanner = setTimeout("changeBigBanner(" + b + ")", 5000)
}
function BannerContentSlideUp() {
    $(".classPromotion").hover(function() {
        $(this).children(".classContentBanner").stop().animate({
            top: 0
        },
        300)
    },
    function() {
        $(this).children(".classContentBanner").stop().animate({
            top: 100
        },
        300)
    })
}
function changeNews(a) {
    $("#labNews").html($("#ulNews").find("li:eq(" + a + ")").text());
    if ($("#ulNews").find("li:eq(" + (a + 1) + ")").text() == "") {
        a = 0
    }
    else {
        a++
    }
    timerNews = setTimeout("changeNews(" + a + ")", 2000)
}
function tab_QuickAccess_News() {
    $("#btnQuickAccess, #btnNews").bind({
        click: function() {
            if ($(this).attr("id") == "btnQuickAccess") {
                $("#divQuickAccess_Content").fadeIn(500, function() {
                    $("#divNews_Content").fadeOut(500)
                })
            }
            else {
                $("#divNews_Content").fadeIn(500, function() {
                    $("#divQuickAccess_Content").fadeOut(500)
                })
            }
        }
    });
    $("#btnQuickAccess, #btnNews").mouseover(function() {
        if ($(this).attr("id") == "btnQuickAccess") {
            $("#btnQuickAccess").find("img").attr("src", "images/quickaccess_btn_over.png")
        }
        else {
            $("#btnNews").find("img").attr("src", "images/news_btn_over.png")
        }
    }).mouseout(function() {
        if ($(this).attr("id") == "btnQuickAccess") {
            $("#btnQuickAccess").find("img").attr("src", "images/quickaccess_btn_link.png")
        }
        else {
            $("#btnNews").find("img").attr("src", "images/news_btn_link.png")
        }
    })
}
function ft_init_style() {
    $bbla("#imgBullet1").attr("src", "images/bullet_on.jpg");
    $bbla("#imgBullet2").attr("src", "images/bullet_off.jpg");
    $bbla("#imgBullet3").attr("src", "images/bullet_off.jpg");
    $bbla("#divBanner1").show();
    $bbla("#divBanner2").hide();
    $bbla("#divBanner3").hide();
    timeOutBanner = setTimeout("ft_ChangeBanner(" + idBannerCurrent + "," + idBannerNew + ")", 2000);
    ft_BulletSlideShow()
}
function ft_ChangeBanner(b, a) {
    idBannerCurrent = b;
    idBannerNew = a;
    $bbla("#divBanner" + b).css("z-index", "1");
    $bbla("#divBanner" + a).css("z-index", "0");
    $bbla("#divBanner" + a).show();
    $bbla("#imgBullet1").attr("src", "images/bullet_off.jpg");
    $bbla("#imgBullet2").attr("src", "images/bullet_off.jpg");
    $bbla("#imgBullet3").attr("src", "images/bullet_off.jpg");
    $bbla("#imgBullet" + b).attr("src", "images/bullet_on.jpg");
    $bbla("#divBanner" + b).fadeOut(1000, function() {
        $bbla("#divBanner" + b).hide();
        b = a;
        a++;
        if (b == 3) {
            a = 1
        }
        $bbla("#divBanner" + a).css("z-index", "1")
    });
    timeOutBanner = setTimeout("ft_ChangeBanner(" + b + "," + a + ")", 4000)
}
function ft_BulletSlideShow() {
    $bbla("#imgBullet1, #imgBullet2, #imgBullet3").click(function() {
        var b = $bbla(this).attr("id");
        var a;
        b = b.charAt(b.length - 1);
        clearTimeout(timeOutBanner);
        var a = b;
        a++;
        if (b == 3) {
            a = 1
        }
        ft_ChangeBanner(b, a)
    })
}
function ft_BannerContentSlideUp() {
    $bbla(".classPromotion").hover(function() {
        clearTimeout(timeOutBanner);
//        window.status = "clearTimeout";
        $bbla(this).children(".classContentBanner").stop().animate({
            top: 0
        },
        300)
    },
    function() {
//        window.status = "setTimeout";
        ft_ChangeBanner(idBannerCurrent, idBannerNew);
        $bbla(this).children(".classContentBanner").stop().animate({
            top: 120
        },
        300)
    })
}
function ft_closeSharePrices() {
    $bbla("#divSharePrices_Switch").click(function() {
        if (statusSharePrices == "on") {
            $bbla("#divSharePrices_Content").slideUp(500, function() {
                statusSharePrices = "off";
                $bbla("#divSharePrices_Switch").find("img").attr("src", "images/Share_Prices_Header_Up.png")
            })
        }
        else {
            $bbla("#divSharePrices_Content").slideDown(500, function() {
                statusSharePrices = "on";
                $bbla("#divSharePrices_Switch").find("img").attr("src", "images/Share_Prices_Header_Down.png")
            })
        }
    })
}

function checkBrowserVersion(){

	$bbla.get('scripts/JSBrowser.js', function(data) {

	myvar = data.split(",");
// ------------------------------------------------------------------------------------------------
	var varBrowser;

	var chromeNewVersion = parseFloat(myvar[0]);
	var msieNewVersion = parseFloat(myvar[1]);
	var safariNewVer = parseFloat(myvar[2]);
	var firefoxNewVersion = parseFloat(myvar[3]);	

	var userAgent = navigator.userAgent.toLowerCase();
 	
 	var browserName, browserVersion;
 	var websiteLang, webURL, iniVersion;
 	var varFirefox = new Array();
 	var varSafari = new Array();

	if (idx == 0){
		websiteLang = 'Thai';
		webURL = "Thai"
	}else{
		websiteLang = 'Eng';	
		webURL = "";
	}

	$bbla.browser = {
		version: (userAgent.match( /.+(?:rv|it|ra|ie|me)[\/: ]([\d.]+)/ ) || [])[1],
		chrome: /chrome/.test( userAgent ),
		safari: /webkit/.test( userAgent ) && !/chrome/.test( userAgent ),
		opera: /opera/.test( userAgent ),
		msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
		mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )		
	};

	$bbla.each($bbla.browser, function(i, val) {
		if (val == true){
			if (i=='mozilla' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
				i = 'firefox'
				varFirefox = navigator.userAgent.split("Firefox/");
			}			
			browserName = i;
		}
		if (i == 'version'){ // Get Browser Version
			browserVersion = parseFloat(val);
		}
	});

	if (browserName == 'safari'){ // Get Safari Version
		varSafari = navigator.userAgent.split("Version/");
		browserVersion = parseFloat(varSafari [1]);
	}	
	
	if (browserName == 'firefox'){ // Get Firefox Version 
    		browserVersion = parseFloat(varFirefox[1]);
	}	
	
	if((browserName == 'msie') && (browserVersion <= 6)){ // IE 6 only

	    	varBrowser = '<a href="/BangkokBank' + webURL + myvar[4] + '" target="_blank"><img src="' + websiteLang  +'/Browser/ie.gif" border=none /></a>';		

	    	$bbla('#divShowUpdateBrowser').append(varBrowser);	    

		$bbla('#divShowUpdateBrowser').css('position','absolute');		
		$bbla('#divShowUpdateBrowser').css('height',$bbla(window.height()));	
		return;

	}else{			
		    if (browserName == 'chrome') { // Chrome
		    		if (browserVersion < chromeNewVersion) {
				    	varBrowser = '<a href="/BangkokBank' + webURL + myvar[4] + '" target="_blank"><img src="' + websiteLang  +'/Browser/chrome.gif" border=none /></a>';
			    	}
		    }else if (browserName == 'safari') { // Safari
		    			if (browserVersion < safariNewVer) {
					    	varBrowser = '<a href="/BangkokBank' + webURL + myvar[4] + '" target="_blank"><img src="' + websiteLang  +'/Browser/safari.gif" border=none /></a>';
					}
		    }else if (browserName == 'firefox'){ // Firefox
					if (browserVersion < firefoxNewVersion) { 
						varBrowser = '<a href="/BangkokBank' + webURL + myvar[4] + '" target="_blank"><img src="' + websiteLang  +'/Browser/firefox.gif" border=none /></a>';
					}
		    }else if (browserName == 'msie') { // IE
		    			if (browserVersion < msieNewVersion) {  
					    	varBrowser = '<a href="/BangkokBank' + webURL + myvar[4] + '" target="_blank"><img src="' + websiteLang  +'/Browser/ie.gif" border=none/></a>';
			    		}
		    }else{ // Others
				varBrowser = '<a href="/BangkokBank' + webURL + myvar[4] + '" target="_blank"><img src="' + websiteLang  +'/Browser/others.gif" border=none/></a>';				
		    }
	    $bbla('#divShowUpdateBrowser').append(varBrowser);	    
    }
	}, 'text');	
}

function checkSpanNewsMouseOver() {
    $bbla("#spanNewsContent").mouseover(function() {
        clearInterval(y)
    });
    $bbla("#spanNewsContent").mouseout(function() {
        y = window.setInterval(ft_news_show, 3000)
    })
}(function(a) {
    a.fn.watermark = function(c) {
        var b = {
            watermarkClass: "watermark",
            defaultText: "type here..."
        };
        if (c) {
            a.extend(b, c)
        }
        this.each(function() {
            a(this).addClass(b.watermarkClass).val(b.defaultText);
        })
    }
})(jQuery);
