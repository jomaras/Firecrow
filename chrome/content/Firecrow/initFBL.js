var EXPORTED_SYMBOLS = ["Firecrow"];
/*Just for the intellisense*/
if(typeof FBL === "undefined")
{
    FBL =  { ns:  function(namespaceFunction){ namespaceFunction(); }};
}
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

        includeNode: function(node, isIncludedByPostprocessor, dependencyIndex)
        {
            //if(node.loc != null && node.loc.start.line >= 1378 && node.loc.start.line <= 5975) debugger;
            if(isIncludedByPostprocessor && !node.shouldBeIncluded)
            {
                node.isIncludedByPostprocessor = isIncludedByPostprocessor;
            }

            node.shouldBeIncluded = true;

            if(node.maxIncludedByDependencyIndex == null) { node.maxIncludedByDependencyIndex = dependencyIndex; }
            else if(node.maxIncludedByDependencyIndex < dependencyIndex) { node.maxIncludedByDependencyIndex = dependencyIndex ; }

            if(node.minIncludedByDependencyIndex == null) { node.minIncludedByDependencyIndex = dependencyIndex; }
            else if(node.minIncludedByDependencyIndex > dependencyIndex) { node.minIncludedByDependencyIndex = dependencyIndex ; }

            //TODO - sort on insertion
            node.includedByDependencies = node.includedByDependencies || [];
            node.includedByDependencies.push(dependencyIndex);
        },

        IGNORED_SCRIPTS:
        [
            "google-analytics.com/ga.js",
            "twitter",
            "stumbleupon",
            "facebook",
            "linkedin",
            "apis.google.com",
            "widgets.dzone.com",
        ],

        isIgnoredScript: function(path)
        {
            if(path == null) { return false; }

            for(var i = 0; i < this.IGNORED_SCRIPTS.length; i++)
            {
                if(path.indexOf(this.IGNORED_SCRIPTS[i]) != -1) { return true; }
            }

            return false;
        }
    };
}});

var Firecrow = FBL.Firecrow;

