var EXPORTED_SYMBOLS = ["FirefoxHelper"];

var Cu = Components.utils;
var Ci = Components.interfaces;
var Cc = Components.classes;

Cu.import("chrome://Firecrow/content/initFBL.js");
Cu.import("chrome://Firecrow/content/helpers/UriHelper.js");

var FirefoxHelper =
{
    promptUserForFolder: function(window, message)
    {
        var filePicker = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
        filePicker.init(window, message,  2); // open folder
        var returnValue = filePicker.show();

        if (returnValue == Ci.nsIFilePicker.returnOK || returnValue == Ci.nsIFilePicker.returnReplace)
        {
            return filePicker.file.path;
        }

        return "";
    },

    //https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIProcess?redirectlocale=en-US&redirectslug=nsIProcess
    executeAsyncProgram: function(applicationExePath, args, completedCallback)
    {
        var file = Cc["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
        file.initWithPath(applicationExePath);

        var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
        process.init(file);

        var programExecutorObserver = new ProgramExecutorObserver(function(subject, topic, data)
        {
            programExecutorObserver.unregister();
            completedCallback(subject, topic, data);
        });

        process.runAsync(args, args.length, programExecutorObserver);

        Cu.reportError("Executing :" + applicationExePath + " - " + args);
    }
};

var ProgramExecutorObserver = function(observeCallback)
{
    this.register();
    this.observeCallback = observeCallback;
};

ProgramExecutorObserver.prototype =
{
    ID: "programExecutorObserver",

    observe: function(subject, topic, data)
    {
        this.observeCallback && this.observeCallback(subject, topic, data);
    },

    register: function()
    {
        var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
        observerService.addObserver(this, this.ID, false);
    },

    unregister: function()
    {
        var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
        observerService.removeObserver(this, this.ID);
    }
}