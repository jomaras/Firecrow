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

                 if(callbackFunctionValue.name == "filter") { this._evaluateFilterCallback(targetObject, returnValue, callbackCommand, returnExpression); return; }
            else if(callbackFunctionValue.name == "map") { this._evaluateMapCallback(targetObject, returnValue, returnExpression); return; }
            else if(callbackFunctionValue.name == "sort") { this._evaluateSortCallback(targetObject, returnValue, callbackCommand, returnExpression); return;}
            else if(callbackFunctionValue.name == "every") { fcModel.Array.notifyError("Still not handling evaluate return from every"); return; }
            else if(callbackFunctionValue.name == "some") { fcModel.Array.notifyError("Still not handling evaluate return from some"); return; }
            else if(callbackFunctionValue.name == "reduce") { fcModel.Array.notifyError("Still not handling evaluate return from reduce"); return; }
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

    _evaluateFilterCallback: function(targetObject, returnValue, callbackCommand, returnExpression)
    {
        var targetObjectValue = targetObject.jsValue;

        if(!ValueTypeHelper.isArray(targetObjectValue)) { fcModel.Array.notifyError("A new array should be created when calling filter: "); return; }

        if(returnValue != null && returnValue.jsValue)
        {
            targetObject.iValue.push(targetObjectValue, [callbackCommand.arguments[0]], returnExpression.argument);
        }
    },

    _evaluateMapCallback: function(targetObject, returnValue, returnExpression)
    {
        var targetObjectValue = targetObject.jsValue;

        if(!ValueTypeHelper.isArray(targetObjectValue)) { fcModel.Array.notifyError("A new array should be created when calling filter: "); return; }

        targetObject.iValue.push(targetObjectValue, [returnValue], returnExpression.argument);
    },

    _evaluateSortCallback: function(targetObject, returnValue, callbackCommand, returnExpression)
    {
        var firstItem = callbackCommand.arguments[0];
        var secondItem = callbackCommand.arguments[1];

        var firstItemIndex = targetObject.jsValue.indexOf(firstItem);
        var secondItemIndex = targetObject.jsValue.indexOf(secondItem);

        targetObject.iValue.addModification(returnExpression);
        targetObject.iValue.addModification(callbackCommand.callCallbackCommand.codeConstruct);

        //if return value = 0 -> leave a and b unchanged
        if(returnValue.jsValue == 0) { return; }
        //if return value < 0 -> sort a to lower index than b;
        if(returnValue.jsValue < 0 && firstItemIndex <= secondItemIndex) { return; }
        //if return value > 0 -> sort b to lower index than a
        if(returnValue.jsValue > 0 && secondItemIndex <= firstItemIndex) { return; }

        this._swapArrayIndexes(targetObject, firstItemIndex, secondItemIndex, returnExpression);

        if(firstItemIndex + 1 < secondItemIndex)
        {
            this._swapArrayIndexes(targetObject, firstItemIndex + 1, secondItemIndex, returnExpression);
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