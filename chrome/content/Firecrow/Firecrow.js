FBL.ns(function() { with (FBL) {
// ************************************************************************************************
	var CC = Components.classes;
	var CI = Components.interfaces;
	
	var FileHelper = Firecrow.FileHelper;
	var fbHelper = Firecrow.fbHelper;
	var htmlHelper = Firecrow.htmlHelper;
	var JsRecorder = Firecrow.JsRecorder;
	var javaInvoker = Firecrow.JavaInvoker;
    var CommandGenerator = Firecrow.CommandGenerator;
    var ASTHelper = Firecrow.ASTHelper;
	
	Firebug.FirecrowModule = extend(Firebug.Module,
	{
		jsRecorder: null,
		persistedState: {},
		
		initialize: function() {},
		
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

        onFirecrowSliceButtonPress: function()
        {
            try
            {
                this.loadHtmlInHiddenIFrame(function(htmlModel)
                {
                    try
                    {
                        var Firecrow = FBL.Firecrow;
                        var WebFile = Firecrow.DoppelBrowser.WebFile;
                        var Browser = Firecrow.DoppelBrowser.Browser;
                        var model = htmlModel;

                        var dependencyGraph = new Firecrow.DependencyGraph.DependencyGraph();
                        var browser = new Browser();
                        prompt("Enter slicing criteria");
                        browser.registerSlicingCriteria(model.results.map(function(result)
                        {
                            for(var propName in result)
                            {
                                return Firecrow.DependencyGraph.SlicingCriterion.createReadIdentifierCriterion(webFile.url, -1, propName);
                            }
                        }));

                        browser.registerNodeCreatedCallback(dependencyGraph.handleNodeCreated, dependencyGraph);
                        browser.registerNodeInsertedCallback(dependencyGraph.handleNodeInserted, dependencyGraph);
                        browser.registerDataDependencyEstablishedCallback(dependencyGraph.handleDataDependencyEstablished, dependencyGraph);
                        browser.registerControlFlowConnectionCallback(dependencyGraph.handleControlFlowConnection, dependencyGraph);
                        browser.registerImportantConstructReachedCallback(dependencyGraph.handleImportantConstructReached, dependencyGraph);

                        browser.buildPageFromModel(model, function()
                        {
                            dependencyGraph.markGraph(model.model.htmlElement);

                            setTitle();

                            checkForErrors(model);

                            document.getElementById("sourceTextContainer").textContent = FBL.Firecrow.CodeTextGenerator.generateCode(model.model);
                            document.getElementById("slicedSourceTextContainer").textContent = FBL.Firecrow.CodeTextGenerator.generateSlicedCode(model.model);
                        });
                    }
                    catch(e) { alert("Error when processing html model in slicing"); }
                });
            }
            catch(e) { alert("Error when pressing Slice button: " + e);}
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
		}
	});
	
	Firebug.registerModule(Firebug.FirecrowModule);

    Firecrow.getWindow = function() { return Firecrow.fbHelper.getWindow(); };
    Firecrow.getDocument = function() { return Firecrow.fbHelper.getDocument(); }
// ************************************************************************************************
}});