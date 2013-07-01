"use strict";

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

const NEW_SOURCE_IGNORED_URLS = ["debugger eval code", "self-hosted"];
const NEW_SOURCE_DISPLAY_DELAY = 200; // ms
const FETCH_SOURCE_RESPONSE_DELAY = 50; // ms
const CALL_STACK_PAGE_SIZE = 25; // frames

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/devtools/dbg-server.jsm");
Cu.import("resource://gre/modules/devtools/dbg-client.jsm");
Cu.import("resource://gre/modules/commonjs/sdk/core/promise.js");
Cu.import("resource:///modules/source-editor.jsm");
Cu.import("resource:///modules/devtools/LayoutHelpers.jsm");
Cu.import("resource:///modules/devtools/BreadcrumbsWidget.jsm");
Cu.import("resource:///modules/devtools/SideMenuWidget.jsm");
Cu.import("resource:///modules/devtools/VariablesView.jsm");
Cu.import("resource:///modules/devtools/ViewHelpers.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "Parser", "resource:///modules/devtools/Parser.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "NetworkHelper", "resource://gre/modules/devtools/NetworkHelper.jsm");

/**
 * Object defining the debugger controller components.
 */
let DebuggerController = {
  /**
   * Initializes the debugger controller.
   */
  initialize: function DC_initialize() {
    dumpn("Initializing the DebuggerController");

    this.startupDebugger = this.startupDebugger.bind(this);
    this.shutdownDebugger = this.shutdownDebugger.bind(this);
    this._onTabNavigated = this._onTabNavigated.bind(this);
    this._onTabDetached = this._onTabDetached.bind(this);

    // Chrome debugging lives in a different process and needs to handle
    // debugger startup and shutdown by itself.
    if (window._isChromeDebugger) {
      window.addEventListener("DOMContentLoaded", this.startupDebugger, true);
      window.addEventListener("unload", this.shutdownDebugger, true);
    }
  },

  /**
   * Initializes the view.
   *
   * @return object
   *         A promise that is resolved when the debugger finishes startup.
   */
  startupDebugger: function DC_startupDebugger() {
    if (this._isInitialized) {
      return this._startup.promise;
    }
    this._isInitialized = true;
    window.removeEventListener("DOMContentLoaded", this.startupDebugger, true);

    let deferred = this._startup = Promise.defer();

    DebuggerView.initialize(() => {
      DebuggerView._isInitialized = true;

      // Chrome debugging needs to initiate the connection by itself.
      if (window._isChromeDebugger) {
        this.connect().then(deferred.resolve);
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  },

  /**
   * Destroys the view and disconnects the debugger client from the server.
   *
   * @return object
   *         A promise that is resolved when the debugger finishes shutdown.
   */
  shutdownDebugger: function DC__shutdownDebugger() {
    if (this._isDestroyed) {
      return this._shutdown.promise;
    }
    this._isDestroyed = true;
    this._startup = null;
    window.removeEventListener("unload", this.shutdownDebugger, true);

    let deferred = this._shutdown = Promise.defer();

    DebuggerView.destroy(() => {
      DebuggerView._isDestroyed = true;
      this.SourceScripts.disconnect();
      this.StackFrames.disconnect();
      this.ThreadState.disconnect();

      this.disconnect();
      deferred.resolve();

      // Chrome debugging needs to close its parent process on shutdown.
      window._isChromeDebugger && this._quitApp();
    });

    return deferred.promise;
  },

  /**
   * Initiates remote or chrome debugging based on the current target,
   * wiring event handlers as necessary.
   *
   * In case of a chrome debugger living in a different process, a socket
   * connection pipe is opened as well.
   *
   * @return object
   *         A promise that is resolved when the debugger finishes connecting.
   */
  connect: function DC_connect() {
    if (this._connection) {
      return this._connection.promise;
    }

    let deferred = this._connection = Promise.defer();

    if (!window._isChromeDebugger) {
      let target = this._target;
      let { client, form, threadActor } = target;
      target.on("close", this._onTabDetached);
      target.on("navigate", this._onTabNavigated);
      target.on("will-navigate", this._onTabNavigated);

      if (target.chrome) {
        this._startChromeDebugging(client, form.chromeDebugger, deferred.resolve);
      } else {
        this._startDebuggingTab(client, threadActor, deferred.resolve);
      }

      return deferred.promise;
    }

    // Chrome debugging needs to make the connection to the debuggee.
    let transport = debuggerSocketConnect(Prefs.chromeDebuggingHost,
                                          Prefs.chromeDebuggingPort);

    let client = new DebuggerClient(transport);
    client.addListener("tabNavigated", this._onTabNavigated);
    client.addListener("tabDetached", this._onTabDetached);

    client.connect((aType, aTraits) => {
      client.listTabs((aResponse) => {
        this._startChromeDebugging(client, aResponse.chromeDebugger, deferred.resolve);
      });
    });

    return deferred.promise;
  },

  /**
   * Disconnects the debugger client and removes event handlers as necessary.
   */
  disconnect: function DC_disconnect() {
    // Return early if the client didn't even have a chance to instantiate.
    if (!this.client) {
      return;
    }

    // When debugging local or a remote instance, the connection is closed by
    // the RemoteTarget.
    if (window._isChromeDebugger) {
      this.client.removeListener("tabNavigated", this._onTabNavigated);
      this.client.removeListener("tabDetached", this._onTabDetached);
      this.client.close();
    }

    this._connection = null;
    this.client = null;
    this.activeThread = null;
  },

  /**
   * Called for each location change in the debugged tab.
   *
   * @param string aType
   *        Packet type.
   * @param object aPacket
   *        Packet received from the server.
   */
  _onTabNavigated: function DC__onTabNavigated(aType, aPacket) {
    if (aType == "will-navigate") {
      DebuggerView._handleTabNavigation();

      // Discard all the old sources.
      DebuggerController.SourceScripts.clearCache();
      DebuggerController.Parser.clearCache();
      SourceUtils.clearCache();
      return;
    }

    this.ThreadState._handleTabNavigation();
    this.SourceScripts._handleTabNavigation();
  },

  /**
   * Called when the debugged tab is closed.
   */
  _onTabDetached: function DC__onTabDetached() {
    this.shutdownDebugger();
  },

  /**
   * Sets up a debugging session.
   *
   * @param DebuggerClient aClient
   *        The debugger client.
   * @param string aThreadActor
   *        The remote protocol grip of the tab.
   * @param function aCallback
   *        A function to invoke once the client attached to the active thread.
   */
  _startDebuggingTab: function DC__startDebuggingTab(aClient, aThreadActor, aCallback) {
    if (!aClient) {
      Cu.reportError("No client found!");
      return;
    }
    this.client = aClient;

    aClient.attachThread(aThreadActor, (aResponse, aThreadClient) => {
      if (!aThreadClient) {
        Cu.reportError("Couldn't attach to thread: " + aResponse.error);
        return;
      }
      this.activeThread = aThreadClient;

      this.ThreadState.connect();
      this.StackFrames.connect();
      this.SourceScripts.connect();
      aThreadClient.resume(this._ensureResumptionOrder);

      if (aCallback) {
        aCallback();
      }
    }, { useSourceMaps: Prefs.sourceMapsEnabled });
  },

  /**
   * Warn if resuming execution produced a wrongOrder error.
   */
  _ensureResumptionOrder: function DC__ensureResumptionOrder(aResponse) {
    if (aResponse.error == "wrongOrder") {
      DebuggerView.Toolbar.showResumeWarning(aResponse.lastPausedUrl);
    }
  },

  /**
   * Sets up a chrome debugging session.
   *
   * @param DebuggerClient aClient
   *        The debugger client.
   * @param object aChromeDebugger
   *        The remote protocol grip of the chrome debugger.
   * @param function aCallback
   *        A function to invoke once the client attached to the active thread.
   */
  _startChromeDebugging: function DC__startChromeDebugging(aClient, aChromeDebugger, aCallback) {
    if (!aClient) {
      Cu.reportError("No client found!");
      return;
    }
    this.client = aClient;

    aClient.attachThread(aChromeDebugger, (aResponse, aThreadClient) => {
      if (!aThreadClient) {
        Cu.reportError("Couldn't attach to thread: " + aResponse.error);
        return;
      }
      this.activeThread = aThreadClient;

      this.ThreadState.connect();
      this.StackFrames.connect();
      this.SourceScripts.connect();
      aThreadClient.resume(this._ensureResumptionOrder);

      if (aCallback) {
        aCallback();
      }
    }, { useSourceMaps: Prefs.sourceMapsEnabled });
  },

  /**
   * Detach and reattach to the thread actor with useSourceMaps true, blow
   * away old scripts and get sources again.
   */
  reconfigureThread: function DC_reconfigureThread(aUseSourceMaps) {
    this.client.reconfigureThread(aUseSourceMaps, (aResponse) => {
      if (aResponse.error) {
        let msg = "Couldn't reconfigure thread: " + aResponse.message;
        Cu.reportError(msg);
        dumpn(msg);
        return;
      }

      // Update the source list widget.
      DebuggerView.Sources.empty();
      SourceUtils.clearCache();
      this.SourceScripts._handleTabNavigation();
      // Update the stack frame list.
      this.activeThread._clearFrames();
      this.activeThread.fillFrames(CALL_STACK_PAGE_SIZE);
    });
  },

  /**
   * Attempts to quit the current process if allowed.
   */
  _quitApp: function DC__quitApp() {
    let canceled = Cc["@mozilla.org/supports-PRBool;1"]
      .createInstance(Ci.nsISupportsPRBool);

    Services.obs.notifyObservers(canceled, "quit-application-requested", null);

    // Somebody canceled our quit request.
    if (canceled.data) {
      return;
    }
    Services.startup.quit(Ci.nsIAppStartup.eAttemptQuit);
  },

  _isInitialized: false,
  _isDestroyed: false,
  _startup: null,
  _shutdown: null,
  _connection: null,
  client: null,
  activeThread: null
};



/**
 * Keeps the stack frame list up-to-date, using the thread client's
 * stack frame cache.
 */

/**
 * Keeps the source script list up-to-date, using the thread client's
 * source script cache.
 */
function SourceScripts() {
  this._cache = new Map(); // Can't use a WeakMap because keys are strings.
  this._onNewSource = this._onNewSource.bind(this);
  this._onNewGlobal = this._onNewGlobal.bind(this);
  this._onSourcesAdded = this._onSourcesAdded.bind(this);
  this._onFetch = this._onFetch.bind(this);
  this._onTimeout = this._onTimeout.bind(this);
  this._onFinished = this._onFinished.bind(this);
}

SourceScripts.prototype = {
  get activeThread() DebuggerController.activeThread,
  get debuggerClient() DebuggerController.client,
  _newSourceTimeout: null,

  /**
   * Connect to the current thread client.
   */
  connect: function SS_connect() {
    dumpn("SourceScripts is connecting...");
    this.debuggerClient.addListener("newGlobal", this._onNewGlobal);
    this.debuggerClient.addListener("newSource", this._onNewSource);
    this._handleTabNavigation();
  },

  /**
   * Disconnect from the client.
   */
  disconnect: function SS_disconnect() {
    if (!this.activeThread) {
      return;
    }
    dumpn("SourceScripts is disconnecting...");
    window.clearTimeout(this._newSourceTimeout);
    this.debuggerClient.removeListener("newGlobal", this._onNewGlobal);
    this.debuggerClient.removeListener("newSource", this._onNewSource);
  },

  /**
   * Handles any initialization on a tab navigation event issued by the client.
   */
  _handleTabNavigation: function SS__handleTabNavigation() {
    if (!this.activeThread) {
      return;
    }
    dumpn("Handling tab navigation in the SourceScripts");
    window.clearTimeout(this._newSourceTimeout);

    // Retrieve the list of script sources known to the server from before
    // the client was ready to handle "newSource" notifications.
    this.activeThread.getSources(this._onSourcesAdded);
  },

  /**
   * Handler for the debugger client's unsolicited newGlobal notification.
   */
  _onNewGlobal: function SS__onNewGlobal(aNotification, aPacket) {
    // TODO: bug 806775, update the globals list using aPacket.hostAnnotations
    // from bug 801084.
  },

  /**
   * Handler for the debugger client's unsolicited newSource notification.
   */
  _onNewSource: function SS__onNewSource(aNotification, aPacket) {
    // Ignore bogus scripts, e.g. generated from 'clientEvaluate' packets.
    if (NEW_SOURCE_IGNORED_URLS.indexOf(aPacket.source.url) != -1) {
      return;
    }

    // Add the source in the debugger view sources container.
    DebuggerView.Sources.addSource(aPacket.source, { staged: false });

    let container = DebuggerView.Sources;
    let preferredValue = container.preferredValue;

    // Select this source if it's the preferred one.
    if (aPacket.source.url == preferredValue) {
      container.selectedValue = preferredValue;
    }
    // ..or the first entry if there's none selected yet after a while
    else {
      window.clearTimeout(this._newSourceTimeout);
      this._newSourceTimeout = window.setTimeout(function() {
        // If after a certain delay the preferred source still wasn't received,
        // just give up on waiting and display the first entry.
        if (!container.selectedValue) {
          container.selectedIndex = 0;
        }
      }, NEW_SOURCE_DISPLAY_DELAY);
    }


    // Signal that a new script has been added.
    window.dispatchEvent(document, "Debugger:AfterNewSource");
  },

  /**
   * Callback for the debugger's active thread getSources() method.
   */
  _onSourcesAdded: function SS__onSourcesAdded(aResponse) {
    if (aResponse.error) {
      Cu.reportError(new Error("Error getting sources: " + aResponse.message));
      return;
    }

    // Add all the sources in the debugger view sources container.
    for (let source of aResponse.sources) {
      // Ignore bogus scripts, e.g. generated from 'clientEvaluate' packets.
      if (NEW_SOURCE_IGNORED_URLS.indexOf(source.url) != -1) {
        continue;
      }
      DebuggerView.Sources.addSource(source, { staged: true });
    }

    let container = DebuggerView.Sources;
    let preferredValue = container.preferredValue;

    // Flushes all the prepared sources into the sources container.
    container.commit({ sorted: true });

    // Select the preferred source if it exists and was part of the response.
    if (container.containsValue(preferredValue)) {
      container.selectedValue = preferredValue;
    }
    // ..or the first entry if there's no one selected yet.
    else if (!container.selectedValue) {
      container.selectedIndex = 0;
    }

    // If there are any stored breakpoints for the sources, display them again,
    // both in the editor and the breakpoints pane.
    DebuggerController.Breakpoints.updateEditorBreakpoints();
    DebuggerController.Breakpoints.updatePaneBreakpoints();

    // Signal that scripts have been added.
    window.dispatchEvent(document, "Debugger:AfterSourcesAdded");
  },

  /**
   * Gets a specified source's text.
   *
   * @param object aSource
   *        The source object coming from the active thread.
   * @param function aCallback
   *        Function called after the source text has been loaded.
   * @param function aTimeout
   *        Function called when the source text takes too long to fetch.
   */
  getText: function SS_getText(aSource, aCallback, aTimeout) {
    // If already loaded, return the source text immediately.
    if (aSource.loaded) {
      aCallback(aSource);
      return;
    }

    // If the source text takes too long to fetch, invoke a timeout to
    // avoid blocking any operations.
    if (aTimeout) {
      var fetchTimeout = window.setTimeout(() => {
        aSource._fetchingTimedOut = true;
        aTimeout(aSource);
      }, FETCH_SOURCE_RESPONSE_DELAY);
    }

    // Get the source text from the active thread.
    this.activeThread.source(aSource).source((aResponse) => {
      if (aTimeout) {
        window.clearTimeout(fetchTimeout);
      }
      if (aResponse.error) {
        Cu.reportError("Error loading: " + aSource.url + "\n" + aResponse.message);
        return void aCallback(aSource);
      }
      aSource.loaded = true;
      aSource.text = aResponse.source;
      aCallback(aSource);
    });
  },

  /**
   * Gets all the fetched sources.
   *
   * @return array
   *         An array containing [url, text] entries for the fetched sources.
   */
  getCache: function SS_getCache() {
    let sources = [];
    for (let source of this._cache) {
      sources.push(source);
    }
    return sources.sort(([first], [second]) => first > second);
  },

  /**
   * Clears all the fetched sources from cache.
   */
  clearCache: function SS_clearCache() {
    this._cache.clear();
  },

  /**
   * Starts fetching all the sources, silently.
   *
   * @param array aUrls
   *        The urls for the sources to fetch.
   * @param object aCallbacks [optional]
   *        An object containing the callback functions to invoke:
   *          - onFetch: optional, called after each source is fetched
   *          - onTimeout: optional, called when a source takes too long to fetch
   *          - onFinished: called when all the sources are fetched
   */
  fetchSources: function SS_fetchSources(aUrls, aCallbacks = {}) {
    this._fetchQueue = new Set();
    this._fetchCallbacks = aCallbacks;

    // Add each new source which needs to be fetched in a queue.
    for (let url of aUrls) {
      if (!this._cache.has(url)) {
        this._fetchQueue.add(url);
      }
    }

    // If all the sources were already fetched, don't do anything special.
    if (this._fetchQueue.size == 0) {
      this._onFinished();
      return;
    }

    // Start fetching each new source.
    for (let url of this._fetchQueue) {
      let sourceItem = DebuggerView.Sources.getItemByValue(url);
      let sourceObject = sourceItem.attachment.source;
      this.getText(sourceObject, this._onFetch, this._onTimeout);
    }
  },

  /**
   * Called when a source has been fetched via fetchSources().
   *
   * @param object aSource
   *        The source object coming from the active thread.
   */
  _onFetch: function SS__onFetch(aSource) {
    // Remember the source in a cache so we don't have to fetch it again.
    this._cache.set(aSource.url, aSource.text);

    // Fetch completed before timeout, remove the source from the fetch queue.
    this._fetchQueue.delete(aSource.url);

    // If this fetch was eventually completed at some point after a timeout,
    // don't call any subsequent event listeners.
    if (aSource._fetchingTimedOut) {
      return;
    }

    // Invoke the source fetch callback if provided via fetchSources();
    if (this._fetchCallbacks.onFetch) {
      this._fetchCallbacks.onFetch(aSource);
    }

    // Check if all sources were fetched and stored in the cache.
    if (this._fetchQueue.size == 0) {
      this._onFinished();
    }
  },

  /**
   * Called when a source's text takes too long to fetch via fetchSources().
   *
   * @param object aSource
   *        The source object coming from the active thread.
   */
  _onTimeout: function SS__onTimeout(aSource) {
    // Remove the source from the fetch queue.
    this._fetchQueue.delete(aSource.url);

    // Invoke the source timeout callback if provided via fetchSources();
    if (this._fetchCallbacks.onTimeout) {
      this._fetchCallbacks.onTimeout(aSource);
    }

    // Check if the remaining sources were fetched and stored in the cache.
    if (this._fetchQueue.size == 0) {
      this._onFinished();
    }
  },

  /**
   * Called when all the sources have been fetched.
   */
  _onFinished: function SS__onFinished() {
    // Invoke the finish callback if provided via fetchSources();
    if (this._fetchCallbacks.onFinished) {
      this._fetchCallbacks.onFinished();
    }
  },

  _cache: null,
  _fetchQueue: null,
  _fetchCallbacks: null
};

/**
 * Preliminary setup for the DebuggerController object.
 */
DebuggerController.initialize();
DebuggerController.Parser = new Parser();
DebuggerController.ThreadState = new ThreadState();
DebuggerController.StackFrames = new StackFrames();
DebuggerController.SourceScripts = new SourceScripts();
DebuggerController.Breakpoints = new Breakpoints();

/**
 * Export some properties to the global scope for easier access.
 */
Object.defineProperties(window, {
  "create": {
    get: function() ViewHelpers.create,
  },
  "dispatchEvent": {
    get: function() ViewHelpers.dispatchEvent,
  },
  "editor": {
    get: function() DebuggerView.editor
  },
  "gClient": {
    get: function() DebuggerController.client
  },
  "gThreadClient": {
    get: function() DebuggerController.activeThread
  },
  "gThreadState": {
    get: function() DebuggerController.ThreadState
  },
  "gStackFrames": {
    get: function() DebuggerController.StackFrames
  },
  "gSourceScripts": {
    get: function() DebuggerController.SourceScripts
  },
  "gBreakpoints": {
    get: function() DebuggerController.Breakpoints
  },
  "gCallStackPageSize": {
    get: function() CALL_STACK_PAGE_SIZE,
  }
});

/**
 * Helper method for debugging.
 * @param string
 */
function dumpn(str) {
  if (wantLogging) {
    dump("DBG-FRONTEND: " + str + "\n");
  }
}

let wantLogging = Services.prefs.getBoolPref("devtools.debugger.log");
