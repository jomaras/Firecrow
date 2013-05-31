var EXPORTED_SYMBOLS = ["Firecrow"];

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");

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