/**
 * User: Jomaras
 * Date: 07.05.12.
 * Time: 09:56
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.ObjectExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, arguments, callExpression)
    {
        try
        {
            if(thisObject.value === undefined && functionObject.value.name == "hasOwnProperty")
            {
                //TODO - jQuery hack
                return new fcModel.JsValue(true, new fcModel.FcInternal());
            }

            return new fcModel.JsValue
            (
                Object.prototype[functionObject.value.name].apply(thisObject.value, arguments.map(function(item){return item.value})),
                new fcModel.FcInternal(callExpression)
            );
        }
        catch(e)
        {
            Firecrow.Interpreter.Model.Object.notifyError("Error when executing internal method:" + e);
        }
    }
};

/*************************************************************************************/
}});