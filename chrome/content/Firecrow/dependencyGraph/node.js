FBL.ns(function() { with (FBL) {
/*************************************************************************************/
    var ValueTypeHelper = Firecrow.ValueTypeHelper;

    Firecrow.DependencyGraph.Node = function(model, type, isDynamic)
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

    Firecrow.DependencyGraph.Node.notifyError = function(message) { alert("Node - " + message); }

    var Node = Firecrow.DependencyGraph.Node;
    Node.LAST_ID = 0;

    Node.prototype.isNodeOfType = function(type) { return this.type === type; };
    Node.prototype.isHtmlNode = function() { return this.isNodeOfType("html"); };
    Node.prototype.isCssNode = function() { return this.isNodeOfType("css"); };
    Node.prototype.isJsNode = function() { return this.isNodeOfType("js"); };
    Node.prototype.isResourceNode = function() { return this.isNodeOfType("resource"); };

    Node.prototype.addStructuralDependency = function(destinationNode, isDynamic)
    {
        this.structuralDependencies.push(new Firecrow.DependencyGraph.Edge(this, destinationNode, isDynamic));
    };
    Node.prototype.addDataDependency = function(destinationNode, isDynamic, index, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency)
    {
        var edge = new Firecrow.DependencyGraph.Edge(this, destinationNode, isDynamic, index, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency);
        this.dataDependencies.push(edge);

        if(destinationNode != null)
        {
            destinationNode.reverseDependencies.push(edge);
        }
    };
    Node.prototype.addControlDependency = function(destinationNode, isDynamic, index, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency, isPreviouslyExecutedBlockStatementDependency)
    {
        var edge = new Firecrow.DependencyGraph.Edge(this, destinationNode, isDynamic, index, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependency);
        edge.isPreviouslyExecutedBlockStatementDependency = isPreviouslyExecutedBlockStatementDependency;

        this.dataDependencies.push(edge);

        if(destinationNode != null)
        {
            destinationNode.reverseDependencies.push(edge);
        }
    };

    Node.prototype.getDependencies = function(maxIndex, destinationConstraint)
    {
        var selectedDependencies = [];
        var returnDependencies = {};

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

            for(var j = dependencies.length - 1; j >= 0; j--)
            {
                if(i == j) { continue; }

                var jThDependency = dependencies[j];

                if((dependency.dependencyCreationInfo.groupId.indexOf(jThDependency.dependencyCreationInfo.groupId) == 0
                 || jThDependency.dependencyCreationInfo.groupId.indexOf(dependency.dependencyCreationInfo.groupId) == 0)
                && this.canFollowDependency(jThDependency, destinationConstraint))
                {
                    selectedDependencies.push(jThDependency);
                }
            }

            break;
        }

        return selectedDependencies;
    };

    function containsInterestingDependencies(dependencies)
    {
        for(var i = 0; i < dependencies.length; i++)
        {
            if(dependencies[i].index == 44 || dependencies[i].index == 45
            || dependencies[i].index == 46 || dependencies[i].index == 57)
            {
                return true;
            }
        }

        return false;
    }

    Node.prototype.canFollowDependency = function(dependency, destinationConstraint)
    {
        if(destinationConstraint == null) { return true; }

        return dependency.dependencyCreationInfo.currentCommandId <= destinationConstraint.currentCommandId;
    };

    Node.createHtmlNode = function(model, isDynamic) { return new Node(model, "html", isDynamic); };
    Node.createCssNode = function(model, isDynamic) { return new Node(model, "css", isDynamic); };
    Node.createJsNode = function(model, isDynamic) { return new Node(model, "js", isDynamic);};
    Node.createResourceNode = function(model, isDynamic) { return new Node(model, "resource", isDynamic);};

    Node.prototype.generateId = function()
    {
        if(this.isHtmlNode()) { return this.generateIdForHtmlNode(); }
        else if (this.isCssNode()) { return this.generateIdForCssNode(); }
        else if (this.isJsNode()) { return this.generateIdForJsNode(); }
        else { alert("Node.generateId - unknown node type!"); return ""; }
    };

    Node.prototype.generateIdForHtmlNode = function()
    {
        try
        {
            if(!this.isHtmlNode()) { return this.generateId(); }

            return this.idNum + ":" +  this.model.type;
        }
        catch(e){ alert("Node - error when generating id for html node: " + e); }
    };

    Node.prototype.generateIdForCssNode = function()
    {
        try
        {
            if(!this.isCssNode()) { return this.generateId(); }

            return this.idNum + ":" + this.model.selector;
        }
        catch(e) { alert("Node - error when generating id for css node: " + e); }
    };

    Node.prototype.generateIdForJsNode = function()
    {
        try
        {
            if(!this.isJsNode()) { return this.generateId(); }

            var additionalData = "";

            if(this.model.type == "Identifier") { additionalData = "->" + this.model.name; }
            else if (this.model.type == "Literal") { additionalData = "->" + this.model.value;}

            return this.idNum + ":@" + (this.model.loc != null ? this.model.loc.start.line : '?' )+  "-" + this.model.type + additionalData;
        }
        catch(e) { alert("Node - error when generating id for js nodes: " + e); }
    };
}});