$(document).ready(function(){
    /* Binding a click event handler to the links: */
    $('li.button a').click(function(e){

        /* Finding the drop down list that corresponds to the current section: */
        var dropDown = $(this).parent().next();

        /* Closing all other drop down sections, except the current one */
        $('.dropdown').not(dropDown).slideUp('slow');
        dropDown.stop(false,true).slideToggle('slow');

        /* Preventing the default event (which would be to navigate the browser to the link's address) */
        e.preventDefault();
    })

});