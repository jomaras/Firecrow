var EXPORTED_SYMBOLS = ["ReuserPanelController"];

const Cu = Components.utils;
const Ci = Components.interfaces;
const Cc = Components.classes;

Cu.import("chrome://Firecrow/content/frontend/FireDataAccess.jsm");
Cu.import("chrome://Firecrow/content/frontend/FirefoxHelper.jsm");
Cu.import("chrome://Firecrow/content/helpers/FileHelper.js");

var ReuserPanelController = function(extensionWindow, extensionDocument, getCurrentPageWindowFunction, getCurrentPageDocumentFunction)
{
    this._extensionWindow = extensionWindow;
    this._extensionDocument = extensionDocument;

    this._getCurrentPageWindow = getCurrentPageWindowFunction;
    this._getCurrentPageDocument = getCurrentPageDocumentFunction;

    this._hiddenIFrame = this._extensionDocument.getElementById("fdHiddenIFrame");

    this._reuserPositionCssSelectorInput = this._extensionDocument.getElementById("reuserPositionCssSelectorInput");
    this._featureCssSelectorInput = this._extensionDocument.getElementById("featureCssSelectorInput");

    this._featurePageSelectorElement = this._extensionDocument.getElementById("featurePageSelectorElement");
    this._reuserPageSelectorElement = this._extensionDocument.getElementById("reuserPageSelectorElement");

    this._featurePageSelectorElement.addEventListener("command", function() { this._featurePageSelected(); }.bind(this));
    this._reuserPageSelectorElement.addEventListener("command", function() { this._reuserPageSelected(); }.bind(this));

    this._featureScenariosContainer = this._extensionDocument.getElementById("featureScenariosContainer");
    this._reuseIntoApplicationScenariosContainer = this._extensionDocument.getElementById("reuseIntoApplicationScenariosContainer");

    this._pagesWithRecordedScenariosMenuPopups = this._extensionDocument.querySelectorAll(".pagesWithRecordedScenariosMenuPopup");

    this._performReuseButton = this._extensionDocument.getElementById("performReuseButton");
    this._performReuseButton.onclick = function(){ this._performReuse(); }.bind(this);

    this._urlEventRecordingsFilesMapping = {};

    this.reset();
};

ReuserPanelController.prototype =
{
    reset: function()
    {
        this._populateWithRecordedScenariosPages();

        this._reuserPositionCssSelectorInput.value = "";
        this._featureCssSelectorInput.value = "";
    },

    markAsSelected: function()
    {
        this.isSelected = true;
    },

    markAsDeselected: function()
    {
        this.isSelected = false;
    },

    _performReuse: function()
    {
        if(!this._isNonDefaultItemSelected(this._featurePageSelectorElement)) { this._extensionWindow.alert("Select the page to reuse from"); return; }
        if(!this._isNonDefaultItemSelected(this._reuserPageSelectorElement)) { this._extensionWindow.alert("Select the page where the feature will be reused into"); return; }

        var nodeJsPath = FireDataAccess.getNodeJsFilePath(this._extensionWindow);
        var phantomJsPath = FireDataAccess.getPhantomJsFilePath(this._extensionWindow);

        var featurePageUrl = this._featurePageSelectorElement.selectedItem.label;
        var reusePageUrl = this._reuserPageSelectorElement.selectedItem.label;

        var dialog = this._extensionWindow.openDialog('chrome://Firecrow/content/frontend/codeTextDialog.xul', '', 'chrome,dialog,centerscreen');

        FireDataAccess.asyncGetPageModels([featurePageUrl, reusePageUrl], this._hiddenIFrame, function(htmlJsons)
        {
            var models = htmlJsons.map(function(htmlJson)
            {
                htmlJson.trackedElementsSelectors = htmlJson.url == featurePageUrl ? [this._featureCssSelectorInput.value]
                                                                                   : [this._reuserPositionCssSelectorInput.value];

                htmlJson.eventTraces = this._getSelectedEventTraces(htmlJson.url);
                return {
                    url: htmlJson.url,
                    model: htmlJson
                };
            }, this);

            FileHelper.saveModelsForExternalApplications
            (
                models,
                function(code) { return "HtmlModelMapping.push(" + code + ");"},
                function()
                {
                    FileHelper.transferScriptsForReuser(function(scriptPath)
                    {
                        dialog.logMessage("Performing reuse");
                        FirefoxHelper.executeAsyncProgram(nodeJsPath, [scriptPath, phantomJsPath],
                        function()
                        {
                            var resultFile = scriptPath.replace(/[a-zA-Z]+\.[a-zA-Z]+$/, "result.html");
                            dialog.logMessage("Reading result from: " + resultFile);
                            dialog.setSourceCode(FileHelper.readFromFile(resultFile));
                        });
                    });
                }
            );

        }.bind(this));
    },

    _getSelectedEventTraces: function(url)
    {
        if(this._featureScenariosContainer.selectedItem == null) { return []; }
        if(this._reuseIntoApplicationScenariosContainer.selectedItem == null) { return []; }

        var parentSelectionElement = this._featureScenariosContainer.url == url ? this._featureScenariosContainer
                                                                                : this._reuseIntoApplicationScenariosContainer;

        var recordingsFiles = this._urlEventRecordingsFilesMapping[url];

        for(var i = 0; i < recordingsFiles.length; i++)
        {
            if(recordingsFiles[i].path == parentSelectionElement.selectedItem.filePath)
            {
                try
                {
                    return JSON.parse(recordingsFiles[i].content);
                }
                catch(e)
                {
                    Cu.reportError("Error when parsing eventTrace:" + e);
                    return [];
                }
            }
        }
    },

    _isNonDefaultItemSelected: function(element)
    {
        if(element.selectedItem == null) { return false; }

        return element.selectedItem.value != null && element.selectedItem.value != "";
    },

    _featurePageSelected: function()
    {
        this._populateWithRecordedScenarios(this._featureScenariosContainer, this._featurePageSelectorElement.selectedItem.label);
    },

    _reuserPageSelected: function()
    {
        this._populateWithRecordedScenarios(this._reuseIntoApplicationScenariosContainer, this._reuserPageSelectorElement.selectedItem.label);
    },

    _populateWithRecordedScenarios: function(element, pageUrl)
    {
        this._deleteAllChildren(element);

        element.url = pageUrl;

        var eventRecordingsFiles = FileHelper.getEventRecordingsFiles(encodeURIComponent(pageUrl));
        this._urlEventRecordingsFilesMapping[pageUrl] = eventRecordingsFiles;

        for(var i = 0; i < eventRecordingsFiles.length; i++)
        {
            //File writing is async, and file reading sync..
            var recording = eventRecordingsFiles[i];

            this._createRecordingInfoView(element, recording);
        }

        element.selectedIndex = 0;
    },

    _createRecordingInfoView: function(parentElement, recordingInfo)
    {
        var doc = this._extensionDocument;

        var container = doc.createElement("vbox");
        container.className = "recordingView";

        var titleContainer = doc.createElement("div");

        var radioButton = doc.createElement("radio");
        titleContainer.appendChild(radioButton);

        container.appendChild(titleContainer);

        try
        {
            var recordingInfos = JSON.parse(recordingInfo.content);
        }
        catch(e)
        {
            recordingInfos = [];
            Cu.reportError("Error when parsing recording info: " + e + " Content: " + recordingInfo.content);
        }

        var eventInfos = this._getRecordedEventInfos(recordingInfos);

        for(var i = 0; i < eventInfos.length; i++)
        {
            var eventInfo = eventInfos[i];

            var itemElement = doc.createElement("div");

            itemElement.className = "eventRecordingElement";

            itemElement.innerHTML = "<label> "  + eventInfo + "</label>";

            container.appendChild(itemElement);
        }

        parentElement.appendChild(container);

        radioButton.filePath = recordingInfo.path;
        radioButton.label = this._getProfilingTime(recordingInfo.name);
    },

    _getProfilingTime: function(recordingName)
    {
        var date = new Date(parseInt(this._removeFileExtension(recordingName)));

        return date.getDate() + "/" + (date.getMonth()+1)  + "/" + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes();
    },

    _getRecordedEventInfos: function(recordingInfos)
    {
        var allEventInfosMap = [];

        for(var i = 0; i < recordingInfos.length; i++)
        {
            var recordingInfo = recordingInfos[i];
            if(recordingInfo == null)
            {
                recordingInfo = {};
            }

            if(recordingInfo.args == null) { recordingInfo.args = {}; }
            if(recordingInfo.thisValue == null) { recordingInfo.thisValue = {}; }

            var eventInfo = (recordingInfo.args.type || "timing" )+ " on " + (recordingInfo.thisValue.xPath || "window");

            allEventInfosMap.push(eventInfo);
        }

        var unique = [];
        var occurrences = 0;
        for(var i = 0; i < allEventInfosMap.length; i++)
        {
            var current = allEventInfosMap[i];
            var next = allEventInfosMap[i+1];

            occurrences++

            if(current != next)
            {
                unique.push((occurrences > 1 ? occurrences + "x " : "") + current);
                occurrences = 0;
            }
        }

        return unique;
    },

    _populateWithRecordedScenariosPages: function()
    {
        var pagesWithRecordings = FileHelper.getSavedPagesWithEventRecordings().map(function(item)
        {
            return {
                label: decodeURIComponent(item.name),
                value: item.path
            };
        });

        for(var i = 0; i < this._pagesWithRecordedScenariosMenuPopups.length; i++)
        {
            var menuPopup = this._pagesWithRecordedScenariosMenuPopups[i];

            this._deleteAllChildren(menuPopup);

            this._populateWithMenuItems(menuPopup, pagesWithRecordings);
        }
    },

    _deleteAllChildren: function(element)
    {
        if(element == null) { return; }

        while(element.hasChildNodes()) { element.removeChild(element.firstChild); }
    },

    _populateWithMenuItems: function(menu, arrayOfLabelsAndValues)
    {
        for(var i = 0; i < arrayOfLabelsAndValues.length; i++)
        {
            var labelAndValue = arrayOfLabelsAndValues[i];

            var menuItem = this._extensionDocument.createElement("menuitem");

            menuItem.setAttribute("label", labelAndValue.label);
            menuItem.setAttribute("value", labelAndValue.value);

            menu.appendChild(menuItem);
        }
    },

    _removeFileExtension: function(name)
    {
        if(name == null || name.indexOf(".") == -1) { return name; }

        return name.substring(0, name.indexOf("."));
    }
};