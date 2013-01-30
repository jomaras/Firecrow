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
            thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
        }
        catch(e)
        {
            //TODO - drawImage fails if the image is not loaded - and since where the model is executed
            //and where the image points to is not in the same location - the image can not be loaded
            //and draw image returns an exception!
            //console.log(e);
        }

        thisObject.iValue.canvas.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
        fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObject.iValue.canvas, globalObject, callExpression);

        return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression);
    }
};
/*************************************************************************************/
}});