FBL.ns(function() { with (FBL) {
/*************************************************************************************/
    var ValueTypeHelper = Firecrow.ValueTypeHelper;
    var fcGraph = Firecrow.DependencyGraph;

    fcGraph.Node = function(model, type, isDynamic)
    {
        this.model = model;
        this.type = type;
        this.isDynamic = !!isDynamic;

        this.structuralDependencies = [];
        this.dataDependencies = [];
        this.reverseDependencies = [];
        this.controlDependencies = [];

        this.model.graphNode = this;
        this.idString = this.generateId();

        this.idNum = Node.LAST_ID++;
    };

    fcGraph.Node.notifyError = function(message) { alert("Node - " + message); }
    fcGraph.Node.LAST_ID = 0;

    fcGraph.Node.createHtmlNode = function(model, isDynamic) { return new Node(model, "html", isDynamic); };
    fcGraph.Node.createCssNode = function(model, isDynamic) { return new Node(model, "css", isDynamic); };
    fcGraph.Node.createJsNode = function(model, isDynamic) { return new Node(model, "js", isDynamic);};
    fcGraph.Node.createResourceNode = function(model, isDynamic) { return new Node(model, "resource", isDynamic);};

    fcGraph.Node.prototype =
    {
        isNodeOfType: function(type) { return this.type === type; },
        isHtmlNode: function() { return this.isNodeOfType("html"); },
        isCssNode: function() { return this.isNodeOfType("css"); },
        isJsNode: function() { return this.isNodeOfType("js"); },
        isResourceNode: function() { return this.isNodeOfType("resource"); },

        addStructuralDependency: function(destinationNode, isDynamic)
        {
            var edge = new fcGraph.Edge(this, destinationNode, isDynamic);

            this.structuralDependencies.push(edge);

            return edge;
        },

        addDataDependency: function(destinationNode, isDynamic, index, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency)
        {
            var edge = new fcGraph.Edge(this, destinationNode, isDynamic, index, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency);

            this.dataDependencies.push(edge);

            if(destinationNode != null)
            {
                destinationNode.reverseDependencies.push(edge);
            }

            return edge;
        },

        addControlDependency: function(destinationNode, isDynamic, index, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency, isPreviouslyExecutedBlockStatementDependency)
        {
            var edge = new Firecrow.DependencyGraph.Edge(this, destinationNode, isDynamic, index, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency);

            edge.isPreviouslyExecutedBlockStatementDependency = isPreviouslyExecutedBlockStatementDependency;

            this.dataDependencies.push(edge);

            if(destinationNode != null)
            {
                destinationNode.reverseDependencies.push(edge);
            }

            return edge;
        },

        getDependencies: function(maxIndex, destinationConstraint)
        {
            var selectedDependencies = [];

            if(maxIndex == null && destinationConstraint == null) { return this.dataDependencies; }

            var dependencies = this.dataDependencies;

            for(var i = dependencies.length - 1; i >= 0; i--)
            {
                var dependency = dependencies[i];

                if(dependency.isReturnDependency && dependency.callDependencyMaxIndex <= maxIndex)
                {
                    selectedDependencies.push(dependency);
                }

                if(dependency.shouldAlwaysBeFollowed)
                {
                    selectedDependencies.push(dependency);
                }

                if(dependency.index > maxIndex) { continue; }
                if(!this.canFollowDependency(dependency, destinationConstraint)) { continue; }

                selectedDependencies.push(dependency);

                for(var j = i + 1; j < dependencies.length; j++)
                {
                    if(!this._areDependenciesInTheSameGroupAndCanBeFollowed(dependency, dependencies[j], destinationConstraint))
                    {
                        break;
                    }

                    selectedDependencies.push(dependencies[j]);
                }

                for(var j = i - 1; j >= 0; j--)
                {
                    if(!this._areDependenciesInTheSameGroupAndCanBeFollowed(dependency, dependencies[j], destinationConstraint))
                    {
                        break;
                    }

                    selectedDependencies.push(dependencies[j]);
                }

                break;
            }

            return selectedDependencies;
        },

        getSliceUnionImportantDependencies: function(minExclusiveIndex, maxInclusiveIndex)
        {
            var dependencies = this.dataDependencies;

            //Remove all already traversed and the ones after the maximum indexed one
            var selectedDependencies = [];

            for(var i = dependencies.length - 1; i >= 0; i--)
            {
                var dependency = dependencies[i];

                if(dependency.isValueDependency && dependency.index > minExclusiveIndex && dependency.index <= maxInclusiveIndex)
                {
                    if(!dependency.hasBeenTraversed)
                    {
                        selectedDependencies.push(dependency);

                        for(var j = i + 1; j < dependencies.length; j++)
                        {
                            if(!this._areDependenciesInTheSameGroupAndCanBeFollowed(dependency, dependencies[j], dependency.dependencyCreationInfo))
                            {
                                break;
                            }

                            selectedDependencies.push(dependencies[j]);
                        }

                        for(var j = i - 1; j >= 0; j--)
                        {
                            if(!this._areDependenciesInTheSameGroupAndCanBeFollowed(dependency, dependencies[j], dependency.dependencyCreationInfo))
                            {
                                break;
                            }

                            selectedDependencies.push(dependencies[j]);
                        }
                    }

                    break;
                }
            }

            return selectedDependencies;
        },

        _areDependenciesInTheSameGroupAndCanBeFollowed: function(dependency1, dependency2, destinationConstraint)
        {
            return (dependency1.dependencyCreationInfo.groupId.indexOf(dependency2.dependencyCreationInfo.groupId) == 0
                 || dependency2.dependencyCreationInfo.groupId.indexOf(dependency1.dependencyCreationInfo.groupId) == 0)
                && this.canFollowDependency(dependency2, destinationConstraint);
        },

        canFollowDependency: function(dependency, destinationConstraint)
        {
            if(destinationConstraint == null) { return true; }

            return dependency.dependencyCreationInfo.currentCommandId <= destinationConstraint.currentCommandId;
        },

        generateId: function()
        {
            if(this.isHtmlNode()) { return this._generateIdForHtmlNode(); }
            else if (this.isCssNode()) { return this._generateIdForCssNode(); }
            else if (this.isJsNode()) { return this._generateIdForJsNode(); }
            else { debugger; alert("Node.generateId - unknown node type!"); return ""; }
        },

        _generateIdForHtmlNode: function()
        {
            if(!this.isHtmlNode()) { return this.generateId(); }

            return this.idNum + ":" +  this.model.type;
        },

        _generateIdForCssNode: function()
        {
                if(!this.isCssNode()) { return this.generateId(); }

                return this.idNum + ":" + this.model.selector;
        },

        _generateIdForJsNode: function()
        {
            if(!this.isJsNode()) { return this.generateId(); }

            var additionalData = "";

            if(this.model.type == "Identifier") { additionalData = "->" + this.model.name; }
            else if (this.model.type == "Literal") { additionalData = "->" + this.model.value;}

            return this.idNum + ":@" + (this.model.loc != null ? this.model.loc.start.line : '?' )+  "-" + this.model.type + additionalData;
        }
    };
}});