/**
 * User: Jomaras
 * Date: 05.06.13.
 * Time: 13:58
 */
FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;
var fcModel = Firecrow.Interpreter.Model;
var fcSymbolic = fcScenarioGenerator.Symbolic;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;

fcScenarioGenerator.ScenarioBrowserHelper =
{
    getSelectElementAvailableValues: function(selectElement)
    {
        var values = [];

        if(selectElement == null) { return values; }

        for(var i = 0; i < selectElement.children.length; i++)
        {
            values.push(selectElement.children[i].value);
        }

        return values;
    },

    isEventPropertyWithPositiveNumberValue: function(propertyName)
    {
        return propertyName.indexOf("page") == 0
            || propertyName.indexOf("client") == 0
            || propertyName.indexOf("layer") == 0
            || propertyName.indexOf("range") == 0
            || propertyName.indexOf("keyCode") == 0
            || propertyName.indexOf("screen") == 0
            || propertyName.indexOf("which") == 0;
    },

    getModelFromCssSelector: function(browser, cssSelector)
    {
        try
        {
            var htmlElement = browser.globalObject.document.implementationObject.querySelector(cssSelector);

            if(htmlElement == null)
            {
                console.log("Can not find: " + cssSelector, "in scenarioBrowserHelper");
                return null;
            }

            return htmlElement.modelElement;
        }
        catch(e)
        {
            console.log("Can not find: " + cssSelector, "in scenarioBrowserHelper");
        }

        return null;
    },

    isEventPropertyWhich: function(propertyName)
    {
        return propertyName != null && propertyName.indexOf("which") == 0;
    },

    getMatchingEventRegistration: function(browser, thisObjectModel, registrationConstruct)
    {
        var handlers = browser.globalObject.intervalHandlers.concat(browser.globalObject.timeoutHandlers)
                                                            .concat(browser.globalObject.ajaxHandlers);

        for(var i = 0; i < handlers.length; i++)
        {
            var handler = handlers[i];

            if(handler.registrationConstruct == registrationConstruct)
            {
                return handler;
            }
        }

        var domHandlers = browser.globalObject.htmlElementEventHandlingRegistrations;
        for(var i = 0; i < domHandlers.length; i++)
        {
            var domHandler = domHandlers[i];

            if(domHandler.registrationConstruct != registrationConstruct) { continue; }

            if(domHandler.thisObjectModel == thisObjectModel)
            {
                return domHandler;
            }
        }

        console.log("Could not find eventRegistration: " + registrationConstruct.nodeId);

        return null;
    },

    getEventRegistrationFingerprint: function(eventRegistration)
    {
        if(eventRegistration == null) { return ""; }

        return eventRegistration.thisObjectDescriptor + eventRegistration.eventType
             + eventRegistration.handlerConstruct.nodeId;
    },

    getEventArguments: function(eventRegistration, browser, parameters, eventIndex)
    {
        switch(eventRegistration.eventType)
        {
            case "onclick":
            case "onmousedown":
            case "onmouseup":
            case "onmousemove":
            case "onmouseover":
            case "click":
            case "mousedown":
            case "mouseup":
            case "mousemove":
            case "mouseover":
            case "touchstart":
            case "touchmove":
            case "touchend":
            case "touchcancel":
            case "ontouchstart":
            case "ontouchmove":
            case "ontouchend":
            case "ontouchcancel":
                return this._generateMouseHandlerArguments(eventRegistration, browser, parameters, eventIndex);
            case "onkeydown":
            case "onkeyup":
            case "keydown":
            case "keyup":
                return this._generateKeyHandlerArguments(eventRegistration, browser, parameters, eventIndex);
            default:
                break;
        }

        return [];
    },

    _generateMouseHandlerArguments: function(eventRegistration, browser, parameters, eventIndex)
    {
        var args = [];
        var fcModel = FBL.Firecrow.Interpreter.Model;

        var eventInfo = {};
        var eventInfoFcObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        var elementPosition = eventRegistration.thisObject.implementationObject != null && ValueTypeHelper.isHtmlElement(eventRegistration.thisObject.implementationObject)
                            ? this.getElementPosition(eventRegistration.thisObject.implementationObject)
                            : { x: 0, y: 0}

        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "target", eventRegistration.thisObject, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "currentTarget", null, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "pageX", elementPosition.x, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "pageY", elementPosition.y, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "clientX", elementPosition.x, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "clientY", elementPosition.y, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "screenX", elementPosition.x, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "screenY", elementPosition.y, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "layerX", elementPosition.x, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "layerY", elementPosition.y, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "which", 1, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "type", eventRegistration.eventType, browser, eventIndex, true);

        this._addTouchesEventObjectArrayProperty(eventInfo, eventInfoFcObject, "touches", browser, eventIndex);
        this._addTouchesEventObjectArrayProperty(eventInfo, eventInfoFcObject, "targetTouches", browser, eventIndex);
        this._addTouchesEventObjectArrayProperty(eventInfo, eventInfoFcObject, "changedTouches", browser, eventIndex);


        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    getElementPosition: function(htmlElement)
    {
        var x = 0;
        var y = 0;

        while(htmlElement && !isNaN( htmlElement.offsetLeft ) && !isNaN( htmlElement.offsetTop ) )
        {
            x += htmlElement.offsetLeft - htmlElement.scrollLeft;
            y += htmlElement.offsetTop - htmlElement.scrollTop;
            htmlElement = htmlElement.offsetParent;
        }

        return { x: x, y: y };
    },

    _generateKeyHandlerArguments: function(eventRegistration, browser, parameters, eventIndex)
    {
        var args = [];
        var fcModel = FBL.Firecrow.Interpreter.Model;

        var eventInfo = {};
        var eventInfoFcObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "altKey", false, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "bubbles", true, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "cancelBubble", false, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "cancelable", true, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "charCode", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "ctrlKey", false, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "currentTarget", null, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "detail", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "eventPhase", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "explicitOriginalTarget", null, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "isChar", false, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "isTrusted", true, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "keyCode", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "layerX", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "layerY", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "rangeOffset", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "rangeParent", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "shiftKey", false, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "target", null, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "type", eventRegistration.eventType, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "which", 1, browser, eventIndex);

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    _addEventObjectProperty: function(eventInfo, eventInfoFcObject, propertyName, propertyValue, browser, executionOrderId, dontCreateSymbolicValue)
    {
        var symbolicValue = null;
        if(!dontCreateSymbolicValue)
        {
            symbolicValue = new fcSymbolic.Identifier(this.addSuffix(propertyName, executionOrderId));
        }

        if(ValueTypeHelper.isPrimitive(propertyValue))
        {
            eventInfo[propertyName] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, propertyValue, symbolicValue);
        }
        else
        {
            eventInfo[propertyName] = new fcModel.fcValue(propertyValue.implementationObject, propertyValue);
        }

        eventInfoFcObject.addProperty(propertyName, eventInfo[propertyName]);
    },

    _addTouchesEventObjectArrayProperty: function(eventInfo, eventInfoFcObject, propertyName, browser, executionOrderId)
    {
        var object = browser.globalObject.internalExecutor.createNonConstructorObject(null, {});

        object.iValue.addProperty("pageX", this._createPrimitiveSymbolicValue("pageX", 0, browser, executionOrderId));
        object.iValue.addProperty("pageY", this._createPrimitiveSymbolicValue("pageY", 0, browser, executionOrderId));

        object.iValue.addProperty("clientX", this._createPrimitiveSymbolicValue("clientX", 0, browser, executionOrderId));
        object.iValue.addProperty("clientY", this._createPrimitiveSymbolicValue("clientY", 0, browser, executionOrderId));

        var touches = browser.globalObject.internalExecutor.createArray(null, [object]);

        eventInfo[propertyName] = touches;
        eventInfoFcObject.addProperty(propertyName, touches);
    },

    _createPrimitiveSymbolicValue: function(propertyName, propertyValue, browser, executionOrderId)
    {
        return browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, propertyValue, new fcSymbolic.Identifier(this.addSuffix(propertyName, executionOrderId)));
    },

    _updateWithConstraintInfo: function(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex)
    {
        if(parameters == null) { return; }

        for(var propName in parameters)
        {
            var propValue = parameters[propName];

            eventInfo[propName] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, propValue, new fcSymbolic.Identifier(this.addSuffix(propName, eventIndex)));
            eventInfoFcObject.addProperty(propName, eventInfo[propName]);

            if(propName == "pageX" || propName == "pageY" || propName == "clientX" || propName == "clientY")
            {
                if(eventInfo.touches != null && eventInfo.touches.iValue != null && eventInfo.touches.iValue.items != null && eventInfo.touches.iValue.items[0] != null)
                {
                    var touchItem = eventInfo.touches.iValue.items[0];

                    touchItem.iValue.addProperty(propName, this._createPrimitiveSymbolicValue(propName, propValue, browser, eventIndex));
                }
            }
        }
    },

    modifyDom: function(eventRegistration, scenario, parameters)
    {
        return this._updateDomWithConstraintInfo(eventRegistration, scenario, parameters);
    },

    _updateDomWithConstraintInfo: function(eventRegistration, scenario, parameters)
    {
        if(parameters == null) { return; }

        for(var parameterName in parameters)
        {
            if(parameterName.indexOf("DOM_") == 0)
            {
                var id = fcSymbolic.ConstraintResolver.getHtmlElementIdFromSymbolicParameter(parameterName);
                var cleansedProperty = fcSymbolic.ConstraintResolver.getHtmlElementPropertyFromSymbolicParameter(parameterName);
                if(id != "")
                {
                    var htmlElement = eventRegistration.thisObject.globalObject.document.document.getElementById(id);

                    if(ValueTypeHelper.isHtmlSelectElement(htmlElement))
                    {
                        var updateResult = fcSymbolic.ConstraintResolver.updateSelectElement(cleansedProperty, htmlElement, parameters[parameterName]);

                        scenario.inputConstraint.resolvedResult[eventRegistration.thisObject.globalObject.browser.eventIndex][parameterName] = updateResult.oldValue + " -&gt; " + updateResult.newValue;
                        parameters.value = updateResult.newValue;
                    }
                }
                else
                {
                    debugger;
                    alert("When updating DOM can not find ID!");
                }
            }
        }
    },

    addSuffix: function(name, suffixID)
    {
        return name + "_FC_" + suffixID;
    }
};
/*****************************************************/
}});