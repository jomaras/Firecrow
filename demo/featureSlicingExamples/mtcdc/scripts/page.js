function defaultInputText(input) {
    thisInput = $(input);
    thisInput.focus(function (e) {
        e.preventDefault();
        if ($(this).val() == $(this).attr('rel')) {
            $(this).val('')
        }
    });
    thisInput.blur(function (e) {
        e.preventDefault();
        if ($(this).val() == '') {
            $(this).val($(this).attr('rel'))
        }
    })
}

function animateFeatureImage(imageArray, imageIndex, imageClass) {
    if ($.support.opacity) {
        $('.ei-slider-large li img').animate({
            'opacity': 0
        }, 500, function () {
            $(this).attr('visiblity', 'hidden').attr('src', imageArray[imageIndex]).attr('visiblity', 'visible');
            $(this).animate({
                'opacity': 1
            }, 500, function () {
                $(this).attr('class', '').addClass(imageClass)
            })
        })
    } else {
        $('.ei-slider-large li img').hide(0, 0, function () {
            $(this).attr('src', imageArray[imageIndex]).show()
        })
    }
    $(".feature .feature-navigation li.active span").animate({
        'opacity': 0
    }, 500, function () {
        $(this).parents('li').removeClass('active');
        $(this).css('visibility', 'hidden')
    });
    $(".feature .feature-navigation li:eq(" + imageIndex + ") span.fade-active").css({
        'opacity': 0,
        'visibility': 'visible'
    }).animate({
        'opacity': 1
    }, 500, function () {
        $(this).parents('li').addClass('active')
    })
}

function animateInfographImage(imageArray, imageIndex) {
    if ($.support.opacity) {
        $('.content .infograph-item img').animate({
            'opacity': 0
        }, 500, function () {
            $(this).attr('visiblity', 'hidden');
            $(this).attr('src', imageArray[imageIndex]);
            $(this).attr('visiblity', 'visible');
            $('.content .infograph-item img').animate({
                'opacity': 1
            }, 500)
        })
    } else {
        $('.content .infograph-item img').hide(0, 0, function () {
            $(this).attr('src', imageArray[imageIndex]).show()
        })
    }
    $(".content .infograph-item .infograph-navigation li.active span").animate({
        'opacity': 0
    }, 500, function () {
        $(this).parents('li.infograph-navigation-item').removeClass('active');
        $(this).css('visibility', 'hidden')
    });
    $(".content .infograph-item .infograph-navigation li:eq(" + imageIndex + ") span.fade-active").css({
        'opacity': 0,
        'visibility': 'visible'
    }).animate({
        'opacity': 1
    }, 500, function () {
        $(this).parents('li.infograph-navigation-item').addClass('active')
    })
}

function bindHoverIntent(elem) {
    elem.not('.infograph-item').hover(
        function () {
        var thisLink = $(this);
        var stories = $(".image-list a");
        if (!thisLink.children().hasClass('active')) {
            stories.removeClass('active');
            stories.find(".image-list-title-holder").slideUp(500).animate({
                'opacity': 0
            }, {
                queue: false,
                duration: 250
            });
            $(".image-list-title-top span").html('&#43;');
            thisLink.find('.image-list-title-holder').slideDown(500).animate({
                'opacity': 1
            }, {
                queue: false,
                duration: 750
            });
            thisLink.find('.image-list-title-top span').html('&mdash;')
        }
        },
        function () {
            var thisLink = $(this);
            thisLink.children().removeClass('active');
            thisLink.find('.image-list-title-holder').slideUp(500).animate({
                'opacity': 1
            }, {
                queue: false,
                duration: 750
            });
            thisLink.find('.image-list-title-top span').html('&#43;')
        }
     )
}

function preloadImages(imageVar) {
    $(imageVar).each(function (index, value) {
        if (index != 0) {
            $("<img/>")[0].src = this
        }
    })
}
$(document).ready(function () {
    var index = 0;
    var autoPlay = 0;

    preloadImages(images);

    defaultInputText('.footer .input-text');
    $('.masthead .mobile-menu').click(function (e) {
        e.preventDefault();
        var dropDownParent = $(this).parent();
        var dropDown = $(this).parent().children('ul');
        if (!dropDown.hasClass('show')) {
            dropDownParent.addClass('active');
            dropDown.addClass('show')
        } else {
            dropDownParent.removeClass('active');
            dropDown.removeClass('show')
        }
    });
    if (images.length > 1) {
        $(".feature .feature-navigation li a").click(function (e) {
            e.preventDefault();
            index = $(this).parent().index();
            autoPlay = 0;
            if (!$(this).parent('li').hasClass('active')) {
                if ($('.masthead .container').width() > 420) {
                    animateFeatureImage(images, index, 'desktop')
                } else {
                    animateFeatureImage(imagesMobile, index, 'mobile')
                }
            }
        })
    }

    if (infographImages.length > 1) {
        $(".content .infograph-item .infograph-navigation li a").click(function (e) {
            e.preventDefault();
            index = $(this).parent().index();
            autoPlay = 0;
            if (!$(this).parent('li').hasClass('active')) {
                animateInfographImage(infographImages, index)
            }
        })
    }
    bindHoverIntent($(".image-list li, .image-list .holder"));

    $(".level2 a").css("color", "white");
});