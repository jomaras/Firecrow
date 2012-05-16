/**
 * Created by Jomaras.
 * Date: 10.03.12.@20:02
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const fcModel = Firecrow.Interpreter.Model;
const fcInternals = fcModel.Internals;

fcModel.GlobalObject = function()
{
    try
    {
        this.__proto__ = new fcModel.Object(this);

        this.stringFunction = new fcInternals.StringFunction(this);
        this.__FIRECROW_INTERNAL__ = {object:this};

        Firecrow.Interpreter.Simulator.VariableObject.liftToVariableObject(this);

        this.arrayPrototype = new fcModel.ArrayPrototype(this);
        this.arrayFunction = new fcModel.ArrayFunction(this);
        this.emptyFunction = new fcModel.EmptyFunction(this);

        this.addProperty("Array", this.arrayFunction, null);
    }
    catch(e) { }
};

fcModel.GlobalObject.prototype = new fcModel.Object(null);
/*************************************************************************************/
}});