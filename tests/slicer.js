/**
 * User: Jomaras
 * Date: 16.06.12.
 * Time: 21:20
 */
var testObject = {};

var modelTestFunction = function(htmlModel, index)
{
    testObject["test " + testName + (index + 1)] = function()
    {
        var Firecrow = FBL.Firecrow;

        testObject.currentUrl = htmlModel.url;

        var slicingCriteria = htmlModel.results.map(function(result)
        {
            for(var propName in result)
            {
                return Firecrow.DependencyGraph.SlicingCriterion.createReadIdentifierCriterion(htmlModel.url, -1, propName);
            }
        });

        if(htmlModel.model.trackedElementsSelectors != null)
        {
            htmlModel.model.trackedElementsSelectors.forEach(function(selector)
            {
                slicingCriteria.push(Firecrow.DependencyGraph.SlicingCriterion.createModifyDomCriterion(selector));
            });
        }

        var returnResult = Firecrow.Slicer.slice(htmlModel.model, slicingCriteria, htmlModel.url);
        var browser = returnResult.browser;
        var globalObjectProperties = browser.globalObject.properties;

        htmlModel.results.forEach(function(result)
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
                            assertTrue(propName + " is null, and should be: " + result[propName] + "\n", false);
                            break;
                        }

                        if(propertyValue.value != result[propName])
                        {
                            assertTrue(propName + " does not match: " + result[propName] + " != " + propertyValue.value + "\n", false);
                        }

                        break;
                    }
                }

                if(!hasBeenFound)
                {
                    assertTrue(propName + " could not be found in global object!\n", false) ;
                }
            }
        });

        assertEquals(Firecrow.CodeTextGenerator.generateSlicedCode(htmlModel.model).replace(/(\r|\n| )+/g, ""), atob(htmlModel.slicingResult).replace(/(\r|\n| )+/g, ""));
    };
};

var testName = "slicing";
HtmlModelMapping.models.forEach(modelTestFunction);

testName = "dom";
DomHtmlModelMapping.models.forEach(modelTestFunction);

TestCase("SlicerTest", testObject);