var EXPORTED_SYMBOLS = ["JsRecorder"];

var Cu = Components.utils;
var Ci = Components.interfaces;
var Cc = Components.classes;

const jsdIFilter = Components.interfaces.jsdIFilter;
const IGNORE_SCRIPTS_REGEXS =
[
    "*/firefox/components/*",
    "*/firefox/modules/*",
    "XStringBundle",
    "chrome://*",
    "resource://*",
    "x-jsd:ppbuffer*",
    "XPCSafeJSObjectWrapper.cpp"
];

var JsRecorder = function()
{
    this.jsDebugger = Cc["@mozilla.org/js/jsd/debugger-service;1"].getService(Ci.jsdIDebuggerService);

    this.executionTrace = [];
    this.eventTrace = [];

    var that = this;

    this.startProfiling = function()
    {
        if(this.jsDebugger == null) { Cu.reportError("Error: jsDebugger is null when trying to start"); return; }

        this.setFilters();

        this.profileAllExecutions();

        this.profileEventExecutions();

        this.trackScriptCreation();

        this._profile();
    }

    this.profileAllExecutions = function()
    {
        this.executionTrace = [];

        var returnContinue = Ci.jsdIExecutionHook.RETURN_CONTINUE;

        this.jsDebugger.interruptHook =
        {
            onExecute: function(frame)
            {
                that.executionTrace.push({file: frame.script.fileName, line: frame.line});

                return returnContinue;
            }
        }
    };

    this.profileEventExecutions = function()
    {
        this.eventTrace = [];

        this.jsDebugger.functionHook =
        {
            onCall: function(frame)
            {
                //onCall hook is called when entering and when exiting the
                //function - ignore the exiting calls (pc != 0)
                if(!that.isProfiling || frame.pc != 0) { return; }

                if(that.getStackDepth(frame) == 0)
                {
                    var trace = { fileName: frame.script.fileName, line: frame.line};

                    var thisElement = frame.thisValue.getWrappedValue();

                    trace.currentTime = (new Date()).getTime();

                    trace.thisValue = { xPath: that.getElementXPath(thisElement)};

                    var args = frame.scope.getWrappedValue().arguments;
                    var firstArgument = args[0];

                    trace.args =
                    {
                        targetXPath: firstArgument!= null ? that.getElementXPath(firstArgument.target) : "",
                        originalTargetXPath: firstArgument != null ? that.getElementXPath(firstArgument.originalTarget) : "",
                        currentTargetXPath: firstArgument != null ? that.getElementXPath(firstArgument.currentTarget) : "",
                        explicitOriginalTargetXPath: firstArgument != null ? that.getElementXPath(firstArgument.explicitOriginalTarget) : "",
                        rangeParentXPath : firstArgument != null ? that.getElementXPath(firstArgument.rangeParent) : "",
                        relatedTargetXPath : firstArgument != null ? that.getElementXPath(firstArgument.relatedTarget) : "",
                        clientX: firstArgument != null ? firstArgument.clientX : 0,
                        clientY: firstArgument != null ? firstArgument.clientY : 0,
                        screenX: firstArgument != null ? firstArgument.screenX : 0,
                        screenY: firstArgument != null ?  firstArgument.screenY : 0,
                        pageX: firstArgument != null ?  firstArgument.pageX : 0,
                        pageY: firstArgument != null ?  firstArgument.pageY : 0,
                        type: firstArgument != null ? firstArgument.type
                                                    : trace.thisValue.xPath !== "" ? "elementEvent" : "",
                        keyCode: firstArgument != null ?  firstArgument.keyCode : 0,
                        currentInputStates: that.getCurrentInputStates(thisElement)
                    };

                    that.eventTrace.push(trace);
                }

                return returnContinue;
            }
        };
    };

    this.trackScriptCreation = function()
    {
        this.jsDebugger.scriptHook =
        {
            onScriptCreated: function(script)
            {
                var found = IGNORE_SCRIPTS_REGEXS.find(function(regEx)
                {
                    //TODO - Not the best way to deal with this, but:
                    if(regEx[0] == "*" && regEx[regEx.length-1] == "*")
                    {
                        return script.fileName.indexOf(regEx.substring(1, regEx.length-1)) != -1;
                    }
                    else if(regEx[0] == "*")
                    {
                        return script.fileName.indexOf(regEx.substring(1, regEx.length)) == regEx.length-1;
                    }
                    else if(regEx[regEx.length-1] == "*")
                    {
                        return script.fileName.indexOf(regEx.substring(0, regEx.length-1)) == 0;
                    }
                });

                if(!found)
                {
                    script.enableSingleStepInterrupts(true);
                }
            }
        };
    };

    this._profile = function()
    {
        if(this.jsDebugger.pauseDepth == 1) { this.jsDebugger.unPause(); }

        this.jsDebugger.asyncOn({});

        this.isProfiling = true;
    }

    this.getStackDepth = function(frame)
    {
        var frameHelper = frame.callingFrame;
        var stackDepth = 0;

        while(frameHelper != null)
        {
            frameHelper = frameHelper.callingFrame;
            stackDepth++;
        }

        return stackDepth;
    };

    this.stop = function()
    {
        try
        {
            if(this.jsDebugger == null) { Cu.reportError("Error: jsDebugger is null when trying to stop"); return; }

            this.jsDebugger.off();
            this.isProfiling = false;
            this.jsDebugger.functionHook = {};
            this.jsDebugger.interruptHook = {};
            this.jsDebugger.scriptHook = {};
        }
        catch(e) { Cu.reportError("Error when stopping jsDebugger " + e); }
    };

    this.createFilter = function(pattern, pass)
    {
        return {
            globalObject: null,
            flags: pass ? (jsdIFilter.FLAG_ENABLED | jsdIFilter.FLAG_PASS) : jsdIFilter.FLAG_ENABLED,
            urlPattern: pattern,
            startLine: 0,
            endLine: 0
        };
    },

    this.setFilters = function()
    {
        this.jsDebugger.clearFilters();

        IGNORE_SCRIPTS_REGEXS.forEach(function(regEx)
        {
            that.jsDebugger.appendFilter(that.createFilter(regEx));
        });
    };

    this.getCurrentInputStates = function(element)
    {
        var inputStates = [];

        if(element == null) { return inputStates; }

        var doc = null;

        if(element.nodeType === undefined) { doc = element.document; }
        else if(element.nodeType == 9) { doc = element; }
        else { doc = element.ownerDocument; }

        if(doc == null) { return inputStates; }

        var allInputElements = doc.querySelectorAll("input");

        for(var i = 0, length = allInputElements.length; i < length; i++)
        {
            var input = allInputElements[i];

            inputStates.push
            ({
                elementXPath : that.getElementXPath(input),
                checked : input.checked,
                value: input.value
            });
        }

        return inputStates;
    }

    this.getElementXPath = function(element)
    {
        var paths = [];

        for (; element && element.nodeType == 1; element = element.parentNode)
        {
            var index = 0;
            for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
            {
                if (sibling.localName == element.localName)
                    ++index;
            }

            var tagName = element.localName.toLowerCase();
            var pathIndex = (index ? "[" + (index+1) + "]" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }

        return paths.length ? "/" + paths.join("/") : "";
    }
};