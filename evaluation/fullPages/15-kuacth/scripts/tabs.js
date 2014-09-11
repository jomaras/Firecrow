/***************************/
//@Author: Adrian "yEnS" Mato Gondelle & Ivan Guardado Castro
//@website: www.yensdesign.com
//@email: yensamg@gmail.com
//@license: Feel free to use it, but keep this credits please!					
/***************************/

$(document).ready(function(){
	$(".menu > li").click(function(e){
		switch(e.target.id){
			case "news":
				//change status & style menu
				$("#news").addClass("active");
				$("#tutorials").removeClass("active");
				$("#links").removeClass("active");
				$("#links1").removeClass("active");
				$("#links2").removeClass("active");
				$("#links3").removeClass("active");
				//display selected division, hide others
				$("div.news").fadeIn();
				$("div.tutorials").css("display", "none");
				$("div.links").css("display", "none");
				$("div.links1").css("display", "none");
				$("div.links2").css("display", "none");
				$("div.links3").css("display", "none");
				
			break;
			case "tutorials":
				//change status & style menu
				$("#news").removeClass("active");
				$("#tutorials").addClass("active");
				$("#links").removeClass("active");
				$("#links1").removeClass("active");
				$("#links2").removeClass("active");
				$("#links3").removeClass("active");
				//display selected division, hide others
				$("div.tutorials").fadeIn();
				$("div.news").css("display", "none");
				$("div.links").css("display", "none");
				$("div.links1").css("display", "none");
				$("div.links2").css("display", "none");
				$("div.links3").css("display", "none");

			break;
			case "links":
				//change status & style menu
				$("#news").removeClass("active");
				$("#tutorials").removeClass("active");
				$("#links").addClass("active");
				$("#links1").removeClass("active");
				$("#links2").removeClass("active");
				$("#links3").removeClass("active");
				//display selected division, hide others
				$("div.links").fadeIn();
				$("div.news").css("display", "none");
				$("div.tutorials").css("display", "none");
				$("div.links1").css("display", "none");
				$("div.links2").css("display", "none");
				$("div.links3").css("display", "none");

				
			break;
			case "links1":
				//change status & style menu
				$("#news").removeClass("active");
				$("#tutorials").removeClass("active");
				$("#links").removeClass("active");
				$("#links1").addClass("active");
				$("#links2").removeClass("active");
				$("#links3").removeClass("active");
				//display selected division, hide others
				$("div.links1").fadeIn();
				$("div.news").css("display", "none");
				$("div.tutorials").css("display", "none");
				$("div.links").css("display", "none");
				$("div.links2").css("display", "none");
				$("div.links3").css("display", "none");
				
			break;
			case "links2":
				//change status & style menu
				$("#news").removeClass("active");
				$("#tutorials").removeClass("active");
				$("#links").removeClass("active");
				$("#links1").removeClass("active");
				$("#links2").addClass("active");
				
				$("#links3").removeClass("active");
				//display selected division, hide others
				$("div.links2").fadeIn();
				$("div.news").css("display", "none");
				$("div.tutorials").css("display", "none");
				$("div.links").css("display", "none");
				$("div.links1").css("display", "none");
				$("div.links3").css("display", "none");
				
			break;
			
			case "links3":
				//change status & style menu
				$("#news").removeClass("active");
				$("#tutorials").removeClass("active");
				$("#links").removeClass("active");
				$("#links1").removeClass("active");
				$("#links2").removeClass("active");
				
				$("#links3").addClass("active");
				//display selected division, hide others
				$("div.links2").css("display", "none");
				$("div.news").css("display", "none");
				$("div.tutorials").css("display", "none");
				$("div.links").css("display", "none");
				$("div.links1").css("display", "none");
				$("div.links3").fadeIn();
				
			break;
		}
		//alert(e.target.id);
		return false;
	});
});