/**IF INCLUDED AS MODULE*/
if(typeof FBL === "undefined") { FBL = {}; FBL.ns = function(namespaceFunction){ namespaceFunction(); }; FBL.Firecrow = {}; }
/**END IF INCLUDED AS MODULE*/

EXPORTED_SYMBOLS = ["FbHelper"];

FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var CC = Components.classes;
var CI = Components.interfaces;
var CU = Components.utils;

var fileHelper = Firecrow.FileHelper;
var valueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
Firecrow.UnrecognizedCssProperties = {};

Firecrow.fbHelper =
{
    installLocation: "",
    openWindow: function (pathToWindow, windowTitle, args)
    {
        try
        {
            args.wrappedJSObject = args;

            var windowWatcher = CC["@mozilla.org/embedcomp/window-watcher;1"].getService(CI.nsIWindowWatcher);

            Firecrow.args = args;

            return windowWatcher.openWindow
            (
                null,
                pathToWindow,
                windowTitle,
                "chrome,centerscreen",
                args
            );
        }
        catch (e) { CU.reportError("Error opening window:" + e); }
    },

    getElementByID: function(elementID)
    {
        try{ return Firebug.chrome.$(elementID); }
        catch(e) { CU.reportError("Error when getting element by id: " + e);}
    },

    createMenuItem: function(document, label, value, selected)
    {
       try
       {
           const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

           var menuItem = document.createElementNS(XUL_NS, "menuitem");

           if (label != undefined) { menuItem.setAttribute("label", label); }
           if (value != undefined) { menuItem.setAttribute("value", value); }
           if (selected != undefined) { menuItem.setAttribute("selected", selected); }


           return menuItem;
       }
       catch(e) { CU.reportError("Error when creating menu item: " + e); }
    },

    clearChildren: function(element)
    {
        try
        {
            if(element == null) { return; }

            while (element.childNodes.length >= 1 )
            {
                element.removeChild(element.firstChild);
            }
        }
        catch(e) { CU.reportError("Error when clearing children");}
    },

    getExternalScriptPaths: function()
    {
        try
        {
            var document = this.getCurrentPageDocument();

            var scripts = [];

            valueTypeHelper.convertToArray(document.querySelectorAll('script[src]')).forEach(function(script)
            {
                scripts.push(script.src);
            });

            return scripts;
        }
        catch(e) { CU.reportError("Getting script paths error " + e); }
    },

    getStylesPathsAndModels: function(document)
    {
        var returnValue = [];

        try
        {
            document = document || this.getCurrentPageDocument();

            var currentPageUrl = document.baseURI;

            var stylesheets = document.styleSheets;

            for(var i = 0; i < stylesheets.length; i++)
            {
                var styleSheet = stylesheets[i];
                returnValue.push
                (
                    {
                        path : styleSheet.href != null ? styleSheet.href : document.baseURI,
                        model:  this.getStyleSheetModel(styleSheet)
                    }
                );
            }
        }
        catch(e) { CU.reportError("fbHelper: an error has occurred when trying to get styles path and model: " + e); }

        return returnValue;
    },

    getStyleSheetModel: function(styleSheet)
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
                        declarations: this.getStyleDeclarations(cssRule)
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

    getStyleDeclarations: function(cssRule)
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
                    Firecrow.UnrecognizedCssProperties[key] = "1";
                }
            }
        }
        catch(e)
        {
            CU.reportError("Error when getting style declarations: " + e  + " " + key + " " + newKey);
            Firecrow._KEY = key;
            Firecrow._NEW_KEY = newKey;
            Firecrow._STYLE = style;
        }

        return declarations;
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

    getScriptsPathsAndModels: function(document)
    {
        try
        {
            var returnValue = [];

            document = document || this.getCurrentPageDocument();

            var currentPageUrl = document.baseURI;
            var currentPageContent = fileHelper.getFileContentFromUrl(currentPageUrl);
            currentPageContent = currentPageContent.replace(/(\r)?\n/g, "\n");
            var currentScriptIndex = 0;

            this._MY_CONTENT = currentPageContent;

            valueTypeHelper.convertToArray(document.querySelectorAll("script")).forEach(function(scriptElement)
            {
                if(scriptElement.src == "")
                {
                    returnValue.push
                    ({
                        path: currentPageUrl,
                        model: ASTHelper.parseSourceCodeToAST
                        (
                            scriptElement.textContent,
                            currentPageUrl,
                            (function()
                            {
                                var code = scriptElement.textContent.replace(/(\r)?\n/g, "\n");
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
                else
                {
                    returnValue.push
                    ({
                        path: scriptElement.src,
                        model: ASTHelper.parseSourceCodeToAST
                        (
                            fileHelper.getFileContentFromUrl(scriptElement.src),
                            scriptElement.src,
                            1
                        )
                    });
                }
            });

            return returnValue;
        }
        catch(e) { CU.reportError("An error has occurred while trying to get script paths and models: " + e);}
    },

    getWindow: function() { return this.getMainWindow().gBrowser.contentWindow; },

    getMainWindow: function()
    {
        return window.QueryInterface(CI.nsIInterfaceRequestor)
                     .getInterface(CI.nsIWebNavigation)
                     .QueryInterface(CI.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(CI.nsIInterfaceRequestor)
                     .getInterface(CI.nsIDOMWindow);
    },

    getCurrentBrowser: function()
    {
        try { return this.getMainWindow().getBrowser().selectedBrowser; }
        catch (e) { CU.reportError("Getting current browser error: " + e); }
    },

    getDocument: function() { return this.getCurrentPageDocument(); },
    getDocumentForSimulating: function()
    {
        var fWindow = this.getWindowForSimulating();

        return fWindow != null ? fWindow.document : null;
    },
    getWindowForSimulating: function()
    {
        var fcFrame = this.getFcFrame();

        return fcFrame != null ? fcFrame.contentWindow : null;
    },
    getFcFrame: function() { return this.getElementByID("fcIFrame"); },

    getCurrentPageDocument: function()
    {
        try { return this.getWindow().document; }
        catch(e) { CU.reportError("Error when getting current page document " + e ); }
    },

    getCurrentUrl: function()
    {
        try { return this.getCurrentPageDocument().baseURI; }
        catch(e) { CU.reportError("Error when getting current url: " + e); }
    },

    getCurrentPageName: function()
    {
        try
        {
            var currentUrl = this.getCurrentUrl();

            return currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
        }
        catch(e) { CU.reportError("Error when getting current page name");}
    },

    reloadPage: function ()
    {
        try { this.getCurrentBrowser().reload(); }
        catch (e) { CU.reportError("Reloading page error: " + e); }
    },

    getExtensionFilePath: function ()
    {
        try
        {
            var directoryService = CC["@mozilla.org/file/directory_service;1"].getService(CI.nsIProperties);
            var fmDir = directoryService.get("ProfD", CI.nsIFile);

            return fmDir.target + "/extensions/Firecrow/";
        }
        catch (e) { CU.reportError("Error while getting filePath" + e); }
    },

    setButtonText: function(buttonId, text)
    {
        try
        {
            var button = this.getElementByID(buttonId);

            if(button != null) { button.label = text; }
            else { CU.reportError("Could not find button"); }
        }
        catch(e) { CU.reportError("Setting button text error: " + e); }
    },

    asyncSetPluginInstallLocation: function(ext_id)
    {
        try
        {
            Components.utils.import("resource://gre/modules/AddonManager.jsm");

            AddonManager.getAddonByID(ext_id, function(addon)
            {
                try
                {
                    var installLocation = addon.getResourceURI().path;

                    if(installLocation.indexOf('/') == 0)
                    {
                        installLocation = installLocation.substring(1, installLocation.length);
                    }

                    Firecrow.fbHelper.installLocation = installLocation;
                }
                catch(e) { CU.reportError("Error when getting addon: " + e); }
            });
        }
        catch(e) { CU.reportError("Error when async setting plugin location: " + e); }
    }
};
/*************************************************************************************/
}});

var FbHelper = FBL.Firecrow.fbHelper;