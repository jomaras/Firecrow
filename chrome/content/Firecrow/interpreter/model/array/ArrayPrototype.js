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
        this.initObject(globalObject, null, Array.prototype, globalObject.fcObjectPrototype);

        this.constructor = fcModel.ArrayPrototype;
        this.addProperty("__proto__", this.globalObject.fcObjectPrototype);

        fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty
            (
                propertyName,
                new fcModel.fcValue
                (
                    Array.prototype[propertyName],
                    fcModel.Function.createInternalNamedFunction(globalObject, propertyName, this),
                    null
                ),
                null,
                false
            );
        }, this);
    }
    catch(e) { fcModel.Array.notifyError("Error when creating array prototype:" + e); }
};

fcModel.ArrayPrototype.prototype = new fcModel.Object();

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