$(function () {
    $('#ribbon').css({
        'height': (($(window).height())) + 'px'
    });

    $(window).resize(function () {
        $('#ribbon').css({
            'height': (($(window).height())) + 'px'
        });
    });

    $('#frame-list li a').click(function (e) {
        var id = $(this).attr('href');
        var iphoneId = id + '-iphone';
        $('#image-area img, #iphone-img img').hide();
        $(id).fadeIn();
        $(iphoneId).fadeIn();
        e.preventDefault();
    })
});