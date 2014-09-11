$(document).ready(function () {
    // Fix external links
    //$("a[href*='http']").not("[rel='external']").each(function() {
    //  $(this).attr('rel', 'external');
    //})

    // Record click-throughs to external sites
    $("a[rel=external]").click(function (e) {
        e.preventDefault();
        window.open($(this).attr('href'), '_blank');
        pageTracker._trackPageview('/outgoing/' + $(this).attr('href'));
    });

    $('#portfolio .index a').each(function (i, link) {
        $(link).click(function (e) {
            e.preventDefault();
            gotoPortfolioPage(i + 2);
        });
    });

    // $('#people li').each(function(i, li) {
    //   var name = $(li).find('h4').html().split(' ')[0];
    //   var email = name.toLowerCase() + '@' + 'makalumedia' + '.com';
    //   $(li).find('.email').attr('href', 'mail' + 'to:' + email).html(email);
    // });

    $('#news li a').click(function (e) {
        e.preventDefault();
        if (!$(this).hasClass('active')) {
            $('#news li a').removeClass('active');
            $(this).addClass('active');
            $.get($(this).attr('href'), function (data) {
                $('#news-article').html(data).animate({
                    opacity: 1,
                    width: '540px',
                    height: $('#expertise').height() - 20,
                    left: 0,
                    top: 0,
                    marginLeft: 0
                }, {
                    duration: 350,
                    easing: 'easeInOutQuad',
                    complete: function () {
                        $(this).find('.entry').height($(this).find('.post').height() - $(this).find('.entry').position().top)
                        $(this).find('.post').animate({
                            opacity: 1
                        }, 200);
                    }
                });
            })
        }
    });

    $('#news-article .close').live('click', function (e) {
        e.preventDefault();
        closeNewsArticle();
    });

    $('#news-article .arrow').live('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('next')) {
            var li = $('#news li a.active').parents('li').next('li');
            if (li.length > 0) {
                li.find('a').click();
            } else {
                $('#news li a:first-child').click();
            }
        } else {
            var li = $('#news li a.active').parents('li').prev('li');
            if (li.length > 0) {
                li.find('a').click();
            } else {
                $('#news li a:last-child').click();
            }
        }
    });

    function closeNewsArticle() {
        $('#news-article .post').fadeOut(50).parents('#news-article').animate({
            opacity: 0,
            width: '20px',
            height: '20px',
            left: 280,
            top: '50%',
            marginLeft: -25
        }, {
            duration: 200,
            easing: 'easeInQuad'
        });
        $('#news li a').removeClass('active');
    }

    $('#footer .interactive').hover(function () {
        $('#footer img.interactive').stop(true).fadeTo('normal', 1);
    }, function () {
        $('#footer img.interactive').stop(true).fadeTo('fast', 0);
    });

    var newsPosition = 0;
    var newsMore = $('#news a.more');
    newsMore.animate({
        bottom: 10
    }, 400)

    newsMore.click(function (e) {
        e.preventDefault();
        newsPosition -= 40;
        if (newsPosition < -($('#news ul').height() - 180)) {
            $(this).addClass('back');
            $('#news .thatsall').animate({
                opacity: 1
            });
        }
        if (newsPosition < -($('#news ul').height() - 140)) {
            $(this).removeClass('back');
            newsPosition = 0;
        }
        $('#news').find('ul').animate({
            top: newsPosition
        }, 300);
    });

    $('#portfolio').find('.paginator a').click(function (e) {
        e.preventDefault();
        gotoPortfolioPage(parseInt($(this).html()));
    });

    function gotoPortfolioPage(i) {
        if (i == 1) {
            $('#portfolio h3').removeClass('dimmed');
        } else {
            $('#portfolio h3').addClass('dimmed');
        }
        $('#portfolio-mask .projects').animate({
            left: -((i - 1) * 360)
        }, 250);
        $('#portfolio .paginator li.active').removeClass('active');
        $('#portfolio .paginator li').eq(i - 1).addClass('active');
    }

    $('#speechbubble .inner').append(unescape('%3C%62%72%3E%3C%62%72%3E%3C%73%6D%61%6C%6C%3E%54%68%69%73%20%69%73%20%74%68%65%20%6D%69%6E%69%6D%61%6C%20%74%77%69%73%74%21%3C%2F%73%6D%61%6C%6C%3E'));
    $('#contact form').ajaxForm({
        success: function (data) {
            $('#speechbubble').css({
                display: 'block'
            }).animate({
                left: 80,
                opacity: 1
            }, {
                duration: 500,
                easing: 'easeInOutQuad'
            }).click(function (e) {
                $('#speechbubble').fadeOut();
            }).find('.name').html($('#name').val().split(' ')[0]);
            setTimeout(function () {
                $('#speechbubble').fadeOut();
            }, 5000);
            $('form .textfield input, form textarea').val('').change();
        }
    });

    var filledIn = false;
    $('#contact input, #contact textarea').keyup(function () {
        if ($('#contact #name').val() != "" && $('#contact #email').val() != "" && $('#contact #message').val() != "") {
            if (!$('#contact .submit').hasClass('active')) {
                $('#contact .submit').addClass('active');
            }
        } else {
            $('#contact .submit').removeClass('active');
        }
    });
    $('#contact input, #contact textarea').change(function () {
        if ($('#contact #name').val() != "" && $('#contact #email').val() != "" && $('#contact #message').val() != "") {
            if (!$('#contact .submit').hasClass('active')) {
                $('#contact .submit').addClass('active');
            }
        } else {
            $('#contact .submit').removeClass('active');
        }
    });

    $('a.submit').click(function (e) {
        e.preventDefault();
        if ($('#contact .submit').hasClass('active')) {
            $(this).parents('form').submit();
        }
    });

    initAutoclearFields();
});

function initAutoclearFields() {
    $.each($('p.autoclear'), function () {
        var p = $(this);
        var label = p.find('label.autoclear');
        var field = p.find('input, textarea');

        // Sometimes browsers leave values in the field on refresh
        if (field.val() != '') {
            label.hide();
        }

        label.click(function () {
            field.focus();
        });
        field.focus(function () {
            label.addClass('dimmed');
            // In case of auto-complete
            if (field.val() != '') {
                label.hide();
            }
        })
        field.blur(function () {
            label.removeClass('dimmed');
            if (field.val() == '') {
                label.show();
            }
        })
        field.keydown(function (e) {
            // Ignore modifier keys
            if ($.inArray(e.keyCode, [9, 27, 16, 17, 18, 20, 144, 224, 91, 92, 93]) == -1) {
                label.fadeOut(200);
            }
        })
        field.change(function () {
            if (field.val() == '') {
                label.show();
            }
        })
    });
}