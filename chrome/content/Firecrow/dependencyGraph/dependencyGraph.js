/**
 * User: Jomaras
 * Date: 03.05.12.
 * Time: 13:44
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var Node = Firecrow.DependencyGraph.Node;

Firecrow.DependencyGraph.DependencyGraph = function()
{
    this.nodes = [];
    this.controlFlow = [];
    this.importantConstructDependencyIndexMapping = [];

    this.dataFlowEdgesCounter = 0;
};

var DependencyGraph = Firecrow.DependencyGraph.DependencyGraph;

DependencyGraph.prototype.addNode = function(node)
{
    if(!ValueTypeHelper.isOfType(node, Node)) { alert("DependencyGraph.DependencyGraph: node is not of type DependencyGraph.Node!"); }

    this.nodes.push(node);
};

DependencyGraph.prototype.handleNodeCreated = function(nodeModelObject, type, isDynamic)
{
    this.addNode(new Node(nodeModelObject, type, isDynamic));
};

DependencyGraph.prototype.handleNodeInserted = function(nodeModelObject, parentNodeModelObject, isDynamic)
{
    if(nodeModelObject == null) { alert("DependencyGraph.DependencyGraph nodeModelObject must not be null!"); return; }

    if(parentNodeModelObject != null)
    {
        nodeModelObject.graphNode.addStructuralDependency(parentNodeModelObject.graphNode, isDynamic);
    }
};

DependencyGraph.prototype.handleDataDependencyEstablished = function(sourceNodeModelObject, targetNodeModelObject, generatingCommandId)
{
    if(sourceNodeModelObject == null || targetNodeModelObject == null) { return; }

    sourceNodeModelObject.graphNode.addDataDependency(targetNodeModelObject.graphNode, true, this.dataFlowEdgesCounter++, generatingCommandId);
};

DependencyGraph.prototype.handleControlFlowConnection = function(sourceNode)
{
    /*if(ASTHelper.isVariableDeclarator(sourceNode))
    {
        sourceNode.id.hasBeenExecuted = true;
    }*/

    sourceNode.hasBeenExecuted = true;
    this.controlFlow.push(sourceNode);
};

DependencyGraph.prototype.handleImportantConstructReached = function(sourceNode)
{
    try
    {
        var dataDependencies = sourceNode.graphNode.dataDependencies;
        this.importantConstructDependencyIndexMapping.push
        (
            {
                codeConstruct: sourceNode,
                dependencyIndex: dataDependencies.length > 0 ? dataDependencies[dataDependencies.length - 1].index : -1
            }
        )
    }
    catch(e){ this.notifyError("Error when handling important construct reached:" + e);}
};

DependencyGraph.prototype.markGraph = function(model)
{
    try
    {
        var importantConstructDependencyIndexMapping = this.importantConstructDependencyIndexMapping;
        for(var i = 0, length = importantConstructDependencyIndexMapping.length; i < length; i++)
        {
            var mapping = importantConstructDependencyIndexMapping[i];

            this.traverseAndMark(mapping.codeConstruct, mapping.dependencyIndex);
        }

        var postProcessor = new Firecrow.DependencyGraph.DependencyPostprocessor();
        postProcessor.processHtmlElement(model);
    }
    catch(e) { this.notifyError("Error occurred when marking graph:" + e);}
};

DependencyGraph.prototype.traverseAndMark = function(codeConstruct, maxDependencyIndex)
{
    try
    {
        codeConstruct.shouldBeIncluded = true;

        var dependencyEdgesToFollow = codeConstruct.graphNode.getDataDependencyEdgesIndexedLessOrEqualTo(maxDependencyIndex);

        for(var i = 0, length = dependencyEdgesToFollow.length; i < length; i++)
        {
            var dependencyEdgeToFollow = dependencyEdgesToFollow[i];

            //This is ok because the whole group is traversed together
            if(dependencyEdgeToFollow.hasBeenTraversed) { return; }

            dependencyEdgeToFollow.hasBeenTraversed = true;

            this.traverseAndMark(dependencyEdgeToFollow.destinationNode.model, dependencyEdgeToFollow.index);
        }
    }
    catch(e) { this.notifyError("Error occurred when traversing and marking the graph: " + e);}
};

DependencyGraph.prototype.notifyError = function(message) { alert("DependencyGraph - :" + message);}
}});