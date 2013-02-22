(function()
{
    var commercialImage = document.getElementById("commercialImage");
    var commercials = ["images/Google.jpg", "images/Bing.jpg", "images/yahoo.jpg"];
    var currentCommercialIndex = -1;
    var buttons = document.querySelectorAll("#commercialSelectorContainer a");
    window.setInterval(function()
    {
        setCommercial((currentCommercialIndex + 1) % commercials.length)
    }, 5000);

    for(var i = 0; i < buttons.length; i++)
    {
        buttons[i].onclick = function()
        {
            setCommercial(getButtonIndex(this));
        };
    }

    function getButtonIndex(button)
    {
        for(var i = 0; i < buttons.length; i++)
        {
            if(buttons[i] == button)
            {
                return i;
            }
        }
    }

    function setCommercial(index)
    {
        commercialImage.src = commercials[index];

        selectButton(index);

        currentCommercialIndex = index;
    }

    function selectButton(buttonIndex)
    {
        for(var i = 0; i < buttons.length; i++)
        {
            buttons[i].className = "";
        }

        buttons[buttonIndex].className = "active";
    }
})();
