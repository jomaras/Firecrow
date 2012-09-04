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
    this.breakContinueReturnEventsMapping = [];

    this.dependencyEdgesCounter = 0;
    this.inculsionFinder = new Firecrow.DependencyGraph.InclusionFinder();
};

var DependencyGraph = Firecrow.DependencyGraph.DependencyGraph;

DependencyGraph.notifyError = function(message) { alert("DependencyGraph - " + message); };
DependencyGraph.log = "";
DependencyGraph.shouldLog = false;

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

DependencyGraph.prototype.handleDataDependencyEstablished = function(sourceNodeModelObject, targetNodeModelObject, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency)
{
    try
    {
        if(sourceNodeModelObject == null || targetNodeModelObject == null) { return; }

        if(ValueTypeHelper.isArray(targetNodeModelObject))
        {
            for(var i = 0; i < targetNodeModelObject.length; i++)
            {
                sourceNodeModelObject.graphNode.addDataDependency(targetNodeModelObject[i].graphNode, true, this.dependencyEdgesCounter++, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency);
            }
        }
        else
        {
            sourceNodeModelObject.graphNode.addDataDependency(targetNodeModelObject.graphNode, true, this.dependencyEdgesCounter++, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency);
        }
    }
    catch(e)
    {
        this.notifyError("Error when handling data dependency established: " + e);
    }
};

DependencyGraph.prototype.handleControlDependencyEstablished = function(sourceNodeModelObject, targetNodeModelObject, dependencyCreationInfo, destinationNodeDependencyInfo, isPreviouslyExecutedBlockStatementDependency)
{
    try
    {
        if(sourceNodeModelObject == null || targetNodeModelObject == null) { return; }

        if(dependencyCreationInfo != null && dependencyCreationInfo.isReturnDependency)
        {
            var enterFunctionPoints = sourceNodeModelObject.graphNode.enterFunctionPoints;
            if(enterFunctionPoints != null)
            {
                dependencyCreationInfo.callDependencyMaxIndex = enterFunctionPoints[enterFunctionPoints.length - 1].lastDependencyIndex;
            }
        }

        sourceNodeModelObject.graphNode.addControlDependency
        (
            targetNodeModelObject.graphNode,
            true,
            this.dependencyEdgesCounter++,
            dependencyCreationInfo,
            destinationNodeDependencyInfo,
            false,
            isPreviouslyExecutedBlockStatementDependency
        );
    }
    catch(e)
    {
        this.notifyError("Error when handling data dependency established: " + e);
    }
};

DependencyGraph.prototype.handleControlFlowConnection = function(sourceNode)
{
    //sourceNode.hasBeenExecuted = true;
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

DependencyGraph.prototype.handleBreakContinueReturnEventReached = function(sourceNode)
{
    try
    {
        var dataDependencies = sourceNode.graphNode.dataDependencies;
        this.breakContinueReturnEventsMapping.push
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
        this.previouslyExecutedBlockDependencies = [];

        for(var i = 0, length = importantConstructDependencyIndexMapping.length; i < length; i++)
        {
            var mapping = importantConstructDependencyIndexMapping[i];

            //TODO - remove this way of handling break and continue,
            //do them like return from event handlers
            if(ASTHelper.isBreakStatement(mapping.codeConstruct)
            || ASTHelper.isContinueStatement(mapping.codeConstruct))
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

        var inclusionFinder = new Firecrow.DependencyGraph.InclusionFinder();

        for(var i = 0; i < this.previouslyExecutedBlockDependencies.length; i++)
        {
            var blockDependency = this.previouslyExecutedBlockDependencies[i];
            //Because the dependency is added to the condition, and here, we want to traverse it
            //only if some of at least one sub-expression is already included in the previous phases
            if(inclusionFinder.isIncludedElement(blockDependency.codeConstruct.parent))
            {
                this.traverseAndMark(blockDependency.codeConstruct, blockDependency.maxDependencyIndex, blockDependency.dependencyConstraint, blockDependency.includedByNode);
            }
        }

        for(var i = 0; i < this.breakContinueReturnEventsMapping.length; i++)
        {
            var mapping = this.breakContinueReturnEventsMapping[i];

            if(ASTHelper.isReturnStatement(mapping.codeConstruct))
            {
                var functionParent = ASTHelper.getFunctionParent(mapping.codeConstruct);

                if(inclusionFinder.isIncludedElement(functionParent))
                {
                    this.traverseAndMark(mapping.codeConstruct, mapping.maxDependencyIndex, null, null)
                }
            }
            else
            {
                alert("Still not handling other break continue in this way");
            }
        }

        var postProcessor = new Firecrow.DependencyGraph.DependencyPostprocessor();
        postProcessor.processHtmlElement(model);
    }
    catch(e) { this.notifyError("Error occurred when marking graph:" + e);}
};

DependencyGraph.prototype.traverseAndMark = function(codeConstruct, maxDependencyIndex, dependencyConstraint, includedByNode)
{
    try
    {
        codeConstruct.shouldBeIncluded = true;
        codeConstruct.inclusionDependencyConstraint = dependencyConstraint;

        if(codeConstruct.loc != null && codeConstruct.loc.start.line == 818)
        {
            var a = 3;
        }

        /*if(DependencyGraph.shouldLog && codeConstruct.loc != null && codeConstruct.loc.start.line == 3968)
        {
            var a = 3;
        }

        if(DependencyGraph.shouldLog)
        {
            if(codeConstruct.loc != null)
            {
                DependencyGraph.log += codeConstruct.loc.start.line + ";";
            }
        }*/

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

            if(dependencyEdge.shouldNotFollowDependency)
            {
                dependencyEdge.destinationNode.model.shouldBeIncluded = true;
                continue;
            }

            if(dependencyEdge.isPreviouslyExecutedBlockStatementDependency)
            {
                this.previouslyExecutedBlockDependencies.push(
                {
                    codeConstruct:dependencyEdge.destinationNode.model,
                    maxDependencyIndex: dependencyEdge.index,
                    dependencyConstraint: dependencyConstraintToFollow,
                    includedByNode:  dependencyEdge.sourceNode.model
                });

                continue;
            }

            this.traverseAndMark(dependencyEdge.destinationNode.model, dependencyEdge.index, dependencyConstraintToFollow, dependencyEdge.sourceNode.model);
        }
    }
    catch(e) { this.notifyError("Error occurred when traversing and marking the graph: " + e);}
};

DependencyGraph.prototype.notifyError = function(message) { Firecrow.DependencyGraph.DependencyGraph.notifyError(message);}
}});