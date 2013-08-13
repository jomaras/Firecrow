var FIRECROW_EXTERNAL_SOURCES = {test:3};

(function()
{
    var externalScripts = document.querySelectorAll("script");

    for(var i = 0; i < externalScripts.length; i++)
    {
        var externalScriptElement = externalScripts[i];

        if(externalScriptElement.src)
        {
            var xmlHttpRequest = new XMLHttpRequest();

            xmlHttpRequest.open("GET", externalScriptElement.src, false);
            xmlHttpRequest.send();

            FIRECROW_EXTERNAL_SOURCES[externalScriptElement.src] = xmlHttpRequest.responseText;
        }
    }
})();
