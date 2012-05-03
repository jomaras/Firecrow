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
    };

    var Node = Firecrow.DependencyGraph.Node;

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
    };

    Node.prototype.generateIdForHtmlNode = function()
    {
        if(!this.isHtmlNode()) { return this.generateId(); }

        var id = "";

        var node = this;

        while(node != null)
        {
            id = node.model.type + " > " + id;
            node = node.structuralDependencies[0] != null ? node.structuralDependencies[0].destrinationNode : null;
        }

        return id;
    };
}});