/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource:///modules/devtools/gDevTools.jsm");

XPCOMUtils.defineLazyGetter(this, "osString", () =>
Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime).OS);

XPCOMUtils.defineLazyGetter(this, "toolStrings", () =>
Services.strings.createBundle("chrome://my-addon/locale/strings.properties"));

XPCOMUtils.defineLazyGetter(this, "toolDefinition", () => ({
    id: "Firecrow",
    ordinal: 99,
    key: "F12",
    modifiers: "accel,shift",
    icon: "chrome://Firecrow/skin/images/tool-Firecrow.png",
    url: "chrome://Firecrow/content/frontend/tool.xul",
    label: "Firecrow",
    tooltip: "",
    isTargetSupported: function(target) {
        return target.isLocalTab;
    },
    build: function(iframeWindow, toolbox)
    {
        Cu.import("chrome://Firecrow/content/frontend/panel.js");
        let panel = new FirecrowPanel(iframeWindow, toolbox);
        return panel.open();
    }
}));

function startup() {
    gDevTools.registerTool(toolDefinition);
}

function shutdown() {
    gDevTools.unregisterTool(toolDefinition);
    Services.obs.notifyObservers(null, "startupcache-invalidate", null);
}

function install() {
}

function uninstall() {
}