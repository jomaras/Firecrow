$(function () {
    $('.error').hide();
    $('input.text-input').css({
        backgroundColor: "#FFFFFF"
    });
    $('input.text-input').focus(function () {
        $(this).css({
            backgroundColor: "#FFDDAA"
        });
    });
    $('input.text-input').blur(function () {
        $(this).css({
            backgroundColor: "#FFFFFF"
        });
    });

    $(".sendButton").click(function () {
        // validate and process form
        // first hide any error messages
        $('.error').hide();

        var email = $("input#email").val();
        if (email == "" || !(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email))) {
            $("span.error").show();
            $("input#email").focus();
            return false;
        }

        var dataString = 'email=' + email;
        //alert (dataString);return false;

        $.ajax({
            type: "POST",
            url: "bin/process.php",
            data: dataString,
            success: function () {
                $('#contact_form').html("<div id='smartLoader'></div>");
                $('#smartLoader').html("")
                    .append("")
                    .hide()
                    .fadeIn(1500, function () {
                    $('#smartLoader').append("<div id='allDone'></div>");
                });
            }
        });
        return false;
    });
});