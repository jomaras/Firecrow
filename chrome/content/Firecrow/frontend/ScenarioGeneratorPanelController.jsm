var EXPORTED_SYMBOLS = ["ScenarioGeneratorPanelController"];

const Cu = Components.utils;
const Ci = Components.interfaces;
const Cc = Components.classes;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

var loader = { lazyGetter: XPCOMUtils.defineLazyGetter.bind(XPCOMUtils) };
var require = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools.require;

var promise = require("sdk/core/promise");
var EventEmitter = require("devtools/shared/event-emitter");

loader.lazyGetter(this, "MarkupView", function() { return require("devtools/markupview/markup-view").MarkupView; });
loader.lazyGetter(this, "Selection", function() { return require("devtools/inspector/selection").Selection; });
loader.lazyGetter(this, "InspectorFront", function() { return require("devtools/server/actors/inspector").InspectorFront; });

var ScenarioGeneratorPanelController = function(extensionWindow, extensionDocument, toolbox, getCurrentPageWindowFunction, getCurrentPageDocumentFunction)
{
    this._extensionWindow = extensionWindow;
    this._extensionDocument = extensionDocument;
    this._toolbox = toolbox;
    this._target = toolbox._target;

    this._getCurrentPageWindow = getCurrentPageWindowFunction;
    this._getCurrentPageDocument = getCurrentPageDocumentFunction;

    this._markupViewerContainer = this._extensionDocument.getElementById("markupViewerContainer");
    this._generatedScenariosContainer = this._extensionDocument.getElementById("generatedScenariosContainer");
    this._keptScenariosContainer = this._extensionDocument.getElementById("keptScenariosContainer");
    this._featureDescriptorContainer = this._extensionDocument.getElementById("featureDescriptorContainer");

    this._setFeatureSelectorButton = this._extensionDocument.getElementById("setFeatureSelectorButton");
    this._generateScenariosButton = this._extensionDocument.getElementById("generateScenariosButton");

    this.onNewSelection = this.onNewSelection.bind(this);
    this.onBeforeNewSelection = this.onBeforeNewSelection.bind(this);

    this.updating = function(){ return function(){};};

    EventEmitter.decorate(this);

    this.open();
};

ScenarioGeneratorPanelController.prototype =
{
    reset: function()
    {
        this._destroyMarkup();
    },

    _currentSelectedNode: null,

    onNewSelection: function ()
    {
        if(this._currentSelectedNode != null)
        {
            this._markNodeAsDeselected(this._currentSelectedNode);
        }

        if(this.selection.node != null && this.selection.node.tagName != "HTML")
        {
            this._currentSelectedNode = this.selection.node;

            this._markNodeAsSelected(this._currentSelectedNode);

            this.selection.setNode(this.selection.node);
        }
    },

    onBeforeNewSelection: function () {},

    _markNodeAsSelected: function(node)
    {
        if(node == null) { return; }

        if(node.style)
        {
            node.oldBorderStyle = node.style.borderStyle;
            node.oldBorderColor = node.style.borderColor;

            node.style.borderStyle = "dashed";
            node.style.borderColor = "gray";
        }
    },

    _markNodeAsDeselected: function(node)
    {
        if(node == null) { return; }

        if(node.style)
        {
            node.style.borderStyle = node.oldBorderStyle;
            node.style.borderColor = node.oldBorderColor;
        }
    },

    //copied from inspector-panel.js
    open: function ()
    {
        return this._target.makeRemote().then(function()
        {
            return this._getWalker();
        }.bind(this)).then(function()
        {
            return this._getDefaultNodeForSelection();
        }.bind(this)).then(function(defaultSelection)
        {
            return this._deferredOpen(defaultSelection);
        }.bind(this)).then(null, Cu.reportError);
    },

    _getInspector: function()
    {
        if (!this._target.form)
        {
            throw new Error("Target.inspector requires an initialized remote actor.");
        }
        if (!this._inspector)
        {
            this._inspector = InspectorFront(this._target.client, this._target.form);
        }

        return this._inspector;
    },

    //Necessary!
    immediateLayoutChange: function(){},

    _getWalker: function()
    {
        return this._getInspector().getWalker().then(function(walker)
        {
            this.walker = walker;
            return this._getInspector().getPageStyle();
        }.bind(this)).then(function(pageStyle)
        {
            this.pageStyle = pageStyle;
        }.bind(this));
    },

    onNewRoot: function()
    {
        this._defaultNode = null;
        this.selection.setNodeFront(null);
        this._destroyMarkup();

        this._getDefaultNodeForSelection().then(function(defaultNode)
        {
            if (this._destroyPromise){ return; }
            this.selection.setNodeFront(defaultNode, "navigateaway");

            this._initMarkup();
            this.once("markuploaded", function()
            {
                if (this._destroyPromise)
                {
                    return;
                }

                this.markup.expandNode(this.selection.nodeFront);
                this.emit("new-root");
            }.bind(this));
        }.bind(this));
    },

    _deferredOpen: function(defaultSelection)
    {
        var deferred = promise.defer();

        this.outerHTMLEditable = this._target.client.traits.editOuterHTML;

        this.onNewRoot = this.onNewRoot.bind(this);
        this.walker.on("new-root", this.onNewRoot);

        // Create an empty selection
        this.selection = new Selection(this.walker);
        this.onNewSelection = this.onNewSelection.bind(this);
        this.selection.on("new-node-front", this.onNewSelection);
        this.onBeforeNewSelection = this.onBeforeNewSelection.bind(this);
        this.selection.on("before-new-node-front", this.onBeforeNewSelection);

        this._initMarkup();
        this.isReady = false;

        this.once("markuploaded", function()
        {
            this.isReady = true;

            // All the components are initialized. Let's select a node.
            this.selection.setNodeFront(defaultSelection);

            this.markup.expandNode(this.selection.nodeFront);

            this.emit("ready");
            deferred.resolve(this);
        }.bind(this));

        return deferred.promise;
    },

    _initMarkup: function ()
    {
        var doc = this._extensionDocument ;

        this._markupBox = doc.getElementById("markupViewerContainer");

        this._markupFrame = doc.createElement("iframe");
        this._markupFrame.setAttribute("flex", "1");
        this._markupFrame.setAttribute("tooltip", "aHTMLTooltip");

        this._boundMarkupFrameLoad = function ()
        {
            this._markupFrame.contentWindow.focus();
            this._onMarkupFrameLoad();
        }.bind(this);

        this._markupFrame.addEventListener("load", this._boundMarkupFrameLoad, true);

        this._markupBox.appendChild(this._markupFrame);
        this._markupFrame.setAttribute("src", "chrome://browser/content/devtools/markup-view.xhtml");
    },

    _onMarkupFrameLoad: function()
    {
        this._markupFrame.removeEventListener("load", this._boundMarkupFrameLoad, true);
        delete this._boundMarkupFrameLoad;

        var controllerWindow = this._toolbox.doc.defaultView;
        this.markup = new MarkupView(this, this._markupFrame, controllerWindow);

        this.emit("markuploaded");
    },

    _destroyMarkup: function()
    {
        if (this._boundMarkupFrameLoad)
        {
            this._markupFrame.removeEventListener("load", this._boundMarkupFrameLoad, true);
            delete this._boundMarkupFrameLoad;
        }

        if (this.markup)
        {
            this.markup.destroy();
            delete this.markup;
        }

        if (this._markupFrame)
        {
            this._markupFrame.parentNode.removeChild(this._markupFrame);
            delete this._markupFrame;
        }

        this._markupBox = null;

        this._currentSelectedNode = null;
    },

    _getDefaultNodeForSelection: function()
    {
        if (this._defaultNode) { return this._defaultNode; }
        var walker = this.walker;
        var rootNode = null;

        // If available, set either the previously selected node or the body
        // as default selected, else set documentElement
        return walker.getRootNode().then(function(aRootNode)
        {
            rootNode = aRootNode;
            return walker.querySelector(rootNode, "body");
        }.bind(this)).then(function(front)
        {
            if (front) { return front; }

            return this.walker.documentElement(this.walker.rootNode);
        }.bind(this)).then(function(node)
        {
            if (walker !== this.walker) { promise.reject(null); }
            this._defaultNode = node;
            return node;
        }.bind(this));
    }
};