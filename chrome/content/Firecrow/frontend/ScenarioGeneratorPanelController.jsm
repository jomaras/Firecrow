var EXPORTED_SYMBOLS = ["ScenarioGeneratorPanelController"];

const Cu = Components.utils;
const Ci = Components.interfaces;
const Cc = Components.classes;

Cu.import("chrome://Firecrow/content/frontend/FireDataAccess.jsm");
Cu.import("chrome://Firecrow/content/frontend/FirefoxHelper.jsm");
Cu.import("chrome://Firecrow/content/helpers/FileHelper.js");

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
    this._markupViewerFrame = this._extensionDocument.getElementById("markupViewerFrame");
    this._generatedScenariosContainer = this._extensionDocument.getElementById("generatedScenariosContainer");
    this._keptScenariosContainer = this._extensionDocument.getElementById("keptScenariosContainer");
    this._featureDescriptorContainer = this._extensionDocument.getElementById("featureDescriptorContainer");

    this._achievedCoverageContainer = this._extensionDocument.getElementById("achievedCoverageContainer");

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

        this._clearScenarios(this._keptScenariosContainer);
        this._clearScenarios(this._generatedScenariosContainer);
        this._showAchievedCoverage("");

        this._markupViewerFrame.setAttribute("collapsed", "true");
        this._markupViewerContainer.setAttribute("collapsed", "false");

        this._addMarkupToMarkupViewer("<div>&nbsp;LOADING MARKUP ...</div>");
    },

    _waitTimeoutId: -1,
    _waitTimeout: function()
    {
        this._populateScripts();

        FireDataAccess.asyncGetPageModel(this._getCurrentPageDocument().baseURI, this._hiddenIFrame, function(window, htmlJson)
        {
            this._addMarkupToMarkupViewer(FBL.Firecrow.CodeMarkupGenerator.generateHtmlRepresentation(htmlJson))
        }.bind(this));
    },

    _clearScripts: function()
    {
        this._deleteAllChildren(this._sourcesContainer);
    },

    _populateScripts: function()
    {
        var scriptNameAndPaths = FireDataAccess.getContentScriptNameAndPaths(this._getCurrentPageDocument());

        for(var i = 0; i < scriptNameAndPaths.length; i++)
        {
            var scriptNameAndPath = scriptNameAndPaths[i];

            this._createSourceCheckbox(this._sourcesContainer, scriptNameAndPath.name, scriptNameAndPath.path);
        }
    },

    _createSourceCheckbox: function(container, label, path)
    {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

        var checkbox = this._extensionDocument.createElementNS(XUL_NS, "checkbox");

        if (label != undefined)
        {
            checkbox.setAttribute("label", label);
            if(label.indexOf("*") == 0) //mainHtmlFile
            {
                checkbox.setAttribute("disabled", "true");
            }
        }
        if (path != undefined) { checkbox.setAttribute("value", path); }

        checkbox.setAttribute("checked", true);


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
        var that = this;

        FireDataAccess.asyncGetPageModel(this._getCurrentPageDocument().baseURI, this._hiddenIFrame, function(window, htmlJson)
        {
            var nodeJsPath = FireDataAccess.getNodeJsFilePath(this._extensionWindow);
            var phantomJsPath = FireDataAccess.getPhantomJsFilePath(this._extensionWindow);
            var ignoredScriptPaths = that._getIgnoredScriptPaths();

            var model =
            {
                url: that._getCurrentPageDocument().baseURI,
                model: htmlJson,
                trackedElementsSelectors: that._selectors
            };

            FileHelper.saveModelForExternalApplications(model, "model.js", function(code) { return code; }, function()
            {
                FileHelper.transferScriptsForScenarioGenerator(function(scriptPath)
                {
                    FirefoxHelper.executeAsyncProgram(nodeJsPath, [scriptPath, "symbolicNewCoverageSequential", phantomJsPath, 100, that._selectors.join(", ") || "*"].concat(ignoredScriptPaths),
                    function()
                    {
                        that._populateScenarios(that._generatedScenariosContainer, FileHelper.getGeneratedScenarios());
                        that._populateScenarios(that._keptScenariosContainer, FileHelper.getKeptScenarios());
                        that._showAchievedCoverage("( Statement Cov: " + FileHelper.getAchievedCoverage() + ")");
                        that._showExecutedCode(FileHelper.getExecutedCodeMarkupPath());
                    });
                });
            });
        });
    },

    _showExecutedCode: function(markupPath)
    {
        this._markupViewerFrame.webNavigation.loadURI(markupPath, Ci.nsIWebNavigation, null, null, null);
        this._markupViewerFrame.setAttribute("collapsed", "false");
        this._markupViewerContainer.setAttribute("collapsed", "true");
    },

    _addMarkupToMarkupViewer: function(markup)
    {
        this._deleteAllChildren(this._markupViewerContainer);

        var injectHTML = htmlParser.parseFragment(markup, false, null, this._markupViewerContainer);

        this._markupViewerContainer.appendChild(injectHTML);
    },

    _showAchievedCoverage: function(achievedCoverageMessage)
    {
        this._achievedCoverageContainer.textContent = achievedCoverageMessage;
    },

    _populateScenarios: function(scenarioContainer, scenarios)
    {
        this._deleteAllChildren(scenarioContainer);

        var htmlNs = "http://www.w3.org/1999/xhtml";

        for(var i = 0; i < scenarios.length; i++)
        {
            var scenario = scenarios[i];

            var label = this._extensionDocument.createElement("label");
            label.textContent = "Scenario " + scenario.id;

            scenarioContainer.appendChild(label);

            var ul = this._extensionDocument.createElementNS(htmlNs, "ul");
            scenarioContainer.appendChild(ul);

            var events = scenario.parametrizedEvents;

            for(var j = 0; j < events.length; j++)
            {
                var event = events[j];

                var li = this._extensionDocument.createElementNS(htmlNs, "li");

                var params = JSON.stringify(event.parameters);
                if(params == "{}") { params = "";}

                li.textContent = event.type + " : " + event.thisObjectDescriptor + " " + params;

                ul.appendChild(li);
            }
        }
    },

    _clearScenarios: function(scenarioContainer)
    {
        this._deleteAllChildren(scenarioContainer);
    },

    _deleteAllChildren: function(element)
    {
        if(element == null) { return; }

        while(element.hasChildNodes()) { element.removeChild(element.firstChild); }
    },


    _getIgnoredScriptPaths: function()
    {
        var notChecked = this._sourcesContainer.querySelectorAll("checkbox:not([checked])");

        var ignored = [];

        for(var i = 0; i < notChecked.length; i++)
        {
            ignored.push(notChecked[i].getAttribute("label"));
        }

        return ignored;
    }
};