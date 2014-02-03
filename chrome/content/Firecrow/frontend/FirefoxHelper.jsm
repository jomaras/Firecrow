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
    }
};