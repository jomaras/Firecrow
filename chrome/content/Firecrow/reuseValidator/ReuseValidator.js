FBL.ns(function() { with (FBL) {
// ************************************************************************************************
var fcModel = Firecrow.Interpreter.Model;
var fcCssSelectorParser = Firecrow.CssSelectorParser;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.ReuseValidator =
{
    validate: function(reuseAppModel, reuseAppDependencyGraph, reuseIntoAppModel, reuseIntoAppDependencyGraph, mergedModel, renameMap)
    {
        //The main idea is to execute the merged model with both events (with care about the renamings)
        //then to hook to each DOM modification and HTTP request and then study if they come from where they should
        //also hook on all errors, and notify about them
        mergedModel.eventTraces = this._updateEventTraces(reuseAppModel.eventTraces.concat(reuseIntoAppModel.eventTraces), renameMap);

        var reuseAppHtmlModifications = this._getModificationConstructsSortedByModificationPoints(reuseAppDependencyGraph.htmlNodes);
        var reuseIntoAppHtmlModifications = this._getModificationConstructsSortedByModificationPoints(reuseIntoAppDependencyGraph.htmlNodes);
        return;
        this._executeApplication(mergedModel, reuseAppHtmlModifications, reuseIntoAppHtmlModifications);
    },

    _executeApplication: function(mergedModel, reuseAppHtmlModifications, reuseIntoAppHtmlModifications)
    {
        var slicingCriteria = [Firecrow.DependencyGraph.SlicingCriterion.createModifyDomCriterion("*")];

        Firecrow.ASTHelper.setParentsChildRelationships(mergedModel);

        var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();
        Firecrow.DoppelBrowser.Browser.isForSlicing = true;
        var browser = new Firecrow.DoppelBrowser.Browser(mergedModel);
        Firecrow.Slicer.browser = browser;

        Firecrow.Interpreter.Simulator.DependencyCreator.shouldCreateDependencies = true;

        browser.registerSlicingCriteria(slicingCriteria);
        browser.registerNodeCreatedCallback(dependencyGraph.handleNodeCreated, dependencyGraph);
        browser.registerNodeInsertedCallback(dependencyGraph.handleNodeInserted, dependencyGraph);
        browser.registerDataDependencyEstablishedCallback(dependencyGraph.handleDataDependencyEstablished, dependencyGraph);
        browser.registerControlDependencyEstablishedCallback(dependencyGraph.handleControlDependencyEstablished, dependencyGraph);
        browser.registerImportantConstructReachedCallback(function(codeConstruct)
        {
            debugger;
        }, this);

        browser.evaluatePage();
    },

    _updateEventTraces: function(eventTraces, renameMap)
    {
        return eventTraces;
    },

    _getModificationConstructsSortedByModificationPoints: function(htmlNodes)
    {
        var allModificationPoints = [];

        for(var i = 0, length = htmlNodes.length; i < length; i++)
        {
            var htmlNode = htmlNodes[i];
            ValueTypeHelper.pushAll(allModificationPoints, htmlNode.model.domElement.elementModificationPoints);
        }

        for(var i = 0, length = allModificationPoints.length; i < length; i++)
        {
            for(var j = i + 1; j < length; j++)
            {
                if(allModificationPoints[i].evaluationPositionId.currentCommandId > allModificationPoints[j].evaluationPositionId.currentCommandId)
                {
                    var temp = allModificationPoints[i];

                    allModificationPoints[i] = allModificationPoints[j];
                    allModificationPoints[j] = temp;
                }
            }
        }

        var sortedConstructs = [];

        for(var i = 0, length = allModificationPoints.length; i < length; i++)
        {
            sortedConstructs.push(allModificationPoints[i].codeConstruct);
        }

        return sortedConstructs;
    }

};
// ************************************************************************************************
}});