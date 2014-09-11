$counter = 0;
$current_class = 'm_1';
$hover_class = 'm_1';
$last_visit = 0;

var $root = $(document.documentElement),
    $window = $(window);

var browserCSSPrefix = "",
    animationEndEvent = "animationend";

var windowWidth = 0,
    windowHeight = 0;




$(document).ready(function()
{
    $('#mustache_picker').addClass( 'initialized' );

    browserCSSPrefix = "-webkit-";
    animationEndEvent = "webkitAnimationEnd";

    windowWidth = $root.width(),
    windowHeight = $root.height(),
    $style = $("<style/>").appendTo("head"),



    manage_scroller();

    onMoustacheHover();
    onMoustachePicked( );
    onlistOut( );

    //onFanionClick();
    //onClose();

    onMustachePickExpand();
});

function onMoustacheHover( )
{
    $('#mustache_picker ul li a').hover( function()
    {

        tmp = $( this ).attr('class');
        if( tmp != 'collapse_arrow')
        {
            $('#mustache_on_logo').removeClass( ).addClass( tmp );
            $hover_class = tmp;
        }

    });
}

function onlistOut( )
{
    $('#mustache_picker ul li a').hover( function()
        {
        },
        function()
        {
            setMoustacheLogo();
        });
}

function setMoustacheLogo()
{
    $('#mustache_on_logo').removeClass( ).addClass( $current_class );
}

function onMoustachePicked()
{
    $('#mustache_picker li a').click( function()
    {
        if( tmp != 'collapse_arrow')
        {
            $('#mustache_picker ul li a').removeClass( 'selected' );
            $( this ).addClass( 'selected' );

            $current_class = $hover_class;
            setMoustacheLogo();
            collapseMe();
        }
        return false;
    });
}


function onMustachePickExpand( )
{
    $('#selected_tache').click(function()
    {
        expandMe();
        return false;
    });

    $('#mustache_picker .expand_arrow').click(function()
    {
        expandMe();
        return false;
    });

    $('#mustache_picker ul .collapse_arrow').click(function()
    {
        collapseMe();
        return false;
    });
}

function expandMe()
{
    $('#branding .logo_text h1').addClass( 'expandme' );
    $('#mustache_picker').addClass( 'expandme' );
}

function collapseMe()
{
    $('#branding .logo_text h1').removeClass( 'expandme' );
    $('#mustache_picker').removeClass( 'expandme' );
}


function manage_scroller()
{
    jQuery('.scroller').click(function()
    {
        var clicked = jQuery(this).attr("href");
        var destination = jQuery(clicked).offset().top;
        jQuery("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination}, 500 );
        return false;
    });
}