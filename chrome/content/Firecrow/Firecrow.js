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
                if(this.persistedState.isRecordingScheduled)
                {
                    fbHelper.setButtonText("profileButton", "Stop Profiling");
                    fbHelper.setButtonText("recordButton", "Stop Recording");

                    this.startRecording(this.persistedState.scripts);
                    this.persistedState.isRecordingScheduled = false;
                }
            }
            catch(e) { alert("Init context error " + e); }
        },

        loadedContext: function(context)
        {
            try
            {
                if(this.persistedState.isRecordingScheduled)
                {
                    this.persistedState.isRecordingScheduled = false;
                }

                fbHelper.asyncSetPluginInstallLocation("Firecrow@fesb.hr");
            }catch(e) { alert("Error when loading context: " + e); }
        },

        onFirecrowProfilePress: function()
        {
            try
            {
                if(this.persistedState.isRecording) { this.stopRecording(); }
                else { this.scheduleRecording(true); }
            }
            catch(e) { alert("Error when pressing Profiling button:" + e); }
        },

        onFirecrowRecordPress: function()
        {
            try
            {
                if(this.persistedState.isRecording) { this.stopRecording(); }
                else { this.scheduleRecording(); }
            }
            catch(e) { alert("Error when pressing Trace button:" + e); }
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

                var currentPageUrl = "file:///" + subdirectory.replace(/\\/g, "/") + "index.html";

                this.loadUrlInHiddenIFrame(currentPageUrl, true, function (window, model)
                {
                    try
                    {
                        var Firecrow = FBL.Firecrow;

                        var slicingVars = this.getDefaultSlicingVariablesFromWindow(window);

                        this.slicePage(currentPageUrl, model, slicingVars, function(errors)
                        {
                            errors == "" ? this.addMessageToCurrentDocument("OK - "  + subdirectory)
                                         : this.addMessageToCurrentDocument("ERROR - " + subdirectory + "  -> " + errors)

                            this.addMessageToCurrentDocument("********************************************************");

                            setTimeout(function(thisObj) { thisObj.processNextTest(); }, 500, this);
                        }, this);
                    }
                    catch(e) { alert("Error when testing a page: " + e); }
                }, this);
            }
            catch(e) { alert("Error when processing next test: " + e); }
        },

        getDefaultSlicingVariablesFromWindow: function(window)
        {
            var slicingVars = [];

            for(var propName in window)
            {
                if(propName.length > 1 && propName.length <= 3 && propName[0] == "a")
                {
                    var value = window[propName];

                    if(value === null) { value = "null"; }

                    slicingVars.push({name: propName, value: value});
                }
            }

            return slicingVars;
        },

        onFirecrowSliceButtonPress: function()
        {
            try
            {
                var currentPageLocation =  fbHelper.getCurrentUrl();

                this.loadUrlInHiddenIFrame(currentPageLocation, true, function(window, model)
                {
                    try
                    {
                        this.slicePage(currentPageLocation, model, this.getDefaultSlicingVariablesFromWindow(window), function(errors)
                        {
                            errors == "" ? prompt("Success", currentPageLocation + " - OK")
                                         : prompt ("Error", currentPageLocation + " - ERROR:" + errors);
                        });
                    }
                    catch(e) { alert("Error when processing html model in slicing: " + e + e.lineNumber) ; }
                }, this);
            }
            catch(e) { alert("Error when pressing Slice button: " + e);}
        },

        slicePage: function(currentPageLocation, model, slicingVariables, callbackFunction, callbackThis)
        {
            try
            {
                var Firecrow = FBL.Firecrow;

                var slicingCriteria = slicingVariables.map(function(slicingVar)
                {
                    return Firecrow.DependencyGraph.SlicingCriterion.createReadIdentifierCriterion(currentPageLocation, -1, slicingVar.name);
                });

                if(model.trackedElementsSelectors != null)
                {
                    model.trackedElementsSelectors.forEach(function(selector)
                    {
                        slicingCriteria.push(Firecrow.DependencyGraph.SlicingCriterion.createModifyDomCriterion(selector));
                    });
                }

                var browser = Firecrow.Slicer.slice(model, slicingCriteria);

                var slicedPageLocation = currentPageLocation.substring(currentPageLocation.lastIndexOf("/") + 1, currentPageLocation.length);

                var slicedPageUrl = currentPageLocation.replace(slicedPageLocation, "index-sliced.html");

                Firecrow.FileHelper.writeToFile
                (
                    slicedPageUrl.replace("file:///",""),
                    Firecrow.CodeTextGenerator.generateSlicedCode(model)
                );

                this.getErrorsString(browser, slicedPageUrl, slicingVariables, callbackFunction, callbackThis);
            }
            catch(e) { alert("Error when slicing page: " + e); }
        },

        getErrorsString: function(browser, slicedPageUrl, slicingVariables, callbackFunction, callbackThis)
        {
           try
           {
               var errors = browser.errorMessages.join("\r\n");

               slicingVariables.forEach(function(slicingVar)
               {
                   var propertyValue = browser.globalObject.getPropertyValue(slicingVar.name);
                   var val = propertyValue.value;

                   if(val === null) { val = "null";}

                   if(val.toString() != slicingVar.value.toString())
                   {
                       errors += "The value of " + slicingVar.name + " differs - is " + propertyValue.value + " and should be " + slicingVar.value + ";";
                   }
               }, this);

               this.loadUrlInHiddenIFrame(slicedPageUrl, true, function(window)
               {
                   var slicedPageVariables = this.getDefaultSlicingVariablesFromWindow(window);

                   for(var i = 0; i < slicingVariables.length; i++)
                   {
                       var originalPageVariable = slicingVariables[i];
                       var hasBeenFound = false;

                       for(var j = 0; j < slicedPageVariables.length; j++)
                       {
                           var slicedPageVariable = slicedPageVariables[j];
                           if(originalPageVariable.name == slicedPageVariable.name)
                           {
                               hasBeenFound = true;
                               if(originalPageVariable.value != slicedPageVariable.value)
                               {
                                   errors += "In sliced page: the value of " + originalPageVariable.name + " differs - is "
                                          + slicedPageVariable.value + " and should be " + originalPageVariable.value + "\r\n";
                               }
                           }
                       }
                   }

                   if(callbackFunction != null) { callbackFunction.call(callbackThis, errors); }
               }, this);

               return errors;
           }
           catch(e) { alert("Error when getting errors string while comparing slicing variables values and doppelBrowser values: " + e);}
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
            this.loadUrlInHiddenIFrame(fbHelper.getCurrentUrl(), false, function(window, htmlJson)
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
            }, this);
        },

        scheduleRecording: function(recordOnlyEventHandlerEntries)
        {
            try
            {
                this.persistedState.isRecordingScheduled = true;
                this.recordOnlyEventHandlerEntries = !!recordOnlyEventHandlerEntries;
                this.persistedState.scripts = fbHelper.getScriptsPathsAndModels();
                fbHelper.reloadPage();
            }
            catch(e) { alert("Scheduling recording error: " + e); }
        },

        startRecording: function(scriptsToTrack)
        {
            try
            {
                this.jsRecorder = new JsRecorder();
                this.persistedState.isRecording = true;
                if(this.recordOnlyEventHandlerEntries) { this.jsRecorder.start(scriptsToTrack); }
                else { this.jsRecorder.startProfiling(scriptsToTrack); }
            }
            catch(e){ alert("Recording js execution error: " + e); }
        },

        stopRecording: function()
        {
            try
            {
                this.persistedState.isRecording = false;
                this.jsRecorder.stop();

                fbHelper.setButtonText("profileButton", "Profile");
                fbHelper.setButtonText("recordButton", "Record");

                if(this.recordOnlyEventHandlerEntries)
                {
                    this.loadUrlInHiddenIFrame(fbHelper.getCurrentUrl(), false, function(window, htmlJson)
                    {
                        try
                        {
                            htmlJson.eventTraces = this.jsRecorder.getEventTrace();
                            htmlJson.trackedElementsSelectors = [];
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
                    }, this);
                }
                else
                {
                    FileHelper.writeToFile(fbHelper.getCurrentUrl().replace("file:///", "") + "-executionTrace.txt", JSON.stringify(this.jsRecorder.getEventTrace()));
                }

                this.recordOnlyEventHandlerEntries = false;
            }
            catch(e) { alert("Stopping analysis error:" + e); }
        },

        asyncGetPageModel: function(callbackFunction, thisValue)
        {
            this.loadUrlInHiddenIFrame(fbHelper.getCurrentUrl(), false, function(pageModel)
            {
                callbackFunction.call(thisValue, window, pageModel);
            });
        },

        loadUrlInHiddenIFrame: function(url, allowJavaScript, callbackFunction, thisObject)
        {
            try
            {
                var hiddenIFrame = fbHelper.getElementByID('fdHiddenIFrame');

                this.hiddenIFrame = hiddenIFrame;

                this.hiddenIFrame.style.height = "0px";
                this.hiddenIFrame.webNavigation.allowAuth = true;
                this.hiddenIFrame.webNavigation.allowImages = false;
                this.hiddenIFrame.webNavigation.allowJavascript = allowJavaScript;
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

                        hiddenIFrame.removeEventListener("DOMContentLoaded", listener, true);

                        callbackFunction.call(thisObject, document.defaultView, htmlJson);
                    }
                    catch(e) { alert("Error while serializing html code:" + e + "->" + e.lineNo + " " + e.href);}
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