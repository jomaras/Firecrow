FBL.ns(function() { with (FBL) {
/*************************************************************************************/

var ValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.DependencyGraph.Edge = function(sourceNode, destinationNode, isDynamic, index, dependencyCreationInfo, destinationNodeDependencyConstraints)
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
    this.index = index;

    this.dependencyCreationInfo = dependencyCreationInfo;
    this.destinationNodeDependencyConstraints = destinationNodeDependencyConstraints || dependencyCreationInfo;

    if(dependencyCreationInfo == null) { return; }


     /*console.log("**********************");
     var sourceStartLine = sourceNode.model.loc != null ? sourceNode.model.loc.start.line : sourceNode.model.parent.loc.start.line;
     var sourceCode = Firecrow.CodeTextGenerator.generateJsCode(sourceNode.model);

     var destinationStartLine = destinationNode.model.loc != null ? destinationNode.model.loc.start.line : destinationNode.model.parent.loc.start.line;
     var destinationCode = Firecrow.CodeTextGenerator.generateJsCode(destinationNode.model);

     console.log(sourceStartLine + ":" + sourceCode + "=>" + destinationStartLine + ":" + destinationCode);

     var dependencyInfo = dependencyCreationInfo.groupId + "->" + dependencyCreationInfo.currentCommandId;
     var additionalInfo = destinationNodeDependencyConstraints == null ? "NONE" : destinationNodeDependencyConstraints.groupId + "->" + destinationNodeDependencyConstraints.currentCommandId;
     console.log("DependencyIndex:" + index + "; " + "info: " + dependencyInfo + "; aInfo: " + additionalInfo); */
};
/*************************************************************************************/
}});