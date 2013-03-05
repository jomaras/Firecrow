FBL.ns(function() { with (FBL) {
/*************************************************************************************/
//https://developer.mozilla.org/en-US/docs/DOM/CanvasRenderingContext2D
var fcModel = Firecrow.Interpreter.Model;

fcModel.CanvasPrototype = function(globalObject)
{
    this.initObject(globalObject);
    this.constructor = fcModel.CanvasPrototype;

    ["getContext", "toDataURL", "toBlob"].forEach(function(propertyName)
    {
        this.addProperty
        (
            propertyName,
            new fcModel.fcValue
            (
                HTMLCanvasElement.prototype[propertyName],
                fcModel.Function.createInternalNamedFunction(globalObject, propertyName, this),
                null,
                null
            ),
            null,
            false
        );
    }, this);
};

fcModel.CanvasPrototype.prototype = new fcModel.Object();

fcModel.CanvasContext = function(globalObject, canvasContext, canvas)
{
    this.initObject(globalObject);
    this.addProperty("__proto__", this.globalObject.fcCanvasContextPrototype);
    this.constructor = fcModel.CanvasContext;

    this.canvasContext = canvasContext;
    this.canvas = canvas;
};

fcModel.CanvasContext.prototype = new fcModel.Object();

fcModel.CanvasContext.prototype.addJsProperty = function(propertyName, propertyValue, assignmentExpression)
{
    this.addProperty(propertyName, propertyValue, assignmentExpression);
    this.canvasContext[propertyName] = propertyValue.jsValue;

    this.canvas.elementModificationPoints.push({ codeConstruct: assignmentExpression, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});
    fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.canvas, this.globalObject, assignmentExpression);
};

fcModel.CanvasContextPrototype = function(globalObject)
{
    this.initObject(globalObject);

    this.addProperty("__proto__", this.globalObject.fcObjectPrototype);

    fcModel.CanvasContext.CONST.METHODS.forEach(function(propertyName)
    {
        this.addProperty
        (
            propertyName,
            new fcModel.fcValue
            (
                CanvasRenderingContext2D.prototype[propertyName],
                fcModel.Function.createInternalNamedFunction(globalObject, propertyName, this),
                null
            ),
            null,
            false
        );
    }, this);
};

fcModel.CanvasContextPrototype.prototype = new fcModel.Object();

fcModel.CanvasContext.CONST =
{
    METHODS:
    [
        "arc", "arcTo", "beginPath", "bezierCurveTo", "clearRect", "clip", "closePath", "createImageDate", "createLinearGradient",
        "createPattern", "createRadialGradient", "drawImage", "drawCustomFocusRing", "fill", "fillRect", "fillText", "getImageData",
        "getLineDash", "isPointInPath", "lineTo", "measureText", "moveTo", "putImageData", "quadraticCurveTo", "rect", "restore",
        "rotate", "save", "scale", "scrollPathIntoView", "setLineDash", "setTransform", "stroke", "strokeRect", "strokeText",
        "transform", "translate"
    ]
}

fcModel.CanvasExecutor =
{
    executeCanvasMethod: function(thisObject, functionObject, args, callExpression)
    {
        var functionObjectValue = functionObject.jsValue;
        var thisObjectValue = thisObject.jsValue;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.iValue;
        var globalObject = fcThisValue.globalObject;
        var jsArguments =  args.map(function(argument){ return argument.jsValue;});

        if(functionName == "getContext")
        {
            var jsCanvasContext = thisObjectValue.getContext.apply(thisObjectValue, jsArguments);

            return new fcModel.fcValue(jsCanvasContext, new fcModel.CanvasContext(globalObject, jsCanvasContext, thisObjectValue), callExpression);
        }
    }
};

fcModel.CanvasContextExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, args, callExpression)
    {
        var functionObjectValue = functionObject.jsValue;
        var thisObjectValue = thisObject.jsValue;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.iValue;
        var globalObject = fcThisValue.globalObject;
        var jsArguments =  args.map(function(argument){ return argument.jsValue;});

        try
        {
            var result = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
        }
        catch(e)
        {
            //TODO - drawImage fails if the image is not loaded - and since where the model is executed
            //and where the image points to is not in the same location - the image can not be loaded
            //and draw image returns an exception!
            //console.log(e);
        }

        if(functionName == "createLinearGradient")
        {
            return new fcModel.fcValue(result, new fcModel.LinearGradient(globalObject, thisObjectValue, thisObject.iValue.canvas, result), callExpression, null);
        }
        else if (functionName == "createRadialGradient")
        {
            return new fcModel.fcValue(result, new fcModel.CanvasGradient(globalObject, thisObjectValue, thisObject.iValue.canvas, result), callExpression, null);
        }
        else if (functionName == "getImageData")
        {
            return new fcModel.fcValue(result, new fcModel.ImageData(globalObject, thisObjectValue, thisObject.iValue.canvas, result), callExpression, null);
        }
        else
        {
            thisObject.iValue.canvas.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
            fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObject.iValue.canvas, globalObject, callExpression);

            return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression);
        }
    }
};

fcModel.LinearGradient = function(globalObject, canvasContext, canvas, linearGradient)
{
    this.initObject(globalObject);
    this.constructor = fcModel.LinearGradient;

    this.canvasContext = canvasContext;
    this.canvas = canvas;
    this.linearGradient = linearGradient;

    this.addProperty
    (
        "addColorStop", new fcModel.fcValue(this.linearGradient.addColorStop, fcModel.Function.createInternalNamedFunction(globalObject, "addColorStop", this), null),
        null,
        false
    );
};

fcModel.LinearGradient.prototype = new fcModel.Object();

fcModel.LinearGradient.prototype.addJsProperty = function(propertyName, propertyValue, assignmentExpression)
{
    this.addProperty(propertyName, propertyValue, assignmentExpression);
    this.linearGradient[propertyName] = propertyValue.jsValue;

    this.canvas.elementModificationPoints.push({ codeConstruct: assignmentExpression, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});
    fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.canvas, this.globalObject, assignmentExpression);
};

fcModel.LinearGradientExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, args, callExpression)
    {
        var functionObjectValue = functionObject.jsValue;
        var thisObjectValue = thisObject.jsValue;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.iValue;
        var globalObject = fcThisValue.globalObject;
        var jsArguments =  args.map(function(argument){ return argument.jsValue;});

        thisObjectValue[functionName].apply(thisObjectValue, jsArguments);

        thisObject.iValue.canvas.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
        fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObject.iValue.canvas, globalObject, callExpression);

        return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression);
    }
};

fcModel.CanvasGradient = function(globalObject, canvasContext, canvas, canvasGradient)
{
    this.initObject(globalObject);
    this.constructor = fcModel.CanvasGradient;

    this.canvasContext = canvasContext;
    this.canvas = canvas;
    this.canvasGradient = canvasGradient;

    this.addProperty
    (
        "addColorStop", new fcModel.fcValue(this.canvasGradient.addColorStop, fcModel.Function.createInternalNamedFunction(globalObject, "addColorStop", this), null),
        null,
        false
    );
};

fcModel.CanvasGradient.prototype = new fcModel.Object();

fcModel.CanvasGradient.prototype.addJsProperty = function(propertyName, propertyValue, assignmentExpression)
{
    this.addProperty(propertyName, propertyValue, assignmentExpression);
    this.canvasGradient[propertyName] = propertyValue.jsValue;

    this.canvas.elementModificationPoints.push({ codeConstruct: assignmentExpression, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});
    fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.canvas, this.globalObject, assignmentExpression);
};

fcModel.CanvasGradientExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, args, callExpression)
    {
        var functionObjectValue = functionObject.jsValue;
        var thisObjectValue = thisObject.jsValue;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.iValue;
        var globalObject = fcThisValue.globalObject;
        var jsArguments =  args.map(function(argument){ return argument.jsValue;});

        thisObjectValue[functionName].apply(thisObjectValue, jsArguments);

        thisObject.iValue.canvas.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
        fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObject.iValue.canvas, globalObject, callExpression);

        return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression);
    }
};

fcModel.ImageData = function(globalObject, canvasContext, canvas, imageData)
{
    this.initObject(globalObject);
    this.constructor = fcModel.ImageData;

    this.canvasContext = canvasContext;
    this.canvas = canvas;
    this.imageData = imageData;

    this.addProperty("data")

    this.addProperty
    (
        "addColorStop", new fcModel.fcValue(this.canvasGradient.addColorStop, fcModel.Function.createInternalNamedFunction(globalObject, "addColorStop", this), null),
        null,
        false
    );
};

fcModel.CanvasGradient.prototype = new fcModel.Object();

fcModel.CanvasGradient.prototype.addJsProperty = function(propertyName, propertyValue, assignmentExpression)
{
    this.addProperty(propertyName, propertyValue, assignmentExpression);
    this.canvasGradient[propertyName] = propertyValue.jsValue;

    this.canvas.elementModificationPoints.push({ codeConstruct: assignmentExpression, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});
    fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.canvas, this.globalObject, assignmentExpression);
};

/*************************************************************************************/
}});