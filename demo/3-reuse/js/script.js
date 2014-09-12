$(document).ready(function () {
    $("a.c-blackeyes").click(function () {
        return $("#photo-reel").attr("class", "blackkeys"), $(".effect-select nav ul li").removeClass("active"), $("li.cb").addClass("active"), !1
    }), $("a.c-dreamy").click(function () {
        return $("#photo-reel").attr("class", "dreamy"), $(".effect-select nav ul li").removeClass("active"), $("li.cd").addClass("active"), !1
    }), $("a.c-foxy").click(function () {
        return $("#photo-reel").attr("class", "foxy"), $(".effect-select nav ul li").removeClass("active"), $("li.cf").addClass("active"), !1
    }), $("a.c-rodney").click(function () {
        return $("#photo-reel").attr("class", "rodney"), $(".effect-select nav ul li").removeClass("active"), $("li.cr").addClass("active"), !1
    }), $("li.if").click(function () {
        $("ul#fl").attr("class", "f-if");
        $("ul#fl li").removeClass("active cl-i es-i if-i us-i");
        $("li.if").addClass("if-i active");
        $("#t_jakobs").attr("class", "invite");
    }), $("li.us").click(function () {
        $("ul#fl").attr("class", "f-us"), $("ul#fl li").removeClass("active cl-i es-i if-i us-i"), $("li.us").addClass("us-i active"), $("#t_jakobs").attr("class", "camera")
    }), $("li.cl").click(function () {
        $("ul#fl").attr("class", "f-cl"), $("ul#fl li").removeClass("active us-i es-i if-i"), $("li.cl").addClass("active cl-i"), $("#t_jakobs").attr("class", "label")
    }), $("li.es").click(function () {
        $("ul#fl").attr("class", "f-es"), $("ul#fl li").removeClass("active cl-i es-i if-i"), $("li.es").addClass("es-i active"), $("#t_jakobs").attr("class", "share")
    }), $(".play").click(function () {
        $(".play").addClass("p-click"), $(".video iframe").addClass("go-time"), $(".video .iframe").append("<iframe src='http://player.vimeo.com/video/33587502?title=0&amp;byline=0&amp;portrait=0&amp;color=F2E895&amp;autoplay=1'' width='487' height='274' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>")
    }), $("a.synthetic").hover(function () {
        $("ul.c-dd").slideDown("fast", function () {})
    }), $(".feature,#product-nav").hover(function () {
        $("ul.c-dd").slideUp("fast", function () {})
    }), $(".dreamy-set img,.bk-set img,.foxy-set img,.rodney-set img").glisse({
        changeSpeed: 350,
        speed: 300,
        effect: "bounce",
        fullscreen: !1
    })
});