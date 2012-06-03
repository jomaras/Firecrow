/**
 * User: Jomaras
 * Date: 29.05.12.
 * Time: 15:11
 */

var testObject = {};

HtmlModelMapping.models.forEach(function(model, index)
{
    testObject["test test" + index] = function()
    {
        var Firecrow = FBL.Firecrow;
        var WebFile = Firecrow.DoppelBrowser.WebFile;
        var Browser = Firecrow.DoppelBrowser.Browser;
        var webFile = new WebFile(model.url);

        var browser = new Browser(webFile, []);

        browser.syncBuildPage();

        var globalObjectProperties = browser.globalObject.properties;

        var errors = "";
        model.results.forEach(function(result)
        {
            for(var propName in result)
            {
                var hasBeenFound = false;
                for(var i = 0; i < globalObjectProperties.length; i++)
                {
                    var property = globalObjectProperties[i];
                    var propertyValue = property.value;

                    if(property.name == propName)
                    {
                        hasBeenFound = true;

                        if(propertyValue == null)
                        {
                            assertFalse(webFile.url + " : Property value: " + propName + " is null, and should be: " + result[propName], true);
                            break;
                        }

                        assertEquals(webFile.url + " : Property value: " + propName, propertyValue.value, result[propName]);

                        break;
                    }
                }

                if(!hasBeenFound) { assertFalse(webFile.url + " : Property value: " + propName + " has not been found",true); }
            }
        });
    };
});

TestCase("InterpreterTest", testObject);
