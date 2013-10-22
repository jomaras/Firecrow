/* Initialize
*/
jQuery(document).ready(function ($) {
		$("[rel=tooltip]").tooltip();
		$("[rel=popover]").popover();
		$("collapse").collapse();
		$('#authorTab a').click(function (e) {e.preventDefault(); $(this).tab('show'); });
		$('.sc_tabs a').click(function (e) {e.preventDefault(); $(this).tab('show'); });
		
		$(".videofit").fitVids();
		$('.accordion').on('show', function (e) {
         $(e.target).prev('.accordion-heading').find('.accordion-toggle').addClass('open');
			});

			$('.accordion').on('hide', function (e) {
				$(this).find('.accordion-toggle').not($(e.target)).removeClass('open');
			});
		$('#archive-orderby').customSelect();
		$('.kad-select').customSelect();
	//Menu
	$("nav select").change(function() {
		window.location = $(this).find("option:selected").val();
	});
});


//Superfish Menu
	jQuery(document).ready(function() {
		jQuery('ul.sf-menu').superfish({
			delay:       200,                            // one second delay on mouseout
			animation:   {opacity:'show',height:'show'},  // fade-in and slide-down animation
			speed:       'fast'                          // faster animation speed
		});
	});
	
//Fred Carousel - Check if headercarousel exsists, start up and adjust for screen size - make the responsive play nice.
 jQuery(document).ready(function ($) {
		if ($('ul#blog_carousel').length) {
					$('#blog_carousel').carouFredSel({
							scroll: { items:1,easing: "swing", duration: 700, pauseOnHover : true},
							auto: {play: false, timeoutDuration: 9000},
							prev: '#prevport_blog',
							next: '#nextport_blog',
							pagination: false,
							swipe: true,
								items: {visible: null
								}
						});
						var resizeTimer;
						$(window).resize(function() {
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(blogCarousel, 100);
						});
					}
					function blogCarousel() {
							$("#blog_carousel").trigger("destroy");
						$('#blog_carousel').carouFredSel({
									scroll: { items:1,easing: "swing", duration: 700, pauseOnHover : true},
							auto: {play: false, timeoutDuration: 9000},
							prev: '#prevport_blog',
							next: '#nextport_blog',
							pagination: false,
							swipe: true,
								items: {visible: null
								}
						});
			}
});
 
  jQuery(document).ready(function ($) {
		if ($('#portfolio-carousel').length) {
					$('#portfolio-carousel').carouFredSel({
							scroll: { items:1,easing: "swing", duration: 700, pauseOnHover : true},
							auto: {play: false, timeoutDuration: 9000},
							prev: '#prevport_portfolio',
							next: '#nextport_portfolio',
							pagination: false,
							swipe: true,
								items: {visible: null
								}
						});
								var resizeTimer;
						$(window).resize(function() {
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(homepCarousel, 100);
						});
					}
					function homepCarousel() {
							$("#portfolio-carousel").trigger("destroy");
						$('#portfolio-carousel').carouFredSel({
									scroll: { items:1,easing: "swing", duration: 700, pauseOnHover : true},
							auto: {play: false, timeoutDuration: 9000},
							prev: '#prevport_portfolio',
							next: '#nextport_portfolio',
							pagination: false,
							swipe: true,
								items: {visible: null
								}
						});
			}
});