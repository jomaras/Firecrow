FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.Document = function(document, globalObject)
{
    try
    {
        this.__proto__ = new fcModel.Object(globalObject);
        for(var prop in fcModel.DocumentProto) { this[prop] = fcModel.DocumentProto[prop]; }

        this.document = document;
        this.constructor = fcModel.Document;

        this.fcInternal = { object: this };
        this.htmlElementToFcMapping = { };

        fcModel.DOM_PROPERTIES.DOCUMENT.METHODS.forEach(function(method)
        {
            this.addProperty(method, this.globalObject.internalExecutor.createInternalFunction(this.document[method], method, this, true));
        }, this);

        fcModel.DOM_PROPERTIES.setPrimitives(this, document, fcModel.DOM_PROPERTIES.DOCUMENT.PRIMITIVES);
        fcModel.DOM_PROPERTIES.setPrimitives(this, document, fcModel.DOM_PROPERTIES.NODE.PRIMITIVES);

        this.addProperty("readyState", new fcModel.JsValue("loading", new fcModel.FcInternal()));
        this.addProperty("location", globalObject.internalExecutor.createLocationObject());
    }
    catch(e) { fcModel.Document.notifyError("Error when creating Document object: " + e); }
};
fcModel.Document.notifyError = function(message) { alert("Document: " + message);}


fcModel.DocumentProto =
{
    //<editor-fold desc="Access Js Properties">
    addJsProperty: function(propertyName, value, codeConstruct)
    {
        this.addProperty(propertyName, value, codeConstruct);
    },

    getJsPropertyValue: function(propertyName, codeConstruct)
    {
        var hasBeenHandled = false;

        if (fcModel.DOM_PROPERTIES.DOCUMENT.ELEMENT.indexOf(propertyName) != -1 || fcModel.DOM_PROPERTIES.NODE.ELEMENT.indexOf(propertyName) != -1)
        {
            this.addProperty(propertyName, fcModel.HtmlElementExecutor.wrapToFcElement(this.document[propertyName], this.globalObject, codeConstruct));
            hasBeenHandled = true;
        }
        else if (fcModel.DOM_PROPERTIES.DOCUMENT.ELEMENTS.indexOf(propertyName) != -1 || fcModel.DOM_PROPERTIES.NODE.ELEMENTS.indexOf(propertyName) != -1)
        {
            this.addProperty(propertyName, this._getElements(propertyName));
            hasBeenHandled = true;
        }
        else if(fcModel.DOM_PROPERTIES.DOCUMENT.PRIMITIVES.indexOf(propertyName) != -1 || fcModel.DOM_PROPERTIES.NODE.PRIMITIVES.indexOf(propertyName) != -1)
        {
            this.addProperty(propertyName, this.getPropertyValue(propertyName, codeConstruct));
            hasBeenHandled = true;
        }
        else if(fcModel.DOM_PROPERTIES.DOCUMENT.OTHER.indexOf(propertyName) != -1 || fcModel.DOM_PROPERTIES.NODE.OTHER.indexOf(propertyName) != -1)
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
        }

        if(!this._isMethodName(propertyName) && !hasBeenHandled)
        {
            fcModel.DOM_PROPERTIES.DOCUMENT.UNPREDICTED[propertyName] = propertyName;
        }

        return this.getPropertyValue(propertyName, codeConstruct);
    },
    //</editor-fold>

    //<editor-fold desc="Fetch elements">
    getElementByXPath: function(xPath)
    {
        if(xPath == null || xPath == "") { return new fcModel.JsValue(null, new fcModel.FcInternal(null));}

        var simpleXPath = (new fcModel.SimpleXPath(xPath)).removeLevel();
        var foundElement = this.document.childNodes[0];

        while(!simpleXPath.isEmpty() && foundElement != null)
        {
            foundElement = this._getChild(foundElement, simpleXPath.getCurrentTag(), simpleXPath.getIndex());
            simpleXPath.removeLevel();
        }

        return fcModel.HtmlElementExecutor.wrapToFcElement(foundElement, this.globalObject, null);
    },
    //</editor-fold>

    //<editor-fold desc="'Private' methods">
    _getElements: function(propertyName, codeConstruct)
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
    },

    _getChild: function(htmlElement, tagName, index)
    {
        if(htmlElement == null || htmlElement.children == null) { return null;}

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
    },

    _isMethodName: function(name)
    {
        return fcModel.DOM_PROPERTIES.DOCUMENT.METHODS.indexOf(name) != -1;
    }
    //</editor-fold>
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
};
}});