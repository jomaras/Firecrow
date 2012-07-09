FBL.ns(function() { with (FBL) {
// ************************************************************************************************
	var CC = Components.classes;
	var CI = Components.interfaces;
	
	var FileHelper = Firecrow.FileHelper;
	var fbHelper = Firecrow.fbHelper;
	var htmlHelper = Firecrow.htmlHelper;
	var JsRecorder = Firecrow.JsRecorder;
    var CommandGenerator = Firecrow.CommandGenerator;
    var ASTHelper = Firecrow.ASTHelper;
	
	Firebug.FirecrowModule = extend(Firebug.Module,
	{
		jsRecorder: null,
		persistedState: {},
		
		initialize: function()
        {
            Firecrow.IsDebugMode = false;
        },
		
		initContext: function(context, persistedState)
		{
			try
			{
				if(this.persistedState.isAnalysisScheduled)
				{
					fbHelper.setButtonText("profileButton", "Stop Profiling");
					this.startRecording(this.persistedState.scripts);
					this.persistedState.isAnalysisScheduled = false;
				}
				else 
				{
					fbHelper.setButtonText("fiButton", "Record"); 
				}
			}
			catch(e) { alert("Init context error " + e); }
		},
		
		loadedContext: function(context)
		{
			try
			{
				if(this.persistedState.isAnalysisScheduled)
				{
					this.persistedState.isAnalysisScheduled = false;
				}
				
				fbHelper.asyncSetPluginInstallLocation("Firecrow@fesb.hr");
			}catch(e) { alert("Error when loading context: " + e); }
		},

        onFirecrowProfilePress: function()
        {
            try
            {
                (!this.persistedState.isAnalyzing ? this.scheduleRecording()
                                                  : this.stopRecording());
            }
            catch(e) { alert("Error when pressing Profiling button:" + e);; }
        },

        testSubdirectories: [],
        currentTestIndex: -1,

        onFirecrowRunTestsButtonPress: function()
        {
            try
            {
                var folderPath = prompt("Enter root test folder path(e.g.)", "C:\\GitWebStorm\\Firecrow\\tests\\sylvester\\");

                this.testSubdirectories = Firecrow.FileHelper.getDirectoriesFromFolder(folderPath);

                this.processNextTest();
            }
            catch(e) { alert("Error when running tests: " + e); }
        },

        processNextTest: function()
        {
            try
            {
                var subdirectory = this.testSubdirectories[++this.currentTestIndex];

                if(subdirectory == null) { return; }

                var currentPage = subdirectory + "index.html";
                var slicedPage = subdirectory + "index-sliced.html";

                this.loadUrlInHiddenIFrame(currentPage, function (model)
                {
                    try
                    {
                        var Firecrow = FBL.Firecrow;
                        var Browser = Firecrow.DoppelBrowser.Browser;
                        ASTHelper.setParentsChildRelationships(model);

                        var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();
                        var browser = new Browser();

                        var slicingVars = JSON.parse(Firecrow.FileHelper.readFromFile(subdirectory + "index-results.txt"))
                        browser.registerSlicingCriteria(slicingVars.map(function(slicingVar)
                        {
                            return Firecrow.DependencyGraph.SlicingCriterion.createReadIdentifierCriterion(currentPage, -1, slicingVar.name);
                        }));

                        browser.registerNodeCreatedCallback(dependencyGraph.handleNodeCreated, dependencyGraph);
                        browser.registerNodeInsertedCallback(dependencyGraph.handleNodeInserted, dependencyGraph);
                        browser.registerDataDependencyEstablishedCallback(dependencyGraph.handleDataDependencyEstablished, dependencyGraph);
                        browser.registerControlDependencyEstablishedCallback(dependencyGraph.handleControlDependencyEstablished, dependencyGraph);
                        browser.registerControlFlowConnectionCallback(dependencyGraph.handleControlFlowConnection, dependencyGraph);
                        browser.registerImportantConstructReachedCallback(dependencyGraph.handleImportantConstructReached, dependencyGraph);

                        browser.buildPageFromModel(model);

                        dependencyGraph.markGraph(model.htmlElement);
                        var errors = browser.errorMessages.join("<br/>");

                        slicingVars.forEach(function(slicingVar)
                        {
                            var propertyValue = browser.globalObject.getPropertyValue(slicingVar.name);
                            var val = propertyValue.value;
                            if(val === null) { val = "null";}

                            if(val.toString() != slicingVar.value.toString())
                            {
                                errors += "The value of " + slicingVar.name + " differs - is " + propertyValue.value + " and should be " + slicingVar.value + ";;";
                            }
                        }, this);

                        if(errors == "")
                        {
                            this.addMessageToCurrentDocument("OK - "  + subdirectory);
                        }
                        else
                        {
                            this.addMessageToCurrentDocument("ERROR - " + subdirectory + "  -> " + errors);
                        }

                        this.addMessageToCurrentDocument("********************************************************");

                        Firecrow.FileHelper.writeToFile(slicedPage, Firecrow.CodeTextGenerator.generateSlicedCode(model));

                        setTimeout(function(thisObj) { thisObj.processNextTest(); }, 500, this);
                    }
                    catch(e) { alert("Error when testing a page: " + e); }
                }, this);
            }
            catch(e) { alert("Error when processing next test: " + e); }
        },

        onFirecrowSliceButtonPress: function()
        {
            try
            {
                this.loadHtmlInHiddenIFrame(function(htmlModel)
                {
                    try
                    {
                        var Firecrow = FBL.Firecrow;
                        var Browser = Firecrow.DoppelBrowser.Browser;
                        var model = htmlModel;
                        ASTHelper.setParentsChildRelationships(htmlModel);
                        FBL.pageModel = model;

                        var currentPageLocation = fbHelper.getCurrentPageDocument().location.href;
                        var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();
                        var browser = new Browser();

                        var suggestedInput = "";
                        var window = fbHelper.getWindow();

                        for(var propName in window)
                        {
                            if(propName.length > 1 && propName.length <= 3 && propName[0] == "a")
                            {
                                if(suggestedInput != "") { suggestedInput += ","; }

                                suggestedInput += propName + ":" + window[propName];
                            }
                        }

                        var input = prompt("Enter identifiers to be sliced (comma separated, only simple : a1:3,a2:'4'...)", suggestedInput);
                        var slicingVars = input.trim().split(",").map(function(item)
                        {
                            var parts = item.trim().split(":");
                            return { name: parts[0], value: parts[1]};
                        });
                        browser.registerSlicingCriteria(slicingVars.map(function(slicingVar)
                        {
                            return Firecrow.DependencyGraph.SlicingCriterion.createReadIdentifierCriterion(currentPageLocation, -1, slicingVar.name);
                        }));

                        browser.registerNodeCreatedCallback(dependencyGraph.handleNodeCreated, dependencyGraph);
                        browser.registerNodeInsertedCallback(dependencyGraph.handleNodeInserted, dependencyGraph);
                        browser.registerDataDependencyEstablishedCallback(dependencyGraph.handleDataDependencyEstablished, dependencyGraph);
                        browser.registerControlDependencyEstablishedCallback(dependencyGraph.handleControlDependencyEstablished, dependencyGraph);
                        browser.registerControlFlowConnectionCallback(dependencyGraph.handleControlFlowConnection, dependencyGraph);
                        browser.registerImportantConstructReachedCallback(dependencyGraph.handleImportantConstructReached, dependencyGraph);

                        browser.buildPageFromModel(model, function()
                        {
                            dependencyGraph.markGraph(model.htmlElement);
                            var errors = "";

                            slicingVars.forEach(function(slicingVar)
                            {
                                var propertyValue = browser.globalObject.getPropertyValue(slicingVar.name);
                                var val = propertyValue.value;
                                if(val === null) { val = "null";}

                                if(val.toString() != slicingVar.value.toString())
                                {
                                    errors += "The value of " + slicingVar.name + " differs - is " + propertyValue.value + " and should be " + slicingVar.value + ";;";
                                }
                            }, this);

                            var pageName  = currentPageLocation.substring(currentPageLocation.lastIndexOf("/") + 1, currentPageLocation.length)

                            if(errors == "")
                            {
                                prompt("Success", currentPageLocation + " - OK");

                                Firecrow.FileHelper.writeToFile
                                (
                                    currentPageLocation.replace(pageName, "index-results.txt").replace("file:///",""),
                                    JSON.stringify(slicingVars)
                                );
                            }
                            else { prompt ("Error", currentPageLocation + " - ERROR:" + errors); }

                            Firecrow.FileHelper.writeToFile
                            (
                                currentPageLocation.replace(pageName, "index-sliced.html").replace("file:///",""),
                                Firecrow.CodeTextGenerator.generateSlicedCode(model)
                            );
                        });
                    }
                    catch(e) { alert("Error when processing html model in slicing: " + e); }
                });
            }
            catch(e) { alert("Error when pressing Slice button: " + e);}
        },

        addMessageToCurrentDocument: function(message)
        {
            try
            {
                var document = Firecrow.fbHelper.getDocument();
                var div = document.createElement("div");

                if(message.indexOf("OK") == 0) { div.style.color = "green"; }
                else if(message.indexOf("ERROR") == 0){ div.style.color = "red"; }

                div.innerHTML = message;
                document.getElementsByTagName("body")[0].appendChild(div);

                Firecrow.fbHelper.getWindow().scrollTo(0, document.body.scrollHeight);
            }
            catch(e) { alert("Error:" + e);}
        },

        onFirecrowASTButtonPress: function()
		{
            this.loadHtmlInHiddenIFrame(function(htmlJson)
            {
                try
                {
                    prompt("JSON", JSON.stringify(htmlJson, function(key, value)
                    {
                        if(key=="value" && value != null && value.constructor != null && value.constructor.name === "RegExp")
                        {
                            return { type: 'RegExpLiteral',  RegExpBase64: btoa(value.toString())};
                        }
                        return value;
                    }));
                }
                catch(e) { alert("Error when converting to JSON model:" + e)};
            });
		},
		
		scheduleRecording: function()
		{
			try
			{
				this.persistedState.isAnalysisScheduled = true;
				this.persistedState.scripts = fbHelper.getScriptsPathsAndModels();
				this.persistedState.elementToTrackXPath = "/html/body";
				fbHelper.reloadPage();
			}
			catch(e) { alert("Scheduling recording error: " + e); }
		},
		
	    startRecording: function(scriptsToTrack)
		{
			try
			{
				this.jsRecorder = new JsRecorder();
				this.persistedState.isAnalyzing = true;
				this.jsRecorder.startProfiling(scriptsToTrack);
			}
			catch(e){ alert("Recording js execution error: " + e); }
		},
		
		stopRecording: function()
		{
			try
			{
				this.persistedState.isAnalyzing = false;
				this.jsRecorder.stop();
			
				fbHelper.setButtonText("profileButton", "Profile");

                alert(this.jsRecorder.getProfilingSummary());
			}
			catch(e) { alert("Stopping analysis error:" + e); }
		},

        asyncGetPageModel: function(callbackFunction, thisValue)
        {
            this.loadHtmlInHiddenIFrame(function(pageModel)
            {
                callbackFunction.call(thisValue, pageModel);
            });
        },
		
		loadHtmlInHiddenIFrame: function(callbackFunction)
		{
			try
			{
				var hiddenIFrame = fbHelper.getElementByID('fdHiddenIFrame');

                this.hiddenIFrame = hiddenIFrame;
				
				this.hiddenIFrame.style.height = "0px";
				this.hiddenIFrame.webNavigation.allowAuth = true;
				this.hiddenIFrame.webNavigation.allowImages = false;
				this.hiddenIFrame.webNavigation.allowJavascript = false;
				this.hiddenIFrame.webNavigation.allowMetaRedirects = true;
				this.hiddenIFrame.webNavigation.allowPlugins = false;
				this.hiddenIFrame.webNavigation.allowSubframes = false;

				this.hiddenIFrame.addEventListener("DOMContentLoaded", function listener(e)
				{ 
					try
					{
						Firebug.FirecrowModule.htmlJson = htmlHelper.serializeToHtmlJSON(e.originalTarget.wrappedJSObject);
                        callbackFunction(Firebug.FirecrowModule.htmlJson);

                        hiddenIFrame.removeEventListener("DOMContentLoaded", listener, true);
					}
					catch(e) { alert("Error while serializing html code:" + e);}
				}, true);
				
				this.hiddenIFrame.webNavigation.loadURI(fbHelper.getCurrentUrl(), CI.nsIWebNavigation, null, null, null);
			}
			catch(e) { alert("Loading html in iFrame errror: " + e); }
		},

        loadUrlInHiddenIFrame: function(url, callbackFunction, thisObject)
        {
            try
            {
                var hiddenIFrame = fbHelper.getElementByID('fdHiddenIFrame');

                this.hiddenIFrame = hiddenIFrame;

                this.hiddenIFrame.style.height = "0px";
                this.hiddenIFrame.webNavigation.allowAuth = true;
                this.hiddenIFrame.webNavigation.allowImages = false;
                this.hiddenIFrame.webNavigation.allowJavascript = false;
                this.hiddenIFrame.webNavigation.allowMetaRedirects = true;
                this.hiddenIFrame.webNavigation.allowPlugins = false;
                this.hiddenIFrame.webNavigation.allowSubframes = false;

                this.hiddenIFrame.addEventListener("DOMContentLoaded", function listener(e)
                {
                    try
                    {
                        var document = e.originalTarget.wrappedJSObject;
                        var htmlJson = htmlHelper.serializeToHtmlJSON
                        (
                            document,
                            Firecrow.fbHelper.getScriptsPathsAndModels(document),
                            Firecrow.fbHelper.getStylesPathsAndModels(document)
                        );
                        callbackFunction.call(thisObject, htmlJson);

                        hiddenIFrame.removeEventListener("DOMContentLoaded", listener, true);
                    }
                    catch(e) { alert("Error while serializing html code:" + e);}
                }, true);

                this.hiddenIFrame.webNavigation.loadURI(url, CI.nsIWebNavigation, null, null, null);
            }
            catch(e) { alert("Loading html in iFrame errror: " + e); }
        }
	});
	
	Firebug.registerModule(Firebug.FirecrowModule);

    Firecrow.getWindow = function() { return Firecrow.fbHelper.getWindow(); };
    Firecrow.getDocument = function() { return Firecrow.fbHelper.getDocument(); }
// ************************************************************************************************
}});