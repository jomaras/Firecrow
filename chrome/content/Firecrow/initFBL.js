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
        postProcessorInclusions: {},

        includeNode: function(node, isIncludedByPostprocessor, dependencyIndex, dependencyConstraint)
        {
            if(isIncludedByPostprocessor && !node.shouldBeIncluded)
            {
                node.isIncludedByPostprocessor = isIncludedByPostprocessor;
                this.postProcessorInclusions[node.nodeId] = 1;
            }
            //if(node != null && node.loc != null && node.loc.start.line == 8152) debugger;
            //if(node.nodeId == 30) debugger;
            node.shouldBeIncluded = true;

            if(node.maxIncludedByDependencyIndex == null) { node.maxIncludedByDependencyIndex = dependencyIndex; }
            else if(node.maxIncludedByDependencyIndex < dependencyIndex) { node.maxIncludedByDependencyIndex = dependencyIndex ; }

            if(node.minIncludedByDependencyIndex == null) { node.minIncludedByDependencyIndex = dependencyIndex; }
            else if(node.minIncludedByDependencyIndex > dependencyIndex) { node.minIncludedByDependencyIndex = dependencyIndex ; }

            //TODO - sort on insertion
            if(dependencyIndex != null)
            {
                node.includedByDependencies = node.includedByDependencies || [];
                node.includedByDependencies.push(dependencyIndex);
            }

            if(dependencyConstraint != null)
            {
                node.includedConstraints = node.includedConstraints || [];
                node.includedConstraints.push(dependencyConstraint);
            }
        },

        INTERNAL_PROTOTYPE_FUNCTIONS:
        {
            Array:
            {
                concat: Array.concat, every: Array.every, forEach: Array.forEach,
                indexOf: Array.indexOf, join: Array.join, map: Array.map,
                pop: Array.pop, push: Array.push, reduce: Array.reduce,
                reduceRight: Array.reduceRight, reverse: Array.reverse,
                reverse: Array.reverse, shift: Array.shift, some: Array.some,
                sort: Array.sort, splice: Array.splice, unshift: Array.unshift
            },
            String:
            {
                camelCase: String.camelCase, capitalize: String.capitalize, charAt: String.charAt, charCodeAt: String.charAt,
                clean: String.clean, concat: String.concat, contains: String.contains, escapeRegExp: String.escapeRegExp,
                hyphenate: String.hyphenate, lastIndexOf: String.lastIndexOf, localeCompare: String.localeCompare, match: String.match,
                replace: String.replace, replace: String.replace, search: String.search, slice: String.slice,
                sub: String.sub, substitute: String.substitute, substr: String.substr, substring: String.substring, toFloat: String.toFloat,
                toInt: String.toInt, toLocaleLowerCase: String.toLocaleLowerCase, toLocaleString: String.toLocaleString,
                toLocaleUpperCase: String.toLocaleUpperCase, toLowerCase: String.toLowerCase, toUpperCase: String.toUpperCase, trim: String.trim,
                trimLeft: String.trimLeft, trimRight: String.trimRight, fromCharCode: String.fromCharCode
            }
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