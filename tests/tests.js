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

                var allPropsName = "";

                for(var i = 0; i < globalObjectProperties.length; i++)
                {
                    allPropsName += globalObjectProperties[i].name;
                }

                for(var i = 0; i < globalObjectProperties.length; i++)
                {
                    var property = globalObjectProperties[i];
                    var propertyValue = property.value;

                    if(property.name == propName)
                    {
                        hasBeenFound = true;

                        if(propertyValue == null)
                        {
                            fail(webFile.url + " : Property value: " + propName + " is null, and should be: " + result[propName]);
                            break;
                        }

                        assertEquals(webFile.url + " : Property value: " + propName, propertyValue.jsValue, result[propName]);

                        break;
                    }
                }

                if(!hasBeenFound) { fail(webFile.url + " : Property value: " + propName + " has not been found; allProps: " + allPropsName); }
            }
        });
    };
});

TestCase("InterpreterTest", testObject);
