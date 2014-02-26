var EXPORTED_SYMBOLS = ["ScenarioGeneratorPanelController"];

const Cu = Components.utils;
const Ci = Components.interfaces;
const Cc = Components.classes;

Cu.import("chrome://Firecrow/content/frontend/FireDataAccess.jsm");

var htmlParser = Cc["@mozilla.org/feed-unescapehtml;1"].getService(Ci.nsIScriptableUnescapeHTML);
var scriptLoader = Cc["@mozilla.org/moz/jssubscript-loader;1"].getService(Ci.mozIJSSubScriptLoader);

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

    this._hiddenIFrame = this._extensionDocument.getElementById("fdHiddenIFrame");

    this._setFeatureSelectorButton = this._extensionDocument.getElementById("setFeatureSelectorButton");
    this._generateScenariosButton = this._extensionDocument.getElementById("generateScenariosButton");

    this._sourcesContainer = this._extensionDocument.getElementById("sourcesContainer");

    scriptLoader.loadSubScript("chrome://Firecrow/content/initFBL.js", this, "UTF-8");
    scriptLoader.loadSubScript("chrome://Firecrow/content/helpers/valueTypeHelper.js", this, "UTF-8");
    scriptLoader.loadSubScript("chrome://Firecrow/content/helpers/ASTHelper.js", this, "UTF-8");
    scriptLoader.loadSubScript("chrome://Firecrow/content/codeMarkupGenerator/codeMarkupGenerator.js", this, "UTF-8");

    this._waitTimeout = this._waitTimeout.bind(this);
    this._deleteSelectorClickHandler = this._deleteSelectorClickHandler.bind(this);

    this._selectors = [];

    this._setFeatureSelectorButton.onclick = function()
    {
        var selector = this._extensionWindow.prompt("Enter selector");

        if(selector)
        {
            this._addSelector(selector);
        }
    }.bind(this);

    this._generateScenariosButton.onclick = function()
    {
        this._generateScenarios();
    }.bind(this);

    this.reset();
};

ScenarioGeneratorPanelController.prototype =
{
    reset: function()
    {
        this._clearScripts();

        this._extensionWindow.clearTimeout(this._waitTimeoutId);

        this._waitTimeoutId = this._extensionWindow.setTimeout(this._waitTimeout, 1500);

        this._selectors = [];
        this._updateSelectorsDisplay();
    },

    _waitTimeoutId: -1,
    _waitTimeout: function()
    {
        this._populateScripts();
        FireDataAccess.asyncGetPageModel(this._getCurrentPageDocument().baseURI, this._hiddenIFrame, function(window, htmlJson)
        {
            var codeHtml = FBL.Firecrow.CodeMarkupGenerator.generateHtmlRepresentation(htmlJson);

            var injectHTML = htmlParser.parseFragment(codeHtml, false, null, this._markupViewerContainer);

            this._markupViewerContainer.appendChild(injectHTML);
        }.bind(this));
    },

    _clearScripts: function()
    {
        while(this._sourcesContainer.hasChildNodes()) { this._sourcesContainer.removeChild(this._sourcesContainer.firstChild); }
    },

    _populateScripts: function()
    {
        var scriptNameAndPaths = FireDataAccess.getContentScriptNameAndPaths(this._getCurrentPageDocument());

        for(var i = 0; i < scriptNameAndPaths.length; i++)
        {
            var scriptNameAndPath = scriptNameAndPaths[i];
            this._createCheckbox(this._sourcesContainer, scriptNameAndPath.name, scriptNameAndPath.path);
        }
    },

    _createCheckbox: function(container, label, path)
    {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

        var checkbox = this._extensionDocument.createElementNS(XUL_NS, "checkbox");

        if (label != undefined) { checkbox.setAttribute("label", label); }
        if (path != undefined) { checkbox.setAttribute("value", path); }

        container.appendChild(checkbox);
    },

    _addSelector: function(selector)
    {
        if(this._selectors.indexOf(selector) == -1)
        {
            this._selectors.push(selector);

            this._updateSelectorsDisplay();
        }
    },

    _updateSelectorsDisplay: function()
    {
        while(this._featureDescriptorContainer.hasChildNodes())
        {
            this._featureDescriptorContainer.removeChild(this._featureDescriptorContainer.firstChild);
        }

        for(var i = 0; i < this._selectors.length; i++)
        {
            var container = this._extensionDocument.createElement("div");

            container.className = "slicingCriteriaElement";

            container.innerHTML = "<span class='deleteContainer'/><label>" + this._selectors[i] + "</label>";

            this._featureDescriptorContainer.appendChild(container);

            container.firstChild.onclick = this._deleteSelectorClickHandler;
        }
    },

    _deleteSelectorClickHandler: function(e)
    {
        var button = e.target;
        var label = button.nextSibling;
        var selector = label.textContent;

        this._selectors.splice(this._selectors.indexOf(selector), 1);

        button.onclick = null;

        button.parentElement.parentElement.removeChild(button.parentElement);
    },

    _generateScenarios: function()
    {
        FireDataAccess.asyncGetPageModel(this._getCurrentPageDocument().baseURI, this._hiddenIFrame, function(window, htmlJson)
        {
            var nodeJsPath = FireDataAccess.getNodeJsFilePath(this._extensionWindow);

            var model =
            {
                url: this._getCurrentPageDocument().baseURI,
                model: htmlJson,
                trackedElementsSelectors: this._selectors
            };

            FileHelper.saveModelForNodeJs(model, function()
            {
                FileHelper.saveNodeJsScripts(function(scriptPath)
                {
                    FirefoxHelper.executeAsyncProgram(nodeJsPath, [scriptPath], function()
                    {

                    });
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }
};