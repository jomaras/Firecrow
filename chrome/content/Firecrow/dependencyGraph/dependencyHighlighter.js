/**
 * User: Jomaras
 * Date: 26.09.12.
 * Time: 17:24
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
Firecrow.DependencyGraph.DependencyHighlighter = function(htmlContainer, dependencyGraph)
{
    (function establishConnection()
    {
        var nodes = dependencyGraph.nodes;

        for(var i = 0, length = nodes.length; i < length; i++)
        {
            var node = nodes[i];

            var htmlNode = htmlContainer.querySelector("#node" + FBL.Firecrow.CodeMarkupGenerator.formatId(node.model.nodeId));

            if(htmlNode != null)
            {
                htmlNode.model = node.model;
            }
        }
    }());

    function removeClass(className)
    {
        var elements = htmlContainer.querySelectorAll("." + className);

        for(var i = 0; i < elements.length; i++)
        {
            elements[i].classList.remove(className);
        }
    }

    var codeElements = htmlContainer.querySelectorAll(".node");

    for(var i = 0, length = codeElements.length; i < length; i++)
    {
        codeElements[i].onclick = function(eventArgs)
        {
            if(this.id.indexOf("node") == 0)
            {
                eventArgs.stopPropagation();

                removeClass("selected");
                removeClass("dependent");

                this.classList.add("selected");

                var modelNode = this.model;

                if(modelNode == null) { return; }

                var dependencies = modelNode.graphNode.dataDependencies;
                for(var j = 0, jLength = dependencies.length; j < jLength; j++)
                {
                    var dependent = dependencies[j];
                    var htmlDependent = htmlContainer.querySelector("#node" + FBL.Firecrow.CodeMarkupGenerator.formatId(dependent.destinationNode.model.nodeId));
                    if(htmlDependent != null)
                    {
                        htmlDependent.classList.add("dependent");
                    }
                }
            }
        }
    }
};
}});