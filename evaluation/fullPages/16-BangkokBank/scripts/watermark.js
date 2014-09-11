(function($) {
	// Create a plug-in with the name 'watermark'
	$.fn.watermark = function(settings) {
		// Defaults
		var config = {
			watermarkClass: 'watermark',
			defaultText: 'type here...'
		};
	
		// merge the passed in settings with our default config
		if(settings) $.extend(config, settings);

		// Loop through the elements in the selector that we call the plug-in on
		this.each(function() {
			// Apply defaults to the box
			$(this).addClass(config.watermarkClass).val(config.defaultText);
		});
	};
})(jQuery);