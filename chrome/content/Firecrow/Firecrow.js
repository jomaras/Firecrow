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

    var panelName = "Firecrow";

    Firebug.FirecrowModule = extend(Firebug.Module,
    {
        jsRecorder: null,
        persistedState: {},

        onGarbageCollect: function()
        {
            try
            {
                window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                      .getInterface(Components.interfaces.nsIDOMWindowUtils)
                      .garbageCollect();

                var domWindow = fbHelper.getWindow();

                domWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                    .getInterface(Components.interfaces.nsIDOMWindowUtils)
                    .garbageCollect();

                var mainWindow = fbHelper.getMainWindow();

                mainWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                    .getInterface(Components.interfaces.nsIDOMWindowUtils)
                    .garbageCollect();
            }
            catch(e){ alert(e); }
        },

        showPanel: function(browser, panel)
        {
            try
            {
                collapse(fbHelper.getElementByID("fcButtons"), !panel || panel.name != panelName);

                var menuPopup = fbHelper.getElementByID("fcSourceFilesMenuPopup");
                fbHelper.clearChildren(menuPopup);

                menuPopup.appendChild(fbHelper.createMenuItem(fbHelper.getCurrentPageName(), fbHelper.getCurrentUrl(), true));
                fbHelper.getElementByID("fcSourceFilesList").selectedIndex = 0;
            }
            catch(e) { alert("Error when showing panel"); }
        },

        getPanelContentContainer: function()
        {
            var context = Firebug.currentContext;
            var panel = context.getPanel(panelName);
            var parentNode = panel.panelNode;

            return parentNode;
        },

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

        onFirecrowShowDependenciesPress: function()
        {
            try
            {
                var communicationObject = { message: "Creating page model<br/>", setMessage: function(message) { this.message += message + "<br/>"; } };
                var notificationWindow = fbHelper.openWindow("chrome://firecrow/content/windows/notificationWindow.html", "Firecrow", communicationObject);

                this.loadUrlInHiddenIFrame(fbHelper.getCurrentUrl(), false, function(window, htmlJson)
                {
                    try
                    {
                        communicationObject.setMessage("Setting parent child relationship");
                        ASTHelper.setParentsChildRelationships(htmlJson);

                        communicationObject.setMessage("Generating code");
                        this.getPanelContentContainer().innerHTML = Firecrow.CodeMarkupGenerator.generateHtmlRepresentation(htmlJson);

                        communicationObject.setMessage("Simulating execution and building the dependency graph");

                        var result = Firecrow.Slicer.slice(htmlJson);
                        var browser = result.browser;
                        var dependencyGraph = result.dependencyGraph;

                        communicationObject.setMessage("Creating a connection between the model and html");
                        (new FBL.Firecrow.DependencyGraph.DependencyHighlighter(this.getPanelContentContainer(), dependencyGraph));

                        notificationWindow.close("");
                    }
                    catch(e) { alert("Error when trying to show code of the current page:" + e)};
                }, this);

            } catch(e) { alert("Error when pressing show code button"); }
        },

        onFirecrowPress: function()
        {
            try
            {
                var communicationObject =
                {
                    onConfigurationFinished: function(configOptions)
                    {
                        alert("Configuration finished");
                    }
                };

                fbHelper.openWindow("chrome://firecrow/content/windows/firecrowWindow.html", "Firecrow", communicationObject);
            }
            catch(e) { alert("Error when handling Firecrow press"); }
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

        onFirecrowASTButtonPress: function()
        {
            this.loadUrlInHiddenIFrame(fbHelper.getCurrentUrl(), false, function(window, htmlJson)
            {
                try
                {
                    var codeModelString = JSON.stringify(htmlJson, function(key, value)
                    {
                        if(key=="value" && value != null && value.constructor != null && value.constructor.name === "RegExp")
                        {
                            return { type: 'RegExpLiteral',  RegExpBase64: btoa(value.toString())};
                        }
                        return value;
                    });

                    prompt("JSON", codeModelString);
                    FileHelper.writeToFile(fbHelper.getCurrentUrl().replace("file:///", "") + "-codeModel.txt", codeModelString);
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
                if(this.jsRecorder == null)
                {
                    this.jsRecorder = new JsRecorder();
                }

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

                            //prompt("JSON", JSON.stringify(htmlJson));
                        }
                        catch(e) { alert("Error when converting to JSON model:" + e)};
                    }, this);
                }
                else
                {
                    var eventTrace = this.jsRecorder.getEventTrace();
                    alert(eventTrace.length);
                    FileHelper.writeToFile(fbHelper.getCurrentUrl().replace("file:///", "") + "-executionTrace.txt", JSON.stringify(eventTrace));
                    FileHelper.appendToFile("C:\\GitWebStorm\\Firecrow\\tests\\libraries\\executions.txt", fbHelper.getCurrentUrl() + " -- " + eventTrace.length);
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

    Firebug.FirecrowPanel = function() {};
    Firebug.FirecrowPanel.prototype = extend(Firebug.Panel,
    {
        name: panelName,
        title: panelName,

        initialize: function()
        {
            Firebug.Panel.initialize.apply(this, arguments);
        }
    });

    Firebug.registerPanel(Firebug.FirecrowPanel);
    Firebug.registerModule(Firebug.FirecrowModule);

    Firebug.registerStylesheet("chrome://Firecrow/skin/style.css");

    Firecrow.getWindow = function() { return Firecrow.fbHelper.getWindow(); };
    Firecrow.getDocument = function() { return Firecrow.fbHelper.getDocumentForSimulating(); }
// ************************************************************************************************
}});