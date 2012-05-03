/**
 * User: Jomaras
 * Date: 03.05.12.
 * Time: 09:11
 */

FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const ValueTypeHelper = Firecrow.ValueTypeHelper;
const WebFile = Firecrow.DoppelBrowser.WebFile;
const Node = Firecrow.DependencyGraph.Node;
const HtmlHelper = Firecrow.htmlHelper;

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

        this.nodeCreatedCallbacks = [];
        this.nodeInsertedCallbacks = [];
    }
    catch(e) { alert("Error when initialising Doppel Browser.Browser: " + e); }
};

var Browser = Firecrow.DoppelBrowser.Browser;

Browser.prototype.registerNodeCreatedCallback = function(callback, thisObject)
{
    if(!ValueTypeHelper.isOfType(callback, Function)) { alert("DoppelBrowser.Browser - node created callback has to be a function!"); return; }

    this.nodeCreatedCallbacks.push({callback: callback, thisObject: thisObject});
};

Browser.prototype._callNodeCreatedCallbacks = function(nodeModelObject, nodeType, isDynamic)
{
    this.nodeCreatedCallbacks.forEach(function(callbackObject)
    {
       callbackObject.callback.call(callbackObject.thisObject, nodeModelObject, nodeType, isDynamic);
    });
};

Browser.prototype.registerNodeInsertedCallback = function(callback, thisObject)
{
    if(!ValueTypeHelper.isOfType(callback, Function)) { alert("DoppelBrowser.Browser - node inserted callback has to be a function!"); return; }

    this.nodeInsertedCallbacks.push({callback: callback, thisObject: thisObject});
};

Browser.prototype._callNodeInsertedCallbacks = function(nodeModelObject, parentNodeModelObject, isDynamic)
{
    this.nodeInsertedCallbacks.forEach(function(callbackObject)
    {
        callbackObject.callback.call(callbackObject.thisObject, nodeModelObject, parentNodeModelObject, isDynamic);
    });
};

Browser.prototype._getDocumentObject = function()
{
    return Firecrow.IsDebugMode ? document
                                : Firecrow.fbHelper.getCurrentPageDocument();
};

Browser.prototype._asyncBuildPage = function(callback)
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
};

Browser.prototype._buildSubtree = function(htmlModelElement, parentDomElement)
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

            htmlModelElement.type == "style"  ? this._processCssRules(htmlDomElement, element.textContent)
                                         : "";
        }, this);
    }
    catch(e)
    {
        alert("Error when building a subtree of an html element in DoppelBrowser.browser: " + e);
    }
};

Browser.prototype._createStaticHtmlNode = function(htmlModelNode)
{
    var htmlDomElement = this.hostDocument.createElement(htmlModelNode.type);

    htmlDomElement.modelElement = htmlModelNode;
    htmlModelNode.domElement = htmlDomElement;

    this._callNodeCreatedCallbacks(htmlModelNode, "html", false);

    return htmlDomElement;
};

Browser.prototype._insertIntoDom = function(htmlDomElement, parentDomElement)
{
    if(parentDomElement == null)
    {
        this.documentFragment.appendChild(htmlDomElement);
    }
    else
    {
        parentDomElement.appendChild(htmlDomElement);
    }

    this._callNodeInsertedCallbacks(htmlDomElement.modelElement, parentDomElement != null ? parentDomElement.modelElement : null);
};

Browser.prototype._processCssRules = function(cssElement, cssCode)
{
    //TODO - add CSS parsing and node building!
};

Browser.prototype._asyncGetHtmlModel = function(callback)
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
};

}});