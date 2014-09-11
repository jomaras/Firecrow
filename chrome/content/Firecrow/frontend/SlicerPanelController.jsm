var EXPORTED_SYMBOLS = ["SlicerPanelController"];

const Cu = Components.utils;
const Ci = Components.interfaces;
const Cc = Components.classes;

Cu.import("chrome://Firecrow/content/frontend/FireDataAccess.jsm");
Cu.import("chrome://Firecrow/content/frontend/JsRecorder.jsm");
Cu.import("chrome://Firecrow/content/frontend/FirefoxHelper.jsm");
Cu.import("chrome://Firecrow/content/helpers/FileHelper.js");
Cu.import("chrome://Firecrow/content/helpers/UriHelper.js");

const require = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools.require;
const promise = require("sdk/core/promise");
const Editor = require("devtools/sourceeditor/editor");

var SlicerPanelController = function(extensionWindow, extensionDocument, getCurrentPageWindowFunction, getCurrentPageDocumentFunction)
{
    this._extensionDocument = extensionDocument;
    this._extensionWindow = extensionWindow;

    this._hiddenIFrame = this._extensionDocument.getElementById("fdHiddenIFrame");
    this._slicingFrame = this._extensionDocument.getElementById("slicingFrame");

    this._getCurrentPageWindow = getCurrentPageWindowFunction;
    this._getCurrentPageDocument = getCurrentPageDocumentFunction;

    this._editorContainer = extensionDocument.getElementById("editor");

    this._addSlicingCriteriaButton = extensionDocument.getElementById("addSlicingCriteriaButton");
    this._addSlicingCriteriaButton.onclick = function(e) { this._onAddSlicingCriteriaClick(e); }.bind(this);

    this._recordButton = extensionDocument.getElementById("recordButton");
    this._recordButton.onclick = function(e) { this._onRecordClick(e); }.bind(this);

    this._recordOptionsElement = extensionDocument.getElementById("recordOptions");

    this._sourcesMenuPopup = extensionDocument.getElementById("sourcesMenuPopup");
    this._sourcesMenuList = extensionDocument.getElementById("sourcesMenuList");

    this._sourcesMenuPopup.addEventListener("popupshowing", function(e) { this._onSourcesPopupShowing(e); }.bind(this), false);
    this._sourcesMenuList.addEventListener("command", function(e){ this._onSourcesPopupItemSelected(e); }.bind(this));

    this._slicingCriteriaList = extensionDocument.getElementById("slicingCriteriaList");
    this._recordingsGroup = extensionDocument.getElementById("recordingsGroup");

    this._slicingButton = extensionDocument.getElementById("slicingButton");
    this._slicingButton.onclick = function(e) { this._onSlicingClick(e); }.bind(this);

    this._slicingOptionsElement = extensionDocument.getElementById("slicingOptions");
    this._slicingResultOptions = extensionDocument.getElementById("slicingResultOptions");

    this._saveModelButton = extensionDocument.getElementById("saveModelButton");
    this._saveModelButton.onclick = function(e) { this._onSaveModelClick(e); }.bind(this);

    this._saveModelAndTraceButton = extensionDocument.getElementById("saveModelAndTraceButton");
    this._saveModelAndTraceButton.onclick = function(e) { this._onSaveModelAndTraceClick(e);}.bind(this);

    this._esprimaCheckbox = extensionDocument.getElementById("esprimaCheckbox");

    this._codeEditorButton = extensionDocument.getElementById("codeEditorButton");
    this._codeEditorButton.onclick = function(e) { this._onCodeEditorClick(e); }.bind(this);

    FireDataAccess._window = this._extensionWindow;
    FireDataAccess.setBrowser(extensionDocument.getElementById("invisibleBrowser"));

    this._currentSelectedFile = null;
    this._ignoreBreakpointChanges = true;
    this._pathSourceLoadedCallbackMap = {};
    this._slicingCriteriaMap = { DOM: {}};
    this._selectors = [];

    this._externalFilesMap = {};

    this._createSourceCodeViewer();
    this._updateCurrentRecordings();
};

SlicerPanelController.prototype =
{
    reset: function(newPageUrl)
    {
        this._sourcesMenuPopup.innerHTML = "";

        this._sourcesMenuList.setAttribute("label","Select Source file");

        this.editor.setText("---- SELECT SOURCE FILE ----");

        this._updateCurrentRecordings(newPageUrl);
    },

    markAsSelected: function()
    {
        this.isSelected = true;
    },

    markAsDeselected: function()
    {
        this.isSelected = false;
    },

    _onSlicingClick: function(e)
    {
        if(e.target == this._slicingButton
        && e.currentTarget == this._slicingButton && e.originalTarget != this._slicingButton)
        {
                 if (this._slicingResultOptions.value == "ExtractSlicedCode") { this._extractAndShowSlicedCode(); }
            else if (this._slicingResultOptions.value == "MarkSlicedCode") { this._extractAndMarkSlicedCode(); }
        }

        e.preventDefault();
        e.stopPropagation();
    },

    _extractAndMarkSlicedCode: function()
    {
        var dialog = this._extensionWindow.openDialog('chrome://Firecrow/content/frontend/codeMarkupDialog.xul', '', 'chrome,dialog,centerscreen');

        FireDataAccess.asyncGetPageModel(this._getCurrentPageDocument().baseURI, this._hiddenIFrame, function(window, htmlJson)
        {
            var model = {
                url: this._getCurrentPageDocument().baseURI,
                model: htmlJson,
                trackedElementsSelectors: this._selectors,
                eventTraces: this._getSelectedEventTraces()
            };

            switch(this._slicingOptionsElement.value)
            {
                case "PhantomJs":
                    return this._performMarkSlicedCodeInPhantomJs(model, dialog);
                case "SlimerJs":
                case "Firefox":
                default:
                    this._performMarkSlicedCodeInFirefox(model, dialog);
            }
        }.bind(this), this._esprimaCheckbox.checked);
    },

    _extractAndShowSlicedCode: function()
    {
        var dialog = this._extensionWindow.openDialog('chrome://Firecrow/content/frontend/codeTextDialog.xul', '', 'chrome,dialog,centerscreen');

        FireDataAccess.asyncGetPageModel(this._getCurrentPageDocument().baseURI, this._hiddenIFrame, function(window, htmlJson)
        {
            var model = {
                url: this._getCurrentPageDocument().baseURI,
                model: htmlJson,
                trackedElementsSelectors: this._selectors,
                eventTraces: this._getSelectedEventTraces()
            };

            switch(this._slicingOptionsElement.value)
            {
                case "PhantomJs":
                    return this._performSlicingInPhantomJs(model, dialog);
                case "SlimerJs":
                    return this._performSlicingInSlimerJs(model, dialog);
                case "Firefox":
                default:
                    this._performSlicingInFirefox(model, dialog);
            }
        }.bind(this), this._esprimaCheckbox.checked);
    },

    _performMarkSlicedCodeInPhantomJs: function(model, dialog)
    {
        this._performOperationInPhantomJs(model, dialog, [true], function(resultText)
        {
            dialog.setSourceMarkup(resultText);
        });
    },

    _performSlicingInPhantomJs: function(model, dialog)
    {
        this._performOperationInPhantomJs(model, dialog, [], function(resultText)
        {
            dialog.setSourceCode(resultText);
        });
    },

    _performOperationInPhantomJs: function(model, dialog, additionalArguments, processPhantomJsResultFunction)
    {
        var phantomJsFilePath = FireDataAccess.getPhantomJsFilePath(this._extensionWindow);

        if(phantomJsFilePath == null || phantomJsFilePath == "") { Cu.reportError("Unknown phantomjs location"); return; }

        dialog.logMessage("Started slicing in Phantom Js..");
        dialog.logMessage("Serializing model..");

        FileHelper.saveModelForPhantomJs(model, function(modelPath)
        {
            dialog.logMessage("Model saved to:" + modelPath);

            FileHelper.transferScriptsForSlicing(function(scriptPath)
            {
                FirefoxHelper.executeAsyncProgram(phantomJsFilePath, [scriptPath].concat(additionalArguments), function()
                {
                    dialog.logMessage("Phantom js finished!");
                    var resultFile = scriptPath.replace(/[a-zA-Z]+\.[a-zA-Z]+$/, "result.txt");
                    dialog.logMessage("Reading result from: " + resultFile);
                    processPhantomJsResultFunction && processPhantomJsResultFunction(FileHelper.readFromFile(resultFile));
                });
            }.bind(this));
        }.bind(this));
    },

    _performSlicingInSlimerJs: function(model, dialog)
    {
        dialog.logMessage("Slicing in SlimerJs not yet supported");
    },

    _performMarkSlicedCodeInFirefox: function(model, dialog)
    {
        this._slicingFrame.contentWindow.console.log = dialog.logMessage;

        dialog.logMessage("Slicing started in Firefox - UI might become unresponsive for minutes at a time");

        this._extensionWindow.setTimeout(function()
        {
            dialog.setSourceMarkup(this._slicingFrame.contentWindow.getSlicedCodeMarkup(model));

            dialog.setResourcePaths(this._getResourcePaths());

        }.bind(this), 1000);
    },

    _getResourcePaths: function()
    {
        var currentPageUrl = this._getCurrentPageDocument().baseURI;
        var resourcePaths = UriHelper || UriHelper.cache || [];

        var adjustedPaths = [];

        return adjustedPaths;
    },

    _performSlicingInFirefox: function(model, dialog)
    {
        this._slicingFrame.contentWindow.console.log = dialog.logMessage;

        dialog.logMessage("Slicing started in Firefox - UI might become unresponsive for minutes at a time");

        this._extensionWindow.setTimeout(function()
        {
            dialog.setSourceCode(this._slicingFrame.contentWindow.performSlicing(model), model);
        }.bind(this), 1000);
    },

    _getSelectedEventTraces: function()
    {
        if(this._recordingsGroup.selectedItem == null) { return []; }

        for(var i = 0; i < this._recordingsFiles.length; i++)
        {
            if(this._recordingsFiles[i].path == this._recordingsGroup.selectedItem.filePath)
            {
                try
                {
                    return JSON.parse(this._recordingsFiles[i].content);
                }
                catch(e)
                {
                    Cu.reportError("Error when parsing eventTrace:" + e);
                    return [];
                }
            }
        }
    },

    _onSaveModelClick: function()
    {
        var selectedFolder = FirefoxHelper.promptUserForFolder(this._extensionWindow, "Select destination folder");

        if(selectedFolder == "" || selectedFolder == null) { return; }

        FireDataAccess.saveModel(selectedFolder, this._getCurrentPageDocument().baseURI, this._hiddenIFrame, this._esprimaCheckbox.checked);
    },

    _onSaveModelAndTraceClick: function()
    {
        var selectedFolder = FirefoxHelper.promptUserForFolder(this._extensionWindow, "Select destination folder");

        if(selectedFolder == "" || selectedFolder == null) { return; }

        FireDataAccess.saveModelAndTrace(selectedFolder, this._getCurrentPageDocument().baseURI, this._getSelectedEventTraces(), this._selectors, this._hiddenIFrame, this._esprimaCheckbox.checked);
    },

    _onCodeEditorClick: function()
    {
        var dialog = this._extensionWindow.openDialog('chrome://Firecrow/content/frontend/codeEditorDialog.xul', '', 'chrome,dialog,centerscreen');
    },

    _onRecordClick: function(e)
    {
        if(e.target == this._recordButton
        && e.currentTarget == this._recordButton && e.originalTarget != this._recordButton)
        {
            this._profileAllExecutions = this._recordOptionsElement.value == "All";

            if(!this._recordButton.checked)
            {
                var currentLocation = this._getCurrentPageDocument().location;
                this._startProfiling();
                currentLocation.reload();
            }
            else
            {
                this._stopProfiling();
            }

            this._recordButton.checked = !this._recordButton.checked;
        }
    },

    _startProfiling: function()
    {
        this._jsRecorder = new JsRecorder();

        this._jsRecorder.startProfiling(this._profileAllExecutions);
    },

    _stopProfiling: function()
    {
        this._jsRecorder.stopProfiling();

        var siteName = encodeURIComponent(this._getCurrentPageDocument().baseURI);
        this._lastRecordingTime = Date.now();

        if(this._profileAllExecutions)
        {
            FileHelper.createAllExecutionsProfilingFile(siteName, this._lastRecordingTime, JSON.stringify(this._jsRecorder.executionTrace));
        }

        this._lastEventTrace = JSON.stringify(this._jsRecorder.eventTrace);
        FileHelper.createEventProfilingFile(siteName, this._lastRecordingTime, this._lastEventTrace);

        this._updateCurrentRecordings();
    },

    _createSourceCodeViewer: function()
    {
        //jar:file:///C:/Program%20Files%20%28x86%29/Mozilla%20Firefox/browser/omni.ja!/modules/devtools/sourceeditor/editor.js
        this.editor = new Editor
        ({
            mode: Editor.modes.html,
            readOnly: true,
            lineNumbers: true,
            showAnnotationRuler: true,
            gutters: [ "breakpoints" ]
        });

        this.editor.appendTo(this._editorContainer).then(function()
        {
            this.editor.setText("---- SELECT SOURCE FILE ----");
        }.bind(this));

        //
        this.editor.on("gutterClick", function(e, line) { this._onEditorBreakPointChange(e, line);}.bind(this));
    },

    _onSourcesPopupShowing: function()
    {
        var scriptNameAndPaths = FireDataAccess.getContentScriptNameAndPaths(this._getCurrentPageDocument());

        this._sourcesMenuPopup.innerHTML = "";

        if(scriptNameAndPaths.length == 0)
        {
            this._sourcesMenuList.setAttribute("label","Select Source file");
        }

        for(var i = 0; i < scriptNameAndPaths.length; i++)
        {
            var scriptNameAndPath = scriptNameAndPaths[i];
            this._createMenuItem(this._sourcesMenuPopup, scriptNameAndPath.name, scriptNameAndPath.path, true);
        }
    },

    _onSourcesPopupItemSelected: function()
    {
        if(this._sourcesMenuList.selectedItem == null) { return; }

        this._currentSelectedFile = this._sourcesMenuList.selectedItem.value;

        var currentContent = FireDataAccess.getFileContent(this._currentSelectedFile);

        if(currentContent != null && currentContent != "SOURCE_UNAVAILABLE")
        {
            this._setEditorModeByFileExtension(this._currentSelectedFile);
            this.editor.setText(currentContent);
            this._showExistingBreakpoints();
        }
        else
        {
            this.editor.setText("---- LOADING SOURCE CODE ----");

            FireDataAccess.cacheExternalFileContent(this._sourcesMenuList.selectedItem.value, function()
            {
                this.editor.setText(FireDataAccess.getFileContent(this._currentSelectedFile));
                this._showExistingBreakpoints();
            }.bind(this));
        }

        this._sourcesMenuList.selectedItem.label.startsWith("DOM - ") ? this._showMarkupEditor()
                                                                      : this._showSourceEditor();
    },

    _setEditorModeByFileExtension: function(filePath)
    {
        if(filePath == null) { this.editor.setMode(Editor.modes.text); }
        else if(filePath.endsWith(".js")) { this.editor.setMode(Editor.modes.js); }
        else if(filePath.endsWith(".html")) { this.editor.setMode(Editor.modes.html); }
        else { this.editor.setMode(Editor.modes.text); }
    },

    _showSourceEditor: function()
    {
        this._editorContainer.setAttribute("collapsed", false);
    },

    _showExistingBreakpoints: function()
    {
        var breakPointMap = this._slicingCriteriaMap[this._currentSelectedFile];
        this._ignoreBreakpointChanges = true;
        if(breakPointMap != null)
        {
            for(var line in breakPointMap)
            {
                this.editor.addBreakpoint(parseInt(line));
            }
        }
        this._ignoreBreakpointChanges = false;
    },

    _onEditorBreakPointChange: function(e, line)
    {
        if(this._currentSelectedFile == null || this._ignoreBreakpointChanges) { return; }

        if(this._slicingCriteriaMap[this._currentSelectedFile] == null) { this._slicingCriteriaMap[this._currentSelectedFile] = {}; }

        if (this._slicingCriteriaMap[this._currentSelectedFile][line])
        {
            this._slicingCriteriaMap[this._currentSelectedFile][line] = null;
            delete this._slicingCriteriaMap[this._currentSelectedFile][line];
            this.editor.removeMarker(line, "breakpoints", "breakpoint");
        }
        else
        {
            this._slicingCriteriaMap[this._currentSelectedFile][line] = true;
            this.editor.addMarker(line, "breakpoints", "breakpoint");
        }

        this._updateSlicingCriteriaDisplay();
    },

    _onAddSlicingCriteriaClick: function()
    {
        var cssSelector = this._extensionWindow.prompt("Enter feature CSS selector:", "");

        if(cssSelector == null || cssSelector == "") { return; }

        this._slicingCriteriaMap.DOM[cssSelector] = true;
        this._selectors.push(cssSelector);
        this._updateSlicingCriteriaDisplay();
    },

    _updateSlicingCriteriaDisplay: function()
    {
        this._clearSlicingCriteriaDisplay();

        var doc = this._slicingCriteriaList.ownerDocument;

        for(var fileName in this._slicingCriteriaMap)
        {
            if(fileName == "DOM")
            {
                for(var selector in this._slicingCriteriaMap[fileName])
                {
                    this._createSlicingCriteriaView(doc, selector + " - DOM", fileName, selector);
                }
            }
            else
            {
                for(var line in this._slicingCriteriaMap[fileName])
                {
                    this._createSlicingCriteriaView(doc, "@" + (parseInt(line) + 1) + " - " + (FireDataAccess.getScriptName(fileName) || "index"), fileName, line);
                }
            }
        }
    },

    _createSlicingCriteriaView: function(doc, summary, firstPropertyId, secondPropertyId)
    {
        var container = doc.createElement("div");

        container.className = "slicingCriteriaElement";

        container.innerHTML = "<span class='deleteContainer'/><label>" + summary + "</label>";
        var deleteButtonContainer = container.querySelector(".deleteContainer");

        deleteButtonContainer.firstPropertyId = firstPropertyId;
        deleteButtonContainer.secondPropertyId = secondPropertyId;

        deleteButtonContainer.onclick = function(e)
        {
            var button = e.target;

            if(this._slicingCriteriaMap[button.firstPropertyId])
            {
                var indexOfElement = this._selectors.indexOf(button.secondPropertyId);
                if(indexOfElement >= 0)
                {
                    this._selectors.splice(indexOfElement, 1)
                }

                delete this._slicingCriteriaMap[button.firstPropertyId][button.secondPropertyId];
            }

            if(this._currentSelectedFile == button.firstPropertyId)
            {
                this.editor.removeBreakpoint(parseInt(secondPropertyId));
            }

            button.onclick = null;
            var buttonContainer = button.parentNode;

            buttonContainer && buttonContainer.parentNode && buttonContainer.parentNode.removeChild(buttonContainer);
        }.bind(this);

        this._slicingCriteriaList.appendChild(container);
    },

    _clearSlicingCriteriaDisplay: function()
    {
        var deleteButtons = this._slicingCriteriaList.querySelectorAll(".deleteContainer");

        for(var i = 0; i < deleteButtons.length; i++)
        {
            deleteButtons[i].onclick = null;
        }

        this._slicingCriteriaList.innerHTML = "";
    },

    _updateCurrentRecordings: function(newPageUrl)
    {
        this._clearRecordingInfoDisplay();

        this._recordingsFiles = FileHelper.getEventRecordingsFiles(encodeURIComponent(newPageUrl || this._getCurrentPageDocument().baseURI));

        for(var i = 0; i < this._recordingsFiles.length; i++)
        {
            //File writing is async, and file reading sync..
            var recording = this._recordingsFiles[i];
            if(recording.content == "" && recording.name.indexOf(this._lastRecordingTime) != -1)
            {
                recording.content = this._lastEventTrace;
            }

            this._createRecordingInfoView(recording);
        }

        this._recordingsGroup.selectedIndex = 0;
    },

    _createRecordingInfoView: function(recordingInfo)
    {
        var doc = this._recordingsGroup.ownerDocument;

        var container = doc.createElement("vbox");
        container.className = "recordingView";

        var titleContainer = doc.createElement("div");

        var deleteRecordingContainer = doc.createElement("span");
        deleteRecordingContainer.className = "deleteContainer";
        titleContainer.appendChild(deleteRecordingContainer);

        var radioButton = doc.createElement("radio");
        titleContainer.appendChild(radioButton);

        container.appendChild(titleContainer);

        try
        {
            var recordingInfos = JSON.parse(recordingInfo.content);
        }
        catch(e)
        {
            recordingInfos = [];
            Cu.reportError("Error when parsing recording info: " + e + " Content: " + recordingInfo.content);
        }

        var eventInfos = this._getRecordedEventInfos(recordingInfos);

        for(var i = 0; i < eventInfos.length; i++)
        {
            var eventInfo = eventInfos[i];

            var itemElement = doc.createElement("div");

            itemElement.className = "eventRecordingElement";

            itemElement.innerHTML = "<label> "  + eventInfo + "</label>";

            container.appendChild(itemElement);
        }

        var deleteButtonContainer = container.querySelector(".deleteContainer");

        deleteButtonContainer.filePath = recordingInfo.path;
        deleteButtonContainer.recordingInfo = container.textContent;

        deleteButtonContainer.onclick = function(e)
        {
            var button = e.target;

            if(button.filePath && this._extensionWindow.confirm("Permanently delete recording: " + button.recordingInfo))
            {
                FileHelper.deleteFile(button.filePath);
                button.onclick = null;
                var buttonContainer = button.parentNode.parentNode;
                buttonContainer.parentNode.removeChild(buttonContainer);
            }
        }.bind(this);

        this._recordingsGroup.appendChild(container);

        radioButton.filePath = recordingInfo.path;
        radioButton.label = this._getProfilingTime(recordingInfo.name);
    },

    _getRecordedEventInfos: function(recordingInfos)
    {
        var allEventInfosMap = [];

        for(var i = 0; i < recordingInfos.length; i++)
        {
            var recordingInfo = recordingInfos[i];
            if(recordingInfo == null)
            {
                recordingInfo = {};
            }

            if(recordingInfo.args == null) { recordingInfo.args = {}; }
            if(recordingInfo.thisValue == null) { recordingInfo.thisValue = {}; }

            var eventInfo = (recordingInfo.args.type || "timing" )+ " on " + (recordingInfo.thisValue.xPath || "window");

            allEventInfosMap.push(eventInfo);
        }

        var unique = [];
        var occurrences = 0;
        for(var i = 0; i < allEventInfosMap.length; i++)
        {
            var current = allEventInfosMap[i];
            var next = allEventInfosMap[i+1];

            occurrences++

            if(current != next)
            {
                unique.push((occurrences > 1 ? occurrences + "x " : "") + current);
                occurrences = 0;
            }
        }

        return unique;
    },

    _getProfilingTime: function(recordingName)
    {
        var date = new Date(parseInt(this._removeFileExtension(recordingName)));

        return date.getDate() + "/" + (date.getMonth()+1)  + "/" + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes();
    },

    _clearRecordingInfoDisplay: function()
    {
        var deleteButtons = this._recordingsGroup.querySelectorAll(".deleteContainer");

        for(var i = 0; i < deleteButtons.length; i++)
        {
            deleteButtons[i].onclick = null;
        }

        this._recordingsGroup.innerHTML = "";
    },

    _createMenuItem: function(menuPopupParent, menuItemName, menuItemPath, isSelected)
    {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

        var menuItem = this._extensionDocument.createElementNS(XUL_NS, "menuitem");

        if (menuItemName != undefined) { menuItem.setAttribute("label", menuItemName); }
        if (menuItemPath != undefined) { menuItem.setAttribute("value", menuItemPath); }
        if (isSelected != undefined) { menuItem.setAttribute("selected", isSelected); }

        menuPopupParent.appendChild(menuItem);
    },

    _removeFileExtension: function(name)
    {
        if(name == null || name.indexOf(".") == -1) { return name; }

        return name.substring(0, name.indexOf("."));
    }
};