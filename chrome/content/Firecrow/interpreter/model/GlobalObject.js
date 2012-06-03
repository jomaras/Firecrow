/**
 * Created by Jomaras.
 * Date: 10.03.12.@20:02
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var fcInternals = fcModel.Internals;

fcModel.GlobalObject = function()
{
    try
    {
        this.__proto__ = new fcModel.Object(this);

        this.stringFunction = new fcInternals.StringFunction(this);
        this.fcInternal = {object:this};

        Firecrow.Interpreter.Simulator.VariableObject.liftToVariableObject(this);

        this.arrayPrototype = new fcModel.ArrayPrototype(this);
        this.objectPrototype = new fcModel.ObjectPrototype(this);
        this.functionPrototype = new fcModel.FunctionPrototype(this);
        this.arrayFunction = new fcModel.ArrayFunction(this);
        this.emptyFunction = new fcModel.EmptyFunction(this);

        this.addProperty("Array", this.arrayFunction, null);
    }
    catch(e) { alert("Error when initializing global object:" + e); }
};

fcModel.GlobalObject.prototype = new fcModel.Object(null);
/*************************************************************************************/
}});