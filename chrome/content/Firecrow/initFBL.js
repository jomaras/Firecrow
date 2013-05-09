/*Just for the intellisense*/
if(typeof FBL === "undefined") { FBL = {}; FBL.ns = function(namespaceFunction){ namespaceFunction(); }; }

/*End just for intellisense*/

FBL.ns(function () { with (FBL)
{
    FBL.Firecrow =
    {
        DependencyGraph:
        {
            DependencyGraph: {},
            Node: {},
            Edge: {}
        },
        DoppelBrowser :
        {
            Browser: {},
            WebFile: {}
        },
        Interpreter:
        {
            Commands : {},
            InterpreterSimulator: {},
            Model:
            {
                Internals: {}
            },
            Internals: {},
            Simulator: {}
        },
        ScenarioGenerator: {
            Symbolic: {}
        },
        IsDebugMode: true,

        getWindow: function() { return frames[0] || window;},
        getDocument: function() { return this.getWindow().document; },

        includeNode: function(node, dependencyIndex)
        {
            if(node.loc != null && (node.loc.start.line == 403)) { console.log(Firecrow.CodeTextGenerator.generateJsCode(node));};
            //if(node.nodeId == 39405) debugger;
            node.shouldBeIncluded = true;

            if(node.maxIncludedByDependencyIndex == null) { node.maxIncludedByDependencyIndex = dependencyIndex; }
            else if(node.maxIncludedByDependencyIndex < dependencyIndex) { node.maxIncludedByDependencyIndex = dependencyIndex ; }

            if(node.minIncludedByDependencyIndex == null) { node.minIncludedByDependencyIndex = dependencyIndex; }
            else if(node.minIncludedByDependencyIndex > dependencyIndex) { node.minIncludedByDependencyIndex = dependencyIndex ; }

            //TODO - sort on insertion
            node.includedByDependencies = node.includedByDependencies || [];
            node.includedByDependencies.push(dependencyIndex);
        }
    };
}});

