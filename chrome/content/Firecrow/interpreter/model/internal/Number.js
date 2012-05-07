/**
 * Created by Jomaras.
 * Date: 23.03.12.@13:20
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const ValueTypeHelper = Firecrow.ValueTypeHelper;
const fcModelInternals = Firecrow.Interpreter.Model.Internals;
const fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Model.Internals.NumberFunction = function(globalObject)
{
    this._prototype = new fcModelInternals.NumberObjectPrototype(globalObject);

    this.addProperty("MAX_VALUE", new fcModelInternals.NumberObject(globalObject, null, Number.MAX_VALUE));
    this.addProperty("MIN_VALUE", new fcModelInternals.NumberObject(globalObject, null, Number.MIN_VALUE));

    this.addProperty("NaN", new fcModelInternals.NumberObject(globalObject, null, Number.NaN));

    this.addProperty("NEGATIVE_INFINITY", new fcModelInternals.NumberObject(globalObject, null, Number.NEGATIVE_INFINITY));
    this.addProperty("POSITIVE_INFINITY", new fcModelInternals.NumberObject(globalObject, null, Number.POSITIVE_INFINITY));
};

Firecrow.Interpreter.Model.Internals.NumberObject = function(globalObject, codeConstruct, value)
{
    this.__proto__ = new fcModel.Object(globalObject, codeConstruct);
    this.value = value || false;

    this.proto = globalObject.getNumberFunction()._prototype;

    this.executeMethod = function(method, arguments, callConstruct)
    {
        this.proto.executeMethod(this, method, arguments, callConstruct);
    };
}

Firecrow.Interpreter.Model.Internals.NumberObjectPrototype = function(globalObject)
{
    this.__proto__ = new fcModel.Object(globalObject);

    this.methods =
    [
        "toExponential","toFixed","toLocaleString",
        "toPrecision","toSource","toString", "valueOf"
    ];

    this.internalMethods = this.methods.map(function(methodName)
    {
        return fcModel.FunctionObject.createNativeFunction(methodName, globalObject);
    });

    this.internalMethods.forEach(function(internalMethod)
    {
        this.addProperty(internalMethod.name, internalMethod, null, false);
    });

    this.executeMethod = function(numberObject, method, arguments, callConstruct)
    {
        try
        {
            if(this.internalMethods.indexOf(method) != -1)
            {
                if(arguments.length == 0)
                {
                    return new fcModelInternals.StringObject(globalObject, callConstruct, numberObject.value[method.name]());
                }
                else
                {
                    return new fcModelInternals.StringObject(globalObject, callConstruct, numberObject.value[method.name](arguments[0].value));
                }
            }
            else
            {
                alert("Number - there is no such method: " + method.name);
            }
        }
        catch(e) { alert("Error when  - :" + e);}
    };
}
/*************************************************************************************/
}});