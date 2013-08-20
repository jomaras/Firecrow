FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
fcModel.ObjectFunction = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.addProperty("prototype", globalObject.fcObjectPrototype);

        this.isInternalFunction = true;
        this.name = "Object";

        fcModel.ObjectFunction.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty
            (
                propertyName,
                new fcModel.fcValue
                (
                    Object[propertyName],
                    fcModel.Function.createInternalNamedFunction(globalObject, propertyName, this),
                    null
                ),
                null,
                false
            );
        }, this);
    }
    catch(e){ fcModel.Object.notifyError("Error when creating Object Function:" + e); }
};

fcModel.ObjectFunction.prototype = new fcModel.Object();

fcModel.ObjectFunction.CONST =
{
    INTERNAL_PROPERTIES:
    {
        METHODS:
        [
            "create", "defineProperty", "defineProperties", "getOwnPropertyDescriptor",
            "keys", "getOwnPropertyNames", "getPrototypeOf", "preventExtensions", "seal",
            "isSealed", "freeze", "isFrozen", "isExtensible", "propertyIsEnumerable"
        ]
    }
};
/*************************************************************************************/
}});