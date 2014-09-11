var slide = false;

$pm = jQuery.noConflict();	
$pm(document).ready(function() {
		$pm('#footer_higher').css('display','none');		
		$pm('#footer_higher').css('height','auto');		
		$pm('#footer_higher').click(function() {
			if ($pm('#footer_higher').height() > 10) {
	        	$pm('#footer_higher').animate({ height: '0px' },2000);
			}	
		});
		if ($pm('#footer_higher').height() > 10) {
			bottom_popup();  
			 
			typewatch(function () {
				bottom_popup();  
			  }, 8000);		
		}	  	

		 //});
});

function bottom_popup() {
	      	if(slide == false) {
				$pm('#footer_higher').css('display','block');
	        	$pm('#footer_higher').animate({ height: '240px' },2000);
				slide = true;
			} else {
	        	$pm('#footer_higher').animate({ height: '0px' },2000);
				slide = false;
			}
}

var typewatch = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  }  
})();