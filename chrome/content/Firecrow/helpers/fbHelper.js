FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const CC = Components.classes;
const CI = Components.interfaces;

const fileHelper = Firecrow.FileHelper;
const valueTypeHelper = Firecrow.ValueTypeHelper;
const astHelper = Firecrow.ASTHelper;

Firecrow.fbHelper = 
{
	installLocation: "",
	openWindow: function (pathToWindowXul, windowTitle, args)
	{
		try
		{
			args.wrappedJSObject = args;
	
	        var windowWatcher = CC["@mozilla.org/embedcomp/window-watcher;1"].getService(CI.nsIWindowWatcher);
	
	        return windowWatcher.openWindow
	        (
	            null,
	            pathToWindowXul,
	            windowTitle,
	            "chrome,centerscreen",
	            args
	        );
	    }
	    catch (e) { alert("Error opening window:" + e); }
	},
	
	getElementByID: function(elementID)
	{
		try{ return Firebug.chrome.$(elementID); }
		catch(e) { alert("Error when getting element by id: " + e);}
	},
	
	getExternalScriptPaths: function()
    {
    	try
    	{
	    	var document = this.getCurrentPageDocument();
	        
            var scripts = [];
            
            valueTypeHelper.convertToArray(document.querySelectorAll('script[src]')).forEach(function(script)
            {
            	scripts.push(script.src);
            });
            
            return scripts;
    	}
    	catch(e) { alert("Getting script paths error " + e); }
    },
    
    getScriptsPathsAndModels: function()
    {
    	try
    	{
	    	var returnValue = [];
	    	
	    	var document = this.getCurrentPageDocument();
	    	
	    	var currentPageUrl = document.baseURI;
	    	var currentPageContent = fileHelper.getFileContentFromUrl(currentPageUrl);
	    	var currentScriptIndex = 0;

            valueTypeHelper.convertToArray(document.querySelectorAll("script")).forEach(function(scriptElement)
	    	{
	    		if(scriptElement.src == "")
	    		{
	    			returnValue.push
	        		({
	        			path: currentPageUrl,
	        			model: astHelper.parseSourceCodeToAST
	        			(
	        				scriptElement.textContent,
	        				currentPageUrl,
	        				(function()
	        				{
	        					var scriptStringIndex = currentPageContent.indexOf(scriptElement.textContent, currentScriptIndex);
	        					
	        					if(scriptStringIndex == null || scriptStringIndex == -1) 
	        					{
	        						return -1; 
	        					}
	        					else
	        					{
	        						currentScriptIndex = scriptStringIndex + scriptElement.textContent.length;
	        						return currentPageContent.substring(0, scriptStringIndex).split("\n").length;
	        					}
	        				})()
	        			)
	        		});
	    		}
	    		else
	    		{
	    			returnValue.push
	        		({
	        			path: scriptElement.src,
	        			model: astHelper.parseSourceCodeToAST
	        			(
	        				fileHelper.getFileContentFromUrl(scriptElement.src),
	        				scriptElement.src,
	        				1
	        			)
	        		});
	    		}
	    	});

            //Set parent child relationship for each element
            returnValue.forEach(function(scriptModel)
            {
                astHelper.traverseAst(scriptModel, function(currentElement, elementName, parentElement)
                {
                    if(valueTypeHelper.isObject(currentElement))
                    {
                        currentElement.parent = parentElement;
                    }
                });
            });

	    	return returnValue;
    	}
    	catch(e) { alert("An error has occured while trying to get script paths and models: " + e);}
    },
    
    getMainWindow: function()
    {
    	return window.QueryInterface(CI.nsIInterfaceRequestor)
    				 .getInterface(CI.nsIWebNavigation)
        			 .QueryInterface(CI.nsIDocShellTreeItem)
        			 .rootTreeItem
        			 .QueryInterface(CI.nsIInterfaceRequestor)
        			 .getInterface(CI.nsIDOMWindow);
    },
    
    getCurrentBrowser: function()
    {
    	try { return this.getMainWindow().getBrowser().selectedBrowser; }
        catch (e) { alert("Getting current browser error: " + e); }
    },
    
    getCurrentPageDocument: function()
    {
    	try { return content.document; }
    	catch(e) { alert("Error when getting current page document " + e ); } 
    },
    
    getCurrentUrl: function()
	{
		try { return this.getCurrentPageDocument().baseURI; }
		catch(e) { alert("Error when getting current url: " + e); }
	},
    
    reloadPage: function ()
    {
    	try { this.getCurrentBrowser().reload(); }
    	catch (e) { alert("Reloading page error: " + e); }
    },
    
    getExtensionFilePath: function ()
    {
        try
        {
        	var directoryService = CC["@mozilla.org/file/directory_service;1"].getService(CI.nsIProperties);
        	var fmDir = directoryService.get("ProfD", CI.nsIFile);
        	
        	return fmDir.target + "/extensions/Firecrow/";
        }
        catch (e) { alert("Error while getting filePath" + e); }
    },
    
	setButtonText: function(buttonId, text)
	{
		try
    	{
    		var button = this.getElementByID(buttonId);
    	
    		if(button != null) { button.label = text; }
    		else { alert("Could not find button"); }
    	}
    	catch(e) { alert("Setting button text error: " + e); }
    },
    
    asyncSetPluginInstallLocation: function(ext_id)
    {
    	try
    	{
	    	Components.utils.import("resource://gre/modules/AddonManager.jsm");
	        
	        AddonManager.getAddonByID(ext_id, function(addon) 
	        {
	        	try
	        	{
		        	var installLocation = addon.getResourceURI().path;
		        	
		        	if(installLocation.indexOf('/') == 0)
		        	{
		        		installLocation = installLocation.substring(1, installLocation.length);
		        	}
		        	
		        	Firecrow.fbHelper.installLocation = installLocation;
	        	}
	        	catch(e) { alert("Error when getting addon: " + e); }
	        });
    	}
    	catch(e) { alert("Error when async setting plugin location: " + e); }
    }
};
/*************************************************************************************/
}});