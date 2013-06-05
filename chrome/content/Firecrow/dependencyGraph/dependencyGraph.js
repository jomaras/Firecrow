FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    var ValueTypeHelper = Firecrow.ValueTypeHelper;
    var ASTHelper = Firecrow.ASTHelper;
    var Node = Firecrow.DependencyGraph.Node;

    var fcGraph = Firecrow.DependencyGraph;

    fcGraph.DependencyGraph = function()
    {
        this.nodes = [];

        this.htmlNodes = [];
        this.cssNodes = [];
        this.jsNodes = [];

        this.controlFlow = [];
        this.importantConstructDependencyIndexMapping = [];
        this.controlDependencies = [];
        this.breakContinueReturnEventsMapping = [];

        this.dependencyEdgesCounter = 0;
        this.inclusionFinder = new Firecrow.DependencyGraph.InclusionFinder();

        this.dependencyCallExpressionMapping = {};

        this.currentCallExpressions = [];
        this.currentCallExpressionsHardCopy = [];
    };

    var DependencyGraph = Firecrow.DependencyGraph.DependencyGraph;
    var dummy;

    DependencyGraph.notifyError = function(message) { alert("DependencyGraph - " + message); };
    DependencyGraph.log = [];
    DependencyGraph.shouldLog = false;

    DependencyGraph.prototype = dummy =
    {
        addNode: function(node)
        {
            if(!ValueTypeHelper.isOfType(node, Node)) { this.notifyError("Node is not of type DependencyGraph.Node!"); return; }

            this.nodes.push(node);

            if (node.type == "html") { this.htmlNodes.push(node); }
            else if (node.type == "css") { this.cssNodes.push(node); }
            else if (node.type == "js") { this.jsNodes.push(node); }
        },

        handleNodeCreated: function(nodeModelObject, type, isDynamic)
        {
            this.addNode(new Node(nodeModelObject, type, isDynamic));
        },

        handleNodeInserted: function(nodeModelObject, parentNodeModelObject, isDynamic)
        {
            if(nodeModelObject == null) { this.notifyError("nodeModelObject must not be null!"); return; }

            if(parentNodeModelObject != null)
            {
                nodeModelObject.graphNode.addStructuralDependency(parentNodeModelObject.graphNode, isDynamic);
            }
        },

        handleDataDependencyEstablished: function(sourceNodeModelObject, targetNodeModelObject, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency, isValueDependency)
        {
            if(sourceNodeModelObject == null || targetNodeModelObject == null) { return; }

            if(ValueTypeHelper.isArray(targetNodeModelObject))
            {
                for(var i = 0; i < targetNodeModelObject.length; i++)
                {
                    var edge = sourceNodeModelObject.graphNode.addDataDependency(targetNodeModelObject[i].graphNode, true, this.dependencyEdgesCounter++, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency);
                    edge.isValueDependency = isValueDependency;
                    sourceNodeModelObject.maxCreatedDependencyIndex = edge.index;
                    this._registerDependencyCallExpressionRelationship(edge);
                }
            }
            else
            {
                var edge = sourceNodeModelObject.graphNode.addDataDependency(targetNodeModelObject.graphNode, true, this.dependencyEdgesCounter++, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency);
                edge.isValueDependency = isValueDependency;
                sourceNodeModelObject.maxCreatedDependencyIndex = edge.index;
                this._registerDependencyCallExpressionRelationship(edge);
            }
        },

        handleControlDependencyEstablished: function(sourceNodeModelObject, targetNodeModelObject, dependencyCreationInfo, destinationNodeDependencyInfo, isPreviouslyExecutedBlockStatementDependency)
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

            var edge = sourceNodeModelObject.graphNode.addControlDependency
            (
                targetNodeModelObject.graphNode,
                true,
                this.dependencyEdgesCounter++,
                dependencyCreationInfo,
                destinationNodeDependencyInfo,
                false,
                isPreviouslyExecutedBlockStatementDependency
            );
            sourceNodeModelObject.maxCreatedDependencyIndex = edge.index;
            this._registerDependencyCallExpressionRelationship(edge);
        },

        _registerDependencyCallExpressionRelationship: function(edge)
        {
            this.dependencyCallExpressionMapping[edge.index] = this.currentCallExpressionsHardCopy;
        },

        handleControlFlowConnection: function(sourceNode)
        {
            //sourceNode.hasBeenExecuted = true;
        },

        handleImportantConstructReached: function(sourceNode)
        {
            var dataDependencies = sourceNode.graphNode.dataDependencies;
            this.importantConstructDependencyIndexMapping.push
            (
                {
                    codeConstruct: sourceNode,
                    dependencyIndex: dataDependencies.length > 0 ? dataDependencies[dataDependencies.length - 1].index : -1
                }
            );
        },

        handleBreakContinueReturnEventReached: function(sourceNode)
        {
            var dataDependencies = sourceNode.graphNode.dataDependencies;
            this.breakContinueReturnEventsMapping.push
            (
                {
                    codeConstruct: sourceNode,
                    dependencyIndex: dataDependencies.length > 0 ? dataDependencies[dataDependencies.length - 1].index : -1
                }
            );
        },

        handleEnterFunction: function(callExpression, functionConstruct)
        {
            if(callExpression == null) return;

            this.currentCallExpressions.push(callExpression);
            this.currentCallExpressionsHardCopy = this.currentCallExpressions.slice();
        },

        handleExitFunction: function()
        {
            this.currentCallExpressions.pop();
            this.currentCallExpressionsHardCopy = this.currentCallExpressions.slice();
        },

        markGraph: function(model, executionTrace)
        {
            try
            {
                this.previouslyExecutedBlockDependencies = [];

                this._traverseImportantDependencies(this.importantConstructDependencyIndexMapping);
                this._traverseHtmlNodeDependencies(this.htmlNodes);

                this._traverseExecutedBlockDependencies();
                this._traverseBreakContinueReturnEventsDependencies();

                var addedDependencies = this._traverseSliceUnionPossibleProblems(executionTrace);

                while(addedDependencies != 0)
                {
                    addedDependencies = this._traverseSliceUnionPossibleProblems(executionTrace);
                }

                Firecrow.DependencyGraph.DependencyPostprocessor.processHtmlElement(model);
            }
            catch(e)
            {
                debugger;
                this.notifyError("Error when marking graph: " + e);
            }
        },

        _traverseImportantDependencies: function(executionTrace)
        {
            for(var i = 0, length = executionTrace.length; i < length; i++)
            {
                var mapping = executionTrace[i];

                this._mainTraverseAndMark(mapping.codeConstruct, mapping.dependencyIndex, null, null);
            }
        },

        _traverseHtmlNodeDependencies: function(htmlNodes)
        {
            for(var i = 0, length = htmlNodes.length; i < length; i++)
            {
                var htmlModelNode =  htmlNodes[i].model;

                if(!htmlModelNode.shouldBeIncluded) { continue; }

                this._mainTraverseAndMark(htmlModelNode);
                this._markParentCssDependencies(htmlModelNode.domElement);
            }
        },

        _markParentCssDependencies: function(htmlDomNode)
        {
            if(htmlDomNode == null || htmlDomNode.parentNode == null
            || htmlDomNode.parentNode.modelElement == null || htmlDomNode.parentNode.modelElement.graphNode == null) { return; }

            var parentModelElement = htmlDomNode.parentNode.modelElement;
            var dependencies = parentModelElement.graphNode.dataDependencies;

            for(var i = 0; i < dependencies.length; i++)
            {
                var dependency = dependencies[i];

                if(dependency.destinationNode.type == "css")
                {
                    Firecrow.includeNode(dependency.destinationNode.model);
                }
            }

            this._markParentCssDependencies(parentModelElement.domElement);
        },

        _traverseExecutedBlockDependencies: function()
        {
            for(var i = 0, length = this.previouslyExecutedBlockDependencies.length; i < length; i++)
            {
                var blockDependency = this.previouslyExecutedBlockDependencies[i];
                //Because the dependency is added to the condition, and here, we want to traverse it
                //only if some of at least one sub-expression is already included in the previous phases
                if(this.inclusionFinder.isIncludedElement(blockDependency.codeConstruct.parent))
                {
                    this._mainTraverseAndMark(blockDependency.codeConstruct, blockDependency.maxDependencyIndex, blockDependency.dependencyConstraint, blockDependency.includedByNode);
                }
            }
        },

        _traverseBreakContinueReturnEventsDependencies: function()
        {
            for(var i = 0; i < this.breakContinueReturnEventsMapping.length; i++)
            {
                var mapping = this.breakContinueReturnEventsMapping[i];
                var parent = ASTHelper.getBreakContinueReturnImportantAncestor(mapping.codeConstruct);

                if(this.inclusionFinder.isIncludedElement(parent))
                {
                    this._mainTraverseAndMark(mapping.codeConstruct, mapping.maxDependencyIndex, null, null);
                }
            }
        },

        _traverseSliceUnionPossibleProblems: function(trace)
        {
            var addedDependencies = 0;

            if(trace == null) { return addedDependencies; }

            var previousIndexMapping = {};

            for(var i = 0; i < trace.length; i++)
            {
                var codeConstruct = trace[i].codeConstruct;

                if(!codeConstruct.shouldBeIncluded) { continue; }

                if(!this._areAllIncluded(this.dependencyCallExpressionMapping[trace[i].index])) { continue; }

                var dependencies = codeConstruct.graphNode.getSliceUnionImportantDependencies
                (
                    previousIndexMapping[codeConstruct.nodeId] || -1,
                    trace[i].index
                );

                addedDependencies += dependencies.length;

                for(var j = 0; j < dependencies.length; j++)
                {
                    var dependency = dependencies[j];

                    dependency.hasBeenTraversed = true;

                    this._traverseAndMark(dependency.destinationNode.model, dependency.index);
                }

                previousIndexMapping[codeConstruct.nodeId] = trace[i].index;
            }

            return addedDependencies;
        },

        _areAllIncluded: function(callExpressions)
        {
            if(callExpressions == null || callExpressions.length == 0) { return false; }

            for(var i = 0; i < callExpressions.length; i++)
            {
                if(!callExpressions[i].shouldBeIncluded) { return false; }
            }

            return true;
        },


        _includedMemberCallExpressionMap: {},

        _mainTraverseAndMark: function(codeConstruct, maxDependencyIndex, dependencyConstraint)
        {
            this._traverseAndMark(codeConstruct, maxDependencyIndex, dependencyConstraint);
        },

        _traverseAndMark: function(codeConstruct, maxDependencyIndex, dependencyConstraint)
        {
            Firecrow.includeNode(codeConstruct, maxDependencyIndex);

            if((ASTHelper.isMemberExpression(codeConstruct) || ASTHelper.isMemberExpression(codeConstruct.parent)
              || ASTHelper.isCallExpression(codeConstruct) || ASTHelper.isCallExpressionCallee(codeConstruct)))
            {
                this._includedMemberCallExpressionMap[codeConstruct.nodeId] = codeConstruct;
            }

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

                if(dependencyEdge.shouldNotFollowDependency)
                {
                    Firecrow.includeNode(dependencyEdge.destinationNode.model);
                    continue;
                }

                if(dependencyEdge.isPreviouslyExecutedBlockStatementDependency)
                {
                    this.previouslyExecutedBlockDependencies.push
                    ({
                        codeConstruct:dependencyEdge.destinationNode.model,
                        maxDependencyIndex: dependencyEdge.index,
                        dependencyConstraint: dependencyConstraintToFollow,
                        includedByNode:  dependencyEdge.sourceNode.model
                    });

                    continue;
                }

                this._traverseAndMark(dependencyEdge.destinationNode.model, dependencyEdge.index, dependencyConstraintToFollow, dependencyEdge.sourceNode.model);
            }
        },

        notifyError: function(message)
        {
            debugger;
            Firecrow.DependencyGraph.DependencyGraph.notifyError(message);
        }
    };
}});