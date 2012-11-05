/**
 * User: Jomaras
 * Date: 05.06.12.
 * Time: 08:03
 */
FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    var fcModel = Firecrow.Interpreter.Model;
    var ValueTypeHelper = Firecrow.ValueTypeHelper;

    fcModel.DOM_PROPERTIES =
    {
        DOCUMENT:
        {
            ELEMENT: ["activeElement", "body", "documentElement", "head", "mozFullScreenElement"],
            ELEMENTS: ["anchors", "embeds", "forms", "images", "links", "scripts"],
            PRIMITIVES:
            [
                "async", "characterSet", "compatMode", "contentType",
                "cookie", "designMode", "dir", "documentURI", "domain",
                "inputEncoding", "lastModified", "lastStyleSheetSet",
                "mozSyntheticDocument", "mozFullScreen", "mozFullScreenEnabled",
                "preferredStyleSheetSet", "readyState", "referrer", "selectedStyleSheetSet",
                "title", "URL", "vlinkColor"
            ],
            OTHER:
            [
                "defaultView", "location", "ownerDocument", "plugins", "readyState",
                "doctype", "implementation", "styleSheetSets", "styleSheets"
            ],
            METHODS:
            [
                "addEventListener", "adoptNode", "appendChild", "appendChild", "captureEvents",
                "cloneNode", "close", "compareDocumentPosition", "createAttribute", "createAttributeNS",
                "createCDATASection", "createComment", "createDocumentFragment", "createElement", "createElementNS",
                "createEvent", "createExpression", "createNSResolver", "createTextNode", "elementFromPoint",
                "getElementById", "getElementsByClassName", "getElementsByName", "getElementsByTagName",
                "hasAttributes", "hasChildNodes", "hasFocus", "importNode", "insertBefore", "isEqualNode", "isSameNode",
                "isSupported", "querySelector", "querySelectorAll", "removeChild", "releaseEvents", "removeEventListener",
                "replaceChild", "routeEvent", "write", "writeln"
            ],
            UNPREDICTED: {}
        },

        NODE:
        {
            ELEMENT: ["firstChild", "lastChild", "nextSibling", "previousSibling", "parentNode", "parentElement"],
            ELEMENTS:  ["childNodes"],
            PRIMITIVES:
            [
                "baseURI", "localName", "textContent", "namespaceURI", "nodeName",
                "nodeName", "nodeType", "nodeValue", "prefix", "childElementCount"
            ],
            OTHER: ["attributes", "ownerDocument"]
        },

        ELEMENT:
        {
            ELEMENT: ["firstElementChild", "lastElementChild", "nextElementSibling", "previousElementSibling", "form", "tHead", "tFoot", "offsetParent"],
            ELEMENTS: ["children", "elements", "options", "labels", "list", "rows", "tBodies", "cells"],
            PRIMITIVES:
            [
                "className", "clientHeight", "clientLeft", "clientTop",
                "clientWidth", "contentEditable", "id", "innerHTML",
                "isContentEditable", "lang", "name", "text",
                "offsetHeight", "offsetLeft", "offsetTop", "offsetWidth",
                "outerHTML", "scrollHeight", "scrollLeft", "scrollTop", "scrollWidth",
                "spellcheck", "tabIndex", "tagName", "textContent", "title",
                "charset", "disabled", "href", "hreflang", "media", "rel", "rev", "target", "type",
                "content", "httpEquiv", "scheme", "autocomplete", "action", "acceptCharset",
                "encoding", "enctype", "length", "method", "noValidate", "autofocus", "disabled",
                "multiple", "required", "selectedIndex", "size", "validationMessage", "willValidate",
                "accept", "alt", "checked", "defaultChecked", "defaultValue", "formAction", "formEncType",
                "formMethod", "formNoValidate", "formTarget", "height", "indeterminate", "max", "maxLength",
                "min", "multiple", "pattern", "placeholder", "readOnly", "src", "useMap", "validationMessage",
                "validity", "valueAsNumber", "width", "cols", "rows", "wrap",
                "htmlFor", "hash", "coords", "host", "hreflang", "pathname", "port", "protocol", "rev", "search",
                "shape", "caption", "align", "bgColor", "border", "cellPadding", "cellSpacing", "frame", "rules",
                "summary", "ch", "chOff", "rowIndex", "sectionRowIndex", "vAlign"
            ],
            EVENT_PROPERTIES:
            [
                "oncopy", "oncut", "onpaste", "onbeforeunload", "onblur", "onchange", "onclick",
                "oncontextmenu", "ondblclick", "onfocus", "onkeydown", "onkeypress", "onkeyup",
                "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onresize",
                "onscroll", "onwheel"
            ],
            OTHER: ["dataset", "style", "classList", "files", "valueAsDate"]
        },

        setPrimitives: function(fcObject, object, names)
        {
            try
            {
                for(var i = 0, length = names.length; i < length; i++)
                {
                    var name = names[i];
                    fcObject.addProperty(name, new fcModel.JsValue(object[name], new fcModel.FcInternal()));
                }
            }
            catch(e)
            {
                alert("Error when setting primitives: " + e);
            }
        }
    };

    fcModel.Document = function(document, globalObject)
    {
        try
        {
            this.globalObject = globalObject;
            this.document = document;
            this.constructor = fcModel.Document;

            this.__proto__ = new fcModel.Object(globalObject);

            this.fcInternal = { object: this };
            this.htmlElementToFcMapping = { };

            var methodNames = fcModel.DOM_PROPERTIES.DOCUMENT.METHODS;

            methodNames.forEach(function(method)
            {
                this.addProperty(method, this.globalObject.internalExecutor.createInternalFunction(this.document[method], method, this, true));
            }, this);

            fcModel.DOM_PROPERTIES.setPrimitives(this, document, fcModel.DOM_PROPERTIES.DOCUMENT.PRIMITIVES);
            fcModel.DOM_PROPERTIES.setPrimitives(this, document, fcModel.DOM_PROPERTIES.NODE.PRIMITIVES);

            this.addProperty("readyState", new fcModel.JsValue("loading", new fcModel.FcInternal()));
            this.addProperty("location", globalObject.internalExecutor.createLocationObject());

            function _getChild(htmlElement, tagName, index)
            {
                if(htmlElement == null) { return null;}
                if(htmlElement.children == null) { return null;}
                var tagChildren = [];

                for(var i = 0; i < htmlElement.children.length; i++)
                {
                    var child = htmlElement.children[i];

                    if(child.nodeName.toUpperCase() == tagName.toUpperCase())
                    {
                        tagChildren.push(child);
                    }
                }

                return tagChildren[index];
            };

            this.getElementByXPath = function(xPath)
            {
                if(xPath == null || xPath == "") { return new fcModel.JsValue(null, new fcModel.FcInternal(null));}

                var simpleXPath = new fcModel.SimpleXPath(xPath);
                simpleXPath.removeLevel();
                var foundElement = this.document.childNodes[0];

                while(!simpleXPath.isEmpty() && foundElement != null)
                {
                    foundElement = _getChild(foundElement, simpleXPath.getCurrentTag(), simpleXPath.getIndex());
                    simpleXPath.removeLevel();
                }

                return fcModel.HtmlElementExecutor.wrapToFcElement(foundElement, this.globalObject, null);
            };

            this.getElements = function(propertyName, codeConstruct)
            {
                var implObj = {};
                var fcObj = new fcModel.Object(this.globalObject, codeConstruct, implObj);
                var returnObj = new fcModel.JsValue(implObj, new fcModel.FcInternal(codeConstruct, fcObj));

                var items = document[propertyName];

                if(items == null) { return returnObj; }

                for(var i = items.length - 1; i >= 0; i--)
                {
                    var htmlItem = items[i];
                    var wrappedElement = fcModel.HtmlElementExecutor.wrapToFcElement(htmlItem, this.globalObject, codeConstruct);

                    implObj[i] = wrappedElement;
                    fcObj.addProperty(i, wrappedElement, codeConstruct);

                    if(htmlItem.name != "")
                    {
                        implObj[htmlItem.name] = wrappedElement;
                        fcObj.addProperty(htmlItem.name, wrappedElement, codeConstruct);
                    }

                    if(htmlItem.id != "")
                    {
                        implObj[htmlItem.id] = wrappedElement;
                        fcObj.addProperty(htmlItem.id, wrappedElement, codeConstruct);
                    }
                }

                fcObj.addProperty(item.length, new fcModel.FcInternal(codeConstruct));

                return returnObj;
            };

            this.getJsPropertyValue = function(propertyName, codeConstruct)
            {
                var hasBeenHandled = false;
                if (fcModel.DOM_PROPERTIES.DOCUMENT.ELEMENT.indexOf(propertyName) != -1
                 || fcModel.DOM_PROPERTIES.NODE.ELEMENT.indexOf(propertyName) != -1)
                {
                    this.addProperty(propertyName, fcModel.HtmlElementExecutor.wrapToFcElement(this.document[propertyName], this.globalObject, codeConstruct));
                    hasBeenHandled = true;
                }
                else if (fcModel.DOM_PROPERTIES.DOCUMENT.ELEMENTS.indexOf(propertyName) != -1
                      || fcModel.DOM_PROPERTIES.NODE.ELEMENTS.indexOf(propertyName) != -1)
                {
                    this.addProperty(propertyName, this.getElements(propertyName));
                    hasBeenHandled = true;
                }
                else if(fcModel.DOM_PROPERTIES.DOCUMENT.PRIMITIVES.indexOf(propertyName) != -1
                     || fcModel.DOM_PROPERTIES.NODE.PRIMITIVES.indexOf(propertyName) != -1)
                {
                    this.addProperty(propertyName, this.getPropertyValue(propertyName, codeConstruct));
                    hasBeenHandled = true;
                }
                else if(fcModel.DOM_PROPERTIES.DOCUMENT.OTHER.indexOf(propertyName) != -1
                     || fcModel.DOM_PROPERTIES.NODE.OTHER.indexOf(propertyName) != -1)
                {
                    if(propertyName == "defaultView") { return this.globalObject; }

                    if (propertyName == "readyState" || propertyName == "location")
                    {
                        this.addProperty(propertyName, this.getPropertyValue(propertyName, codeConstruct));
                        hasBeenHandled = true;
                    }
                    else if (propertyName == "ownerDocument" || propertyName == "attributes")
                    {
                        this.addProperty(propertyName, new fcModel.JsValue(null, new fcModel.FcInternal(codeConstruct)));
                        hasBeenHandled = true;
                    }
                    else
                    {
                        //alert("Unhandled document property: " +  propertyName);
                    }
                }

                if(!_isMethod(propertyName) && !hasBeenHandled)
                {
                    fcModel.DOM_PROPERTIES.DOCUMENT.UNPREDICTED[propertyName] = propertyName;
                }

                return this.getPropertyValue(propertyName, codeConstruct);
            };

            this.addJsProperty = function(propertyName, value, codeConstruct)
            {
                this.addProperty(propertyName, value, codeConstruct);
            };

            function _isMethod(methodName){ return methodNames.indexOf(methodName) != -1; }
        }
        catch(e) { fcModel.Document.notifyError("Error when creating Document object: " + e); }
    };
    fcModel.Document.notifyError = function(message) { alert("Document: " + message);}

    fcModel.Document.prototype = new fcModel.Object(null);

    fcModel.SimpleXPath = function(xPathExpression)
    {
        this.xPathExpression = xPathExpression;
    };
    fcModel.SimpleXPath.prototype =
    {
        getCurrentTag: function()
        {
            var elementRegEx = new RegExp("^/([^/[])*");

            var match = this.xPathExpression.match(elementRegEx);

            if(match != null)
            {
                var matchedString = match[0];

                if(matchedString == null) { return ""; }

                if(matchedString.indexOf("/") == 0) { return matchedString.substring(1);}
            }

            return "";
        },

        getIndex: function()
        {
            var indexRegEx = new RegExp("\\[[^\\]]\\]");

            var currentTag = this.xPathExpression.substring((this.xPathExpression[0] === "/" ? 1 : 0));
            currentTag = currentTag.substring(0, currentTag.indexOf("/"));

            var match = currentTag.match(indexRegEx);

            if(match != null)
            {
                var matchedString = match[0];

                if(matchedString != null)
                {
                    var result =  matchedString.replace(/\]$/, "").replace(/^\[/,"");

                    if(result != "") { return result - 1; }
                }
            }

            return 0;
        },

        removeLevel: function()
        {
            var startsWithSlash = this.xPathExpression[0] === "/";
            var currentTag = this.xPathExpression.substring(startsWithSlash ? 1 : 0);
            var indexOfSlash = currentTag.indexOf("/");
            currentTag = currentTag.substring(0, indexOfSlash != -1 ? indexOfSlash : currentTag.length);

            this.xPathExpression = this.xPathExpression.substring(currentTag.length + (startsWithSlash ? 1 : 0));

            return this;
        },

        isEmpty: function() { return this.xPathExpression == ""; }
    };

    fcModel.DocumentExecutor =
    {
        executeInternalMethod: function(thisObject, functionObject, arguments, callExpression)
        {
            if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing document method!"); return; }

            var functionObjectValue = functionObject.value;
            var thisObjectValue = thisObject.value;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.fcInternal.object;
            var globalObject = fcThisValue.globalObject;

                 if (functionName == "createElement") { return globalObject.internalExecutor.createHtmlElement(callExpression, arguments[0].value); }
            else if (functionName == "createTextNode") { return globalObject.internalExecutor.createTextNode(callExpression, arguments[0].value);}
            else if (functionName == "addEventListener") { return globalObject.document.addEventListener(arguments, callExpression, globalObject); }
            else if (functionName == "removeEventListener") { return globalObject.document.removeEventListener(arguments, callExpression, globalObject); }
            else if (functionName == "createDocumentFragment") { return globalObject.internalExecutor.createDocumentFragment(callExpression, globalObject); }
            else if (functionName == "createComment") { return new fcModel.JsValue(globalObject.origDocument.createComment(""), new fcModel.FcInternal(callExpression))}
            else if (functionName == "getElementsByTagName" || functionName == "querySelectorAll" || functionName == "getElementsByClassName")
            {
                var selector = arguments[0].value;

                globalObject.browser.logDomQueried(functionName, selector, callExpression);

                if(functionName == "getElementsByClassName") { selector = "." + selector; }
                var elements = [];
                try
                {
                    elements = thisObjectValue.querySelectorAll(selector);
                }
                catch(e)
                {
                    globalObject.executionContextStack.callExceptionCallbacks
                    (
                        {
                            exceptionGeneratingConstruct: callExpression,
                            isMatchesSelectorException: true
                        }
                    );
                }

                for(var i = 0, length = elements.length; i < length; i++)
                {
                    fcModel.HtmlElementExecutor.addDependencies(elements[i], callExpression, globalObject);
                }

                return fcModel.HtmlElementExecutor.wrapToFcElements(elements, globalObject, callExpression);
            }
            else if(functionName == "getElementById" || functionName == "querySelector")
            {
                var selector = arguments[0].value;

                globalObject.browser.logDomQueried(functionName, selector, callExpression);

                if(functionName == "getElementById") { selector = "#" + selector; }

                var element = null;
                try
                {
                    element = thisObjectValue.querySelector(selector);
                }
                catch(e)
                {
                    globalObject.executionContextStack.callExceptionCallbacks
                    (
                        {
                            exceptionGeneratingConstruct: callExpression,
                            isMatchesSelectorException: true
                        }
                    );
                }

                if(element == null) { return new fcModel.JsValue(null, new fcModel.FcInternal(callExpression)); }

                fcModel.HtmlElementExecutor.addDependencies(element, callExpression, globalObject);

                return fcModel.HtmlElementExecutor.wrapToFcElement(element, globalObject, callExpression);
            }

            this.notifyError("Unknown document method: " +  functionName);

            return null;
        },

        notifyError: function(message) { alert("DocumentExecutor - " + message);}
    }
}});