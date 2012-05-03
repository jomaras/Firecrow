FBL.ns(function() { with (FBL) {
    /*************************************************************************************/

    const ValueTypeHelper = Firecrow.ValueTypeHelper;

    Firecrow.DependencyGraph.Edge = function(sourceNode, destinationNode, isDynamic)
    {
        if(!ValueTypeHelper.isOfType(sourceNode, Firecrow.DependencyGraph.Node)
        || !ValueTypeHelper.isOfType(destinationNode, Firecrow.DependencyGraph.Node))
        {
            alert("DependencyGraph.Edge: Source or destination node are not of type node!");
            return;
        }

        this.sourceNode = sourceNode;
        this.destinationNode = destinationNode;
        this.isDynamic = !!isDynamic;
    };
}});