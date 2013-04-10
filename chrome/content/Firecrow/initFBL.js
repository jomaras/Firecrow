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

        includeNode: function(node)
        {
            /*if(node.loc != null && node.loc.start.line == 1765)
                debugger;*/

            node.shouldBeIncluded = true;
        }
    };
}});

