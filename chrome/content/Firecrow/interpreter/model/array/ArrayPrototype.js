/**
 * User: Jomaras
 * Date: 06.11.12.
 * Time: 11:05
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.ArrayPrototype = function(globalObject)
{
    try
    {
        this.globalObject = globalObject;
        this.__proto__ = new fcModel.Object(globalObject);

        fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            var internalFunction = globalObject.internalExecutor.createInternalFunction(Array.prototype[propertyName], propertyName, this);
            this[propertyName] = internalFunction;
            this.addProperty(propertyName, internalFunction, null, false);
        }, this);

        this.fcInternal = { object: this };
    }
    catch(e) { fcModel.Array.notifyError("Error when creating array prototype:" + e); }
};

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array#Methods_2
fcModel.ArrayPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice","indexOf","lastIndexOf","filter","forEach","every","map","some","reduce","reduceRight", "toString"],
        CALLBACK_METHODS: ["filter", "forEach", "every", "map", "some", "reduce", "reduceRight"]
    }
};
/****************************************************************************************************/
}});