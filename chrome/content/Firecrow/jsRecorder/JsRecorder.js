FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var CC = Components.classes;
var CI = Components.interfaces;
var CU = Components.utils;

var fbHelper = Firecrow.fbHelper;
var htmlHelper = Firecrow.htmlHelper;

if(fbHelper == null || htmlHelper == null)
{
    var scriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);

    var importedScope = {};

    scriptLoader.loadSubScript("chrome://Firecrow/content/helpers/fbHelper.js", importedScope, "UTF-8");
    scriptLoader.loadSubScript("chrome://Firecrow/content/helpers/fbHelper.js", importedScope, "UTF-8");

    fbHelper = importedScope.FbHelper;
    htmlHelper = importedScope.HtmlHelper;
}

Firecrow.JsRecorder = function ()
{
    this.jsDebugger = CC["@mozilla.org/js/jsd/debugger-service;1"].getService(CI.jsdIDebuggerService);

    this.executionTrace = [];

    var that = this;
    this.myFilePathCache = [];

    this.startProfiling = function(scriptsToTrack)
    {
        if(this.jsDebugger == null) { CU.reportError("Error: jsDebugger is null when trying to start"); return; }

        this.setScriptsToTrack(scriptsToTrack);

        var returnContinue = CI.jsdIExecutionHook.RETURN_CONTINUE;
        this.executionTrace = [];

        this.jsDebugger.interruptHook =
        {
            onExecute: function(frame, type, val)
            {
                that.executionTrace.push({file: frame.script.fileName, pc: frame.pc, line: frame.line});

                return returnContinue;
            }
        }

        if(this.jsDebugger.pauseDepth == 1) { this.jsDebugger.unPause(); }

        this.jsDebugger.asyncOn(function(){});
        this.isRecording = true;
    }

    this.start = function(scriptsToTrack, elementToTrackXPath)
    {
        this.elementToTrackXPath = elementToTrackXPath;
        try
        {
            if(this.jsDebugger == null) { CU.reportError("Error: jsDebugger is null when trying to start"); return; }

            this.setScriptsToTrack(scriptsToTrack);

            var returnContinue = CI.jsdIExecutionHook.RETURN_CONTINUE;

            this.jsDebugger.functionHook =
            {
                getStackDepth: function(frame)
                {
                    var frameHelper = frame.callingFrame;
                    var stackDepth = 0;

                    while(frameHelper != null)
                    {
                        frameHelper = frameHelper.callingFrame;
                        stackDepth++;
                    }

                    return stackDepth;
                },
                onCall: function(frame, type, val)
                {
                    //onCall hook is called when entering and when exiting the
                    //function - ignore the exiting calls (pc != 0)
                    try
                    {
                        if(!that.isRecording || frame.pc != 0) { return; }

                        //is event handler
                        if(this.getStackDepth(frame) == 0)
                        {
                            var trace = { filePath: frame.script.fileName, line: frame.line };

                            var thisElement = frame.thisValue.getWrappedValue();

                            trace.currentTime = (new Date()).getTime();

                            trace.thisValue =
                            {
                                xPath: htmlHelper.getElementXPath(thisElement)
                            };

                            var propArray = {}, length = {};

                            var args = null;

                            if(frame.callee != null)
                            {
                                args = frame.callee.getProperty("arguments").value.getWrappedValue();
                            }

                            var firstArgument = args != null ? args[0] : null;

                            if(firstArgument == null)
                            {
                                var propArray = {}, length = {};
                                frame.callee.getProperties(propArray, length);
                                var calleeProperties = propArray.value;

                                for(var i = 0; i < calleeProperties != null && i < calleeProperties.length; i++)
                                {
                                    var value = calleeProperties[i].value.getWrappedValue();

                                    if(value instanceof Event)
                                    {
                                        firstArgument = value;
                                        break;
                                    }
                                }
                            }

                            trace.args =
                            {
                                targetXPath: firstArgument!= null ? htmlHelper.getElementXPath(firstArgument.target) : "",
                                originalTargetXPath: firstArgument != null ? htmlHelper.getElementXPath(firstArgument.originalTarget) : "",
                                currentTargetXPath: firstArgument != null ? htmlHelper.getElementXPath(firstArgument.currentTarget) : "",
                                explicitOriginalTargetXPath: firstArgument != null ? htmlHelper.getElementXPath(firstArgument.explicitOriginalTarget) : "",
                                rangeParentXPath : firstArgument != null ? htmlHelper.getElementXPath(firstArgument.rangeParent) : "",
                                relatedTargetXPath : firstArgument != null ? htmlHelper.getElementXPath(firstArgument.relatedTarget) : "",
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

                            if(trace.args.type == "elementEvent")
                            {
                                CU.reportError("Shit - elementEvent: " + trace.thisValue.xPath + " " + trace.line);
                            }

                            that.executionTrace.push(trace);
                        }
                    }
                    catch(e) { CU.reportError("Error when recording: " + e); }

                    return returnContinue;
                }
            };

            if(this.jsDebugger.pauseDepth == 1) { this.jsDebugger.unPause(); }

            this.jsDebugger.asyncOn(function(){});
            this.isRecording = true;
        }
        catch(e) { CU.reportError("Error while starting jsDebugger:" + e); }
    };

    this.stop = function()
    {
        try
        {
            if(this.jsDebugger == null) { CU.reportError("Error: jsDebugger is null when trying to stop"); return; }

            this.jsDebugger.off();
            this.isRecording = false;
            this.jsDebugger.functionHook = {};
            this.resultExecutionTrace = this.executionTrace;
            this.executionTrace = [];
        }
        catch(e) { CU.reportError("Error when stopping jsDebugger " + e); }
    };

    this.setScriptsToTrack = function(scriptsToTrack)
    {
        this.jsDebugger.clearFilters();

        scriptsToTrack.forEach(function(scriptToTrack)
        {
            this.jsDebugger.appendFilter(this.getFilterForFile(scriptToTrack.path));
        }, this);

        this.jsDebugger.appendFilter
        (
            {
                globalObject: null,
                flags: CI.jsdIFilter.FLAG_ENABLED,
                urlPattern: "*",
                startLine: 0,
                endLine: 0
            }
        );
    };

    this.getFilterForFile = function(file)
    {
        return {
            globalObject: null,
            flags: CI.jsdIFilter.FLAG_ENABLED | CI.jsdIFilter.FLAG_PASS,
            urlPattern: this.denormalizeUrl(file),
            startLine: 0,
            endLine: 0
        };
    };

    this.denormalizeUrl = function(url)
    {
        return url != null ? url.replace(/file:\/\/\//, "file:/") : "";
    };

    this.getProfilingSummary = function()
    {
       var executionTrace = this.resultExecutionTrace;
       var summary = {pcNum:0};
       for(var i = 0, length = executionTrace.length; i < length; i++)
       {
           var trace = executionTrace[i];
           var file = trace.file;
           var pc = trace.pc;
           var line = trace.line;

           if(summary[file] == null) { summary[file] = {}; }
           summary[file][line] = 1;
           summary.pcNum++;
       }
        var pcNum;
        var noExecutedLines = 0

        for(var prop in summary)
        {
            if(prop == "pcNum") { pcNum = summary[prop];}
            else
            {
                //is fileName
                var fileSummary = summary[prop];

                for(var line in fileSummary)
                {
                    noExecutedLines++;
                }
            }
        }

        return "NoExecutedLine: " + noExecutedLines + "\n" + "PcNum: " + pcNum;
    };

    this.getExecutionTrace = function() { return this.resultExecutionTrace; };

    this.getEventTrace = function()
    {
        return this.resultExecutionTrace;
    };

    this.getExecutionSummary = function()
    {
        if(this.resultExecutionTrace == null || this.resultExecutionTrace.length == 0) { return {}; }

        var executionSummary = [];
        var files = [];

        for(var i = 0; i < this.resultExecutionTrace.length; i++)
        {
            var lastExecutionTrace = i > 0 ? this.resultExecutionTrace[i - 1] : null;
            var currentExecutionTrace = this.resultExecutionTrace[i];

            if(!this.filePathAllreadyExists(files, currentExecutionTrace.filePath))
            {
                files.push({filePath : currentExecutionTrace.filePath});
            }

            if(lastExecutionTrace == null
            || lastExecutionTrace.filePath != currentExecutionTrace.filePath)
            {
                executionSummary.push
                (
                    {
                        filePath: currentExecutionTrace.filePath,
                        lines : []
                    }
                );
            }

            if(executionSummary.length == 0) { continue; }

            var lastSummary = executionSummary[executionSummary.length - 1];

            if(lastSummary != null)
            {
                lastSummary.lines.push
                (
                    {
                        lnNum: currentExecutionTrace.line,
                        thisVal: currentExecutionTrace.thisValue,
                        args: currentExecutionTrace.args,
                        isIntrExec: currentExecutionTrace.isInterestingExecution
                    }
                );
            }
        }

        var currentWebPagePath = fbHelper.getCurrentUrl().replace("file:///", "file:/");

        if(!this.filePathAllreadyExists(files, currentWebPagePath))
        {
            files.push(
            {
                filePath: currentWebPagePath,
                model: Firebug.FirecrowModule.htmlJson
            });
        }
        else
        {
            files.forEach(function(file)
            {
                if(file.filePath == currentWebPagePath)
                {
                    file.model = Firebug.FirecrowModule.htmlJson;
                }
            });
        }

        fbHelper.getScriptPaths().forEach(function(script)
        {
            script = script.replace("file:///", "file:/");
            if(!this.filePathAllreadyExists(files, script))
            {
                files.push({filePath : script});
            }
        }, this);

        return {
            files: files,
            executionSummary : executionSummary
        };
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
                elementXPath : htmlHelper.getElementXPath(input),
                checked : input.checked,
                value: input.value
            });
        }

        return inputStates;
    }

    /********* UTILS ********************/
    this.filePathAllreadyExists = function(files, filePath)
    {
        for(var i = 0; i < files.length; i++)
        {
            var currentFilePath = files[i].filePath;

            if(currentFilePath == filePath) { return true; }
        }

        return false;
    };
};
/*************************************************************************************/
}});