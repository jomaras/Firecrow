var imageCount=3;
var imagePosition=0;
var lastImagePosition=0;
var aa;
var intervalId = 0;

function slide(pos){
    var move;
    var orient=1;
    lastImagePosition=imagePosition;
    imagePosition=pos;
    if (imagePosition==imageCount){
        imagePosition=0;
    }
    orient=imagePosition-lastImagePosition;
    
    $(".pager_circle").removeClass("selected");
    $(".pager_circle").eq(imagePosition).addClass("selected");
    move=257*orient;
    $('#ipad_img_container').animate({
        marginLeft: '-='+move
      }, 500, function() {
        // Animation complete.
      });
    
    move=117*orient;

      $('#iphone_img_container').animate({
        marginLeft: '-='+move
      }, 500, function() {
        // Animation complete.
      });
}
$(document).ready(function() {

	$('.slide_fx').cycle({
		 timeout: 0,
		 speed: 300,
		 height: 'fit',
		 fx: 'scrollLeft', 
	     next: '.next',
		 prev: '.prev',
		 cleartypeNoBg: true,
		 pager:  '.nav ul' 
	})

});

jQuery.fn.preloadImages = function( userfunction ) {
	that = this;
	that.data('imagesToLoad', 0 );
	jQuery.each(this.find('img').css('visibility', 'hidden').fadeTo( 0, 0 ), function(i, val){
		that.data('imagesToLoad', that.data('imagesToLoad') + 1 );
		
		var image = new Image();
		// jQuery(val).parent().parent().addClass('loading');
		jQuery(image).one('load', function(){
			jQuery(val).removeClass('loading').css('visibility', 'visible').fadeTo( 300, 1, function() {
				
				jQuery(this).css('opacity', '');
				
			} );//.parent().parent().removeClass('loading');
			
			that.data('imagesToLoad', that.data('imagesToLoad') - 1 );
			if( typeof userfunction == 'function' && that.data('imagesToLoad') == 0 )
				userfunction( jQuery(val) );
		});
		
		// Set SRC after adding load listener in case image has been cached
		image.src = jQuery(val).addClass('loading').attr('src');
	});
	
	if( typeof userfunction == 'function' && that.data('imagesToLoad') == 0 )
		userfunction( this );
	
	return this;
};