var FIRECROW_EXTERNAL_SOURCES = {test:3};

(function()
{
    var iFrame = document.querySelector("iframe");
    var externalCodeElements = iFrame.contentDocument.querySelectorAll("script, link[rel=stylesheet]");

    for(var i = 0; i < externalCodeElements.length; i++)
    {
        var externalCodeElement = externalCodeElements[i];
        var path = externalCodeElement.src || externalCodeElement.href;

        if(path)
        {
            var xmlHttpRequest = new XMLHttpRequest();

            xmlHttpRequest.open("GET", path, false);
            xmlHttpRequest.send();

            FIRECROW_EXTERNAL_SOURCES[path] = xmlHttpRequest.responseText;
        }
    }
})();
