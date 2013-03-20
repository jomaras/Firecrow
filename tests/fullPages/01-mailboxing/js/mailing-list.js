/*///////////////////////////////////////////////////////////////////////
Ported to jquery from prototype by Joel Lisenby (joel.lisenby@gmail.com)
http://joellisenby.com

original prototype code by Aarron Walter (aarron@buildingfindablewebsites.com)
http://buildingfindablewebsites.com

Distrbuted under Creative Commons license
http://creativecommons.org/licenses/by-sa/3.0/us/
///////////////////////////////////////////////////////////////////////*/

$(document).ready(function() {
	$('#signup').submit(function() {
		// update user interface
		$('.response').html('<img src="images/loader.gif" />');
		
		var email = $("#email").val();
		
		// Prepare query string and send AJAX request
		$.ajax({
			url: 'inc/store-address.php',
			data: 'ajax=true&email=' + escape(email),
			success: function(msg) {
				$('.response').html(msg);
			}
		
		});
		
		return false;
	});
});