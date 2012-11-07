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

            if(!ValueTypeHelper.isArray(originatingObject.value)) { fcModel.Array.notifyError("When evaluating callback return the argument has to be an array!"); return; }

            var callbackFunctionValue = callbackCommand.callerFunction.value;
            var targetObject = callbackCommand.targetObject;
            var targetObjectValue = targetObject.value;

            if(callbackFunctionValue.name == "filter")
            {
                if(!ValueTypeHelper.isArray(targetObjectValue)) { fcModel.Array.notifyError("A new array should be created when calling filter: " + e); return; }

                if(returnValue != null && returnValue.value)
                {
                    targetObject.fcInternal.object.push(targetObjectValue, [callbackCommand.arguments[0]], returnExpression.argument);
                }
            }
            else if(callbackFunctionValue.name == "map")
            {
                if(!ValueTypeHelper.isArray(targetObjectValue)) { fcModel.Array.notifyError("A new array should be created when calling filter: " + e); return; }

                targetObject.fcInternal.object.push(targetObjectValue, [returnValue], returnExpression.argument);
            }
            else if(callbackFunctionValue.name == "forEach") { }
            else if(callbackFunctionValue.name == "sort") { fcModel.Array.notifyError("Still not handling evaluate return from sort!"); return; }
            else if(callbackFunctionValue.name == "every") { fcModel.Array.notifyError("Still not handling evaluate return from every"); return; }
            else if(callbackFunctionValue.name == "some") { fcModel.Array.notifyError("Still not handling evaluate return from some"); return; }
            else if(callbackFunctionValue.name == "reduce") { fcModel.Array.notifyError("Still not handling evaluate return from reduce"); return; }
            else if(callbackFunctionValue.name == "reduceRight") { fcModel.Array.notifyError("Still not handling evaluate return from reduceRight"); return; }
            else
            {
                fcModel.Array.notifyError("Unknown callbackFunction!");
            }
        }
        catch(e)
        {
            fcModel.Array.notifyError("Error when evaluating callback return!");
        }
    }
};
/*************************************************************************************/
}});