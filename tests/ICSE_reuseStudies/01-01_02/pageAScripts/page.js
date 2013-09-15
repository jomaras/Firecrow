window.onload = function () {
    var slideshow = new TINY.slider.slide('slideshow', {
        id: 'slider',
        auto: 10,
        resume: false,
        vertical: false,
        navid: 'pagination',
        activeclass: 'current',
        position: 0,
        rewind: false,
        elastic: false,
        left: 'slideleft',
        right: 'slideright'
    });

    document.getElementById("slideleft").onclick = function () {
        slideshow.move(-1);
    }
    document.getElementById("slideright").onclick = function () {
        slideshow.move(1);
    }

    var pages = document.querySelectorAll("#pagination li");

    for (var i = 0; i < pages.length; i++) {
        (function (index) {
            pages[index].onclick = function () {
                slideshow.pos(index);
            }
        })(i);
    }
}