$class_sequence = 0;
$tmp_class = 0;


var $root = $(document.documentElement),
    $window = $(window);

var browserCSSPrefix = "",
    animationEndEvent = "animationend";

var windowWidth = 0,
    windowHeight = 0;

var animGoing = false;


availableBodyClass = [ 'welcome', 'webmadeclean', 'imake', 'menuslide', 'home_nav' ];


$(document).ready(function()
{

    // Helpers
    browserCSSPrefix = "-webkit-";
    animationEndEvent = "webkitAnimationEnd";

    windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        $style = $("<style/>").appendTo("head"),



        $('#main_nav ul li a.home').addClass( 'selected' );

    $('.welcome').css( { 'width' : windowWidth } );
    $('.webmadeclean').css( { 'width' : windowWidth } );
    $('.imake').css( { 'width' : windowWidth } );
    $('.menuslide').css( { 'width' : windowWidth } );
    $('.myphotoblog').css( { 'width' : windowWidth } );
    $('#home_loader').css( { 'width' : windowWidth } );


    $('.slider_one').click( function()
    {
        if( $class_sequence != 0 )
        {
            if( animGoing == false )
            {
                removeSelections( )
                $( this ).addClass( 'selected' );
                $class_sequence = 0;
                gotoSlide('0');
                return false;
            }
        }
    });


    $('.slider_two').click( function()
    {
        if( $class_sequence != 1 )
        {
            if( animGoing == false )
            {
                removeSelections( )
                $( this ).addClass( 'selected' );
                $class_sequence = 1;
                gotoSlide('-100%');
                return false;
            }
        }
    });


    $('.slider_three').click( function()
    {
        if( $class_sequence != 2 )
        {
            if( animGoing == false )
            {
                removeSelections( )
                $( this ).addClass( 'selected' );
                $class_sequence = 2;
                gotoSlide('-200%');
                return false;
            }
        }
    });


    $('.slider_four').click( function()
    {
        if( $class_sequence != 3 )
        {
            if( animGoing == false )
            {
                removeSelections( )
                $( this ).addClass( 'selected' );
                $class_sequence = 3
                gotoSlide('-300%');
                return false;
            }
        }
    });

    $('.slider_five').click( function()
    {
        if( $class_sequence != 4 )
        {
            if( animGoing == false )
            {
                removeSelections( )
                $( this ).addClass( 'selected' );
                $class_sequence = 4
                gotoSlide('-400%');
                return false;
            }
        }
    });


    $('.home_nav .right').click( function()
    {
        if( animGoing == false )
        {
            removeSelections( );
            $class_sequence = ++$class_sequence%5;

            wheretoGo();


            return false;
        }
    });


    $('.home_nav .left').click( function()
    {
        if( animGoing == false )
        {
            removeSelections( );
            $class_sequence--;
            if( $class_sequence == -1 ) $class_sequence = 4;

            wheretoGo();
            return false;
        }
    });

    $(document).keydown(function(e)
    {
        if (e.keyCode == 37)
        {
            if( animGoing == false )
            {
                removeSelections( );
                $class_sequence--;
                if( $class_sequence == -1 ) $class_sequence = 4;
                wheretoGo();
                return false;
            }
        }

        if( e.keyCode == 39 )
        {
            if( animGoing == false )
            {
                removeSelections( );
                $class_sequence = ++$class_sequence%5;
                wheretoGo();
                return false;
            }
        }
    });


    $(window).resize(function()
    {
        windowWidth = $(window).width(),
            $('.welcome').css( { 'width' : windowWidth } );
        $('.webmadeclean').css( { 'width' : windowWidth } );
        $('.imake').css( { 'width' : windowWidth } );
        $('.menuslide').css( { 'width' : windowWidth } );
        $('.myphotoblog').css( { 'width' : windowWidth } );
        $('#home_loader').css( { 'width' : windowWidth } );
    });

});


function removeSelections( )
{

    $( '.home_nav button' ).removeClass( 'selected' );

}

function gotoSlide( newMargin )
{

    $('#home_slider').css( { 'margin-left' : newMargin } );
    return false;


    /*
     if( animGoing == false )
     {

     animGoing = true;

     var animName = "slideFrom" + $tmp_class + "to" + $class_sequence;
     var fromMargin =  -1*$tmp_class*windowWidth + "px";

     var adds;
     if( $class_sequence > $tmp_class ) adds = -windowWidth/2;
     else adds = windowWidth/2;

     var tmpMargin =  -1*$class_sequence*windowWidth + adds + "px";
     var endMargin =  -1*$class_sequence*windowWidth + "px";

     insertCSSAnimation(animName, {
     0 : prefix({
     "margin-left" : fromMargin
     }),
     100 : prefix({
     "margin-left" : endMargin
     })
     });

     $tmp_class = $class_sequence;

     $('#home_slider').css(prefix({
     "animation":animName + " 0.8s cubic-bezier(.7,0,.6,.2)"
     }))
     .bind(animationEndEvent, function(e){
     if(e.originalEvent.animationName == animName)
     {
     $('#home_slider').css({ "margin-left" : -1*$class_sequence*windowWidth + "px" });
     animGoing = false;
     }
     });
     }
     */

}

function wheretoGo()
{

    if( $class_sequence == 0 )
    {
        $( '.slider_one' ).addClass( 'selected' );
        gotoSlide('0');
    }
    if( $class_sequence == 1 )
    {
        $( '.slider_two' ).addClass( 'selected' );
        gotoSlide('-100%');
    }
    if( $class_sequence == 2 )
    {
        $( '.slider_three' ).addClass( 'selected' );
        gotoSlide('-200%');
    }
    if( $class_sequence == 3 )
    {
        $( '.slider_four' ).addClass( 'selected' );
        gotoSlide('-300%');
    }
    if( $class_sequence == 4 )
    {
        $( '.slider_five' ).addClass( 'selected' );
        gotoSlide('-400%');
    }

}

function prefix(obj)
{
    if(obj instanceof Object)
    {
        var dict = obj,
            newDict = {};
        $.each(dict,function(key , value)
        {
            newDict[prefix(key)] = value;
        });
        return newDict;
    }

    if([
        "transform",
        "animation",
        "animation-name",
        "animation-duration",
        "animation-timing-function",
        "animation-iteration-count",
        "animation-direction",
        "animation-delay"
    ].indexOf(obj) > -1)
        obj = browserCSSPrefix + obj;
    return obj;
}

function insertCSSAnimation(name, properties)
{
    var anim = "@" + browserCSSPrefix + "keyframes " + name + " {\n";
    $.each(properties, function(progress, props)
    {
        anim += "\t" + progress + "% {\n";
        $.each(props,function(key , value)
        {
            anim += "\t\t" + key + ":" + value + ";\n";
        })
        anim += "\t" + "}\n";
    })
    anim += "}\n";
    $style.append(anim);
};