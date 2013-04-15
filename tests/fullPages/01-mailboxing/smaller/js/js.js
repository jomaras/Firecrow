var reviews = $(".review-slide > div:gt(0)");
var review = document.querySelector(".review-slide > div");

$.each(reviews, function(i, o)
{
    review.textContent += i;
});