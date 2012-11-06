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
    this.globalObject = globalObject;

    this.__proto__ = new fcModel.Object(globalObject);

    fcModel.ObjectPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
    {
        var internalFunction = globalObject.internalExecutor.createInternalFunction(Object.prototype[propertyName], propertyName, this);
        this[propertyName] = internalFunction;
        this.addProperty(propertyName, internalFunction, null, false);
    }, this);

    this.fcInternal = { object: this };
};

fcModel.ObjectPrototype.prototype = new fcModel.Object(null);

fcModel.ObjectPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["toString", "hasOwnProperty", "isPrototypeOf"]
    }
};
/*************************************************************************************/
}});