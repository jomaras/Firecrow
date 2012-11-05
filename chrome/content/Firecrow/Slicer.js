/**
 * User: Jomaras
 * Date: 13.07.12.
 * Time: 08:06
 */
FBL.ns(function() { with (FBL) {
// ************************************************************************************************
Firecrow.Slicer = {
    slice: function(htmlModel, slicingCriteria, url)
    {
        var Firecrow = FBL.Firecrow;
        Firecrow.ASTHelper.setParentsChildRelationships(htmlModel);

        var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();
        var browser = new Firecrow.DoppelBrowser.Browser(htmlModel);
        Firecrow.Slicer.browser = browser;
        browser.url = url;

        browser.registerSlicingCriteria(slicingCriteria);
        browser.registerNodeCreatedCallback(dependencyGraph.handleNodeCreated, dependencyGraph);
        browser.registerNodeInsertedCallback(dependencyGraph.handleNodeInserted, dependencyGraph);
        browser.registerDataDependencyEstablishedCallback(dependencyGraph.handleDataDependencyEstablished, dependencyGraph);
        browser.registerControlDependencyEstablishedCallback(dependencyGraph.handleControlDependencyEstablished, dependencyGraph);
        browser.registerControlFlowConnectionCallback(dependencyGraph.handleControlFlowConnection, dependencyGraph);
        browser.registerImportantConstructReachedCallback(dependencyGraph.handleImportantConstructReached, dependencyGraph);
        browser.registerBreakContinueReturnEventReached(dependencyGraph.handleBreakContinueReturnEventReached, dependencyGraph);

        browser.evaluatePage();
        browser.clean();

        dependencyGraph.markGraph(htmlModel.htmlElement);

        return {
            browser: browser,
            dependencyGraph: dependencyGraph
        }
    }
};
// ************************************************************************************************
}});