/**
 * User: Jomaras
 * Date: 16.06.12.
 * Time: 21:20
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
        var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();

        var browser = new Browser(webFile, []);
        browser.registerNodeCreatedCallback(dependencyGraph.handleNodeCreated, dependencyGraph);
        browser.registerNodeInsertedCallback(dependencyGraph.handleNodeInserted, dependencyGraph);
        browser.registerDataDependencyEstablishedCallback(dependencyGraph.handleDataDependencyEstablished, dependencyGraph);
        browser.registerControlFlowConnectionCallback(dependencyGraph.handleControlFlowConnection, dependencyGraph);
        browser.registerImportantConstructReachedCallback(dependencyGraph.handleImportantConstructReached, dependencyGraph);
        browser.registerSlicingCriteria(model.results.map(function(result)
        {
            for(var propName in result)
            {
                return Firecrow.DependencyGraph.SlicingCriterion.createReadIdentifierCriterion(webFile.url, -1, propName);
            }
        }));

        browser.syncBuildPage();

        dependencyGraph.markGraph(model.model.htmlElement);

        assertEquals(Firecrow.CodeTextGenerator.generateSlicedCode(model.model), atob(model.slicingResult));
    };
});

TestCase("SlicerTest", testObject);