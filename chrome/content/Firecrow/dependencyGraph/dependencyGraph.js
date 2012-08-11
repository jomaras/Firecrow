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
    this.controlDependencies = [];

    this.dependencyEdgesCounter = 0;
    this.inculsionFinder = new Firecrow.DependencyGraph.InclusionFinder();
};

var DependencyGraph = Firecrow.DependencyGraph.DependencyGraph;

DependencyGraph.notifyError = function(message) { alert("DependencyGraph - " + message); };

DependencyGraph.prototype.addNode = function(node)
{
    if(!ValueTypeHelper.isOfType(node, Node)) { this.notifyError("Node is not of type DependencyGraph.Node!"); }

    this.nodes.push(node);
};

DependencyGraph.prototype.handleNodeCreated = function(nodeModelObject, type, isDynamic)
{
    this.addNode(new Node(nodeModelObject, type, isDynamic));
};

DependencyGraph.prototype.handleNodeInserted = function(nodeModelObject, parentNodeModelObject, isDynamic)
{
    if(nodeModelObject == null) { this.notifyError("nodeModelObject must not be null!"); return; }

    if(parentNodeModelObject != null)
    {
        nodeModelObject.graphNode.addStructuralDependency(parentNodeModelObject.graphNode, isDynamic);
    }
};

DependencyGraph.prototype.handleDataDependencyEstablished = function(sourceNodeModelObject, targetNodeModelObject, dependencyCreationInfo, destinationNodeDependencyInfo)
{
    try
    {
        if(sourceNodeModelObject == null || targetNodeModelObject == null) { return; }

        if(ValueTypeHelper.isArray(targetNodeModelObject))
        {
            for(var i = 0; i < targetNodeModelObject.length; i++)
            {
                sourceNodeModelObject.graphNode.addDataDependency(targetNodeModelObject[i].graphNode, true, this.dependencyEdgesCounter++, dependencyCreationInfo, destinationNodeDependencyInfo);
            }
        }
        else
        {
            sourceNodeModelObject.graphNode.addDataDependency(targetNodeModelObject.graphNode, true, this.dependencyEdgesCounter++, dependencyCreationInfo, destinationNodeDependencyInfo);
        }
    }
    catch(e)
    {
        this.notifyError("Error when handling data dependency established: " + e);
    }
};

DependencyGraph.prototype.handleControlDependencyEstablished = function(sourceNodeModelObject, targetNodeModelObject, dependencyCreationInfo, destinationNodeDependencyInfo)
{
    try
    {
        if(sourceNodeModelObject == null || targetNodeModelObject == null) { return; }

        if(dependencyCreationInfo != null && dependencyCreationInfo.isReturnDependency)
        {
            var lastDependency = sourceNodeModelObject.graphNode.dataDependencies[sourceNodeModelObject.graphNode.dataDependencies.length - 1];
            if(lastDependency != null)
            {
                dependencyCreationInfo.callDependencyMaxIndex = lastDependency.callDependencyMaxIndex == null ? lastDependency.index
                                                                                                              : lastDependency.callDependencyMaxIndex;
            }
        }

        sourceNodeModelObject.graphNode.addControlDependency
        (
            targetNodeModelObject.graphNode,
            true,
            this.dependencyEdgesCounter++,
            dependencyCreationInfo,
            destinationNodeDependencyInfo
        );
    }
    catch(e)
    {
        this.notifyError("Error when handling data dependency established: " + e);
    }
};

DependencyGraph.prototype.handleControlFlowConnection = function(sourceNode)
{
    sourceNode.hasBeenExecuted = true;
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
        );
    }
    catch(e){ this.notifyError("Error when handling important construct reached:" + e);}
};

DependencyGraph.prototype.markGraph = function(model)
{
    try
    {
        var importantConstructDependencyIndexMapping = this.importantConstructDependencyIndexMapping;
        var breakContinueMapping = [];
        for(var i = 0, length = importantConstructDependencyIndexMapping.length; i < length; i++)
        {
            var mapping = importantConstructDependencyIndexMapping[i];

            if(ASTHelper.isBreakStatement(mapping.codeConstruct) || ASTHelper.isContinueStatement(mapping.codeConstruct))
            {
                breakContinueMapping.push(mapping);
            }
            else
            {
                this.traverseAndMark(mapping.codeConstruct, mapping.dependencyIndex, null, null);
            }
        }

        for(var i = 0, length = breakContinueMapping.length; i < length; i++)
        {
            var mapping = breakContinueMapping[i];

            var parent = ASTHelper.isBreakStatement(mapping.codeConstruct) ? ASTHelper.getLoopOrSwitchParent(mapping.codeConstruct)
                                                                           : ASTHelper.getLoopParent(mapping.codeConstruct);

            if(this.inculsionFinder.isIncludedElement(parent))
            {
                this.traverseAndMark(mapping.codeConstruct, mapping.dependencyIndex, null, null);
            }
        }

        var postProcessor = new Firecrow.DependencyGraph.DependencyPostprocessor();
        postProcessor.processHtmlElement(model);
    }
    catch(e) { this.notifyError("Error occurred when marking graph:" + e);}
};

_GLOBAL_HELPER = [];

DependencyGraph.prototype.traverseAndMark = function(codeConstruct, maxDependencyIndex, dependencyConstraint, includedByNode)
{
    try
    {
        if(codeConstruct.nodeId == 33)
        {
            var a = 3;
        }
/*        if(includedByNode != null)
        {
            if(includedByNode.includesNodes == null) { includedByNode.includesNodes = []; }
            includedByNode.includesNodes.push(codeConstruct);
        }

        if(codeConstruct.includedByNodes == null) { codeConstruct.includedByNodes = [];}
        codeConstruct.includedByNodes.push(includedByNode);*/

        if(codeConstruct.loc != null && codeConstruct.loc.start.line == 55)
        {
            var a = 3;
        }

        codeConstruct.shouldBeIncluded = true;
        codeConstruct.inclusionDependencyConstraint = dependencyConstraint;

        var potentialDependencyEdges = codeConstruct.graphNode.getDependencies(maxDependencyIndex, dependencyConstraint);

        for(var i = potentialDependencyEdges.length - 1; i >= 0; i--)
        {
            var dependencyEdge = potentialDependencyEdges[i];

            if(dependencyEdge.hasBeenTraversed) { continue; }

            dependencyEdge.hasBeenTraversed = true;

            var dependencyConstraintToFollow = dependencyConstraint;

            if(dependencyConstraintToFollow == null){ dependencyConstraintToFollow = dependencyEdge.destinationNodeDependencyConstraints; }
            else if(dependencyEdge.destinationNodeDependencyConstraints.currentCommandId < dependencyConstraint.currentCommandId)
            {
                dependencyConstraintToFollow = dependencyEdge.destinationNodeDependencyConstraints;
            }
            else if (dependencyEdge.isReturnDependency || dependencyEdge.shouldAlwaysBeFollowed)
            {
                dependencyConstraintToFollow = dependencyEdge.destinationNodeDependencyConstraints;
            }

            this.traverseAndMark(dependencyEdge.destinationNode.model, dependencyEdge.index, dependencyConstraintToFollow, dependencyEdge.sourceNode.model);
        }
    }
    catch(e) { this.notifyError("Error occurred when traversing and marking the graph: " + e);}
};

DependencyGraph.prototype.notifyError = function(message) { Firecrow.DependencyGraph.DependencyGraph.notifyError(message);}
}});