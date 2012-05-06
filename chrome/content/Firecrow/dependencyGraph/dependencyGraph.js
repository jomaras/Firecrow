/**
 * User: Jomaras
 * Date: 03.05.12.
 * Time: 13:44
 */
FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    const ValueTypeHelper = Firecrow.ValueTypeHelper;
    const Node = Firecrow.DependencyGraph.Node;

    Firecrow.DependencyGraph.DependencyGraph = function()
    {
        this.nodes = [];
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
            nodeModelObject.graphNode.addStructuralDependency(parentNodeModelObject.graphNode);
        }
    };
}});