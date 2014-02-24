var EXPORTED_SYMBOLS = ["FirecrowUI"];

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");

const broadcasterID = "devtoolsMenuBroadcaster_FirecrowUI";
var gDevToolsAvailable, _FirecrowUIOpened = false;

try
{
  Cu.import("resource:///modules/devtools/gDevTools.jsm");
  Cu.import("resource:///modules/devtools/Target.jsm");
  gDevToolsAvailable = true;
}
catch (ex)
{
  gDevToolsAvailable = false;
}

var global = {};
var FirecrowUI = {
  contentWindow: null,
  gDevToolsAvailable: gDevToolsAvailable,
  isUiOpened: function()
  {
      return FirecrowUI.gDevToolsAvailable ? _FirecrowUIOpened
                                           : global.Firecrow.UIOpened;
  },

  _startup: function()
  {
    if (gDevToolsAvailable)
    {
        Cu.import("chrome://Firecrow/content/frontend/FirecrowPanel.jsm", global);
        var FirecrowDefinition =
        {
            id: "Firecrow",
            ordinal: 5,
            killswitch: "devtools.Firecrow.enabled",
            icon: "chrome://Firecrow/skin/images/tool-Firecrow.png",
            url: "chrome://Firecrow/content/frontend/Firecrow.xul",
            label: "Firecrow",
            tooltip: "Firecrow - dynamic analysis",

            isTargetSupported: function() { return true; },

            build: function(iframeWindow, toolbox)
            {
                if (FirecrowUI.UIOpened == true)
                {
                    FirecrowUI.toggleFirecrowUI(toolbox._target);
                    _FirecrowUIOpened = false;
                    return {
                        destroy: function() {},
                        once: function() {},
                        open: function() {}
                    }.open();
                }
                else
                {
                    FirecrowUI.contentWindow = toolbox._target.window;
                }
                _FirecrowUIOpened = true;
                return (new global.FirecrowPanel(iframeWindow, toolbox, global.Firecrow._window.gBrowser, function()
                {
                _FirecrowUIOpened = false;
                })).open();
            }
        };

        gDevTools.registerTool(FirecrowDefinition);
    }
    else
    {
        Cu.import("chrome://Firecrow/content/frontend/Firecrow.jsm", global);
    }
  },

    _unload: function()
    {
        gDevToolsAvailable ? gDevTools.unregisterTool("Firecrow")
                           : global.Firecrow.destroy();

        FirecrowUI.contentWindow = null;
        Components.utils.unload("chrome://Firecrow/content/frontend/Firecrow.jsm");
        try
        {
            Components.utils.unload("chrome://Firecrow/content/producers/NetworkProducer.jsm");
            Components.utils.unload("chrome://Firecrow/content/producers/PageEventsProducer.jsm");
            Components.utils.unload("chrome://Firecrow/content/producers/MemoryProducer.jsm");
        } catch (e) {}

        try
        {
            global.Firecrow = null;
            delete global.Firecrow;
            delete global.FirecrowPanel;
        } catch (e) {}

        FirecrowUI = null;
    },

    _onTabChange: function (window)
    {
        function $(id) { return window.document.getElementById(id); };

        if (global.Firecrow && global.Firecrow.UIOpened)
        {
            if (window.gBrowser.selectedTab.linkedBrowser.contentWindow == FirecrowUI.contentWindow)
            {
                $(broadcasterID).setAttribute("checked", "true");
            }
            else
            {
                $(broadcasterID).setAttribute("checked", "false");
            }
        }
    },

    toggleFirecrowUI: function TUI_toggleFirecrowUI(aTarget)
    {
        function $(id) { return window.document.getElementById(id); };

        var window = Services.wm.getMostRecentWindow("navigator:browser");

        if (FirecrowUI.UIOpened != true)
        {
            if (gDevToolsAvailable)
            {
                if (!aTarget)
                {
                    aTarget = TargetFactory.forTab(window.gBrowser.selectedTab);
                }
                gDevTools.showToolbox(aTarget, "Firecrow");
                FirecrowUI.contentWindow = aTarget.window;
            }
            else
            {
                global.Firecrow.init(function ()
                {
                    try
                    {
                        Components.utils.unload("chrome://Firecrow/content/frontend/Firecrow.jsm");
                        global.Firecrow = null;
                        delete global.Firecrow;
                        Components.utils.import("chrome://Firecrow/content/frontend/Firecrow.jsm", global);
                        $(broadcasterID).setAttribute("checked", "false");
                    } catch (e) {}
                });

                $(broadcasterID).setAttribute("checked", "true");
                FirecrowUI.contentWindow = window.content.window;
            }
        }
        else
        {
            FirecrowUI.contentWindow = null;
            if (!FirecrowUI.gDevToolsAvailable)
            {
                global.Firecrow.destroy();
            }
        }
    },

    reopenFirecrowUI: function TUI_reopenFirecrowUI()
    {
        FirecrowUI.closeCurrentlyOpenedToolbox();
        FirecrowUI.closeThisToolbox();
        if (!FirecrowUI.gDevToolsAvailable)
        {
            global.Firecrow.destroy();
        }

        FirecrowUI.toggleFirecrowUI();
    },

    getFirecrowTab: function TUI_getFirecrowTab()
    {
        if (!FirecrowUI.gDevToolsAvailable)
        {
            return global.Firecrow._window.gBrowser.tabs
            [
                global.Firecrow._window.gBrowser.getBrowserIndexForDocument(FirecrowUI.contentWindow.document)
            ];
        }
        else
        {
            var chromeWindow = FirecrowUI.contentWindow
                                         .QueryInterface(Ci.nsIInterfaceRequestor)
                                         .getInterface(Ci.nsIWebNavigation)
                                         .QueryInterface(Ci.nsIDocShell)
                                         .chromeEventHandler
                                         .ownerDocument.defaultView;
            return chromeWindow.gBrowser.tabs
            [
                chromeWindow.gBrowser.getBrowserIndexForDocument(FirecrowUI.contentWindow.document)
            ];
         }
    },

    closeCurrentlyOpenedToolbox: function TUI_closeCurrentlyOpenedToolbox()
    {
        if (FirecrowUI.gDevToolsAvailable)
        {
            gDevTools.closeToolbox(TargetFactory.forTab(FirecrowUI.getFirecrowTab()));
        }
    },

    closeThisToolbox: function TUI_closeThisToolbox()
    {
        if (FirecrowUI.gDevToolsAvailable)
        {
            var window = Services.wm.getMostRecentWindow("navigator:browser");
            var target = TargetFactory.forTab(window.gBrowser.selectedTab);
            gDevTools.closeToolbox(target);
        }
    }
};
