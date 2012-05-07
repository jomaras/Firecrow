/**
 * Created by Jomaras.
 * Date: 11.03.12.@12:25
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const ValueTypeHelper = Firecrow.ValueTypeHelper;
const fcModelInternals = Firecrow.Interpreter.Model.Internals;
const fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Model.Internals.BooleanFunction = function(globalObject)
{
    this.__proto__ = fcModel.createNativeFunction("Boolean", globalObject, false);

    this._prototype = new fcModelInternals.BooleanObjectPrototype(globalObject);
    //TODO: proto not set!
    //TODO: not finished!
};

Firecrow.Interpreter.Model.Internals.BooleanObject = function(globalObject, codeConstruct, value)
{
    this.__proto__ = new fcModel.Object(globalObject, codeConstruct);
    this.value = value || false;
}

Firecrow.Interpreter.Model.Internals.BooleanObjectPrototype = function(globalObject)
{
    this.__proto__ = new fcModel.Object(globalObject);
}
/*************************************************************************************/
}});