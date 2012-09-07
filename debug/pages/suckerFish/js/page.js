$(document).ready(function(){
    $("#nav-one li").hover(
        function(){ $("ul", this).fadeIn("fast"); },
        function() { }
    );
    if (document.all) {
        $("#nav-one li").hoverClass ("sfHover");
    }
});

$.fn.hoverClass = function(c) {
    return this.each(function(){
        $(this).hover(
            function() { $(this).addClass(c);  },
            function() { $(this).removeClass(c); }
        );
    });
};