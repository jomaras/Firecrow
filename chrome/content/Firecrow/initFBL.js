/*Just for the intellisense*/
if(FBL == undefined) { FBL = {}; FBL.ns = function(namespaceFunction){ namespaceFunction(); }; }
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
            Internals: {}
        },
        IsDebugMode: true
    };
}});

