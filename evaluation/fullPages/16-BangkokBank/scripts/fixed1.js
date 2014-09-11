function checkSpanNewsMouseOver(){
	$ft('#spanNewsContent').mouseover(function(){
		clearInterval(y);
	});

	$ft('#spanNewsContent').mouseout(function(){
		y = window.setInterval(ft_news_show, 3000);	
	});
}
