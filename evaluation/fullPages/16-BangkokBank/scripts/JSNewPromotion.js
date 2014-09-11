var varHTML = '';
var idBannerZone = 1;
var totalSlideShow = 0;
var totalWhatsNews = 0;
var currentSlideShow = 1;
var currentWhatsNew = 1;
var varIntervalSlideShow,  varIntervalWhatsNew;
var array_SlideShow = [];
var timeFaceIn = 500;
var timeFaceOut = 500;
var btnWhatsNewStatus = 0;
var btnSlideShowStatus = 0;

jQuery.noConflict();
jQuery(document).ready(function() {
	
		jQuery('#divPromotion').hide();				

		genWhatsNews();		
		firstTimerWhatsNews();
		timerWhatsNews(currentWhatsNew);					

		genSlideShow();
		firstTimerSlideShow();

// Whats New		
		jQuery('.cssWhatsNew,cssSubWhatsNew_Trans').bind('mouseover',function()
		{
		   	clearInterval(varIntervalWhatsNew); 
		   	varIntervalWhatsNew = 0;	
		}).bind('mouseout',function(){
			timerWhatsNews(currentWhatsNew);
		});	
// Slide Show	
		jQuery('#divSlideShow').bind('mouseover',function()
		{
		   	clearInterval(varIntervalSlideShow); 	
		   	varIntervalSlideShow = 0;	
		}).bind('mouseout',function(){
			timerSlideShow(currentSlideShow);
		});
		
		jQuery('#bullet1 img').attr('src','images/bullets_open.png');				
		jQuery('#bulletSlideShow1 img').attr('src','images/bullets_open.png');				

			jQuery('.cssSubWhatsNew').mouseover(function(){
				jQuery(this).children('div').stop().animate({
					top:-110,
					opacity:0.95
				},200);
			});
			jQuery('.cssSubWhatsNew').mouseout(function(){
			var yTop;
			if (jQuery.browser.msie){
				yTop = 50;
			}else{
				yTop = -50;
			}
				jQuery(this).children('div').stop().animate({
					top:yTop,
					opacity:0				
				},200);
			});		
		
		jQuery('#divHomePageWhatsNews').css('position','relative');
		jQuery('#divHomePageWhatsNews').css('left','480px');
		jQuery('#divHomePageWhatsNews').css('top','-15px');					
});

function genWhatsNews(){
// Begin --------------------------- WhatsNew ------------------------------ //
var strHTML = '<div id="divWhatsNew_Main" style="position:relative;left:65px;">';
var imgWhatsNews = 1;
var No_ThumbWhatsNew=0;
var imgZindex=4;

	for(var imgWhatsNews=1;imgWhatsNews<4;imgWhatsNews++){
		strHTML += '<div id="divWhatsNew_Img'+  (parseInt(imgWhatsNews)) +'" class="cssWhatsNew" style="z-index:'+(parseInt(imgZindex--))+';">';
		for(var imgThumbWhatsNew=0;imgThumbWhatsNew<4;imgThumbWhatsNew++){		
			No_ThumbWhatsNew++;
			strHTML += '<div class="cssSubWhatsNew"><img src=' + jQuery('#imgBanner'+(parseInt(No_ThumbWhatsNew))).attr('src') + ' height="110px" width="220px" /><div class="cssSubWhatsNew_Trans">' + jQuery('#divContent'+(parseInt(No_ThumbWhatsNew))).html() + '</div></div>';
		}		
		strHTML += '</div>';					
	}		
	strHTML += '</div>';

	var total_WhatsNew = No_ThumbWhatsNew/4;

	strHTML += '<div id="bulletWhatsNew" style="z-index:1;position:absolute;top:465px;left:145px;">';
		for(var No_Bullet=0;No_Bullet<total_WhatsNew;No_Bullet++){
			strHTML += '<div  id="bullet' + parseInt(total_WhatsNew-No_Bullet) + '" class="cssNoBullet"><img src="images/bullets_close.png" style="cursor:pointer;"></div>';
		}
	strHTML += '</div>';	

    jQuery('#divHomePageWhatsNews #WebPartWPQ4').append(strHTML);

    var bullets = jQuery('#divHomePageWhatsNews #WebPartWPQ4 .cssNoBullet');

    bullets.click(function()
    {
        clickBullet(total_WhatsNew - jQuery(this).index());
    });

	jQuery('#divPromotion').remove();		
}

function genSlideShow(){
	var slideIndex ='1';
	var x1 = jQuery('#WebPartWPQ2 #slider').html();
	jQuery('#WebPartWPQ2 link').remove();
	jQuery('#WebPartWPQ2 script').remove();
	jQuery('#WebPartWPQ2 style').remove();

	var slideShowHTML = '';
		if(jQuery(document).ready()) {
            var links = jQuery('#WebPartWPQ2 a');
            var images = jQuery('#WebPartWPQ2 img');

            for(var index = 0; index < links.length; index++)
            {
                if(links[index].href != '')
                {
                    totalSlideShow++;

                    if(images[index])
                    {
                        var src = images[index].getAttribute('src');

                        slideShowHTML += '<div id="divSlideShow_Img'+ totalSlideShow +'" style="position:absolute;"  style="z-index:'+(parseInt(slideIndex--))+';"><a href="'+jQuery('#WebPartWPQ2 a')[index].getAttribute('href')+'">' + '<img src="'+ src +'"></a></div>';
                    }
                }
            }
		}		

	slideShowHTML += '<div id="bulletSlideShow" style="z-index:1;position:absolute;top:450px;float:left;left:220px;">';
		if(totalSlideShow > 1){
			for(var No_Bullet=0;No_Bullet<totalSlideShow;No_Bullet++){
				slideShowHTML += '<div  id="bulletSlideShow' + parseInt(totalSlideShow-No_Bullet) + '" class="cssNoBullet"><img src="images/bullets_close.png" style="cursor:pointer;"></div>';
			}
		}
	slideShowHTML += '</div>';	
		
	jQuery('#WebPartWPQ2 #slider').remove();
	jQuery('#divHomePagePromotion').remove();
	jQuery('#divSlideShow').append(slideShowHTML);
    var bullets = jQuery('#divSlideShow .cssNoBullet');
    bullets.click(function()
    {
        clickBulletSlideShow(totalSlideShow - jQuery(this).index());
    });
	if(totalSlideShow > 1){
		timerSlideShow(currentSlideShow);
	}
}

function firstTimerWhatsNews(){
	for(var y=1;y<4;y++){
		jQuery("#divWhatsNew_Img" + y).css('display','none');
		
		jQuery('#bullet' + parseInt(y) + ' img').attr('src','images/bullets_close.png');		
		
		if(y == 3){
			jQuery('#divWhatsNew_Img1').fadeIn('0');					
			jQuery('#bullet1 img').attr('src','images/bullets_open.png');										
		}else{
			jQuery("#divWhatsNew_Img" + (parseInt(y)+1)).fadeIn('0');			
			jQuery('#bullet' + (parseInt(y)+1) + ' img').attr('src','images/bullets_open.png');							
		}
	}
}

function firstTimerSlideShow(){
	for(var x=1;x<(totalSlideShow+1);x++){
		jQuery("#divSlideShow_Img" + x).css('display','none');
		jQuery('#bulletSlideShow' + parseInt(x) + ' img').attr('src','images/bullets_close.png');				

		if(x == totalSlideShow){
			jQuery('#divSlideShow_Img1').fadeIn('0');				
			jQuery('#bulletSlideShow1 img').attr('src','images/bullets_open.png');								
		}else{
			jQuery("#divSlideShow_Img" + (parseInt(x)+1)).fadeIn('0');			
			jQuery('#bulletSlideShow' + (parseInt(x)+1) + ' img').attr('src','images/bullets_open.png');										
		}
	}
}

function timerWhatsNews(y){

	clearInterval(varIntervalWhatsNew);
	varIntervalWhatsNew = 0;
	varIntervalWhatsNew = setInterval(function () {
		jQuery("#divWhatsNew_Img" + y).fadeOut(timeFaceOut);
		jQuery('#bullet' + parseInt(y) + ' img').attr('src','images/bullets_close.png');		
		
		if(y == 3){
			jQuery('#divWhatsNew_Img1').fadeIn(timeFaceIn);					
			jQuery('#bullet1 img').attr('src','images/bullets_open.png');										
		}else{
			jQuery("#divWhatsNew_Img" + (parseInt(y)+1)).fadeIn(timeFaceIn);			
			jQuery('#bullet' + (parseInt(y)+1) + ' img').attr('src','images/bullets_open.png');							
		}
				
		y++;				
		if(y == 4){
			y = 1;
		}		
		currentWhatsNew = y;
	},20000);
}

function timerSlideShow(x){
	if(totalSlideShow > 1){
		clearInterval(varIntervalSlideShow);
		varIntervalSlideShow = 0;
						
		varIntervalSlideShow = setInterval(function () {
			jQuery("#divSlideShow_Img" + x).fadeOut(timeFaceOut);
			jQuery('#bulletSlideShow' + parseInt(x) + ' img').attr('src','images/bullets_close.png');				
			if(x == totalSlideShow){
				jQuery('#divSlideShow_Img1').fadeIn(timeFaceIn);				
				jQuery('#bulletSlideShow1 img').attr('src','images/bullets_open.png');								
			}else{
				jQuery("#divSlideShow_Img" + (parseInt(x)+1)).fadeIn(timeFaceIn);			
				jQuery('#bulletSlideShow' + (parseInt(x)+1) + ' img').attr('src','images/bullets_open.png');										
			}
					
			x++;				
			if(x == (totalSlideShow+1)){
				x = 1;
			}		
			currentSlideShow = x;
		},8000);
	}
}

function clickBullet(selectedWhatsNew){
	if (selectedWhatsNew != currentWhatsNew) {
		clearInterval(varIntervalWhatsNew);
		if (btnWhatsNewStatus == 0){ 
			btnWhatsNewStatus = 1;
			jQuery("#divWhatsNew_Img" + parseInt(selectedWhatsNew)).stop().fadeIn('125',function(){			
				jQuery('#bullet' + parseInt(currentWhatsNew) + ' img').attr('src','images/bullets_close.png');
				jQuery('#bullet' + parseInt(selectedWhatsNew) + ' img').attr('src','images/bullets_open.png');						
				jQuery("#divWhatsNew_Img" + currentWhatsNew).stop().fadeOut('125',function(){
					currentWhatsNew = selectedWhatsNew++;	
					btnWhatsNewStatus = 0;			
					if(currentWhatsNew == 4){
						currentWhatsNew = 1;
					}			
				 	timerWhatsNews(currentWhatsNew);			
				});			
			});					
		 }
	 }
}

function clickBulletSlideShow(selectedSlideShow){
	if (selectedSlideShow != currentSlideShow) {
		clearInterval(varIntervalSlideShow);
		if (btnSlideShowStatus == 0){
			btnSlideShowStatus = 1;
			jQuery("#divSlideShow_Img" + parseInt(selectedSlideShow)).stop().fadeIn('125',function(){
				jQuery('#bulletSlideShow' + parseInt(currentSlideShow) + ' img').attr('src','images/bullets_close.png');
				jQuery('#bulletSlideShow' + parseInt(selectedSlideShow) + ' img').attr('src','images/bullets_open.png');
				jQuery("#divSlideShow_Img" + currentSlideShow).stop().fadeOut('125',function(){
					currentSlideShow = selectedSlideShow++;
					btnSlideShowStatus = 0;
					if(currentSlideShow == (totalSlideShow+1)){
						currentSlideShow = 1;
					}
				 	timerSlideShow(currentSlideShow);
				});			
			});					
		 }
	 }
}