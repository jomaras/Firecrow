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


var HTML = "http://www.w3.org/1999/xhtml";

function FirecrowView(aChromeWindow, aIframe)
{
    this._window = aChromeWindow;
    this._aChromeWindow = aChromeWindow;
    var gBrowser = this._window.gBrowser;
    this._iframe = aIframe || null;
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
    this._onUnload = this._onUnload.bind(this);

    this._frame.addEventListener("load", this._onLoad, true);

    if (!this._iframe)
    {
        this._frame.setAttribute("src", "chrome://Firecrow/content/frontend/Firecrow.xul");
    }
}

FirecrowView.prototype =
{
    _onLoad: function FV__onLoad()
    {
        this.loaded = true;
        this._frame.removeEventListener("load", this._onLoad, true);
        this._frameDoc = this._frame.contentDocument;
        this._frameDoc.defaultView.focus();

        this._frame.addEventListener("unload", this._onUnload, true);

        this.mainContainerContent = this.$("mainContainerContent");
        this.slicerMainContainer = this.$("slicerMainContainer");
        this.sourcesMenuPopup = this.$("sourcesMenuPopup");
        this.sourcesMenuList = this.$("sourcesMenuList");

        this.slicingCriteriaList = this.$("slicingCriteriaList");

        this.editorPlaceHolder = this.$("editor");
        this.invisibleBrowser = this.$("invisibleBrowser");

        this._markupBox = this.$("markupBox");

        this._createSourceSelectionMenu();
        this._createSourceCodeViewer();
        this._handleSourceCodeEvents();

        this._createMarkupViewer();

        this._slicingCriteriaMap = {};
        this._currentSelectedFile = null;
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

    _onUnload: function FV__onUnload()
    {
        this._frame = null;
        this._frameDoc = null;
        this._splitter = null;
        this._window = null;
        this.loaded = false;
    },

    _createSourceSelectionMenu: function()
    {
        var scriptNameAndPaths = this._getContentScriptNameAndPaths();

        for(var i = 0; i < scriptNameAndPaths.length; i++)
        {
            var scriptNameAndPath = scriptNameAndPaths[i];
            this._createMenuItem(this.sourcesMenuPopup, scriptNameAndPath.name, scriptNameAndPath.path, true);
        }
    },

    _createSourceCodeViewer: function()
    {
        this.editor = new SourceEditor();

        this.editor.init
        (
            this.editorPlaceHolder,
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
        this.slicingCriteriaList.innerHTML = "";
        var doc = this.slicingCriteriaList.ownerDocument;

        for(var fileName in this._slicingCriteriaMap)
        {
            for(var line in this._slicingCriteriaMap[fileName])
            {
                var container = doc.createElement("div");
                var link = doc.createElement("a");

                link.textContent = "@" + (parseInt(line) + 1) + " - " + this._getScriptName(fileName);
                link.href = "test.html";
                container.appendChild(link);

                this.slicingCriteriaList.appendChild(container);
            }
        }
    },

    _createMarkupViewer: function()
    {
        //var currentPageDocument = ;
        //this.markupBox.textContent = currentPageDocument.body.innerHTML;

        this.selection = new Selection();
        this.onNewSelection = this.onNewSelection.bind(this);
        this.selection.on("new-node", this.onNewSelection);
        this.onBeforeNewSelection = this.onBeforeNewSelection.bind(this);
        this.selection.on("before-new-node", this.onBeforeNewSelection);

        this._markupFrame = this._frameDoc.createElement("iframe");
        this._markupFrame.setAttribute("flex", "1");
        this._markupFrame.setAttribute("tooltip", "aHTMLTooltip");
        this._markupFrame.setAttribute("context", "inspector-node-popup");

        // This is needed to enable tooltips inside the iframe document.
        this._boundMarkupFrameLoad = function InspectorPanel_initMarkupPanel_onload() {
            this._markupFrame.contentWindow.focus();
            this._onMarkupFrameLoad();
        }.bind(this);
        this._markupFrame.addEventListener("load", this._boundMarkupFrameLoad, true);

        this._markupBox.setAttribute("hidden", true);
        this._markupBox.appendChild(this._markupFrame);
        this._markupFrame.setAttribute("src", "chrome://browser/content/devtools/markup-view.xhtml");
    },

    _onMarkupFrameLoad: function InspectorPanel__onMarkupFrameLoad()
    {
        this._markupFrame.removeEventListener("load", this._boundMarkupFrameLoad, true);
        delete this._boundMarkupFrameLoad;

        this._markupBox.removeAttribute("hidden");

        this.markup = new MarkupView(this, this._markupFrame, this._aChromeWindow);

        var root = this._getCurrentPageDocument().documentElement;
        this.selection.setNode(root);
    },

    onNewSelection: function InspectorPanel_onNewSelection()
    {
    },

    /**
     * When a new node is selected, before the selection has changed.
     */
    onBeforeNewSelection: function InspectorPanel_onBeforeNewSelection(event, node)
    {
    },

    _handleSourceCodeEvents: function()
    {
        this.sourcesMenuList.addEventListener("command", function()
        {
            this.editor.setText("---- LOADING SOURCE CODE ----");
            this._currentSelectedFile = this.sourcesMenuList.selectedItem.value;
            this.invisibleBrowser.setAttribute("src", "view-source:" + this.sourcesMenuList.selectedItem.value);
        }.bind(this));


        this.invisibleBrowser.addEventListener("DOMContentLoaded", function()
        {
            if(this.sourcesMenuList.selectedItem != null && this.sourcesMenuList.selectedItem.label.startsWith("*"))
            {
                this.editor.setMode(SourceEditor.MODES.HTML);
            }
            else
            {
                this.editor.setMode(SourceEditor.MODES.JAVASCRIPT);
            }

            this.editor.setText(this.invisibleBrowser.contentDocument.getElementById('viewsource').textContent);

            this._showExistingBreakpoints();

        }.bind(this));
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
        return this._aChromeWindow.content.document;
    },

    _getContentScriptNameAndPaths: function()
    {
        var scriptPaths = [];
        var document = this._getCurrentPageDocument();

        scriptPaths.push({name: "* - " + this._getScriptName(document.baseURI), path: document.baseURI });

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
        if (aIframe) { Firecrow._iframe = aIframe; }

        Firecrow._toolbox = aToolbox;

        if (Firecrow._toolbox)
        {
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

        Firecrow._view = new FirecrowView(Firecrow._window, aIframe);
    },

    destroy: function GUI_destroy()
    {
        if (Firecrow._window)
        {
            try
            {
                Firecrow._window.removeEventListener("unload", Firecrow.destroy, false);
            } catch(ex) {}
        }

        if (Firecrow.UIOpened == true)
        {
            Firecrow._view.closeUI();
            Firecrow.callback && Firecrow.callback();
        }
    }
};