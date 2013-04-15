var review = document.querySelector(".review-slide > div");

var obj = $.extend({}, null);
var opts = { original: {} };

opts.original.animIn = $.extend(null, null);
opts.original.animIn.a = 4;

review.textContent = "MUAHAHAHAHAHAHAHAHAHAHAHAHAHA" + opts.original.animIn.a;
