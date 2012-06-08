/**
 * User: Jomaras
 * Date: 06.06.12.
 * Time: 23:37
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
Firecrow.Interpreter.DependencyGenerator =
{
    generateDependencies: function(callbackFunction, thisValue)
    {
        var WebFile = Firecrow.DoppelBrowser.WebFile;
        var Browser = Firecrow.DoppelBrowser.Browser;
        var webFile = new WebFile("file:///C:/GitWebStorm/Firecrow/debug/testFiles/08/index.html");

        var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();
        var browser = new Browser(webFile, []);

        browser.registerNodeCreatedCallback(dependencyGraph.handleNodeCreated, dependencyGraph);
        browser.registerNodeInsertedCallback(dependencyGraph.handleNodeInserted, dependencyGraph);
        browser.registerDataDependencyEstablishedCallback(dependencyGraph.handleDataDependencyEstablished, dependencyGraph);

        browser.asyncBuildPage(function()
        {
            var allNodes = dependencyGraph.nodes;

            for(var i = 0, length = allNodes.length; i < length; i++)
            {
                var node = allNodes[i];
                var nodeModel = node.model;

                if(nodeModel.dependencies == null) { nodeModel.dependencies = [];}

                var edges = node.dataDependencies;

                for(var j = 0, depLength = edges.length; j < depLength; j++)
                {
                    var edge = edges[j];
                    var destinationModel = edge.destinationNode.model;

                    nodeModel.dependencies.push(destinationModel.nodeId);
                }
            }

            if(callbackFunction != null)
            {
                callbackFunction.call(thisValue, browser.model);
            }
        });
    }
}

/*************************************************************************************/
}});