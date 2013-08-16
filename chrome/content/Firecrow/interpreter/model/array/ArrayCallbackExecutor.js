FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
fcModel.ArrayCallbackEvaluator =
{
    evaluateCallbackReturn: function(callbackCommand, returnValue, returnExpression)
    {
        try
        {
            var originatingObject = callbackCommand.originatingObject;

            if(!ValueTypeHelper.isArray(originatingObject.jsValue)) { fcModel.Array.notifyError("When evaluating callback return the argument has to be an array!"); return; }

            var callbackFunctionValue = callbackCommand.callerFunction.jsValue;
            var targetObject = callbackCommand.targetObject;

            var valueCodeConstruct = returnExpression;

            if(valueCodeConstruct == null) { valueCodeConstruct = returnValue.codeConstruct; }

                 if(callbackFunctionValue.name == "filter") { this._evaluateFilterCallback(targetObject, returnValue, callbackCommand, valueCodeConstruct); return; }
            else if(callbackFunctionValue.name == "map") { this._evaluateMapCallback(targetObject, returnValue, valueCodeConstruct); return; }
            else if(callbackFunctionValue.name == "sort") { this._evaluateSortCallback(targetObject, returnValue, callbackCommand, valueCodeConstruct); return;}
            else if(callbackFunctionValue.name == "every") { this._evaluateEveryCallback(targetObject, returnValue, callbackCommand, valueCodeConstruct); return; }
            else if(callbackFunctionValue.name == "some") { fcModel.Array.notifyError("Still not handling evaluate return from some"); return; }
            else if(callbackFunctionValue.name == "reduce") { this._evaluateReduceCallback(targetObject, returnValue, callbackCommand, valueCodeConstruct); return; }
            else if(callbackFunctionValue.name == "reduceRight") { fcModel.Array.notifyError("Still not handling evaluate return from reduceRight"); return; }
            else if(callbackFunctionValue.name == "forEach") { }
            else
            {
                debugger;
                fcModel.Array.notifyError("Unknown callbackFunction!");
            }
        }
        catch(e)
        {
            debugger;
            fcModel.Array.notifyError("Error when evaluating callback return!");
        }
    },

    _evaluateFilterCallback: function(targetObject, returnValue, callbackCommand, valueExpression)
    {
        var targetObjectValue = targetObject.jsValue;

        if(!ValueTypeHelper.isArray(targetObjectValue)) { fcModel.Array.notifyError("A new array should be created when calling filter: "); return; }

        if(returnValue != null && returnValue.jsValue)
        {
            targetObject.iValue.push(targetObjectValue, [callbackCommand.arguments[0]], valueExpression.argument || valueExpression);
        }
    },

    _evaluateMapCallback: function(targetObject, returnValue, valueExpression)
    {
        var targetObjectValue = targetObject.jsValue;

        if(!ValueTypeHelper.isArray(targetObjectValue)) { fcModel.Array.notifyError("A new array should be created when calling filter: "); return; }

        targetObject.iValue.push(targetObjectValue, [returnValue], valueExpression.argument || valueExpression);
    },

    _evaluateReduceCallback: function(targetObject, returnValue, callbackCommand, valueExpression)
    {
        var parentCommand = callbackCommand.parentInitCallbackCommand;
        var nextCommand = parentCommand.childCommands[callbackCommand.index + 1];

        if(nextCommand != null)
        {
            nextCommand.arguments[0] = returnValue;
        }
        else
        {
            parentCommand.originatingObject.iValue.globalObject.executionContextStack.setExpressionValueInPreviousContext(parentCommand.codeConstruct, returnValue);
        }
    },

    _evaluateSortCallback: function(targetObject, returnValue, callbackCommand, valueExpression)
    {
        var firstItem = callbackCommand.arguments[0];
        var secondItem = callbackCommand.arguments[1];

        var firstItemIndex = targetObject.jsValue.indexOf(firstItem);
        var secondItemIndex = targetObject.jsValue.indexOf(secondItem);

        targetObject.iValue.addModification(valueExpression);
        targetObject.iValue.addModification(callbackCommand.callCallbackCommand.codeConstruct);

        //if return value = 0 -> leave a and b unchanged
        if(returnValue.jsValue == 0) { return; }
        //if return value < 0 -> sort a to lower index than b;
        if(returnValue.jsValue < 0 && firstItemIndex <= secondItemIndex) { return; }
        //if return value > 0 -> sort b to lower index than a
        if(returnValue.jsValue > 0 && secondItemIndex <= firstItemIndex) { return; }

        this._swapArrayIndexes(targetObject, firstItemIndex, secondItemIndex, valueExpression);

        if(firstItemIndex + 1 < secondItemIndex)
        {
            this._swapArrayIndexes(targetObject, firstItemIndex + 1, secondItemIndex, valueExpression);
        }
    },

    _evaluateEveryCallback: function(targetObject, returnValue, callbackCommand)
    {
        var parentCommand = callbackCommand.parentInitCallbackCommand;
        parentCommand.originatingObject.iValue.globalObject.executionContextStack.setExpressionValueInPreviousContext(parentCommand.codeConstruct, returnValue);

        if(!returnValue.jsValue)
        {
            parentCommand.originatingObject.iValue.globalObject.browser.interpreter.removeOtherCallbackCommands(parentCommand)
        }
    },

    _swapArrayIndexes: function(arrayFcObject, indexA, indexB, modificationExpression)
    {
        var temp = arrayFcObject.jsValue[indexA];
        arrayFcObject.jsValue[indexA] = arrayFcObject.jsValue[indexB];
        arrayFcObject.jsValue[indexB] = temp;

        var temp = arrayFcObject.iValue.items[indexA];
        arrayFcObject.iValue.items[indexA] = arrayFcObject.iValue.items[indexB];
        arrayFcObject.iValue.items[indexB] = temp;

        arrayFcObject.iValue.addProperty(indexA, arrayFcObject.jsValue[indexA], modificationExpression, true);
        arrayFcObject.iValue.addProperty(indexB, arrayFcObject.jsValue[indexB], modificationExpression, true);
    }
};
/*************************************************************************************/
}});