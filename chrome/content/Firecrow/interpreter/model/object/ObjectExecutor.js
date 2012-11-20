/**
 * User: Jomaras
 * Date: 06.11.12.
 * Time: 08:50
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
                return new fcModel.fcValue(true, true, null);
            }

            return new fcModel.fcValue
            (
                Object.prototype[functionObject.value.name].apply(thisObject.value, arguments.map(function(item){return item.value})),
                null,
                callExpression
            );
        }
        catch(e)
        {
            fcModel.Object.notifyError("Error when executing internal method:" + e);
        }
    }
};
/*************************************************************************************/
}});