var EXPORTED_SYMBOLS = ["FireDataAccess"];

var Cu = Components.utils;
var Ci = Components.interfaces;
var Cc = Components.classes;

Cu.import("chrome://Firecrow/content/initFBL.js");
Cu.import("chrome://Firecrow/content/helpers/UriHelper.js");
Cu.import("chrome://Firecrow/content/helpers/htmlHelper.js");
Cu.import("chrome://Firecrow/content/helpers/FileHelper.js");
Cu.import("chrome://Firecrow/content/helpers/esprima.js");
Cu.import("resource://gre/modules/NetUtil.jsm");

var prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
var phantomJsPreference = "Firecrow.phantomJsPath";
var nodeJsPreference = "Firecrow.nodeJsPath";
var slimerJsPreference = "Firecrow.slimerJsPath";

var FireDataAccess =
{
    _externalFilesMap: {},
    _pathSourceLoadedCallbackMap: {},
    _externalScripts: [],

    getPhantomJsPathFromPreferences: function()
    {
        return this.getPreference(phantomJsPreference);
    },

    getNodeJsPathFromPreferences: function()
    {
        return this.getPreference(nodeJsPreference);
    },

    savePhantomJsPathToPreferences: function(path)
    {
        return this.savePreference(phantomJsPreference, path);
    },

    saveNodeJsPathToPreferences: function(path)
    {
        return this.savePreference(nodeJsPreference, path);
    },

    getPreference: function(preference)
    {
        try
        {
            return prefService.getCharPref(preference);
        }
        catch(e) { return null; }
    },

    savePreference: function(preference, value)
    {
        try
        {
            return prefService.setCharPref(preference, value);
        }
        catch(e) {  }
    },

    reset: function(window, htmlHelper)
    {
        this._window = window;

        this._externalFilesMap = {};
        this._pathSourceLoadedCallbackMap = {};
    },

    setBrowser: function(browser)
    {
        this._browser = browser;
    },

    getFileContent: function(filePath)
    {
        return this._externalFilesMap[filePath];
    },

    cacheExternalScriptsContent: function(document)
    {
        this._externalScripts = FireDataAccess.getExternalScripts(document);
        this._externalScripts.push({src: document.baseURI});

        this._externalScripts.currentIndex = 0;

        this._cacheNextExternalScriptContent();
    },

    _cacheNextExternalScriptContent: function()
    {
        var nextExternalScript = this._externalScripts[this._externalScripts.currentIndex++];

        if(nextExternalScript != null)
        {
            this.cacheExternalFileContent(nextExternalScript.src, function()
            {
                FireDataAccess._cacheNextExternalScriptContent();
            });
        }
    },

    cacheAllExternalFilesContent: function(document, allFinishedCallback)
    {
        var externalFileElements = FireDataAccess.getExternalFileElements(document);
        externalFileElements.push({src: document.baseURI});
        var processedFiles = 0;

        for(var i = 0; i < externalFileElements.length; i++)
        {
            this.cacheExternalFileContent(externalFileElements[i].src || externalFileElements[i].href, function()
            {
                processedFiles++;

                if(processedFiles == externalFileElements.length) { allFinishedCallback(); }
            });
        }
    },

    cacheExternalFileContent: function(path, finishedCallback)
    {
        if(this._externalFilesMap[path]) { finishedCallback && finishedCallback(); return; }

        NetUtil.asyncFetch(path, function(aInputStream, aResult)
        {
            Components.isSuccessCode(aResult) ? this._externalFilesMap[path] = NetUtil.readInputStreamToString(aInputStream, aInputStream.available())
                                              : this._externalFilesMap[path] = "SOURCE_UNAVAILABLE";

            finishedCallback && finishedCallback();
        }.bind(this));
    },

    saveModel: function(selectedFolder, pageUrl, iFrame, useEsprima)
    {
        var pageName = this._getPageName(pageUrl);
        this.useEsprima = useEsprima;

        if(pageName == "") { pageName = "model"; }

        pageName += Date.now();

        if(selectedFolder)
        {
            this.asyncGetPageModel(pageUrl, iFrame, function(window, htmlJson)
            {
                FileHelper.writeToFile(selectedFolder + "\\" + pageName + ".json", this._wrapModel(JSON.stringify(htmlJson, function(key, value)
                {
                    if(value != null && value.nodeId == 32) debugger;
                    if(key=="value" && value != null && value.constructor != null && value.constructor.name === "RegExp")
                    {
                        return { type: 'RegExpLiteral',  RegExpBase64: btoa(value.toString())};
                    }
                    return value;
                })));
            }.bind(this));
        }
    },

    saveModelAndTrace: function(selectedFolder, pageUrl, eventTraces, selectors, iFrame, useEsprima)
    {
        var pageName = this._getPageName(pageUrl);
        this.useEsprima = useEsprima;

        if(pageName == "") { pageName = "model"; }

        pageName += Date.now();

        if(selectedFolder)
        {
            this.asyncGetPageModel(pageUrl, iFrame, function(window, htmlJson)
            {
                htmlJson.eventTraces = eventTraces;
                htmlJson.trackedElementsSelectors = selectors;

                FileHelper.writeToFile(selectedFolder + "\\" + pageName + ".json", this._wrapModelAndTraces(JSON.stringify(htmlJson, function(key, value)
                {
                    if(key=="value" && value != null && value.constructor != null && value.constructor.name === "RegExp")
                    {
                        return { type: 'RegExpLiteral',  RegExpBase64: btoa(value.toString())};
                    }
                    return value;
                }), pageUrl));
            }.bind(this));
        }
    },

    _getPageName: function(pageUrl)
    {
        var indexOfExtension = pageUrl.indexOf(".");

        if(indexOfExtension < 0) { indexOfExtension = pageUrl.length; }

        return pageUrl.substring(pageUrl.lastIndexOf("/") + 1, indexOfExtension);
    },

    asyncGetPageModels: function(urls, iFrame, callback, useEsprima)
    {
        var models = [];

        var currentModelIndex = 0;

        var modelLoadedFunction = function(window, htmlJson)
        {
            models.push(htmlJson);

            currentModelIndex++;

            if(models.length == urls.length)
            {
                callback && callback(models);
            }
            else
            {
                this.asyncGetPageModel(urls[currentModelIndex], iFrame, modelLoadedFunction, useEsprima);
            }
        }.bind(this);

        this.asyncGetPageModel(urls[currentModelIndex], iFrame, modelLoadedFunction);
    },

    asyncGetPageModel: function(url, iFrame, callback, useEsprima)
    {
        try
        {
            iFrame.style.height = "0px";
            iFrame.webNavigation.allowAuth = true;
            iFrame.webNavigation.allowImages = false;
            iFrame.webNavigation.allowJavascript = false;
            iFrame.webNavigation.allowMetaRedirects = true;
            iFrame.webNavigation.allowPlugins = false;
            iFrame.webNavigation.allowSubframes = false;

            this.useEsprima = useEsprima;

            var onLoadFunction = function(e)
            {
                var document = e.originalTarget.wrappedJSObject;

                iFrame.removeEventListener("load", onLoadFunction, true);

                this.cacheAllExternalFilesContent(document, function()
                {
                    var htmlJson = HtmlHelper.serializeToHtmlJSON
                    (
                        document,
                        this._getScriptsPathsAndModels(document),
                        this._getStylesPathsAndModels(document)
                    );

                    htmlJson.url = url;

                    callback(document.defaultView, htmlJson);
                }.bind(this));
            }.bind(this)

            iFrame.addEventListener("load", onLoadFunction, true);

            iFrame.webNavigation.loadURI(url, Ci.nsIWebNavigation, null, null, null);
        }
        catch(e) { Cu.reportError("Loading html in iFrame errror: " + e); }
    },

    _wrapModel: function(model)
    {
        //return "var fullPageModel = { pageModel:" + model + "};";
        return model;
        //return "HtmlModelMapping.push({url: '',results: [], model: " + model + "});"
    },

    _wrapModelAndTraces: function(model, url)
    {
        return "HtmlModelMapping.push({url: '" + url +"',results: [], model: " + model + "});"
    },

    getContentScriptNameAndPaths: function(document)
    {
        var scriptPaths = [];

        scriptPaths.push({name: "* - " + (FireDataAccess.getScriptName(document.baseURI) || "index"), path: document.baseURI });
        /*scriptPaths.push({name: "DOM - " + (FireDataAccess.getScriptName(document.baseURI) || "index"), path: document.baseURI });*/

        var scriptElements = document.scripts;

        for(var i = 0; i < scriptElements.length; i++)
        {
            var src = scriptElements[i].src;

            if(src != "")
            {
                scriptPaths.push({name: FireDataAccess.getScriptName(src), path: src });
            }
        }

        return scriptPaths;
    },

    getExternalScripts: function(document)
    {
        var scripts = document.scripts;
        var externalScripts = [];

        for(var i = 0; i < scripts.length; i++)
        {
            var script = scripts[i];

            if(script.src != null && script.src != "")
            {
                externalScripts.push(script);
            }
        }

        return externalScripts;
    },

    getExternalFileElements: function(document)
    {
        var potentialExternalElements = document.querySelectorAll("script, link");
        var externalElements = [];

        for(var i = 0; i < potentialExternalElements.length; i++)
        {
            var element = potentialExternalElements[i];

            if(element.tagName == "SCRIPT" && element.src != "")
            {
                externalElements.push(element)
            }
            else if(element.tagName == "LINK" && element.rel == "stylesheet" && element.href != "")
            {
                externalElements.push(element);
            }
        }

        return externalElements;
    },

    _getScriptsPathsAndModels: function(document)
    {
        var scripts = document.getElementsByTagName("script");
        var scriptPathsAndModels = [];

        var currentPageContent = this._externalFilesMap[document.baseURI];
        currentPageContent = currentPageContent.replace(/(\r)?\n/g, "\n");

        var currentScriptIndex = 0;

        for(var i = 0; i < scripts.length; i++)
        {
            var script = scripts[i];

            if(script.src != "")
            {
                scriptPathsAndModels.push
                ({
                    path: script.src,
                    model: this.parseSourceCode(this._externalFilesMap[script.src], script.src, 1)
                });
            }
            else
            {
                scriptPathsAndModels.push
                ({
                    path: script.src,
                    model: this.parseSourceCode
                    (
                        script.textContent,
                        script.baseURI,
                        (function()
                        {
                            var code = script.textContent.replace(/(\r)?\n/g, "\n");
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
        }

        return scriptPathsAndModels;
    },

    _getStylesPathsAndModels: function(document)
    {
        var stylesheets = document.styleSheets;
        var stylePathAndModels = [];

        for(var i = 0; i < stylesheets.length; i++)
        {
            var styleSheet = stylesheets[i];
            var path = styleSheet.href != null ? styleSheet.href : document.baseURI;
            var model = { rules: [] };

            this._fillStyleSheetModel(model, styleSheet, path)

            stylePathAndModels.push({path : path, model: model });
        }

        return stylePathAndModels;
    },

    _fillStyleSheetModel: function(model, styleSheet, path)
    {
        if(styleSheet == null) { return model; }

        try
        {
            var cssRules = styleSheet.cssRules;
        }
        catch(e)
        {
            Cu.reportError("CSS stylesheets not yet ready for parsing!" + e);
            cssRules = [];
        }

        for(var i = 0; i < cssRules.length; i++)
        {
            var cssRule = cssRules[i];

            //type :
            // 3 - import command
            // 4 - media
            // 5 - fontface
            // 6 - pagerule
            // 7,8 - keyframe

            if(cssRule.type == 3)
            {
                this._fillStyleSheetModel(model, cssRule.styleSheet, UriHelper.getAbsoluteUrl(cssRule.href, path))
            }
            else
            {
                var result = this._getStyleDeclarationsAndUpdatedCssText(cssRule, path);

                model.rules.push
                ({
                    selector: cssRule.selectorText,
                    cssText: result.cssText,
                    declarations: result.declarations,
                    shouldBeIncluded: cssRule.type == 5 || cssRule.type == 7 || cssRule.type == 8
                });
            }
        }
    },

    _getStyleDeclarationsAndUpdatedCssText: function(cssRule, path)
    {
        var result = { declarations: [], cssText: cssRule.cssText };

        function urlReplacementFunction(match, p1)
        {
            if(p1 == null) { return match; }

            p1 = p1.trim();

            var enclosing = p1[0] == "'" || p1[0] == '"' ? p1[0] : "";

            if(enclosing != "") { p1 = p1.substring(1, p1.length-1); }

            return "url(" + enclosing + UriHelper.getAbsoluteUrl(p1, path) + enclosing + ")";
        }

        if(cssRule == null || cssRule.style == null || cssRule.type != 1) { return result;}

        var style = cssRule.style;

        for(var i = 0; i < style.length; i++)
        {
            var key = style[i].toLowerCase();

            var value = style.getPropertyValue(key);

            if(key == "background-image" || key == "background")
            {
                if(value.indexOf("url") != -1 || value.indexOf("URL") != -1)
                {
                    value = value.replace(/url\s*\(([^)]*)\)/gi, urlReplacementFunction);
                    result.cssText = result.cssText.replace(/url\s*\(([^)]*)\)/gi, urlReplacementFunction);
                }
            }

            result.declarations[key] = value;
        }

        return result;
    },

    getScriptName: function(url)
    {
        if(!url) { return ""; }

        var lastIndexOfSlash = url.lastIndexOf("/");

        if(lastIndexOfSlash != -1) { return url.substring(lastIndexOfSlash + 1); }

        lastIndexOfSlash = url.lastIndexOf("\\");

        if(lastIndexOfSlash != -1) { return url.substring(lastIndexOfSlash + 1); }

        return url;
    },

    getPhantomJsFilePath: function(window)
    {
        var loggedPath = this.getPhantomJsPathFromPreferences();

        if(loggedPath != null && loggedPath != "") { return loggedPath; }

        var phantomJsPath = FileHelper.userPickFile(window, "Select PhantomJs path", "phantomjs.exe");

        this.savePhantomJsPathToPreferences(phantomJsPath);

        return phantomJsPath;
    },

    getNodeJsFilePath: function(window)
    {
        var loggedPath = this.getNodeJsPathFromPreferences();

        if(loggedPath != null && loggedPath != "") { return loggedPath; }

        var nodeJsPath = FileHelper.userPickFile(window, "Select nodeJs path", "node.exe");

        this.saveNodeJsPathToPreferences(nodeJsPath);

        return nodeJsPath;
    },

    parseSourceCode: function(sourceCode, path, startLine)
    {
        if(path != null && Firecrow.isIgnoredScript(path)) { return {};}

        Components.utils.import("resource://gre/modules/reflect.jsm");

        try
        {
            var model = this.useEsprima ? esprima.parse(sourceCode, {loc: true}) : Reflect.parse(sourceCode);

            if(model != null)
            {
                if(model.loc == null)
                {
                    model.loc = { start: {line: startLine}, source: path};
                }

                if(model.loc.start.line != startLine)
                {
                    model.lineAdjuster = startLine;
                }
                else
                {
                    model.lineAdjuster = 0;
                }

                model.source = path;
            }

            return model;
        }
        catch(e)
        {
            Cu.reportError("Error when parsing source code: " + e + "; path:" + path + e.lineNumber);
        }
    }
};
