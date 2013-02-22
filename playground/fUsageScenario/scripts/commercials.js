(function()
{
    var commercialImage = document.getElementById("commercialImage");
    var commercials = ["images/Google.jpg", "images/Bing.jpg", "images/yahoo.jpg"];
    var currentCommercialIndex = -1;
    window.setInterval(function()
    {
        currentCommercialIndex = (currentCommercialIndex + 1) % commercials.length;
        commercialImage.src = commercials[currentCommercialIndex];
    }, 5000);
})();
