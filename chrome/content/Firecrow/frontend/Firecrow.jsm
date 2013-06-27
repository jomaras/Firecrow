var EXPORTED_SYMBOLS = ["Firecrow"];

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

Cu.import("resource:///modules/source-editor.jsm");
Cu.import("resource:///modules/devtools/CssLogic.jsm");

Cu.import("chrome://Firecrow/content/helpers/fbHelper.js");
Cu.import("chrome://Firecrow/content/helpers/htmlHelper.js");
Cu.import("chrome://Firecrow/content/helpers/FileHelper.js");
Cu.import("chrome://Firecrow/content/jsRecorder/JsRecorder.js");

XPCOMUtils.defineLazyModuleGetter(this, "MarkupView", "resource:///modules/devtools/MarkupView.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "Selection", "resource:///modules/devtools/Selection.jsm");


var HTML = "http://www.w3.org/1999/xhtml";

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
    _filePathSourceMap: {},
    _currentSelectedFile: null,

    _onLoad: function FV__onLoad()
    {
        this.loaded = true;

        this._frame.removeEventListener("load", this._onLoad, true);
        this._frameDoc = this._frame.contentDocument;
        this._frameDoc.defaultView.focus();

        this._frame.addEventListener("unload", this._onUnload, true);

        this._mainContainerContent = this.$("mainContainerContent");
        this._slicerMainContainer = this.$("slicerMainContainer");
        this._sourcesMenuPopup = this.$("sourcesMenuPopup");
        this._sourcesMenuList = this.$("sourcesMenuList");

        this._slicingCriteriaList = this.$("_slicingCriteriaList");
        this._existingRecordingsList = this.$("existingRecordingsList");

        this._editorContainer = this.$("editor");
        this._markupContainer = this.$("markupBox");

        this._setSlicingCriteriaButton = this.$("setSlicingCriteriaButton");
        this._recordButton = this.$("recordButton");
        this._slicingButton = this.$("slicingButton");

        this._invisibleBrowser = this.$("invisibleBrowser");

        this._recordOptionsElement = this.$("recordOptions");

        this._createSourceSelectionMenu();
        this._createSourceCodeViewer();
        this._createMarkupViewer();

        this._handleSourceCodeEvents();

        this._setSlicingCriteriaButton.onclick = this._slicingCriteriaClick.bind(this);
        this._recordButton.onclick = this._recordClick.bind(this);
        this._slicingButton.onclick = this._slicingClick.bind(this);

        this._updateCurrentRecordings();
    },

    _slicingClick: function()
    {
        FbHelper.openWindow("chrome://firecrow/content/windows/slicerWindow.html", "Firecrow", {});
    },

    _slicingCriteriaClick: function()
    {
        if(!this._isMarkupView()) { return; }

        this._slicingCriteriaMap.DOM[CssLogic.findCssSelector(this.selection.node)] = true;
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
        this._filePathSourceMap = {};
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
        return !this._markupContainer.collapsed;
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

        container.innerHTML = "<span class='deleteSlicingCriteriaContainer'/><a>" + summary + "</a>";
        var deleteButtonContainer = container.querySelector(".deleteSlicingCriteriaContainer");

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

        var container = doc.createElement("div");
        container.innerHTML = "<span class='deleteRecordingContainer'/><a>" + recordingInfo.name + "</a>";

        var deleteButtonContainer = container.querySelector(".deleteRecordingContainer");

        deleteButtonContainer.filePath = recordingInfo.path;

        deleteButtonContainer.onclick = function(e)
        {
            var button = e.target;

            if(button.filePath)
            {
                FileHelper.deleteFile(button.filePath);
                button.onclick = null;
                var buttonContainer = button.parentNode;
                buttonContainer.parentNode.removeChild(buttonContainer);
            }
        }

        this._existingRecordingsList.appendChild(container);
    },

    _clearSlicingCriteriaDisplay: function()
    {
        var deleteButtons = this._slicingCriteriaList.querySelectorAll(".deleteSlicingCriteriaContainer");

        for(var i = 0; i < deleteButtons.length; i++)
        {
            deleteButtons[i].onclick = null;
        }

        this._slicingCriteriaList.innerHTML = "";
    },

    _clearRecordingInfoDisplay: function()
    {
        var deleteButtons = this._existingRecordingsList.querySelectorAll(".deleteRecordingContainer");

        for(var i = 0; i < deleteButtons.length; i++)
        {
            deleteButtons[i].onclick = null;
        }

        this._existingRecordingsList.innerHTML = "";
    },

    _createMarkupViewer: function()
    {
        this._markupContainer.setAttribute("hidden", true);

        this._createMarkupSelection();
        this._createMarkupFrame();
    },

    _createMarkupSelection: function()
    {
        this.selection = new Selection();
        this.onNewSelection = this.onNewSelection.bind(this);
        this.selection.on("new-node", this.onNewSelection);

        this.onBeforeNewSelection = this.onBeforeNewSelection.bind(this);
        this.selection.on("before-new-node", this.onBeforeNewSelection);
    },

    _destroyMarkupSelection: function()
    {
        if(this.selection == null) { return; }

        this.selection.off("new-node", this.onNewSelection);
        this.selection.off("before-new-node", this.onBeforeNewSelection);

        this.selection = null;
    },

    _createMarkupFrame: function()
    {
        this._markupFrame = this._frameDoc.createElement("iframe");
        this._markupFrame.setAttribute("flex", "1");
        this._markupFrame.setAttribute("tooltip", "aHTMLTooltip");
        this._markupFrame.setAttribute("context", "inspector-node-popup");

        // This is needed to enable tooltips inside the iframe document.
        this._boundMarkupFrameLoad = function ()
        {
            this._markupFrame.contentWindow.focus();
            this._onMarkupFrameLoad();
        }.bind(this);

        this._markupFrame.addEventListener("load", this._boundMarkupFrameLoad, true);
        this._markupFrame.setAttribute("src", "chrome://browser/content/devtools/markup-view.xhtml");

        this._markupContainer.appendChild(this._markupFrame);
    },

    _destroyMarkupFrame: function()
    {
        this._markupContainer.removeChild(this._markupFrame);
        this._markupFrame = null;
    },

    _onMarkupFrameLoad: function InspectorPanel__onMarkupFrameLoad()
    {
        this._markupFrame.removeEventListener("load", this._boundMarkupFrameLoad, true);
        delete this._boundMarkupFrameLoad;

        this._markupContainer.removeAttribute("hidden");

        this.markup = new MarkupView(this, this._markupFrame, this._window);

        var root = this._getCurrentPageDocument().documentElement;
        this.selection.setNode(root);
    },

    onNewSelection: function InspectorPanel_onNewSelection() {},
    onBeforeNewSelection: function InspectorPanel_onBeforeNewSelection(event, node) {},

    _handleSourceCodeEvents: function()
    {
        this._sourcesMenuList.addEventListener("command", function()
        {
            if(this._sourcesMenuList.selectedItem == null) { return; }

            this._currentSelectedFile = this._sourcesMenuList.selectedItem.value;

            if(this._filePathSourceMap[this._currentSelectedFile] == null)
            {
                this._invisibleBrowser.setAttribute("src", "view-source:" + this._sourcesMenuList.selectedItem.value);
                this.editor.setText("---- LOADING SOURCE CODE ----");
            }
            else
            {
                this.editor.setText(this._filePathSourceMap[this._currentSelectedFile]);
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


        this._invisibleBrowser.addEventListener("DOMContentLoaded", function()
        {
            this._filePathSourceMap[this._currentSelectedFile] = this._invisibleBrowser.contentDocument.getElementById('viewsource').textContent;
            this.editor.setText(this._filePathSourceMap[this._currentSelectedFile]);

            this._showExistingBreakpoints();
        }.bind(this));
    },

    _showSourceEditor: function()
    {
        this._editorContainer.setAttribute("collapsed", false);
        this._markupContainer.setAttribute("collapsed", true);
    },

    _showMarkupEditor: function()
    {
        this._editorContainer.setAttribute("collapsed", true);
        this._markupContainer.setAttribute("collapsed", false);
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
    }
};

var Firecrow =
{
    _view: null,
    _currentId: 1,
    _window: null,
    _iframe: null,
    _toolbox: null,

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

    onNavigatedAway: function onNavigatedAway(event, payload) {
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