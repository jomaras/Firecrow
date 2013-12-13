var EXPORTED_SYMBOLS = ["SlicerPanelController"];

var Cu = Components.utils;
var Ci = Components.interfaces;

Cu.import("resource:///modules/source-editor.jsm");
Cu.import("chrome://Firecrow/content/frontend/FireDataAccess.jsm");
Cu.import("chrome://Firecrow/content/frontend/JsRecorder.jsm");

var SlicerPanelController = function(extensionWindow, extensionDocument, getCurrentPageWindowFunction, getCurrentPageDocumentFunction)
{
    this._extensionDocument = extensionDocument;
    this._extensionWindow = extensionWindow;

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
    this._existingRecordingsList = extensionDocument.getElementById("existingRecordingsList");

    this._slicingButton = extensionDocument.getElementById("slicingButton");
    this._slicingButton.onclick = function(e) { this._onSlicingClick(e); }.bind(this);

    this._saveModelButton = extensionDocument.getElementById("saveModelButton");
    this._saveModelButton.onclick = function(e) { this._onSaveModelClick(e); }.bind(this);

    FireDataAccess._window = this._extensionWindow;
    FireDataAccess.setBrowser(extensionDocument.getElementById("invisibleBrowser"));

    this._currentSelectedFile = null;
    this._ignoreBreakpointChanges = true;
    this._pathSourceLoadedCallbackMap = {};
    this._slicingCriteriaMap = { DOM: {} };

    this._externalFilesMap = {};

    this._createSourceCodeViewer();
    //this._updateCurrentRecordings();
};

SlicerPanelController.prototype =
{
    reset: function()
    {
        this._sourcesMenuPopup.innerHTML = "";
        this._sourcesMenuList.setAttribute("label","Select Source file");

        this.editor.setText("---- SELECT SOURCE FILE ----");

        this._updateCurrentRecordings();
    },

    _onSaveModelClick: function()
    {

    },

    _onRecordClick: function(e)
    {
        if(e.target == this._recordButton
        && e.currentTarget == this._recordButton && e.originalTarget != this._recordButton)
        {
            if(!this._recordButton.checked)
            {
                var currentLocation = this._getCurrentPageDocument().location;
                this._startRecording();
                currentLocation.reload();
            }
            else
            {
                this._stopRecording();
            }

            this._recordButton.checked = !this._recordButton.checked;
        }
    },

    _startRecording: function()
    {
        this._jsRecorder = new JsRecorder();

        var scriptNamesAndPaths = FireDataAccess.getContentScriptNameAndPaths(this._getCurrentPageDocument());

        if(this._recordOptionsElement.value == "All")
        {
            this._jsRecorder.startProfiling(scriptNamesAndPaths);
        }
        else
        {
            this._jsRecorder.start(scriptNamesAndPaths);
        }
    },

    _stopRecording: function()
    {

    },

    _createSourceCodeViewer: function()
    {
        this.editor = new SourceEditor();

        this.editor.init
        (
            this._editorContainer,
            {
                mode: SourceEditor.MODES.JAVASCRIPT,
                readOnly: true,
                showLineNumbers: true,
                showAnnotationRuler: true,
                showOverviewRuler: true
            },
            function()
            {
                this.editor.setText("---- SELECT SOURCE FILE ----");
            }.bind(this)
        );

        this.editor.addEventListener(SourceEditor.EVENTS.BREAKPOINT_CHANGE, function(e) { this._onEditorBreakPointChange(e);}.bind(this));
    },

    _onSourcesPopupShowing: function()
    {
        var scriptNameAndPaths = this._getContentScriptNameAndPaths(this._getCurrentPageDocument());

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

        if(currentContent != null)
        {
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

        if(this._sourcesMenuList.selectedItem.label.startsWith("DOM - "))
        {
            this._showMarkupEditor();
        }
        else
        {
            if(this._sourcesMenuList.selectedItem.label.startsWith("* - "))
            {
                this.editor.setMode(SourceEditor.MODES.HTML);
            }
            else
            {
                this.editor.setMode(SourceEditor.MODES.JAVASCRIPT);
            }

            this._showSourceEditor();
        }
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

    _onEditorBreakPointChange: function(e)
    {
        if(this._currentSelectedFile == null || this._ignoreBreakpointChanges) { return; }

        if(this._slicingCriteriaMap[this._currentSelectedFile] == null) { this._slicingCriteriaMap[this._currentSelectedFile] = {}; }

        for(var i = 0; i < e.added.length; i++)
        {
            var addedLine = e.added[i].line;
            this._slicingCriteriaMap[this._currentSelectedFile][addedLine] = true;
        }

        for(var i = 0; i < e.removed.length; i++)
        {
            var removedLine = e.removed[i].line;
            this._slicingCriteriaMap[this._currentSelectedFile][removedLine] = null;
            delete this._slicingCriteriaMap[this._currentSelectedFile][removedLine];
        }

        this._updateSlicingCriteriaDisplay();
    },

    _onAddSlicingCriteriaClick: function()
    {
        var cssSelector = this._extensionWindow.prompt("Enter feature CSS selector:", "");

        if(cssSelector == null || cssSelector == "") { return; }

        this._slicingCriteriaMap.DOM[cssSelector] = true;
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

    _updateCurrentRecordings: function()
    {
        this._clearRecordingInfoDisplay();

        var recordingsFiles = FileHelper.getRecordingsFiles(encodeURIComponent(this._getCurrentPageDocument().baseURI));

        for(var i = 0; i < recordingsFiles.length; i++)
        {
            this._createRecordingInfoView(recordingsFiles[i]);
        }
    },

    _createRecordingInfoView: function(recordingInfo)
    {
        var doc = this._existingRecordingsList.ownerDocument;

        var container = doc.createElement("vbox");
        container.className = "recordingView";

        var titleContainer = doc.createElement("div");

        var deleteRecordingContainer = doc.createElement("span");
        deleteRecordingContainer.className = "deleteContainer";
        titleContainer.appendChild(deleteRecordingContainer);

        var checkbox = doc.createElement("checkbox");
        checkbox.recordingFilePath = recordingInfo.path;
        checkbox.className = "selectRecordingCheckbox";
        titleContainer.appendChild(checkbox);

        var timeLabel = doc.createElement("label");
        timeLabel.textContent = this._getRecordingTime(recordingInfo.name);

        titleContainer.appendChild(timeLabel);

        container.appendChild(titleContainer);

        var recordingInfos = JSON.parse(recordingInfo.content);

        for(var i = 0; i < recordingInfos.length; i++)
        {
            var itemElement = doc.createElement("div");
            itemElement.className = "eventRecordingElement";

            itemElement.innerHTML = "<label>" + recordingInfos[i].args.type + " on " + recordingInfos[i].thisValue.xPath + "; </label>";

            container.appendChild(itemElement);
        }

        var deleteButtonContainer = container.querySelector(".deleteContainer");

        deleteButtonContainer.filePath = recordingInfo.path;
        deleteButtonContainer.recordingInfo = container.textContent;

        deleteButtonContainer.onclick = function(e)
        {
            var button = e.target;

            if(button.filePath && this._window.confirm("Permanently delete recording: " + button.recordingInfo))
            {
                FileHelper.deleteFile(button.filePath);
                button.onclick = null;
                var buttonContainer = button.parentNode.parentNode;
                buttonContainer.parentNode.removeChild(buttonContainer);
            }
        }.bind(this);

        this._existingRecordingsList.appendChild(container);
    },

    _getRecordingTime: function(recordingName)
    {
        var date = new Date(parseInt(this._removeFileExtension(recordingName)));

        return date.getDate() + "/" + (date.getMonth()+1)  + "/" + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes();
    },

    _clearRecordingInfoDisplay: function()
    {
        var deleteButtons = this._existingRecordingsList.querySelectorAll(".deleteContainer");

        for(var i = 0; i < deleteButtons.length; i++)
        {
            deleteButtons[i].onclick = null;
        }

        this._existingRecordingsList.innerHTML = "";
    },

    _getContentScriptNameAndPaths: function(document)
    {
        var scriptPaths = [];

        scriptPaths.push({name: "* - " + (FireDataAccess.getScriptName(document.baseURI) || "index"), path: document.baseURI });
        /*scriptPaths.push({name: "DOM - " + (FireDataAccess.getScriptName(document.baseURI) || "index"), path: document.baseURI });*/

        var scriptElements = document.scripts;

        for(var i = 0; i < scriptElements.length; i++)
        {
            var src = scriptElements[i].src;

            if(src != "")
            {
                scriptPaths.push({name: FireDataAccess.getScriptName(src), path: src });
            }
        }

        return scriptPaths;
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