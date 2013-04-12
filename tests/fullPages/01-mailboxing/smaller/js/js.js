var reviews = $(".review-slide > div:gt(0)");

reviews.hide();

$('.review-slide > div:first').fadeOut(300).next().fadeIn(300);

/*setInterval(function() {
  $('.review-slide > div:first')
    .fadeOut(300)
    .next()
    .fadeIn(300)
    .end()
    .appendTo('.review-slide');
},  1000);*/