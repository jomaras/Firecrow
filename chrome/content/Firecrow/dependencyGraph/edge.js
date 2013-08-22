FBL.ns(function() { with (FBL) {
/*************************************************************************************/

var ValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.DependencyGraph.Edge = function(sourceNode, destinationNode, isDynamic, index, dependencyCreationInfo, destinationNodeDependencyConstraints, shouldNotFollowDependency)
{
    if(!ValueTypeHelper.isOfType(sourceNode, Firecrow.DependencyGraph.Node)
    || !ValueTypeHelper.isOfType(destinationNode, Firecrow.DependencyGraph.Node))
    {
        debugger;
        Firecrow.DependencyGraph.Edge.notifyError("DependencyGraph.Edge: Source or destination node are not of type node!");
        return;
    }

    this.sourceNode = sourceNode;
    this.destinationNode = destinationNode;
    this.isDynamic = !!isDynamic;
    this.index = index; //if(index == 245280)debugger;3

    this.dependencyCreationInfo = dependencyCreationInfo;
    this.destinationNodeDependencyConstraints = destinationNodeDependencyConstraints || dependencyCreationInfo;
    this.shouldNotFollowDependency = shouldNotFollowDependency;

    if(dependencyCreationInfo == null) { return; }

    this.isReturnDependency = dependencyCreationInfo.isReturnDependency;
    this.shouldAlwaysBeFollowed = dependencyCreationInfo.shouldAlwaysBeFollowed;

    if(this.isReturnDependency)
    {
        this.callDependencyMaxIndex = dependencyCreationInfo.callDependencyMaxIndex || index;
    }

/*    if(sourceNode.model.nodeId == 14)
    {
        console.log(sourceNode.model.nodeId + " index: " + this.index +  "; depCreationInfoId: " + dependencyCreationInfo.groupId + "; depCommand: " + dependencyCreationInfo.currentCommandId
                 +  " destinationGroupId: " + this.destinationNodeDependencyConstraints.groupId + "; destDepCommand: " + this.destinationNodeDependencyConstraints.currentCommandId
                 + " " + Firecrow.CodeTextGenerator.generateJsCode(this.destinationNode.model));
    }*/

     /*var sourceStartLine = sourceNode.model.loc != null ? sourceNode.model.loc.start.line : sourceNode.model.parent.loc.start.line;
     var sourceCode = Firecrow.CodeTextGenerator.generateJsCode(sourceNode.model);

     var destinationStartLine = destinationNode.model.loc != null ? destinationNode.model.loc.start.line : destinationNode.model.parent.loc.start.line;
     var destinationCode = Firecrow.CodeTextGenerator.generateJsCode(destinationNode.model);

     var location = sourceStartLine + "[" + sourceNode.model.nodeId + "]" + ":" + sourceCode + "=>" + destinationStartLine + "[" + destinationNode.model.nodeId + "]" + ":" + destinationCode

     var dependencyInfo = dependencyCreationInfo.groupId + "->" + dependencyCreationInfo.currentCommandId;
     var additionalInfo = destinationNodeDependencyConstraints == null ? "N" : destinationNodeDependencyConstraints.groupId + "->" + destinationNodeDependencyConstraints.currentCommandId;
     console.log(location.replace(/\n/," ") + "; index:" + index + "; " + "; info: " + dependencyInfo + "; aInfo: " + additionalInfo);*/
};

Firecrow.DependencyGraph.Edge.notifyError = function(message) { alert("Edge - " + message); }
/*************************************************************************************/
}});