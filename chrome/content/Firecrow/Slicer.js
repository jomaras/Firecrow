/**
 * User: Jomaras
 * Date: 13.07.12.
 * Time: 08:06
 */
FBL.ns(function() { with (FBL) {
// ************************************************************************************************
Firecrow.Slicer = {
    slice: function(htmlModel, slicingCriteria)
    {
        var Firecrow = FBL.Firecrow;
        Firecrow.ASTHelper.setParentsChildRelationships(htmlModel);

        var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();
        var browser = new Firecrow.DoppelBrowser.Browser(htmlModel);

        browser.registerSlicingCriteria(slicingCriteria);
        browser.registerNodeCreatedCallback(dependencyGraph.handleNodeCreated, dependencyGraph);
        browser.registerNodeInsertedCallback(dependencyGraph.handleNodeInserted, dependencyGraph);
        browser.registerDataDependencyEstablishedCallback(dependencyGraph.handleDataDependencyEstablished, dependencyGraph);
        browser.registerControlDependencyEstablishedCallback(dependencyGraph.handleControlDependencyEstablished, dependencyGraph);
        browser.registerControlFlowConnectionCallback(dependencyGraph.handleControlFlowConnection, dependencyGraph);
        browser.registerImportantConstructReachedCallback(dependencyGraph.handleImportantConstructReached, dependencyGraph);

        browser.evaluatePage();
        browser.clean();

        dependencyGraph.markGraph(htmlModel.htmlElement);

        return browser;
    }
};
// ************************************************************************************************
}});