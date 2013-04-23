(function ($) {

    //Scroll Code

    $(window).scroll(function () {
        if ($(this).scrollTop() > 120) {
            $(".small_logo").fadeIn();
        } else {
            $(".small_logo").fadeOut();
        }



    });





})(jQuery);