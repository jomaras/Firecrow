/**
 * User: Jomaras
 * Date: 13.07.12.
 * Time: 08:06
 */
FBL.ns(function() { with (FBL) {
// ************************************************************************************************
    Firecrow.Slicer = {
        slice: function(htmlModel, slicingCriteria, url, executeRegisteredEvents, doNotFixSliceUnionProblems)
        {
            var Firecrow = FBL.Firecrow;
            Firecrow.ASTHelper.setParentsChildRelationships(htmlModel);

            var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();
            Firecrow.DoppelBrowser.Browser.isForSlicing = true;
            var browser = new Firecrow.DoppelBrowser.Browser(htmlModel);
            Firecrow.Slicer.browser = browser;
            browser.url = url || htmlModel.pageUrl;

            Firecrow.Interpreter.Simulator.DependencyCreator.shouldCreateDependencies = true;

            browser.registerSlicingCriteria(slicingCriteria);
            browser.registerNodeCreatedCallback(dependencyGraph.handleNodeCreated, dependencyGraph);
            browser.registerNodeInsertedCallback(dependencyGraph.handleNodeInserted, dependencyGraph);
            browser.registerDataDependencyEstablishedCallback(dependencyGraph.handleDataDependencyEstablished, dependencyGraph);
            browser.registerControlDependencyEstablishedCallback(dependencyGraph.handleControlDependencyEstablished, dependencyGraph);
            browser.registerImportantConstructReachedCallback(dependencyGraph.handleImportantConstructReached, dependencyGraph);
            browser.registerBreakContinueReturnEventReached(dependencyGraph.handleBreakContinueReturnEventReached, dependencyGraph);
            browser.registerEnterFunctionCallback(dependencyGraph.handleEnterFunction, dependencyGraph);
            browser.registerExitFunctionCallback(dependencyGraph.handleExitFunction, dependencyGraph);
            browser.registerCallbackCalled(dependencyGraph.handleCallbackCalled, dependencyGraph);
            browser.registerExpressionEvaluatedCallback(dependencyGraph.handleExpressionEvaluated, dependencyGraph);
            browser.registerCallbackStartedExecuting(dependencyGraph.handleCallbackStartedExecuting, dependencyGraph);
            browser.registerCallbackStoppedExecuting(dependencyGraph.handleCallbackStoppedExecuting, dependencyGraph);

            browser.evaluatePage();

            if(executeRegisteredEvents)
            {
                browser.executeLoadingEvents();
                browser.executeTimingEvents();
            }

            Firecrow.DependencyGraph.DependencyGraph.sliceUnions = false;
            if(doNotFixSliceUnionProblems)
            {
                Firecrow.DependencyGraph.DependencyGraph.sliceUnions = false;
            }

            dependencyGraph.markGraph(htmlModel.htmlElement);

            return {
                browser: browser,
                dependencyGraph: dependencyGraph
            };
        },

        profile: function(htmlModel, url, executeRegisteredEvents)
        {
            var Firecrow = FBL.Firecrow;

            Firecrow.ASTHelper.setParentsChildRelationships(htmlModel);

            var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();
            Firecrow.DoppelBrowser.Browser.isForSlicing = true;
            var browser = new Firecrow.DoppelBrowser.Browser(htmlModel);
            Firecrow.Slicer.browser = browser;
            browser.url = url || htmlModel.pageUrl;

            Firecrow.Interpreter.Simulator.DependencyCreator.shouldCreateDependencies = false;

            browser.evaluatePage();

            if(executeRegisteredEvents)
            {
                browser.executeLoadingEvents();
                browser.executeTimingEvents();
            }

            return {
                browser: browser,
                dependencyGraph: dependencyGraph
            };
        },

        getSlicedCode: function(htmlModel, slicingCriteria, url)
        {
            this.slice(htmlModel, slicingCriteria, url);

            return FBL.Firecrow.CodeTextGenerator.generateSlicedCode(htmlModel);
        }
    };
// ************************************************************************************************
}});