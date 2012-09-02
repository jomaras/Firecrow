(function($){
    $.fn.customSelect = function(options){
        this.each(function(){
            var obj = $(this);
            var name = obj.attr("name");
            var id = obj.attr("id");
            var rel = obj.attr("rel");
            var html = '<div class="form_select" rel="'+rel+'"><input type="hidden" name="'+name+'" id="'+id+'" /><div class="expander"></div><div class="input"></div><div class="optgroup">';
            obj.find("option").each(function(i){
                var val = $(this).attr("value");
                var text = $(this).text();
                html += '<div';
                if($(this).attr('selected'))html += ' class="selected"';
                html += '><span class="value">'+val+'</span><span class="name">'+text+'</span></div>';
            });
            html += '</div></div>';
            obj.after(html);
            obj.remove();
        });

        // css+js custom select box with input[type=hidden]
        $(".form_select .optgroup").each(function(){
            var option = $(this).children("div.selected");
            var hasSelected = 0;
            if(option.hasClass("selected")){
                setSelectOption(option);
                hasSelected = 1;
            }
            if(hasSelected == 0){
                option = $(this).children("div:first");
                setSelectOption(option);
            }
            // collapese options
            $("html").click(function(event){
                if(!$(event.target).closest(".form_select .optgroup", option.parent()).length && !$(event.target).closest(".input", option.parent().parent().children(".input")).length){
                    option.parent().parent().children(".expander").removeClass("expanded");
                    option.parent().hide();
                }
            });
        });
        // expand options
        $(".form_select .input").click(function(){
            if($(this).parent().hasClass('disabled'))return false;
            var optgroup = $(this).parent().children(".optgroup");
            var expander = $(this).parent().children(".expander");
            if(expander.hasClass("expanded")){
                expander.removeClass("expanded");
                optgroup.hide();
            }else{
                $(".form_select .optgroup").hide();
                $(".form_select .expander").removeClass("expanded");
                expander.addClass("expanded");
                optgroup.show();
            }
        });
        // select option
        $(".form_select .optgroup div").click(function(){
            setSelectEvent($(this));
        });
        function setSelectEvent(obj){
            setSelectOption(obj);
            $(".form_select .optgroup").hide();
            $(".form_select .expander").removeClass("expanded");
        }

        // function to select option
        function setSelectOption(obj){
            var default_opt = options['please_select']+'...';
            var loading = options['loading']+'...';
            var name = obj.children(".name").text();
            var val = obj.children(".value").text();
            var rel = obj.parent().parent().attr("rel");

            obj.parent().prev(".input").html(name);
            obj.parent().parent().children("input").val(val);
            obj.parent().children("div").removeClass("selected");
            obj.addClass("selected");

            if(rel != undefined && rel != "undefined"){
                var optgroup = '<div><span class="value"></span><span class="name">'+default_opt+'</span></div>';
                var ex_rel = rel.split("|");
                $('#'+ex_rel[0]).parent().addClass('disabled');
                $('#'+ex_rel[0]).parent().children('.input').html(loading);
                $.getJSON(ex_rel[1]+'/index/'+val, function(data) {
                    if(data){
                        $.each(data, function(key,val){
                            optgroup += '<div><span class="value">'+key+'</span><span class="name">'+val+'</span></div>';
                        });
                        $('#'+ex_rel[0]).parent().removeClass('disabled');
                        $('#'+ex_rel[0]).parent().prev('label').removeClass('disabled');
                    }else{
                        $('#'+ex_rel[0]).parent().addClass('disabled');
                        $('#'+ex_rel[0]).parent().prev('label').addClass('disabled');
                    }
                    $('#'+ex_rel[0]).parent().children('.input').html(default_opt);
                    $('#'+ex_rel[0]).parent().children('.optgroup').html(optgroup);
                    $("#"+ex_rel[0]).parent().find(".optgroup div").click(function(){
                        setSelectEvent($(this));
                    });
                });
            }
        }
    }
})(jQuery);
/*******

 ***	Link Fader by Cedric Dugas   ***
 *** Http://www.position-absolute.com ***

 You can use and modify this script for any project you want,
 but please leave this comment as credit.

 With this script you can have beautiful fade in and fade out hover link.

 Just add the class linkFader at your <a> tag and it will fade,
 user with javascript disable will still have the css hover.

 This script only work if you use the image replacement technique as it take
 the background image of the <a> tag and play with the background position.

 Edited by Kristian Feldsam

 Added support for slip images and backgroud position. Use element .hover instead of element:hover to configure bg pos. If you dont configure bg pos them script set it to bottom right;

 fixed position settings - if position isnt absolute them script set it to relative, else them set it to absolute.

 *****/

$(document).ready(function() {
    hoverOpacity.init('.linkFader')
});

hoverOpacity = {
    init : function(obj){

        $(obj).each(function(i){

            if($(this).css('position') != 'absolute')$(this).css({position:"relative"});

            spanFader = document.createElement('span');
            myBG = $(this).css("background-image")

            $(this).append(spanFader);
            $(this).find('span').addClass('hover');

            myBG = $(this).css("background-image")
            myBGpos = $(this).find('.hover').css("background-position");
            if(myBGpos == '0% 0%')myBGpos = 'bottom right';
            spanWidth =  $(this).css("width")
            spanHeight =  $(this).css("height")

            $(this).find("span").css({
                backgroundImage:myBG,
                backgroundPosition:myBGpos,
                position:"absolute",
                display:"none",
                cursor:"pointer",
                top:"0px",
                left:"0px",
                width:spanWidth,
                height:spanHeight,
                visibility:"visible"
            });
            if(!$.browser.msie){
                $(this).find("span").css({opacity:0, display: 'block'});
            }
        })
        $(".linkFader").hover(function () {
                if($.browser.msie){
                    $(this).find("span").show();
                }else{
                    $(this).find("span").stop().animate({opacity: 1}, 300);
                }
            },
            function () {
                if($.browser.msie){
                    $(this).find("span").hide();
                }else{
                    $(this).find("span").stop().animate({opacity: 0},250);
                }
            });
    }
}
$(document).ready(function() {

    base_url = $("#i_base_url").text();
    lang_code = $("#i_lang_code").text();


    // start slider
    stopSlide = new Array();

    var ident = $(".tab.selected").attr("id");
    init_slideshow(ident);

    $(".tab").click(function(){
        var ident = $(this).attr("id");
        $(".tab").each(function(){
            var idents = $(this).attr("id");
            stopSlide[idents] = 1;
        });
        $(".tab").removeClass("selected");
        $("#"+ident).addClass("selected");
        init_slideshow(ident);
    });

    function init_slideshow(ident){
        create_index(ident);
        $(".slider").hide();
        $(".slider."+ident).show();
        var slides = $(".slider."+ident).children("div").length;
        var sWidth = $("#slideshow").width();
        $("#slideshow .mask").html("");
        for(i = 1; i <= slides; i++){
            var idNum = i;
            $("#slideshow .mask").append("<span class=\"selector\" id=\"slide-"+ident+idNum+"\"></span>");
        }

        if(slides > 1){
            margins = new Array();
            id = "";
            count = 0;
            $("#slideshow span.selector").each(function(x){
                var i = $(this);
                var newId = i.attr("id");
                if(x > 0) margins[newId] = margins[id] - sWidth; else margins[newId] = 0;
                var actual = $(".slider."+ident).css("margin-left");
                if(actual == margins[newId]+"px") i.addClass("selected");
                id = newId;
                count++;
            });
            /*
             stopSlide[ident] = 0;
             slide("#slideshow span.selector",1, ident);
             */

            $(".slider."+ident).css({width : (slides*sWidth)+"px"});
        }

        $("#slideshow span.selector").click(function(){
            var ident = $(".tab.selected").attr("id");
            stopSlide[ident] = 1;
            new_posts($(this), ident);
        });

        return true;
    }

    $("#arrow_left").click(function(){
        var ident = $(".tab.selected").attr("id");
        var obj = getActualPosition();
        stopSlide[ident] = 1;
        var newId = obj.attr("id");
        if(margins[newId] != 0)new_posts(obj.prev(), ident);
    });

    $("#arrow_right").click(function(){
        var ident = $(".tab.selected").attr("id");
        var obj = getActualPosition();
        stopSlide[ident] = 1;
        var newId = obj.attr("id");
        if(margins[newId] != margins[id])new_posts(obj.next(), ident);
    });

    function getActualPosition()
    {
        return $("#slideshow span.selector.selected");
    }

    function new_posts(object, ident){
        var i = object;
        var newId = i.attr("id");
        $(".slider."+ident).stop().animate({marginLeft : margins[newId]+"px"}, {duration : 500, complete : function(){
            $("#slideshow span.selector.selected").removeClass("selected");
            i.addClass("selected");
        }});
    }

    function slide(th,i, ident){
        thx = $(th+":eq("+i+")");
        i++;
        if(i >= count)i = 0;
        setTimeout(function(){
            if(stopSlide[ident] == 0){
                new_posts(thx, ident);
                slide(th,i, ident);
            }
            return true;
        }, 5000);
    }

    $(".slide").each(function(){
        $(this).find(".item").each(function(i){
            i += 1;
            if(i % 4 == 0){
                $(this).addClass("last");
            }
        });
    });
    // exit slider

    // item fade
    $('.item').hover(function(){
        $(this).find('.hover').show().css({opacity: 0}).stop().animate({opacity: 1}, 300);
    }, function(){
        $(this).find('.hover').stop().animate({opacity: 0}, 250, function(){$(this).hide();});
    });

    // show legal info
    $("#show_legal_info").click(function(){
        if($("#legal_info").css("display") == "none"){
            $("#legal_info").show();
            return false;
        }
        $("#legal_info").hide();
        return false;
    });
    $("html").click(function(event){
        if(!$(event.target).closest("#legal_info").length){
            $("#legal_info").hide();
        }
    });

    var slang = new Array();
    if(lang_code == 'en'){
        slang['loading'] = 'Loading';
        slang['please_select'] = 'Please select';
    }
    if(lang_code == 'sk'){
        slang['loading'] = 'Načítavam';
        slang['please_select'] = 'Prosím vyberte';
    }

    // detail box

    //index of items
    function create_index(ident){
        items_index = new Array();
        $(".slider."+ident+" .item").each(function(i){
            i+=1;
            var slug = $(this).children('a').attr('rel');
            items_index[i] = slug;
        });
    }

    //ajax load
    function load_detail(slug){
        var url = base_url+lang_code+"/products/index/"+slug;

        var pos = parseInt(array_search(slug, items_index));
        var max = items_index.length -1;
        var prev = pos - 1;
        var next = pos + 1;
        if(prev < 1)prev = 1;
        if(next > max)next = max;

        showBox($("#detail_box"));
        $("#detail_box_img").html("");
        $("#db_name").html(slang['loading']+"...");
        $("#db_infos").html("");

        $.getJSON(url, function(data) {
            if(data){
                var html = '<p>';
                if(data.year != "undefined")html += '<span class="bold">'+data.lang_year+':</span> '+data.year;
                if(data.agency != "undefined"){
                    html += ' <span class="info"><span class="bold">'+data.lang_agency+':</span> ';
                    if(data.agencyLink != "undefined")html += '<a href="'+data.agencyLink+'" target="_blank">';
                    html += data.agency;
                    if(data.agencyLink != "undefined")html += '</a>';
                    html += '</span>';
                }
                html += ' <span class="info"><span class="bold">'+data.lang_our_work+':</span> '+data.desc+'</span></p>';
                if(data.web != "undefined")html += '<a href="'+data.web+'" class="linkFader" id="detail_box_see_live_site" target="_blank">'+data.lang_see_live_site+'</a>';

                if(data.img != "undefined"){
                    var img = '<img src="'+base_url+data.img+'" alt="'+data.name+'" />';
                    var image = new Image();
                    image.onload = function(){
                        show_loaded(html,data,img,pos,max,prev,next);
                    }
                    image.src = base_url+data.img;
                }else{
                    show_loaded(html,data,"",pos,max,prev,next);
                }
            }
        });
    }

    //show loaded
    function show_loaded(html,data,img,pos,max,prev,next){
        $("#db_name").html(data.name);
        $("#db_infos").html(html);
        $("#detail_box_img").html(img);
        $("#db_counter").html(pos+' / '+max);
        $("#detail_box_prev").attr("rel",prev);
        $("#detail_box_next").attr("rel",next);

        hoverOpacity.init('#detail_box .linkFader');

        setTimeout(function(){set_black_bg();}, 100);
    }

    // click next prev
    $("#detail_box_next").click(function(){
        var pos = $(this).attr("rel");
        load_detail(items_index[pos]);
    });
    $("#detail_box_prev").click(function(){
        var pos = $(this).attr("rel");
        load_detail(items_index[pos]);
    });

    // click function to show detail
    $(".item").click(function(){
        var slug = $(this).children('a').attr('rel');
        load_detail(slug);
        return false;
    });

    // click to show contact form
    $("#contact_us").click(function(){
        return show_contact_form();
    });
    $("#design_inquiry_form").click(function(){
        return show_contact_form();
    });

    // show contact form
    function show_contact_form(){
        $("#cf_info").hide().removeAttr("class").html("");
        $("#form_box .send_message_button").show();
        $("#form_box").find('fieldset .wr').show();
        showBox($("#form_box"));
        return false;
    }

    // click to close button
    $(".box_close").click(function(){
        hideBox($(this).parent());
    });

    // function show box
    function showBox(obj){
        if(obj.css("display") == "block")return;
        obj.show().css({opacity: 0}).animate({opacity: 1}, 300);
        $("#black_bg").show().css({opacity: 0}).animate({opacity: 0.85}, 300).addClass(obj.attr("id"));
        set_black_bg(obj);
        // click somewhere else detail_box closes detail
        $("html").click(function(event){
            if(!$(event.target).closest("#"+obj.attr("id")).length){
                hideBox(obj);
            }
        });
        $('html, body').animate({scrollTop:0}, 'slow');
    }

    // function hide box
    function hideBox(obj){
        obj.animate({opacity: 0}, 250, function(){obj.hide()});
        var id = obj.attr("id");
        $("."+id).animate({opacity: 0}, 250, function(){$(this).hide()}).removeClass(id);
    }

    // function to set black bg width and height
    function set_black_bg(){
        $("#black_bg").hide();
        var bg_width = $(document).width();
        var bg_left = (bg_width - $("body").width()) / 2;
        $("#black_bg").css({"height": $(document).height() + "px", "width": bg_width + "px", "left": "-" + bg_left + "px"});
        $("#black_bg").show();
        return;
    }

    /*
     $('input[type=text]').each(function(){
     var val = $(this).attr('title');
     $(this).val(val);
     $(this).focus(function(){if($(this).val() == val)$(this).val('');}).blur(function(){if($(this).val() == '')$(this).val(val);});
     });
     */

    $("#form_box .require").after("<span class=\"required\">*</span>");

    $("#form_box .send_message_button").click(function(){
        obj = $(this);
        if(!$.browser.msie)obj.prev().css({opacity: 0.5});
        $("#cf_info").show().removeAttr("class").html("<span class=\"load\"></span>");
        $.post(base_url+lang_code+'/contact/submit/', obj.parent().parent().serialize(), function(data){
            $("#cf_info").addClass(data.status).html(data.text);
            if(data.status == "success"){
                obj.prev().hide();
                obj.hide();
            }
            if(!$.browser.msie)obj.prev().css({opacity: 1});
        }, "json");

        return false;
    });

    // open A tags with class external in new windows - replace unsemantic target="_blank"
    $('a.external').click(function() { window.open($(this).attr('href')); return false; });

    // fix tabs width (stupid ie7)
    if(getInternetExplorerVersion() == 7){
        $(".tab").each(function(){
            var text = $(this).text();
            var length = text.length;
            var width = length*7+5;
            $(this).width(width);
        });
        // http://www.vancelucas.com/blog/fixing-ie7-z-index-issues-with-jquery/
        var zIndexNumber = 1000;
        $("#form_box div").each(function() {
            var actZIndex = parseInt($(this).css("zIndex"));
            if(actZIndex == 0){
                $(this).css("zIndex", zIndexNumber);
                zIndexNumber -= 10;
            }else if(actZIndex < 1000){
                var newZIndex = actZIndex*10 + 1000;
                $(this).css("zIndex", newZIndex);
            }
        });
    }

});

function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == "Microsoft Internet Explorer")
    {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
    }
    return rv;
}

function array_search (needle, haystack, argStrict) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
    // *     returns 1: 'surname'

    var strict = !!argStrict;
    var key = '';

    for (key in haystack) {
        if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
            return key;
        }
    }

    return false;
}