FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var CC = Components.classes;
var CI = Components.interfaces;

var fbHelper = Firecrow.fbHelper;

Firecrow.JsRecorder = function ()
{
    this.jsDebugger = CC["@mozilla.org/js/jsd/debugger-service;1"].getService(CI.jsdIDebuggerService);
    
    this.executionTrace = [];
    this.helperVars = 
    {
        lastExecutedLine : -1,
        lastPc: -1,
        stackDepth: -1,
        frameHelper: null
    };
        
    var that = this;
    this.myFilePathCache = [];
    
    this.start = function(scriptsToTrack, elementToTrackXPath)
    {
    	this.elementToTrackXPath = elementToTrackXPath;
        try
        {
            if(this.jsDebugger == null) { alert("Error: jsDebugger is null when trying to start"); return; }
            
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
        			if(!that.isRecording || frame.pc != 0) { return; }
        			
        			var trace = { filePath: frame.script.fileName, line: frame.line };
        			
        			var stackDepth = this.getStackDepth(frame);
        			
        			//is event handler
        			if(stackDepth == 0)
        			{
        				trace.thisValue = 
                		{
            				xPath: that.getElementXPath(frame.thisValue.getWrappedValue())
                		};
                		
                		var args = frame.callee.getProperty("arguments").value.getWrappedValue();
                		var firstArgument = args[0];
                		
                		trace.args = 
                		{
                			targetXPath: that.getElementXPath(firstArgument.target),
                			originalTargetXPath: that.getElementXPath(firstArgument.originalTarget),
                			currentTargetXPath: that.getElementXPath(firstArgument.currentTarget),
                			explicitOriginalTargetXPath: that.getElementXPath(firstArgument.explicitOriginalTarget),
        					rangeParentXPath : that.getElementXPath(firstArgument.rangeParent),
        					relatedTargetXPath : that.getElementXPath(firstArgument.relatedTarget),
                			clientX: firstArgument.clientX,
                			clientY: firstArgument.clientY,
                			screenX: firstArgument.screenX,
                			screenY: firstArgument.screenY,
                			type: firstArgument.type
                		};
        			}
        			
        			that.executionTrace.push(trace);
        			
        			return returnContinue;
        		}
            };
            
	        if(this.jsDebugger.pauseDepth == 1) { this.jsDebugger.unPause(); }
		
	        this.jsDebugger.asyncOn(function(){});
	        this.isRecording = true;
        }
        catch(e) { alert("Error while starting jsDebugger:" + e); }
    };
    
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
    
    this.stop = function()
    {
    	try
    	{
	        if(this.jsDebugger == null) { alert("Error: jsDebugger is null when trying to stop"); return; }
	        
	        this.jsDebugger.off();
	        this.isRecording = false;
	        this.jsDebugger.functionHook = {};
    	}
    	catch(e) { alert("Error when stopping jsDebugger " + e); }
    };

    this.setScriptsToTrack = function(scriptsToTrack)
    {
    	scriptsToTrack.forEach(function(scriptToTrack)
    	{
    		this.jsDebugger.appendFilter(this.getFilterForFile(scriptToTrack));
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
        return url ? url.replace(/file:\/\/\//, "file:/") : "";
    };
    
    this.getExecutionSummary = function()
    {
    	if(this.executionTrace == null || this.executionTrace.length == 0) { return {}; }
    	
    	var executionSummary = [];
    	var files = [];
    	
    	for(var i = 0; i < this.executionTrace.length; i++)
    	{
    		var lastExecutionTrace = i > 0 ? this.executionTrace[i - 1] : null;
    		var currentExecutionTrace = this.executionTrace[i];
    		
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