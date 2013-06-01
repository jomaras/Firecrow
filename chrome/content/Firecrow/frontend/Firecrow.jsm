var EXPORTED_SYMBOLS = ["Firecrow"];

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource:///modules/source-editor.jsm");

var HTML = "http://www.w3.org/1999/xhtml";

function FirecrowView(aChromeWindow, aIframe)
{
    this._window = aChromeWindow;
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
    _onLoad: function TV__onLoad()
    {
        this.loaded = true;
        this._frame.removeEventListener("load", this._onLoad, true);
        this._frameDoc = this._frame.contentDocument;
        this._frameDoc.defaultView.focus();

        this.recordButton = this.$("record");
        this.recordButton.addEventListener("command", this.toggleRecording, true);
        this._frame.addEventListener("unload", this._onUnload, true);

        this.mainContainerContent = this.$("mainContainerContent");

        this.codeMenuItem = this.$("codeMenuItem");
        this.slicingMenuItem = this.$("slicingMenuItem");
        this.scenariosMenuItem = this.$("scenariosMenuItem");
        this.reuserMenuItem = this.$("reuserMenuItem");

        var self = this;

        this.codeMenuItem.onclick = function()
        {
            self.markSelectedMenuItem(self.codeMenuItem, [self.slicingMenuItem, self.scenariosMenuItem, self.reuserMenuItem]);
        };

        this.slicingMenuItem.onclick = function()
        {
            self.markSelectedMenuItem(self.slicingMenuItem, [self.codeMenuItem, self.scenariosMenuItem, self.reuserMenuItem]);
        };

        this.scenariosMenuItem.onclick = function()
        {
            self.markSelectedMenuItem(self.scenariosMenuItem, [self.slicingMenuItem, self.codeMenuItem, self.reuserMenuItem]);
        };

        this.reuserMenuItem.onclick = function()
        {
            self.markSelectedMenuItem(self.reuserMenuItem, [self.slicingMenuItem, self.scenariosMenuItem, self.codeMenuItem]);
        };

        this.markSelectedMenuItem = function(selectedItem, rest)
        {
            selectedItem.classList.add("splitview-active");

            rest.forEach(function(item) { item.classList.remove("splitview-active"); })
        };

        this._initializeEditor();
    },

    closeUI: function TV_closeUI()
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

    _onUnload: function TV__onUnload()
    {
        this._frame = null;
        this._frameDoc = null;
        this._splitter = null;
        this._window = null;
        this.loaded = false;
    },

    $: function (ID)
    {
        return this._frameDoc.getElementById(ID);
    },

    _initializeEditor: function DV__initializeEditor(aCallback)
    {
        var placeholder = this.$("editor");
        var config = {
            mode: SourceEditor.MODES.JAVASCRIPT,
            readOnly: true,
            showLineNumbers: true,
            showAnnotationRuler: true,
            showOverviewRuler: true
        };

        this.editor = new SourceEditor();
        this.editor.init(placeholder, config, function() {
            this._onEditorLoad();
            aCallback && aCallback();
        }.bind(this));

        this.setEditorSource("file:///C:/GitWebStorm/Firecrow/playground/test.js");
    },

    _onEditorLoad: function DV__onEditorLoad() {
        this.editor.focus();
    },

    setEditorMode: function DV_setEditorMode(aUrl, aContentType, aTextContent)
    {
        if(aContentType === undefined) { aContentType = ""; }
        if(aTextContent === undefined) { aTextContent = ""; }

        if (aContentType)
        {
            if (/javascript/.test(aContentType))
            {
                this.editor.setMode(SourceEditor.MODES.JAVASCRIPT);
            }
            else
            {
                this.editor.setMode(SourceEditor.MODES.HTML);
            }
        }
        else if (aTextContent.match(/^\s*</))
        {
            // Use HTML mode for files in which the first non whitespace character is
            // &lt;, regardless of extension.
            this.editor.setMode(SourceEditor.MODES.HTML);
        }
        else
        {
            // Use JS mode for files with .js and .jsm extensions.
            if (/\.jsm?$/.test(SourceUtils.trimUrlQuery(aUrl)))
            {
                this.editor.setMode(SourceEditor.MODES.JAVASCRIPT);
            }
            else
            {
                this.editor.setMode(SourceEditor.MODES.TEXT);
            }
        }
    },

    setEditorSource: function(aSource)
    {
        if (this._isDestroyed || this._editorSource == aSource)  { return; }

        this.editor.setMode(SourceEditor.MODES.TEXT);
        this.editor.setText(L10N.getStr("loadingText"));
        this.editor.resetUndo();
        this._editorSource = aSource;

        // If the source is not loaded, display a placeholder text.
        if (!aSource.loaded)
        {
            DebuggerController.SourceScripts.getText(aSource, set.bind(this));
        }
        // If the source is already loaded, display it immediately.
        else
        {
            set.call(this, aSource);
        }

        // Updates the source editor's displayed text.
        // @param object aSource
        function set(aSource) {
            // Avoid setting an unexpected source. This may happen when fast switching
            // between sources that haven't been fetched yet.
            if (this._editorSource != aSource) {
                return;
            }

            // Avoid setting the editor mode for very large files.
            if (aSource.text.length < SOURCE_SYNTAX_HIGHLIGHT_MAX_FILE_SIZE) {
                this.setEditorMode(aSource.url, aSource.contentType, aSource.text);
            } else {
                this.editor.setMode(SourceEditor.MODES.TEXT);
            }
            this.editor.setText(aSource.text);
            this.editor.resetUndo();

            // Update the editor's current caret and debug locations given by the
            // currently active frame in the stack, if there's one available.
            this.updateEditor();

            // Synchronize any other components with the currently displayed source.
            DebuggerView.Sources.selectedValue = aSource.url;
            DebuggerController.Breakpoints.updateEditorBreakpoints();

            // Notify that we've shown a source file.
            window.dispatchEvent(document, "Debugger:SourceShown", aSource);
        }
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