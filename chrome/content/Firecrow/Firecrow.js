FBL.ns(function() { with (FBL) {
// ************************************************************************************************
	const CC = Components.classes;
	const CI = Components.interfaces;
	
	const FileHelper = Firecrow.FileHelper;
	const fbHelper = Firecrow.fbHelper;
	const htmlHelper = Firecrow.htmlHelper;
	const JsRecorder = Firecrow.JsRecorder;
	const javaInvoker = Firecrow.JavaInvoker;
    const CommandGenerator = Firecrow.CommandGenerator;
    const ASTHelper = Firecrow.ASTHelper;
	
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
					fbHelper.setButtonText("fiButton", "Stop Recording");
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
		
		onFirecrowButtonPress: function()
		{
//			try
//			{
//				(!this.persistedState.isAnalyzing ? (this.loadHtmlInHiddenIFrame(), this.scheduleRecording()) 	
//												  : this.stopRecording());
//			}
//			catch(e) { alert("Record button clicking error " + e);

            this.loadHtmlInHiddenIFrame(function(htmlJson)
            {
               prompt("JSON", JSON.stringify(htmlJson, function(key, value)
               {
                   if(key=="value" && value.constructor != null && value.constructor.name === "RegExp")
                   {
                       return { type: 'RegExpLiteral',  RegExpBase64: btoa(value.toString())};
                   }
                   return value;
               }));
            });
		},

        onFirecrowASTButtonPress: function()
        {
            var code = prompt("Enter source code");

            alert(ASTHelper.parseSourceCodeToASTString(code));
        },
		
		scheduleRecording: function()
		{
			try
			{
				this.persistedState.isAnalysisScheduled = true;
				this.persistedState.scripts = fbHelper.getScriptsPathsContents();
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
				this.jsRecorder.start(scriptsToTrack, this.persistedState.elementToTrackXPath);
			}
			catch(e){ alert("Recording js execution error: " + e); }
		},
		
		stopRecording: function()
		{
			try
			{
				this.persistedState.isAnalyzing = false;
				this.jsRecorder.stop();
			
				fbHelper.setButtonText("fiButton", "Record");
			
				var dataFile = fbHelper.installLocation + "data/data.txt";
				
				FileHelper.writeToFile(dataFile, JSON.stringify(this.jsRecorder.getExecutionSummary()));
				
				javaInvoker.invokeJavaMethod("doppelBrowser.jar", "DoppelBrowser", "GenerateExecutionData", [dataFile]);
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
					catch(e) { alert("Error while serializing html code" + e);}
				}, true);
				
				this.hiddenIFrame.webNavigation.loadURI(fbHelper.getCurrentUrl(), CI.nsIWebNavigation, null, null, null);
			}
			catch(e) { alert("Loading html in iFrame errror: " + e); }
		}
	});
	
	Firebug.registerModule(Firebug.FirecrowModule);
// ************************************************************************************************
}});