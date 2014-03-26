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
        this.dynamicNodes = [];

        this.controlFlow = [];
        this.importantConstructDependencyIndexMapping = [];
        this.controlDependencies = [];
        this.breakContinueReturnEventsMapping = [];

        this.dependencyEdgesCounter = 0;
        this.inclusionFinder = new Firecrow.DependencyGraph.InclusionFinder();

        this.dependencyCallExpressionMapping = {};

        this.currentCallExpressions = [];
        this.currentCallExpressionsHardCopy = [];

        this.executionContextIndexMap = {};
        this.executionContextIdStack = [];
        this.pushExecutionContextId("root");
        this.traversedEdgesMap = {};
        this.expressionTrace = [];
    };

    var DependencyGraph = Firecrow.DependencyGraph.DependencyGraph;
    var dummy;

    DependencyGraph.notifyError = function(message) { alert("DependencyGraph - " + message); };
    DependencyGraph.log = [];
    DependencyGraph.shouldLog = false;
    DependencyGraph.sliceUnions = true;
    DependencyGraph.noOfSlicingCriteria = 0;
    DependencyGraph.sliceUnionProblematicExpressions = [];

    DependencyGraph.prototype = dummy =
    {
        getSimplified: function()
        {
            var simplifiedDependencyGraph = { htmlNodes:[], cssNodes:[], jsNodes:[] };

            for(var i = 0; i < this.htmlNodes.length; i++)
            {
                simplifiedDependencyGraph.htmlNodes.push(this.htmlNodes[i].getSimplified());
            }

            for(var i = 0; i < this.cssNodes.length; i++)
            {
                simplifiedDependencyGraph.cssNodes.push(this.cssNodes[i].getSimplified());
            }

            for(var i = 0; i < this.jsNodes.length; i++)
            {
                simplifiedDependencyGraph.jsNodes.push(this.jsNodes[i].getSimplified());
            }

            return simplifiedDependencyGraph;
        },

        addNode: function(node)
        {
            if(!ValueTypeHelper.isOfType(node, Node)) { this.notifyError("Node is not of type DependencyGraph.Node!"); return; }

            this.nodes.push(node);

                 if (node.type == "html") { this.htmlNodes.push(node); }
            else if (node.type == "css") { this.cssNodes.push(node); }
            else if (node.type == "js") { this.jsNodes.push(node); }
        },

        pushExecutionContextId: function(executionContextId)
        {
            this.executionContextId = executionContextId;
            this.executionContextIdStack.push(executionContextId);

            if(this.executionContextIndexMap[this.executionContextId] == null) { this.executionContextIndexMap[this.executionContextId] = []; }
        },

        popExecutionContextId: function()
        {
            this.executionContextIdStack.pop();
            this.executionContextId = this.executionContextIdStack[this.executionContextIdStack.length-1];
        },

        handleExpressionEvaluated: function(codeConstruct)
        {
            this.expressionTrace.push
            ({
                codeConstruct: codeConstruct,
                dependencyIndex: codeConstruct.maxCreatedDependencyIndex,
                executionContextId: this.executionContextId
            });
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
            if(targetNodeModelObject.isEvalCreatedNode)
            {
                this.handleDataDependencyEstablished(sourceNodeModelObject, targetNodeModelObject.evalConstruct, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency, isValueDependency)
            }
            if(ValueTypeHelper.isArray(targetNodeModelObject))
            {
                for(var i = 0; i < targetNodeModelObject.length; i++)
                {
                    var edge = sourceNodeModelObject.graphNode.addDataDependency(targetNodeModelObject[i].graphNode, true, this.dependencyEdgesCounter++, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency);
                    edge.isValueDependency = isValueDependency;
                    sourceNodeModelObject.maxCreatedDependencyIndex = edge.index;

                    if(DependencyGraph.sliceUnions) {  this._registerDependencyCallExpressionRelationship(edge); }

                    this.executionContextIndexMap[this.executionContextId].push(edge.index);
                    edge.executionContextId = this.executionContextId;
                }
            }
            else
            {
                var edge = sourceNodeModelObject.graphNode.addDataDependency(targetNodeModelObject.graphNode, true, this.dependencyEdgesCounter++, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency);
                edge.isValueDependency = isValueDependency;
                sourceNodeModelObject.maxCreatedDependencyIndex = edge.index;

                if(DependencyGraph.sliceUnions) {  this._registerDependencyCallExpressionRelationship(edge); }

                this.executionContextIndexMap[this.executionContextId].push(edge.index);
                edge.executionContextId = this.executionContextId;
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

            this.executionContextIndexMap[this.executionContextId].push(edge.index);
            edge.executionContextId = this.executionContextId;
        },

        _registerDependencyCallExpressionRelationship: function(edge)
        {
            this.dependencyCallExpressionMapping[edge.index] = this.currentCallExpressionsHardCopy;
        },

        handleCallbackCalled: function(callbackConstruct, callCallbackConstruct, evaluationPosition)
        {
            if(this.callbackExecutionMap[callbackConstruct.nodeId] == null)
            {
                this.callbackExecutionMap[callbackConstruct.nodeId] =
                {
                    callbackConstruct: callbackConstruct,
                    callCallbackMap: {}
                }
            }

            if(this.callbackExecutionMap[callbackConstruct.nodeId].callCallbackMap[callCallbackConstruct.nodeId] == null)
            {
                this.callbackExecutionMap[callbackConstruct.nodeId].callCallbackMap[callCallbackConstruct.nodeId] =
                {
                    callCallbackConstruct: callCallbackConstruct,
                    evaluationPositions: []
                };
            }

            this.callbackExecutionMap[callbackConstruct.nodeId].callCallbackMap[callCallbackConstruct.nodeId].evaluationPositions.push(evaluationPosition);
        },

        callbackExecutionMap: {},

        handleControlFlowConnection: function(sourceNode)
        {
            //sourceNode.hasBeenExecuted = true;
        },

        handleImportantConstructReached: function(sourceNode)
        {
            var dataDependencies = sourceNode.graphNode.dataDependencies;
            this.importantConstructDependencyIndexMapping.push
            ({
                codeConstruct: sourceNode,
                dependencyIndex: dataDependencies.length > 0 ? dataDependencies[dataDependencies.length - 1].index : -1
            });
        },

        handleBreakContinueReturnEventReached: function(sourceNode,  evaluationPosition, isCallbackReturn)
        {
            var dataDependencies = sourceNode.graphNode.dataDependencies;
            this.breakContinueReturnEventsMapping.push
            ({
                codeConstruct: sourceNode,
                dependencyIndex: dataDependencies.length > 0 ? dataDependencies[dataDependencies.length - 1].index : -1,
                executionContextId: this.executionContextId,
                isCallbackReturn: isCallbackReturn
            });
        },

        //This is so that i know which callback executions are related
        //in the map i will keep track of all execution context id's
        //for the executed callback functions
        _callbackStartStopTrackingMap: {},
        _currentCallbackStartStopExecutionIdStack: [],

        handleCallbackStartedExecuting: function(functionConstruct)
        {
            /*if(functionConstruct == null) { return; }

             if(this._callbackStartStopTrackingMap[functionConstruct.nodeId] == null) { this._callbackStartStopTrackingMap[functionConstruct.nodeId] = []; }

             this._currentCallbackStartStopExecutionIdStack.push([]);*/
        },

        handleCallbackStoppedExecuting: function(functionConstruct)
        {
            //debugger;
        },

        handleEnterFunction: function(callExpression, functionConstruct, executionContextId)
        {
            if(callExpression == null) return;

            this.currentCallExpressions.push(callExpression);
            this.currentCallExpressionsHardCopy = this.currentCallExpressions.slice();

            this.pushExecutionContextId(executionContextId);
        },

        handleExitFunction: function()
        {
            this.currentCallExpressions.pop();
            this.currentCallExpressionsHardCopy = this.currentCallExpressions.slice();
            this.popExecutionContextId();
        },

        markGraph: function(model)
        {
            try
            {
                this.previouslyExecutedBlockDependencies = [];
                this.traversedEdgesMap = {};

                this._traverseImportantDependencies(this.importantConstructDependencyIndexMapping);
                this._traverseHtmlNodeDependencies(this.htmlNodes);

                var addedDependencies = this._traverseIndirectDependencies();

                while(addedDependencies != 0)
                {
                    addedDependencies = this._traverseIndirectDependencies();
                }

                Firecrow.DependencyGraph.DependencyPostprocessor.processHtmlElement(model);
            }
            catch(e)
            {
                debugger;
                this.notifyError("Error when marking graph: " + e);
            }
        },

        _traverseIndirectDependencies: function()
        {
            var addedDependencies = 0;

            addedDependencies += this._traverseExecutedBlockDependencies();
            addedDependencies += this._traverseBreakContinueReturnEventsDependencies();

            if(fcGraph.DependencyGraph.sliceUnions)
            {
                addedDependencies += this._traverseSliceUnionPossibleProblems(this.expressionTrace);
            }

            return addedDependencies
        },

        _traverseImportantDependencies: function(executionTrace)
        {
            for(var i = 0, length = executionTrace.length; i < length; i++)
            {
                var mapping = executionTrace[i];

                DependencyGraph.noOfSlicingCriteria++;
                this._mainTraverseAndMark(mapping.codeConstruct, mapping.dependencyIndex, null, null);
            }
        },

        _traverseHtmlNodeDependencies: function(htmlNodes)
        {
            for(var i = 0, length = htmlNodes.length; i < length; i++)
            {
                var htmlModelNode = htmlNodes[i].model;

                if(!htmlModelNode.shouldBeIncluded) { continue; }

                DependencyGraph.noOfSlicingCriteria++;
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
            var addedDependencies = 0;

            for(var i = 0, length = this.previouslyExecutedBlockDependencies.length; i < length; i++)
            {
                var blockDependency = this.previouslyExecutedBlockDependencies[i];
                //Because the dependency is added to the condition, and here, we want to traverse it
                //only if some of at least one sub-expression is already included in the previous phases
                if(this.inclusionFinder.isIncludedElement(blockDependency.codeConstruct.parent))
                {
                    addedDependencies += this._mainTraverseAndMark(blockDependency.codeConstruct, blockDependency.maxDependencyIndex, blockDependency.dependencyConstraint, blockDependency.includedByNode);
                }
            }

            return addedDependencies;
        },

        _traverseBreakContinueReturnEventsDependencies: function()
        {
            var addedDependencies = 0;

            for(var i = 0; i < this.breakContinueReturnEventsMapping.length; i++)
            {
                var mapping = this.breakContinueReturnEventsMapping[i];
                var codeConstruct = mapping.codeConstruct;

                if(codeConstruct.shouldBeIncluded) { continue; }

                var parent = ASTHelper.getBreakContinueReturnImportantAncestor(codeConstruct);

                if(!this.inclusionFinder.isIncludedElement(parent)) { continue; }

                if(this._areAllIncluded(this.dependencyCallExpressionMapping[mapping.dependencyIndex]) || this._contextHasIncludedDependencies(mapping.executionContextId))
                {
                    addedDependencies += this._mainTraverseAndMark(codeConstruct, mapping.dependencyIndex, null);
                    ValueTypeHelper.removeFromArrayByIndex(this.breakContinueReturnEventsMapping, i--);
                }
            }

            return addedDependencies;
        },

        _traverseSliceUnionPossibleProblems: function(trace)
        {
            var addedDependencies = 0;

            if(trace == null) { return addedDependencies; }

            for(var i = 0; i < trace.length; i++)
            {
                var traceItem = trace[i];

                if(traceItem == null) { continue; }

                var codeConstruct = traceItem.codeConstruct;
                //if(codeConstruct.nodeId == 99164) debugger;
                //if(codeConstruct.loc != null && codeConstruct.loc.start.line == 4791) debugger;
                if(!codeConstruct.shouldBeIncluded || !this._contextHasIncludedDependencies(traceItem.executionContextId)) { continue; }
                var dependencies = codeConstruct.graphNode.getUntraversedValueDependenciesFromContext(traceItem.executionContextId);

                addedDependencies += dependencies.length;
                if(dependencies.length != 0) { DependencyGraph.sliceUnionProblematicExpressions.push({traceItem: traceItem, dependencies: dependencies});}
                for(var j = 0; j < dependencies.length; j++)
                {
                    var dependency = dependencies[j];

                    dependency.hasBeenTraversed = true;

                    this._traverseAndMark(dependency.destinationNode.model, dependency.index);
                }

                trace[i] = null;//not important anymore, but slice is too slow to remove it
            }

            return addedDependencies;
        },

        _contextIncludedDependencyCache: {},

        _contextHasIncludedDependencies: function(referentExecutionContextId)
        {
            if(this._contextIncludedDependencyCache[referentExecutionContextId]) { return true; }

            var hasIncludedDependencies = this._isAtLeastOneDependencyTraversed(this.executionContextIndexMap[referentExecutionContextId]);

            if(hasIncludedDependencies)
            {
                this._contextIncludedDependencyCache[referentExecutionContextId] = true;
            }

            return hasIncludedDependencies;
        },

        _isAtLeastOneDependencyTraversed: function(dependencyIndexes)
        {
            for(var i = 0; i < dependencyIndexes.length; i++)
            {
                if(this.traversedEdgesMap[dependencyIndexes[i]]) { return true; }
            }

            return false;
        },

        _areAllIncluded: function(callExpressions)
        {
            if(callExpressions == null || callExpressions.length == 0) { return false; }
            if(callExpressions.areAllIncluded) { return true; }

            for(var i = 0; i < callExpressions.length; i++)
            {
                if(!callExpressions[i].shouldBeIncluded) { return false; }
            }

            callExpressions.areAllIncluded = true;

            return true;
        },

        _includedMemberCallExpressionMap: {},

        _mainTraverseAndMark: function(codeConstruct, maxDependencyIndex, dependencyConstraint)
        {
            return this._traverseAndMark(codeConstruct, maxDependencyIndex, dependencyConstraint, 0);
        },

        _traverseAndMark: function(codeConstruct, maxDependencyIndex, dependencyConstraint, addedDependencies)
        {
            Firecrow.includeNode(codeConstruct, false, maxDependencyIndex, dependencyConstraint);

            if((ASTHelper.isMemberExpression(codeConstruct) || ASTHelper.isMemberExpression(codeConstruct.parent)
             || ASTHelper.isCallExpression(codeConstruct) || ASTHelper.isCallExpressionCallee(codeConstruct)))
            {
                this._includedMemberCallExpressionMap[codeConstruct.nodeId] = codeConstruct;
            }

            var potentialDependencyEdges = codeConstruct.graphNode.getDependencies(maxDependencyIndex, dependencyConstraint);

            for(var i = potentialDependencyEdges.length - 1; i >= 0; i--)
            {
                var dependencyEdge = potentialDependencyEdges[i];
                if(dependencyEdge.hasBeenTraversed) { continue; }

                //if(dependencyEdge.index >= 85346 && dependencyEdge.index <= 85396) debugger;

                dependencyEdge.hasBeenTraversed = true;
                this.traversedEdgesMap[dependencyEdge.index] = true;
                addedDependencies++;
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
                        includedByNode:  dependencyEdge.sourceNode.model,
                        executionContextId: dependencyEdge.executionContextId
                    });

                    continue;
                }
                //if(dependencyEdge.index >= 49955 && dependencyEdge.index < 253284) debugger;3
                this._traverseAndMark(dependencyEdge.destinationNode.model, dependencyEdge.index, dependencyConstraintToFollow, dependencyEdge.sourceNode.model, addedDependencies);
            }

            return addedDependencies;
        },

        notifyError: function(message)
        {
            debugger;
            Firecrow.DependencyGraph.DependencyGraph.notifyError(message);
        }
    };
}});