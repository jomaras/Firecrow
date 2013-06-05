/**
 * User: Jomaras
 * Date: 04.06.13.
 * Time: 11:16
 */
//From debugger-controller.js
var EXPORTED_SYMBOLS = ["SourceScripts"];

function SourceScripts(debuggerClient)
{
    this._cache = new Map(); // Can't use a WeakMap because keys are strings.
    this._onNewSource = this._onNewSource.bind(this);
    this._onNewGlobal = this._onNewGlobal.bind(this);
    this._onSourcesAdded = this._onSourcesAdded.bind(this);
    this._onFetch = this._onFetch.bind(this);
    this._onTimeout = this._onTimeout.bind(this);
    this._onFinished = this._onFinished.bind(this);
}

SourceScripts.prototype =
{
    getActiveThread: function() { return DebuggerController.activeThread; },
    getDebuggerClient: function(){ return DebuggerController.client; },

    _newSourceTimeout: null,

    /**
     * Connect to the current thread client.
     */
    connect: function SS_connect()
    {
        dumpn("SourceScripts is connecting...");
        this.debuggerClient.addListener("newGlobal", this._onNewGlobal);
        this.debuggerClient.addListener("newSource", this._onNewSource);
        this._handleTabNavigation();
    },

    /**
     * Disconnect from the client.
     */
    disconnect: function SS_disconnect()
    {
        if (!this.activeThread) { return; }

        dumpn("SourceScripts is disconnecting...");
        window.clearTimeout(this._newSourceTimeout);

        this.debuggerClient.removeListener("newGlobal", this._onNewGlobal);
        this.debuggerClient.removeListener("newSource", this._onNewSource);
    },

    /**
     * Handles any initialization on a tab navigation event issued by the client.
     */
    _handleTabNavigation: function SS__handleTabNavigation()
    {
        if (!this.activeThread) { return; }
        dumpn("Handling tab navigation in the SourceScripts");
        window.clearTimeout(this._newSourceTimeout);

        // Retrieve the list of script sources known to the server from before
        // the client was ready to handle "newSource" notifications.
        this.activeThread.getSources(this._onSourcesAdded);
    },

    /**
     * Handler for the debugger client's unsolicited newGlobal notification.
     */
    _onNewGlobal: function SS__onNewGlobal(aNotification, aPacket)
    {
        // TODO: bug 806775, update the globals list using aPacket.hostAnnotations
        // from bug 801084.
    },

    /**
     * Handler for the debugger client's unsolicited newSource notification.
     */
    _onNewSource: function SS__onNewSource(aNotification, aPacket)
    {
        // Ignore bogus scripts, e.g. generated from 'clientEvaluate' packets.
        if (NEW_SOURCE_IGNORED_URLS.indexOf(aPacket.source.url) != -1) { return; }

        // Add the source in the debugger view sources container.
        DebuggerView.Sources.addSource(aPacket.source, { staged: false });

        var container = DebuggerView.Sources;
        var preferredValue = container.preferredValue;

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

        // If there are any stored breakpoints for this source, display them again,
        // both in the editor and the breakpoints pane.
        DebuggerController.Breakpoints.updateEditorBreakpoints();
        DebuggerController.Breakpoints.updatePaneBreakpoints();

        // Signal that a new script has been added.
        window.dispatchEvent(document, "Debugger:AfterNewSource");
    },

    /**
     * Callback for the debugger's active thread getSources() method.
     */
    _onSourcesAdded: function SS__onSourcesAdded(aResponse)
    {
        if (aResponse.error)
        {
            Cu.reportError(new Error("Error getting sources: " + aResponse.message));
            return;
        }

        // Add all the sources in the debugger view sources container.
        for (var i = 0; i < aResponse.sources.length; i++)
        {
            var source = aResponse.sources[i];
            // Ignore bogus scripts, e.g. generated from 'clientEvaluate' packets.
            if (NEW_SOURCE_IGNORED_URLS.indexOf(source.url) != -1) { continue; }

            DebuggerView.Sources.addSource(source, { staged: true });
        }

        var container = DebuggerView.Sources;
        var preferredValue = container.preferredValue;

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
    getText: function SS_getText(aSource, aCallback, aTimeout)
    {
        // If already loaded, return the source text immediately.
        if (aSource.loaded)
        {
            aCallback(aSource);
            return;
        }

        // If the source text takes too long to fetch, invoke a timeout to
        // avoid blocking any operations.
        if (aTimeout)
        {
            var fetchTimeout = window.setTimeout(function()
            {
                aSource._fetchingTimedOut = true;
                aTimeout(aSource);
            }, FETCH_SOURCE_RESPONSE_DELAY);
        }

        // Get the source text from the active thread.
        this.activeThread.source(aSource).source(function (aResponse)
        {
            if (aTimeout)
            {
                window.clearTimeout(fetchTimeout);
            }

            if (aResponse.error)
            {
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
    getCache: function SS_getCache()
    {
        var sources = [];

        for (var i = 0; i < this._chache.length; i++)
        {
            sources.push(this._cache[i]);
        }

        return sources.sort(function(first, second)
        {
            return first > second;
        });
    },

    /**
     * Clears all the fetched sources from cache.
     */
    clearCache: function SS_clearCache()
    {
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
    fetchSources: function SS_fetchSources(aUrls, aCallbacks)
    {
        aCallbacks = aCallbacks || {};

        this._fetchQueue = new Set();
        this._fetchCallbacks = aCallbacks;

        // Add each new source which needs to be fetched in a queue.
        for (var i = 0; i < aUrls.length; i++)
        {
            var url = aUrls[i];

            if (!this._cache.has(url))
            {
                this._fetchQueue.add(url);
            }
        }

        // If all the sources were already fetched, don't do anything special.
        if (this._fetchQueue.size == 0)
        {
            this._onFinished();
            return;
        }

        // Start fetching each new source.
        for (var i = 0; i < this._fetchQueue.length; i++)
        {
            var url = this._fetchQueue[i];
            var sourceItem = DebuggerView.Sources.getItemByValue(url);
            var sourceObject = sourceItem.attachment.source;
            this.getText(sourceObject, this._onFetch, this._onTimeout);
        }
    },

    /**
     * Called when a source has been fetched via fetchSources().
     *
     * @param object aSource
     *        The source object coming from the active thread.
     */
    _onFetch: function SS__onFetch(aSource)
    {
        // Remember the source in a cache so we don't have to fetch it again.
        this._cache.set(aSource.url, aSource.text);

        // Fetch completed before timeout, remove the source from the fetch queue.
        this._fetchQueue.delete(aSource.url);

        // If this fetch was eventually completed at some point after a timeout,
        // don't call any subsequent event listeners.
        if (aSource._fetchingTimedOut) { return; }

        // Invoke the source fetch callback if provided via fetchSources();
        if (this._fetchCallbacks.onFetch)
        {
            this._fetchCallbacks.onFetch(aSource);
        }

        // Check if all sources were fetched and stored in the cache.
        if (this._fetchQueue.size == 0)
        {
            this._onFinished();
        }
    },

    /**
     * Called when a source's text takes too long to fetch via fetchSources().
     *
     * @param object aSource
     *        The source object coming from the active thread.
     */
    _onTimeout: function SS__onTimeout(aSource)
    {
        // Remove the source from the fetch queue.
        this._fetchQueue.delete(aSource.url);

        // Invoke the source timeout callback if provided via fetchSources();
        if (this._fetchCallbacks.onTimeout)
        {
            this._fetchCallbacks.onTimeout(aSource);
        }

        // Check if the remaining sources were fetched and stored in the cache.
        if (this._fetchQueue.size == 0)
        {
            this._onFinished();
        }
    },

    /**
     * Called when all the sources have been fetched.
     */
    _onFinished: function SS__onFinished()
    {
        // Invoke the finish callback if provided via fetchSources();
        if (this._fetchCallbacks.onFinished)
        {
            this._fetchCallbacks.onFinished();
        }
    },

    _cache: null,
    _fetchQueue: null,
    _fetchCallbacks: null
};