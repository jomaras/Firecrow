/**
 * User: Jomaras
 * Date: 03.05.12.
 * Time: 09:11
 */

FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const ValueTypeHelper = Firecrow.ValueTypeHelper;
const ASTHelper = Firecrow.ASTHelper;
const WebFile = Firecrow.DoppelBrowser.WebFile;
const Node = Firecrow.DependencyGraph.Node;
const HtmlHelper = Firecrow.htmlHelper;

const Interpreter = Firecrow.Interpreter.InterpreterSimulator;
const GlobalObject = Firecrow.Interpreter.Model.GlobalObject;

const fcSimulator = Firecrow.Interpreter.Simulator;

Firecrow.DoppelBrowser.Browser = function(htmlWebFile, externalWebFiles)
{
    try
    {
        if(!ValueTypeHelper.isOfType(htmlWebFile, WebFile)) { alert("The main html file in DoppelBrowser.Browser is not a web File!"); return; }
        if(!ValueTypeHelper.isArrayOf(externalWebFiles, WebFile)) { alert("External web files are not webFiles in DoppelBrowser.Browser"); return; }

        this.htmlWebFile = htmlWebFile;
        this.externalWebFiles = externalWebFiles;

        this.hostDocument = this._getDocumentObject();
        this.documentFragment = this.hostDocument.createDocumentFragment();

        this.globalObject = new GlobalObject();
        fcSimulator.InternalExecutor.expandInternalFunctions(this.globalObject);

        this.nodeCreatedCallbacks = [];
        this.nodeInsertedCallbacks = [];
        this.interpretJsCallbacks = [];

        this.interpreterMessageGeneratedCallbacks = [];
    }
    catch(e)
    {
        alert("Error when initialising Doppel Browser.Browser: " + e);
    }
};

var Browser = Firecrow.DoppelBrowser.Browser;

Browser.prototype =
{
    asyncBuildPage: function(callback)
    {
        this._asyncGetHtmlModel(function(htmlModel)
        {
            try
            {
                if(htmlModel == null) { alert("There is no html model in DoppelBrowser.Browser for page: " + this.htmlWebFile.url); return; }
                if(htmlModel.htmlElement == null) { alert("There is no html element for html model in DoppelBrowser.Browser for page: " + this.htmlWebFile.url); return; }

                this._buildSubtree(htmlModel.htmlElement, null);
            }
            catch(e) { alert("Exception when async getting html model at DoppelBrowser.Browser: " + e); }
        });
    },

    _asyncGetHtmlModel: function(callback)
    {
        try
        {
            if(this.htmlWebFile == null) { alert("The initial page is not set in DoppelBrowser.Browser!"); return; }

            if(!Firecrow.IsDebugMode)
            {
                var iFrame = FirebugChrome.$('fdHiddenIFrame');
                iFrame.webNavigation.allowAuth = true;
                iFrame.webNavigation.allowImages = false;
                iFrame.webNavigation.allowJavascript = false;
                iFrame.webNavigation.allowMetaRedirects = true;
                iFrame.webNavigation.allowPlugins = false;
                iFrame.webNavigation.allowSubframes = false;
                iFrame.addEventListener("DOMContentLoaded", function (e)
                {
                    callback(HtmlHelper.serializeToHtmlJSON(e.originalTarget.wrappedJSObject));
                }, true);

                iFrame.webNavigation.loadURI(this.getCurrentUrl(), Components.interfaces.nsIWebNavigation, null, null, null);
            }
            else
            {
                callback.call(this, HtmlModelMapping.getModel(this.htmlWebFile.url));
            }
        }
        catch(e)
        {
            alert("Exception in creating main page iFrame: " + e);
        }
    },

    _buildSubtree: function(htmlModelElement, parentDomElement)
    {
        try
        {
            var htmlDomElement = this._createStaticHtmlNode(htmlModelElement);

            htmlModelElement.attributes.forEach(function(attribute)
            {
                htmlDomElement.setAttribute(attribute.name, attribute.value);
            }, this);

            this._insertIntoDom(htmlDomElement, parentDomElement);

            htmlModelElement.type == "script" ? htmlDomElement.textContent = htmlModelElement.textContent
                : "";

            htmlModelElement.children.forEach(function(element)
            {
                element.type == "textNode" ? htmlDomElement.appendChild(this.hostDocument.createTextNode(element.textContent))
                    : this._buildSubtree(element, htmlDomElement);
            }, this);
        }
        catch(e)
        {
            alert("Error when building a subtree of an html element in DoppelBrowser.browser: " + e);
        }
    },

    _createStaticHtmlNode: function(htmlModelNode)
    {
        var htmlDomElement = this.hostDocument.createElement(htmlModelNode.type);

        htmlDomElement.modelElement = htmlModelNode;
        htmlModelNode.domElement = htmlDomElement;

        this._callNodeCreatedCallbacks(htmlModelNode, "html", false);

        if(htmlModelNode.type == "script")
        {
            this._buildJavaScriptNodes(htmlModelNode);
            this._interpretJsCode(htmlModelNode);
            this._callInterpretJsCallbacks(htmlModelNode.pathAndModel.model);
        }
        else if(htmlModelNode.type == "style")
        {
            this._buildCssNodes(htmlModelNode);
        }
        else if (htmlModelNode.type == "link")
        {
            this._buildCssNodes(htmlModelNode);
        }

        return htmlDomElement;
    },

    _interpretJsCode: function(scriptModelNode)
    {
        try
        {
            var interpreter = new Interpreter(scriptModelNode.pathAndModel.model, this.globalObject);
            interpreter.registerMessageGeneratedCallback(function(message)
            {
                this._callInterpreterMessageGeneratedCallbacks(message);
            }, this);

            interpreter.run();
        }
        catch(e)
        {
            alert("DoppelBrowser.browser error when interpreting js code: " + e);
        }
    },

    _insertIntoDom: function(htmlDomElement, parentDomElement)
    {
        parentDomElement == null ? this.documentFragment.appendChild(htmlDomElement)
                                 : parentDomElement.appendChild(htmlDomElement);

        this._callNodeInsertedCallbacks(htmlDomElement.modelElement, parentDomElement != null ? parentDomElement.modelElement : null);
    },

    _buildCssNodes: function(cssHtmlElementModelNode)
    {
        try
        {
            cssHtmlElementModelNode.pathAndModel.model.rules.forEach(function(cssRule)
            {
                this._callNodeCreatedCallbacks(cssRule, "css", false);
                this._callNodeInsertedCallbacks(cssRule, cssHtmlElementModelNode);
            }, this);

            //TODO - add to document.stylesheets
        }
        catch(e) { alert("DoppelBrowser.browser error when building css nodes: " + e);}
    },

    _buildJavaScriptNodes: function(scriptHtmlElementModelNode)
    {
        try
        {
            var that = this;
            ASTHelper.traverseAst(scriptHtmlElementModelNode.pathAndModel.model, function(currentNode, nodeName, parentNode)
            {
                that._callNodeCreatedCallbacks(currentNode, "js", false);
                that._callNodeInsertedCallbacks(currentNode, ASTHelper.isProgram(parentNode) ? scriptHtmlElementModelNode : parentNode);
            });
        }
        catch(e) { alert("DoppelBrowser.browser error when building js nodes: " + e); }
    },

    registerNodeCreatedCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { alert("DoppelBrowser.Browser - node created callback has to be a function!"); return; }

        this.nodeCreatedCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerNodeInsertedCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { alert("DoppelBrowser.Browser - node inserted callback has to be a function!"); return; }

        this.nodeInsertedCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerInterpretJsCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { alert("DoppelBrowser.Browser - interpret js callback has to be a function!"); return; }

        this.interpretJsCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerInterpreterMessageGeneratedCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { alert("DoppelBrowser.Browser - interpreter message generated callback has to be a function!"); return; }

        this.interpreterMessageGeneratedCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerInterpretJsCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { alert("DoppelBrowser.Browser - interpret js callback has to be a function!"); return; }

        this.interpretJsCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    _callNodeCreatedCallbacks: function(nodeModelObject, nodeType, isDynamic)
    {
        this.nodeCreatedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, nodeModelObject, nodeType, isDynamic);
        });
    },

    _callNodeInsertedCallbacks: function(nodeModelObject, nodeType, isDynamic)
    {
        this.nodeInsertedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, nodeModelObject, nodeType, isDynamic);
        });
    },

    _callInterpreterMessageGeneratedCallbacks: function(message)
    {
        this.interpreterMessageGeneratedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, message);
        });
    },

    _callInterpretJsCallbacks: function(programModel)
    {
        this.interpretJsCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, programModel);
        });
    },

    _getDocumentObject: function()
    {
        return Firecrow.IsDebugMode ? document : Firecrow.fbHelper.getCurrentPageDocument();
    }
};

}});