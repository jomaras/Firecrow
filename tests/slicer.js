/**
 * User: Jomaras
 * Date: 16.06.12.
 * Time: 21:20
 */
var testObject = {};

HtmlModelMapping.models.forEach(function(htmlModel, index)
{
    testObject["test test" + (index + 1)] = function()
    {
        var Firecrow = FBL.Firecrow;
        var WebFile = Firecrow.DoppelBrowser.WebFile;
        var Browser = Firecrow.DoppelBrowser.Browser;
        var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();

        Firecrow.Slicer.slice(htmlModel.model, htmlModel.results.map(function(result)
        {
            for(var propName in result)
            {
                return Firecrow.DependencyGraph.SlicingCriterion.createReadIdentifierCriterion(htmlModel.url, -1, propName);
            }
        }));

        assertEquals(Firecrow.CodeTextGenerator.generateSlicedCode(htmlModel.model), atob(htmlModel.slicingResult));
    };
});

TestCase("SlicerTest", testObject);