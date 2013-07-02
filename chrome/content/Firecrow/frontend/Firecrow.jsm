var EXPORTED_SYMBOLS = ["Firecrow"];

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

Cu.import("resource:///modules/source-editor.jsm");
Cu.import("resource:///modules/devtools/CssLogic.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "MarkupView", "resource:///modules/devtools/MarkupView.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "Selection", "resource:///modules/devtools/Selection.jsm");

var scriptLoader = Cc["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);

scriptLoader.loadSubScript("chrome://Firecrow/content/initFBL.js", this, "UTF-8");
scriptLoader.loadSubScript("chrome://Firecrow/content/parsers/CssSelectorParser.js", this, "UTF-8");
scriptLoader.loadSubScript("chrome://Firecrow/content/helpers/valueTypeHelper.js", this, "UTF-8");
scriptLoader.loadSubScript("chrome://Firecrow/content/helpers/ASTHelper.js", this, "UTF-8");
scriptLoader.loadSubScript("chrome://Firecrow/content/helpers/htmlHelper.js", this, "UTF-8");
scriptLoader.loadSubScript("chrome://Firecrow/content/helpers/FileHelper.js", this, "UTF-8");
scriptLoader.loadSubScript("chrome://Firecrow/content/helpers/fbHelper.js", this, "UTF-8");
scriptLoader.loadSubScript("chrome://Firecrow/content/jsRecorder/JsRecorder.js", this, "UTF-8");

var HTML = "http://www.w3.org/1999/xhtml";

var FileHelper = FBL.Firecrow.FileHelper;
var FbHelper = FBL.Firecrow.fbHelper;
var HtmlHelper = FBL.Firecrow.htmlHelper;
var JsRecorder = FBL.Firecrow.JsRecorder;

function FirecrowView(window, aIframe)
{
    this._window = window;
    var gBrowser = this._window.gBrowser;
    this._iframe = aIframe;
    var ownerDocument = gBrowser.parentNode.ownerDocument;

    if (!this._iframe)
    {
        this._splitter = ownerDocument.createElement("hbox");
        this._splitter.setAttribute("class", "devtools-horizontal-splitter");
        this._splitter.style.cursor = "n-resize";
    }

    this.loaded = false;

    this._frame = this._iframe || ownerDocument.createElement("iframe");

    this.$ = this.$.bind(this);

    this._onLoad = this._onLoad.bind(this);

    this._frame.addEventListener("load", this._onLoad, true);

    if (!this._iframe)
    {
        this._frame.setAttribute("src", "chrome://Firecrow/content/frontend/Firecrow.xul");
    }
}

FirecrowView.prototype =
{
    _jsRecorder: null,
    _slicingCriteriaMap: { DOM: {} },
    _featureSelectorsMap: {},
    _externalFilesMap: {},
    _currentSelectedFile: null,

    _onLoad: function FV__onLoad()
    {
        this.loaded = true;

        this._frame.removeEventListener("load", this._onLoad, true);
        this._frameDoc = this._frame.contentDocument;
        this._frameDoc.defaultView.focus();

        this._frame.addEventListener("unload", this._onUnload, true);

        this._hiddenIFrame = this.$("fdHiddenIFrame");

        this._mainContainerContent = this.$("mainContainerContent");
        this._slicerMainContainer = this.$("slicerMainContainer");
        this._sourcesMenuPopup = this.$("sourcesMenuPopup");
        this._sourcesMenuList = this.$("sourcesMenuList");

        this._slicingCriteriaList = this.$("slicingCriteriaList");
        this._existingRecordingsList = this.$("existingRecordingsList");

        this._featureDescriptorContainer = this.$("featureDescriptorContainer");

        this._editorContainer = this.$("editor");
        this._slicerMarkupViewerElement = this.$("slicerMarkupViewerElement");
        this._slicerCodeContainer = this.$("sources-pane");
        this._scenarioMarkupViewerElement = this.$("scenarioMarkupViewerElement");

        this._keptScenariosContainer = this.$("keptScenariosContainer");
        this._generatedScenariosContainer = this.$("generatedScenariosContainer");

        this._setSlicingCriteriaButton = this.$("setSlicingCriteriaButton");
        this._setFeatureSelectorButton = this.$("setFeatureSelectorButton");
        this._recordButton = this.$("recordButton");
        this._slicingButton = this.$("slicingButton");
        this._generateScenariosButton = this.$("generateScenariosButton");

        this._invisibleBrowser = this.$("invisibleBrowser");

        this._recordOptionsElement = this.$("recordOptions");

        this._createSourceSelectionMenu();
        this._createSourceCodeViewer();
        this._createMarkupViewer();

        this._handleSourceCodeEvents();

        this._setSlicingCriteriaButton.onclick = this._slicingCriteriaClick.bind(this);
        this._setFeatureSelectorButton.onclick = this._featureSelectorClick.bind(this);
        this._recordButton.onclick = this._recordClick.bind(this);
        this._slicingButton.onclick = this._slicingClick.bind(this);
        this._generateScenariosButton.onclick = this._generateScenariosClick.bind(this);

        this._slicerTabButton = this.$("slicerTabButton");
        this._scenarioTabButton = this.$("scenarioTabButton");

        this._slicerTabButton.onclick = this._slicerTabClick.bind(this);
        this._scenarioTabButton.onclick = this._scenarioTabClick.bind(this);

        this._updateCurrentRecordings();

        this._sourceCodeLoadedInInvisibleBrowser = this._sourceCodeLoadedInInvisibleBrowser.bind(this);
    },

    emit: function(){}, //For selection

    _slicerTabClick: function()
    {
        this.selection = this.slicerSelection;
    },

    _scenarioTabClick: function()
    {
        this.selection = this.scenarioSelection;
    },

    _slicingClick: function()
    {
        var selectedRecordings = this._getSelectedRecordingsPaths();

        if(this._isSlicingCriteriaMapEmpty())
        {
            this._window.alert("Specify at least one slicing criteria");
        }
        else if(selectedRecordings.length == 0)
        {
            this._window.alert("Select at least one recording");
        }
        else
        {
            var selectedFolder = this._openSelectFolderDialog();

            if(selectedFolder)
            {
                this._loadUrlInHiddenIFrame(this._getCurrentPageDocument().baseURI, false, function(window, htmlJson)
                {
                    htmlJson.eventTraces = JSON.parse(FileHelper.readFromFile(selectedRecordings[0]));

                    FileHelper.writeToFile
                    (
                        selectedFolder + "\\index.html",
                        Firecrow.slicer.getSlicedCode(htmlJson, this._getSlicingCriteria(), window.document.documentElement.baseURI)
                    );
                }, this);
            }
        }
    },

    _generateScenariosClick: function()
    {
        if(this._isFeatureSelectorsMapEmpty()) { this._window.alert("Specify at least one feature selector!"); return; }

        this._loadUrlInHiddenIFrame(this._getCurrentPageDocument().baseURI, false, function(window, htmlJson)
        {
            Firecrow.scenarioGenerator.generateScenarios(htmlJson, FBL.Firecrow.ValueTypeHelper.convertToArray(this._featureSelectorsMap), function(scenario)
            {
                if(scenario.length != null) { this._fillViewWithKeptScenarios(scenario); return;}

                this._appendScenarioView(scenario, this._generatedScenariosContainer);
            }.bind(this));
        }.bind(this), this);
    },

    _fillViewWithKeptScenarios: function(scenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            this._appendScenarioView(scenarios[i], this._keptScenariosContainer);
        }
    },

    _appendScenarioView: function(scenario, container)
    {
        var document = this._generatedScenariosContainer.ownerDocument;
        var resolvedResult = scenario.inputConstraint != null ? scenario.inputConstraint.resolvedResult : {};
        var html = "<h3><label>Scenario " + scenario.id + " - cov: " + Firecrow.scenarioGenerator.achievedCoverage + "&#37;</label></h3>";

        html += "<ol start='0'>";

        var events = scenario.events || {};

        for(var i = 0; i < events.length; i++)
        {
            var event = events[i];

            html += "<li><label>";
            html += event.toString() + (resolvedResult[i] != null ? " -&gt; " + this._window.JSON.stringify(resolvedResult[i]) : "") ;
            html += "</label></li>";
        }

        html += "</ol>";

        var wrapper = document.createElement("vbox");
        wrapper.className = "scenarioWrapperContainer";
        wrapper.innerHTML = html;

        container.appendChild(wrapper);
    },

    _getSlicingCriteria: function()
    {
        var slicingCriteria = [];

        for(var propName in this._slicingCriteriaMap)
        {
            if(propName == "DOM") { slicingCriteria = slicingCriteria.concat(this._getCssSlicingCriteria(this._slicingCriteriaMap[propName])); }
            else
            {
                var filePath = propName;

                for(var lineNumber in this._slicingCriteriaMap[filePath])
                {
                    slicingCriteria.push(this._createLineExecutedCriterion(filePath, lineNumber));
                }
            }
        }

        return slicingCriteria;
    },

    _createLineExecutedCriterion: function(filePath, lineNumber)
    {
        return { type: "LINE_EXECUTED", fileName: filePath, lineNumber: lineNumber};
    },

    _createModifyDomCriterion: function(selector)
    {
        return { type: "DOM_MODIFICATION",  cssSelector: selector };
    },

    _getCssSlicingCriteria: function(cssSelectorsObject)
    {
        var cssSelectors = [];

        for(var cssSelector in cssSelectorsObject)
        {
            cssSelectors.push(this._createModifyDomCriterion(cssSelector));
        }

        return cssSelectors;
    },

    _featureSelectorClick: function()
    {
        this._featureSelectorsMap[CssLogic.findCssSelector(this.scenarioSelection.node)] = true;
        this._updateFeatureSelectorsDisplay();
    },

    _slicingCriteriaClick: function()
    {
        if(!this._isMarkupView()) { return; }

        this._slicingCriteriaMap.DOM[CssLogic.findCssSelector(this.slicerSelection.node)] = true;
        this._updateSlicingCriteriaDisplay();
    },

    _recordClick: function(e)
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

        if(this._recordOptionsElement.value == "All")
        {
            this._jsRecorder.startProfiling(this._getContentScriptNameAndPaths());
        }
        else
        {
            this._jsRecorder.start(this._getContentScriptNameAndPaths());
        }
    },

    _stopRecording: function()
    {
        this._jsRecorder.stop();

        var document = this._getCurrentPageDocument();

        FileHelper.createRecordingFile
        (
            encodeURIComponent(document.baseURI),
            Date.now(),
            JSON.stringify(this._jsRecorder.getExecutionTrace())
        );

        this._window.setTimeout(function()
        {
            this._updateCurrentRecordings();
        }.bind(this), 1000);
    },

    rebuild: function(newWindow)
    {
        this._slicingCriteriaMap = { DOM: {} };
        this._externalFilesMap = {};
        this._currentSelectedFile = null;

        this._window = newWindow;

        this._clearSourceSelectionMenu();
        this._createSourceSelectionMenu();

        this._destroyMarkupSelection();
        this._destroyMarkupFrame();
        this._createMarkupViewer();

        if(this._isMarkupView())
        {
            this._showMarkupEditor();
        }
        else
        {
            this.editor.setText("---- SELECT SOURCE FILE ----");
            this._showSourceEditor();
        }
    },

    _isMarkupView: function()
    {
        return !this._slicerMarkupViewerElement.collapsed;
    },

    closeUI: function FV_closeUI()
    {
        if (!this.loaded) { return; }

        if (!this._iframe)
        {
            this._splitter.parentNode.removeChild(this._splitter);
            this._frame.parentNode.removeChild(this._frame);
            this._frame = null;
        }

        this._frameDoc = this._window = null;
    },

    _createSourceSelectionMenu: function()
    {
        var scriptNameAndPaths = this._getContentScriptNameAndPaths();

        for(var i = 0; i < scriptNameAndPaths.length; i++)
        {
            var scriptNameAndPath = scriptNameAndPaths[i];
            this._createMenuItem(this._sourcesMenuPopup, scriptNameAndPath.name, scriptNameAndPath.path, true);
        }
    },

    _clearSourceSelectionMenu: function()
    {
        this._sourcesMenuPopup.innerHTML = "";
        this._sourcesMenuList.setAttribute("label","Select Source file");
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

        this.editor.addEventListener
        (
            SourceEditor.EVENTS.BREAKPOINT_CHANGE,
            function(e)
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
            }.bind(this)
        );
    },

    _isSlicingCriteriaMapEmpty: function()
    {
        return this._slicingCriteriaList.children.length === 0;
    },

    _isFeatureSelectorsMapEmpty: function()
    {
        for(var prop in this._featureSelectorsMap) { return false; }

        return true;
    },

    _getSelectedRecordingsPaths: function()
    {
        var doc = this._existingRecordingsList.ownerDocument;

        var selectedItems = doc.querySelectorAll(".selectRecordingCheckbox[checked]");
        var paths = [];

        for(var i = 0; i < selectedItems.length; i++)
        {
            paths.push(selectedItems[i].recordingFilePath);
        }

        return paths;
    },

    _updateFeatureSelectorsDisplay: function()
    {
        this._clearFeatureSelectorsDisplay();

        var doc = this._featureDescriptorContainer.ownerDocument;

        for(var cssSelector in this._featureSelectorsMap)
        {
            var container = doc.createElement("div");
            container.className = "featureSelectorContainer";
            container.innerHTML = "<span class='deleteContainer'/><label style='margin-top:-1px'>" + cssSelector + "</label>";

            this._featureDescriptorContainer.appendChild(container);

            var deleteContainer = container.querySelector(".deleteContainer");
            deleteContainer.cssSelector = cssSelector;

            deleteContainer.onclick = function(e)
            {
                var button = e.target;

                delete this._featureSelectorsMap[button.cssSelector];

                button.onclick = null;
                var buttonContainer = button.parentNode;
                buttonContainer.parentNode.removeChild(buttonContainer);
            }.bind(this);
        }
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
                    this._createSlicingCriteriaView(doc, "@" + (parseInt(line) + 1) + " - " + this._getScriptName(fileName), fileName, line);
                }
            }
        }
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
            buttonContainer.parentNode.removeChild(buttonContainer);
        }.bind(this);

        this._slicingCriteriaList.appendChild(container);
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

            itemElement.textContent = recordingInfos[i].args.type + " on " + recordingInfos[i].thisValue.xPath + "; ";

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

    _openSelectFolderDialog: function()
    {
        var filePicker = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
        filePicker.init(this._window, "Select destination folder",  2); // open folder
        var returnValue = filePicker.show();

        if (returnValue == Ci.nsIFilePicker.returnOK || returnValue == Ci.nsIFilePicker.returnReplace)
        {
            return filePicker.file.path;
        }

        return "";
    },

    _getRecordingTime: function(recordingName)
    {
        var date = new Date(parseInt(this._removeFileExtension(recordingName)));

        return date.getDate() + "/" + (date.getMonth()+1)  + "/" + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes();
    },

    _removeFileExtension: function(name)
    {
        if(name == null || name.indexOf(".") == -1) { return name; }

        return name.substring(0, name.indexOf("."));
    },

    _clearFeatureSelectorsDisplay: function()
    {
        var deleteButtons = this._featureDescriptorContainer.querySelectorAll(".deleteContainer");

        for(var i = 0; i < deleteButtons.length; i++)
        {
            deleteButtons[i].onclick = null;
        }

        this._featureDescriptorContainer.innerHTML = "";
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

    _clearRecordingInfoDisplay: function()
    {
        var deleteButtons = this._existingRecordingsList.querySelectorAll(".deleteContainer");

        for(var i = 0; i < deleteButtons.length; i++)
        {
            deleteButtons[i].onclick = null;
        }

        this._existingRecordingsList.innerHTML = "";
    },

    _createMarkupViewer: function()
    {
        this._slicerMarkupViewerElement.setAttribute("hidden", true);
        this._scenarioMarkupViewerElement.setAttribute("hidden", true);

        this._createSlicerMarkupSelection();
        this._createSlicerMarkupFrame();

        this._createScenarioMarkupSelection();
        this._createScenarioMarkupFrame();
    },

    _createSlicerMarkupSelection: function()
    {
        this.slicerSelection = new Selection();
        this.onNewSelection = this.onNewSelection.bind(this);
        this.slicerSelection.on("new-node", this.onNewSelection);

        this.onBeforeNewSelection = this.onBeforeNewSelection.bind(this);
        this.slicerSelection.on("before-new-node", this.onBeforeNewSelection);

        this.selection = this.slicerSelection;
    },

    _createScenarioMarkupSelection: function()
    {
        this.scenarioSelection = new Selection();

        this.scenarioSelection.on("new-node", this.onNewSelection);
        this.scenarioSelection.on("before-new-node", this.onBeforeNewSelection);
    },

    _destroyMarkupSelection: function()
    {
        if(this.slicerSelection == null) { return; }

        this.slicerSelection.off("new-node", this.onNewSelection);
        this.slicerSelection.off("before-new-node", this.onBeforeNewSelection);

        this.slicerSelection = null;
    },

    _createSlicerMarkupFrame: function()
    {
        this._slicerMarkupFrame = this._frameDoc.createElement("iframe");
        this._slicerMarkupFrame.setAttribute("flex", "1");
        this._slicerMarkupFrame.setAttribute("tooltip", "aHTMLTooltip");
        this._slicerMarkupFrame.setAttribute("context", "inspector-node-popup");

        // This is needed to enable tooltips inside the iframe document.
        this._boundSlicerMarkupFrameLoad = function ()
        {
            this._slicerMarkupFrame.contentWindow.focus();
            this._onSlicerMarkupFrameLoad();
        }.bind(this);

        this._slicerMarkupFrame.addEventListener("load", this._boundSlicerMarkupFrameLoad, true);
        this._slicerMarkupFrame.setAttribute("src", "chrome://browser/content/devtools/markup-view.xhtml");

        this._slicerMarkupViewerElement.appendChild(this._slicerMarkupFrame);
    },

    _createScenarioMarkupFrame: function()
    {
        this._scenarioMarkupFrame = this._frameDoc.createElement("iframe");
        this._scenarioMarkupFrame.setAttribute("flex", "1");
        this._scenarioMarkupFrame.setAttribute("tooltip", "aHTMLTooltip");
        this._scenarioMarkupFrame.setAttribute("context", "inspector-node-popup");

        // This is needed to enable tooltips inside the iframe document.
        this._boundScenarioMarkupFrameLoad = function ()
        {
            this._scenarioMarkupFrame.contentWindow.focus();
            this._onScenarioMarkupFrameLoad();
        }.bind(this);

        this._scenarioMarkupFrame.addEventListener("load", this._boundScenarioMarkupFrameLoad, true);
        this._scenarioMarkupFrame.setAttribute("src", "chrome://browser/content/devtools/markup-view.xhtml");

        this._scenarioMarkupViewerElement.appendChild(this._scenarioMarkupFrame);
    },

    _destroyMarkupFrame: function()
    {
        this._slicerMarkupViewerElement.removeChild(this._slicerMarkupFrame);
        this._slicerMarkupFrame = null;

        this._scenarioMarkupViewerElement.removeChild(this._scenarioMarkupFrame);
        this._scenarioMarkupFrame = null;
    },

    _onSlicerMarkupFrameLoad: function SlicerPanel__onMarkupFrameLoad()
    {
        this._slicerMarkupFrame.removeEventListener("load", this._boundSlicerMarkupFrameLoad, true);
        delete this._boundSlicerMarkupFrameLoad;

        this._slicerMarkupViewerElement.removeAttribute("hidden");

        this.markup = new MarkupView(this, this._slicerMarkupFrame, this._window);

        var root = this._getCurrentPageDocument().documentElement;
        this.slicerSelection.setNode(root);
    },

    _onScenarioMarkupFrameLoad: function()
    {
        this._scenarioMarkupFrame.removeEventListener("load", this._boundScenarioMarkupFrameLoad, true);
        delete this._boundScenarioMarkupFrameLoad;

        this._scenarioMarkupViewerElement.removeAttribute("hidden");

        this.markup = new MarkupView(this, this._scenarioMarkupFrame, this._window);

        var root = this._getCurrentPageDocument().documentElement;
        this.scenarioSelection.setNode(root);
    },

    _currentSelectedNode: null,

    onNewSelection: function ()
    {
        if(this._currentSelectedNode != null)
        {
            this._markNodeAsDeselected(this._currentSelectedNode);
        }

        if(this.selection.node != null && this.selection.node.tagName != "HTML")
        {
            this._currentSelectedNode = this.selection.node;

            this._markNodeAsSelected(this._currentSelectedNode);

            if(this.selection != this.slicerSelection) { this.slicerSelection.setNode(this.selection.node); }
            else { this.scenarioSelection.setNode(this.selection.node); }
        }
    },

    onBeforeNewSelection: function () { },

    _markNodeAsSelected: function(node)
    {
        if(node == null) { return; }

        node.oldBorderStyle = node.style.borderStyle;
        node.oldBorderColor = node.style.borderColor;

        node.style.borderStyle = "dashed";
        node.style.borderColor = "gray";
    },

    _markNodeAsDeselected: function(node)
    {
        if(node == null) { return; }

        node.style.borderStyle = node.oldBorderStyle;
        node.style.borderColor = node.oldBorderColor;
    },

    _handleSourceCodeEvents: function()
    {
        this._sourcesMenuList.addEventListener("command", function()
        {
            if(this._sourcesMenuList.selectedItem == null) { return; }

            this._currentSelectedFile = this._sourcesMenuList.selectedItem.value;

            if(this._externalFilesMap[this._currentSelectedFile] == null)
            {
                this._cacheExternalFileContent(this._sourcesMenuList.selectedItem.value, function()
                {
                    this.editor.setText(this._externalFilesMap[this._currentSelectedFile]);
                    this._showExistingBreakpoints();
                }.bind(this));

                this.editor.setText("---- LOADING SOURCE CODE ----");
            }
            else
            {
                this.editor.setText(this._externalFilesMap[this._currentSelectedFile]);
                this._showExistingBreakpoints();
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
        }.bind(this));
    },

    _pathSourceLoadedCallbackMap: { },

    _cacheExternalFileContent: function(path, finishedCallback)
    {
        if(this._externalFilesMap[path]) { finishedCallback && finishedCallback(); return; }

        this._pathSourceLoadedCallbackMap[path] = { finishedCallback: finishedCallback, failCallbackId: this._window.setTimeout(function()
        {
            this._externalFilesMap[path] = "SOURCE_UNAVAILABLE";
            this._pathSourceLoadedCallbackMap[path] && this._pathSourceLoadedCallbackMap[path].finishedCallback && this._pathSourceLoadedCallbackMap[path].finishedCallback();
        }.bind(this), 500)};

        this._invisibleBrowser.addEventListener("DOMContentLoaded", this._sourceCodeLoadedInInvisibleBrowser);
        this._invisibleBrowser.setAttribute("src", "view-source:" + path);
    },

    _sourceCodeLoadedInInvisibleBrowser: function()
    {
        var path = this._invisibleBrowser.contentDocument.baseURI.replace("view-source:", "");

        this._window.clearTimeout(this._pathSourceLoadedCallbackMap[path].failCallbackId);

        this._invisibleBrowser.removeEventListener("DOMContentLoaded", this._sourceCodeLoadedInInvisibleBrowser);

        this._externalFilesMap[path] = this._invisibleBrowser.contentDocument.getElementById('viewsource').textContent;

        this._pathSourceLoadedCallbackMap[path] && this._pathSourceLoadedCallbackMap[path].finishedCallback && this._pathSourceLoadedCallbackMap[path].finishedCallback();
        this._pathSourceLoadedCallbackMap[path] = null;
    },

    _showSourceEditor: function()
    {
        this._editorContainer.setAttribute("collapsed", false);
        this._slicerMarkupViewerElement.setAttribute("collapsed", true);
    },

    _showMarkupEditor: function()
    {
        this._editorContainer.setAttribute("collapsed", true);
        this._slicerMarkupViewerElement.setAttribute("collapsed", false);
    },

    $: function (ID)
    {
        return this._frameDoc.getElementById(ID);
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

    _createMenuItem: function(menuPopupParent, menuItemName, menuItemPath, isSelected)
    {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

        var menuItem = this._frameDoc.createElementNS(XUL_NS, "menuitem");

        if (menuItemName != undefined) { menuItem.setAttribute("label", menuItemName); }
        if (menuItemPath != undefined) { menuItem.setAttribute("value", menuItemPath); }
        if (isSelected != undefined) { menuItem.setAttribute("selected", isSelected); }

        menuPopupParent.appendChild(menuItem);
    },

    _getCurrentPageDocument: function()
    {
        return this._window.content.document;
    },

    _getContentScriptNameAndPaths: function()
    {
        var scriptPaths = [];
        var document = this._getCurrentPageDocument();

        scriptPaths.push({name: "* - " + this._getScriptName(document.baseURI), path: document.baseURI });
        scriptPaths.push({name: "DOM - " + this._getScriptName(document.baseURI), path: document.baseURI });

        var scriptElements = document.querySelectorAll("script");

        for(var i = 0; i < scriptElements.length; i++)
        {
            var src = scriptElements[i].src;

            if(src != "")
            {
                scriptPaths.push({name: this._getScriptName(src), path: src });
            }
        }

        return scriptPaths;
    },

    _getScriptName: function(url)
    {
        if(!url) { return ""; }

        var lastIndexOfSlash = url.lastIndexOf("/");

        if(lastIndexOfSlash != -1) { return url.substring(lastIndexOfSlash + 1); }

        lastIndexOfSlash = url.lastIndexOf("\\");

        if(lastIndexOfSlash != -1) { return url.substring(lastIndexOfSlash + 1); }

        return url;
    },

    _loadUrlInHiddenIFrame: function(url, allowJavaScript, callbackFunction, thisObject)
    {
        try
        {
            this._hiddenIFrame.style.height = "0px";
            this._hiddenIFrame.webNavigation.allowAuth = true;
            this._hiddenIFrame.webNavigation.allowImages = false;
            this._hiddenIFrame.webNavigation.allowJavascript = allowJavaScript;
            this._hiddenIFrame.webNavigation.allowMetaRedirects = true;
            this._hiddenIFrame.webNavigation.allowPlugins = false;
            this._hiddenIFrame.webNavigation.allowSubframes = false;

            this._hiddenIFrame.addEventListener("DOMContentLoaded", function listener(e)
            {
                try
                {
                    var document = e.originalTarget.wrappedJSObject;

                    this._hiddenIFrame.removeEventListener("DOMContentLoaded", listener, true);

                    this._cacheAllExternalFilesContent(document, function()
                    {
                        var htmlJson = HtmlHelper.serializeToHtmlJSON
                        (
                            document,
                            this._getScriptsPathsAndModels(document),
                            this._getStylesPathsAndModels(document)
                        );

                        callbackFunction.call(thisObject, document.defaultView, htmlJson);
                    }.bind(this));
                }
                catch(e) { Cu.reportError("Error while serializing html code:" + e + "->" + e.lineNo + " " + e.href);}
            }.bind(this), true);

            this._hiddenIFrame.webNavigation.loadURI(url, Ci.nsIWebNavigation, null, null, null);
        }
        catch(e) { Cu.reportError("Loading html in iFrame errror: " + e); }
    },

    _cacheAllExternalFilesContent: function(document, allFinishedCallback)
    {
        var externalFileElements = this._getExternalFileElements(document);
        externalFileElements.push({src: document.baseURI});
        var processedFiles = 0;

        for(var i = 0; i < externalFileElements.length; i++)
        {
            this._cacheExternalFileContent(externalFileElements[i].src || externalFileElements[i].href, function()
            {
                processedFiles++;

                if(processedFiles == externalFileElements.length) { allFinishedCallback(); }
            });
        }
    },

    _getExternalFileElements: function(document)
    {
        var potentialExternalElements = document.querySelectorAll("script, link");
        var externalElements = [];

        for(var i = 0; i < potentialExternalElements.length; i++)
        {
            var element = potentialExternalElements[i];

            if(element.tagName == "SCRIPT" && element.src != "")
            {
                externalElements.push(element)
            }
            else if(element.tagName == "LINK" && element.rel == "stylesheet" && element.href != "")
            {
                externalElements.push(element);
            }
        }

        return externalElements;
    },

    _getScriptsPathsAndModels: function(document)
    {
        var scripts = document.getElementsByTagName("script");
        var scriptPathsAndModels = [];

        var currentPageContent = this._externalFilesMap[document.baseURI];
        currentPageContent = currentPageContent.replace(/(\r)?\n/g, "\n");

        var currentScriptIndex = 0;

        for(var i = 0; i < scripts.length; i++)
        {
            var script = scripts[i];

            if(script.src != "")
            {
                scriptPathsAndModels.push
                ({
                    path: script.src,
                    model: this._parseSourceCode(this._externalFilesMap[script.src], script.src, 1)
                });
            }
            else
            {
                scriptPathsAndModels.push
                ({
                    path: script.src,
                    model: this._parseSourceCode
                    (
                        script.textContent,
                        script.baseURI,
                        (function()
                        {
                            var code = script.textContent.replace(/(\r)?\n/g, "\n");
                            var scriptStringIndex = currentPageContent.indexOf(code, currentScriptIndex);

                            if(scriptStringIndex == null || scriptStringIndex == -1) { return -1; }
                            else
                            {
                                currentScriptIndex = scriptStringIndex + code.length;
                                return currentPageContent.substring(0, scriptStringIndex).split("\n").length;
                            }
                        })()
                    )
                });
            }
        }

        return scriptPathsAndModels;
    },

    _getStylesPathsAndModels: function(document)
    {
        var stylesheets = document.styleSheets;
        var stylePathAndModels = [];

        for(var i = 0; i < stylesheets.length; i++)
        {
            var styleSheet = stylesheets[i];
            stylePathAndModels.push
            (
                {
                    path : styleSheet.href != null ? styleSheet.href : document.baseURI,
                    model:  this._getStyleSheetModel(styleSheet)
                }
            );
        }

        return stylePathAndModels;
    },

    _getStyleSheetModel: function(styleSheet)
    {
        if(styleSheet == null) { return {}; }

        var model = { rules: [] };

        try
        {
            var cssRules = styleSheet.cssRules;

            for(var i = 0; i < cssRules.length; i++)
            {
                var cssRule = cssRules[i];
                model.rules.push
                (
                    {
                        selector: cssRule.selectorText,
                        cssText: cssRule.cssText,
                        declarations: this._getStyleDeclarations(cssRule)
                    }
                );
            }
        }
        catch(e)
        {
            CU.reportError("Error when getting stylesheet model: " + e);
        }

        return model;
    },

    _getStyleDeclarations: function(cssRule)
    {
        var declarations = {};

        try
        {
            //type == 1 for styles, so far we don't care about others
            if(cssRule == null || cssRule.style == null || cssRule.type != 1) { return declarations;}

            var style = cssRule.style;

            for(var i = 0; i < style.length; i++)
            {
                var key = style[i];
                declarations[key] = style[key];

                if(declarations[key] == null)
                {
                    if(key == "float")
                    {
                        declarations[key] = style["cssFloat"];
                    }
                    else
                    {
                        var newKey = key.replace(/-[a-z]/g, function(match){ return match[1].toUpperCase()});
                        declarations[key] = style[newKey];
                    }
                }

                if(declarations[key] == null)
                {
                    newKey = newKey.replace("Value", "");
                    declarations[key] = style[newKey];
                }

                if(declarations[key] == null)
                {
                    Cu.reportError("Unrecognized CSS Property: " + key);
                }
            }
        }
        catch(e)
        {
            CU.reportError("Error when getting style declarations: " + e  + " " + key + " " + newKey);
        }

        return declarations;
    },

    _parseSourceCode: function(sourceCode, path, startLine)
    {
        Components.utils.import("resource://gre/modules/reflect.jsm");

        var model = Reflect.parse(sourceCode);

        if(model != null)
        {
            if(model.loc == null)
            {
                model.loc = { start: {line: startLine}, source: path};
            }

            if(model.loc.start.line != startLine)
            {
                model.lineAdjuster = startLine;
            }
            else
            {
                model.lineAdjuster = 0;
            }

            model.source = path;
        }

        return model;
    }
};

var Firecrow =
{
    _view: null,
    _currentId: 1,
    _window: null,
    _iframe: null,
    _toolbox: null,
    slicer: null,
    scenarioGenerator: null,

    UIOpened: false,
    id: null,
    timer: null,
    callback: null,
    data: {},

    init: function GUI_init(aCallback, aIframe, aToolbox)
    {
        Firecrow.callback = aCallback;

        Firecrow._iframe = aIframe;
        Firecrow._toolbox = aToolbox;

        if (Firecrow._toolbox)
        {
            this._target = aToolbox._target;
            Firecrow._window = Firecrow._toolbox._target.tab.ownerDocument.defaultView;
        }
        else
        {
            Firecrow._window = Services.wm.getMostRecentWindow("navigator:browser");
        }

        Firecrow._window.addEventListener("unload", Firecrow.destroy, false);
        if (!Firecrow.id)
        {
            Firecrow.id = "Firecrow-ui-" + Date.now();
        }

        this.onNavigatedAway = this.onNavigatedAway.bind(this);
        this._target.on("navigate", this.onNavigatedAway);

        Firecrow._view = new FirecrowView(Firecrow._window, aIframe);

        FileHelper.createFirecrowDirs();
    },

    setSlicer: function(slicer)
    {
        this.slicer = slicer;
    },

    setScenarioGenerator: function(scenarioGenerator)
    {
        this.scenarioGenerator = scenarioGenerator;
    },

    onNavigatedAway: function onNavigatedAway(event, payload)
    {
        var newWindow = payload._navPayload || payload;
        var self = this;

        function onDOMReady() {
            newWindow.removeEventListener("DOMContentLoaded", onDOMReady, true);

            self._view.rebuild(newWindow);
        }

        if (newWindow.document.readyState == "loading") { newWindow.addEventListener("DOMContentLoaded", onDOMReady, true); }
        else { onDOMReady(); }
    },

    destroy: function GUI_destroy()
    {
        if (Firecrow._window)
        {
            try
            {
                Firecrow._window.removeEventListener("unload", Firecrow.destroy, false);
                this.target.off("navigate", this.onNavigatedAway);
            } catch(ex) {}
        }

        if (Firecrow.UIOpened == true)
        {
            Firecrow._view.closeUI();
            Firecrow.callback && Firecrow.callback();
        }
    }
};