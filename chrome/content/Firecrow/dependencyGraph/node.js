FBL.ns(function() { with (FBL) {
/*************************************************************************************/

    const ValueTypeHelper = Firecrow.ValueTypeHelper;

    Firecrow.DependencyGraph.Node = function(model, type, isDynamic)
    {
        if(!(model instanceof Object)) { alert("DependencyGraph.Node: model has to be an object!"); return; }

        this.model = model;
        this.type = type;
        this.isDynamic = !!isDynamic;

        this.structuralDependencies = [];
        this.dataDependencies = [];
        this.controlDependencies = [];

        this.model.graphNode = this;

        this.idNum = Node.ID++;
        this.idString = this.generateId();
    };

    var Node = Firecrow.DependencyGraph.Node;

    Node.ID = 0;

    Node.prototype.isNodeOfType = function(type) { return this.type === type; };
    Node.prototype.isHtmlNode = function() { return this.isNodeOfType("html"); };
    Node.prototype.isCssNode = function() { return this.isNodeOfType("css"); };
    Node.prototype.isJsNode = function() { return this.isNodeOfType("js"); };
    Node.prototype.isResourceNode = function() { return this.isNodeOfType("resource"); };

    Node.prototype.addStructuralDependency = function(destinationNode, isDynamic) { this.structuralDependencies.push(new Firecrow.DependencyGraph.Edge(this, destinationNode, isDynamic));};
    Node.prototype.addDataDependency = function(destinationNode, isDynamic) { this.dataDependencies.push(new Firecrow.DependencyGraph.Edge(this, destinationNode, isDynamic)); };
    Node.prototype.addControlDependency = function(destinationNode, isDynamic) { this.controlDependencies.push(new Firecrow.DependencyGraph.Edge(this, destinationNode, isDynamic)); };

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

            return this.idNum + ":" + this.model.selector ;
        }
        catch(e) { alert("Node - error when generating id for css node: " + e); }
    };

    Node.prototype.generateIdForJsNode = function()
    {
        try
        {
            if(!this.isJsNode()) { return this.generateId(); }

            return this.idNum + ":@" + (this.model.loc != null ? this.model.loc.start.line : '?' )+  "-" + this.model.type;
        }
        catch(e) { alert("Node - error when generating id for js nodes: " + e); }
    };
}});