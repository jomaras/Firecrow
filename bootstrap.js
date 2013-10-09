/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
 
"use strict";
let global = this;

let {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/AddonManager.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

let gAddon;
let reload = function() {};
let openSite = false;
const toolsMenuitemID = "Firecrow-tools-menu-item";
const appMenuitemID = "Firecrow-app-menu-item";
const keyID = "Firecrow-key";
const keysetID = "Firecrow-keyset";
const toolbarButtonID = "developer-toolbar-Firecrowui";
const commandID = "Tools:FirecrowUI";
const broadcasterID = "devtoolsMenuBroadcaster_FirecrowUI";

// Function to run on every window which detects customizations
function handleCustomization(window) {
  // Disable the add-on when customizing
  listen(window, window, "beforecustomization", function() {
    if (gAddon.userDisabled)
      return;
    unload();

    // Listen for one customization finish to re-enable the addon
    listen(window, window, "aftercustomization", reload, false);
  });
}

function addMenuItem(window) {
  function $(id) window.document.getElementById(id);

  function removeMenuItem() {
    let menuitem = $(toolsMenuitemID);
    menuitem && menuitem.parentNode.removeChild(menuitem);
    let appitem = $(appMenuitemID);
    appitem && appitem.parentNode.removeChild(appitem);
    let toolbitem = $(toolbarButtonID);
    toolbitem && toolbitem.parentNode.removeChild(toolbitem);
  }
  function removeKey() {
    let keyset = $(keysetID);
    keyset && keyset.parentNode.removeChild(keyset);
    let command = $(commandID);
    command && command.parentNode.removeChild(command);
  }

  let XUL = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
  let notificationBox;
  unload(function() {
    notificationBox = FirecrowWindow = null;
  }, window);

  let command = window.document.createElement("command");
  command.id = commandID;
  window.FirecrowUI = FirecrowUI;
  command.setAttribute("oncommand", "FirecrowUI.toggleFirecrowUI()");
  $("mainCommandSet").appendChild(command);

  let broadcaster = window.document.createElement("broadcaster");
  broadcaster.id = broadcasterID;
  broadcaster.setAttribute("label", "Firecrow");
  broadcaster.setAttribute("type", "checkbox");
  broadcaster.setAttribute("autocheck", "false");
  broadcaster.setAttribute("key", keyID);
  broadcaster.setAttribute("command", commandID);
  $("mainBroadcasterSet").appendChild(broadcaster);

  let menubaritem = window.document.createElement("menuitem");
  menubaritem.id = toolsMenuitemID;
  menubaritem.setAttribute("observes", broadcasterID);
  menubaritem.setAttribute("accesskey", "I");
  $("menuWebDeveloperPopup").insertBefore(menubaritem, $("webConsole").nextSibling);

  let appmenuPopup = $("appmenu_webDeveloper_popup");
  if (appmenuPopup) {
    let appmenuitem = window.document.createElement("menuitem");
    appmenuitem.id = appMenuitemID;
    appmenuitem.setAttribute("observes", broadcasterID);
    appmenuPopup.insertBefore(appmenuitem, $("appmenu_webConsole").nextSibling);
  }

  let keyset = window.document.createElementNS(XUL, "keyset");
  keyset.id = keysetID;
  let key = window.document.createElementNS(XUL, "key");
  key.id = keyID;
  key.setAttribute("key", "Q");
  key.setAttribute("command", commandID);
  key.setAttribute("modifiers", "accel,shift")
  $("mainKeyset").parentNode.appendChild(keyset).appendChild(key);

  let button = window.document.createElement("toolbarbutton");
  button.setAttribute("observes", broadcasterID);
  button.classList.add("developer-toolbar-button");
  button.id = toolbarButtonID;
  button.setAttribute("style", "list-style-image: " +
                               "url('chrome://Firecrow/skin" +
                               "/images/tools-icons-small.png');" +
                               "-moz-image-region: rect(0, 16px, 16px, 0);");
  $("developer-toolbar").insertBefore(button, $("developer-toolbar-webconsole").nextSibling);

  unload(removeMenuItem, window);
  unload(removeKey, window);
  unload(function() {
    delete window.FirecrowUI;
  }, window);
}

function disable(id) {
  AddonManager.getAddonByID(id, function(addon) {
    addon.userDisabled = true;
  });
}

function startup(data, reason) AddonManager.getAddonByID(data.id, function(addon) {
  gAddon = addon;
  // Load various javascript includes for helper functions
  ["helper", "pref"].forEach(function(fileName) {
    let fileURI = addon.getResourceURI("bootstrapHelperScripts/" + fileName + ".js");
    Services.scriptloader.loadSubScript(fileURI.spec, global);
  });

  function init() {
    Cu.import("chrome://Firecrow/content/frontend/FirecrowUI.jsm", global);
    FirecrowUI._startup();
    watchWindows(handleCustomization);
    if (!FirecrowUI.gDevToolsAvailable) {
      watchWindows(function(window) {
        // Tab switch handler.
        listen(window, window.gBrowser.tabContainer, "TabSelect", function() {
          FirecrowUI._onTabChange(window);
        }, true);
      });
      watchWindows(addMenuItem);
    }
    else {
      watchWindows(function(window) window.FirecrowUI = FirecrowUI);
    }
    unload(function() {
      FirecrowUI._unload();
      Components.utils.unload("chrom://Firecrow/content/frontend/FirecrowUI.jsm");
      global.FirecrowUI = null;
      delete global.FirecrowUI;
    });
  }
  reload = function() {
    unload();
    init();
  };
  init();

  if ((reason == 7 || reason == 5) && data.version == "0.9.5")
    openSite = true;
  watchWindows(function(window) {
    if (openSite) {
      let stats = JSON.parse(pref("userStats"));
      let statString = (stats.compactMode || 0) + "_" + (stats.recorded || 0) + "_" +
                       (stats.linkClicked || 0) + "_" + (stats.networkPanel || 0) + "_" +
                       (stats.rulerDragged || 0) + "_" + (pref("timesUIOpened") || 0) + "_" +
                       (stats.windowZoomed || 0) + "_" + (stats.liveMode || 0) + "_" +
                       (stats.inspector || 0);
      window.openUILinkIn("http://grssam.com/addons/Firecrow/?stats=" + statString, "tab");
      openSite = false;
    }
  });
});

function shutdown(data, reason) {
  if (reason != APP_SHUTDOWN) {
    unload();
  }
}

function install() {}

function uninstall() {}
