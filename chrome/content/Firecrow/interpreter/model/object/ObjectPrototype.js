/**
 * User: Jomaras
 * Date: 06.11.12.
 * Time: 08:34
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.ObjectPrototype = function(globalObject)
{
    this.initObject(globalObject);
};

fcModel.ObjectPrototype.prototype = new fcModel.Object();
fcModel.ObjectPrototype.prototype.initMethods = function()
{
    fcModel.ObjectPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
    {
        this.addProperty
        (
            propertyName,
            new fcModel.fcValue
            (
                Object.prototype[propertyName],
                fcModel.Function.createInternalNamedFunction(this.globalObject, propertyName, this),
                null
            ),
            null,
            false
        );
    }, this);
}

fcModel.ObjectPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["toString", "hasOwnProperty", "isPrototypeOf"]
    }
};
/*************************************************************************************/
}});