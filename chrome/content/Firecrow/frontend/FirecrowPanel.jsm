var EXPORTED_SYMBOLS = ["FirecrowPanel"];

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

var global = {};

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource:///modules/devtools/EventEmitter.jsm");
Cu.import("chrome://Firecrow/content/frontend/Firecrow.jsm", global);

try
{
    Cu.import("resource://gre/modules/commonjs/promise/core.js");
}
catch (e)
{
    Cu.import("resource://gre/modules/commonjs/sdk/core/promise.js");
}

function FirecrowPanel(iframeWindow, toolbox, callback)
{
    this._toolbox = toolbox;
    this.panelWin = iframeWindow;
    this.callback = callback;

    this.window = toolbox._target.tab.ownerDocument.defaultView;
    this.aTab = toolbox._target.tab;
    var parentDoc = iframeWindow.document.defaultView.parent.document;
    var iframe = parentDoc.getElementById("toolbox-panel-iframe-Firecrow");

    global.Firecrow.init(null, iframe, toolbox);
    EventEmitter.decorate(this);
}

FirecrowPanel.prototype =
{
    open: function()
    {
        var deferred = Promise.defer();
        this._isReady = true;
        this.emit("ready");
        deferred.resolve(this);
        return deferred.promise;
    },

    destroy: function()
    {
        global.Firecrow.destroy();
        this.window = null;
        try
        {
            Components.utils.unload("chrome://Firecrow/content/frontend/Firecrow.jsm");
            global.FirecrowModule = null;
            delete global.Firecrow;
            global = null;
            global = {};
            Cu.import("chrome://Firecrow/content/frontend/Firecrow.jsm", global);
        }
        catch (e) {}

        if (this.callback)
        {
            this.callback();
            this.callback = null;
        }
        return Promise.resolve(null);
    }
};
