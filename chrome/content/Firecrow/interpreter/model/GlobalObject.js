/**
 * Created by Jomaras.
 * Date: 10.03.12.@20:02
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const fcModel = Firecrow.Interpreter.Model;
const fcInternals = fcModel.Internals;

Firecrow.Interpreter.Model.GlobalObject = function()
{
    this.__proto__ = new fcModel.Object(this);

    this.stringFunction = new fcInternals.StringFunction(this);
    this.__FIRECROW_INTERNAL__ = {object:this};

    Firecrow.Interpreter.Simulator.VariableObject.liftToVariableObject(this);
};

Firecrow.Interpreter.Model.GlobalObject.prototype = new fcModel.Object(null);

fcModel.GlobalObject.getGlobalVariableObject = function()
{
    return this;
};

fcModel.GlobalObject.prototype.getStringFunction = function()
{
     return this.stringFunction;
};

fcModel.GlobalObject.prototype.getEmptyFunction = function()
{

};

fcModel.GlobalObject.prototype.getNativeObjectFunction = function()
{

};

fcModel.GlobalObject.prototype.getMathFunction = function()
{

};

fcModel.GlobalObject.prototype.getArrayFunction = function()
{

};

fcModel.GlobalObject.prototype.getArrayFunction = function()
{

};

fcModel.GlobalObject.prototype.getRegExpFunction = function()
{

};

fcModel.GlobalObject.prototype.getNavigator = function()
{

};

fcModel.GlobalObject.prototype.getImageFunction = function()
{

};

fcModel.GlobalObject.prototype.getDateFunction = function()
{

};

fcModel.GlobalObject.prototype.getNumberFunction = function()
{

};

fcModel.GlobalObject.prototype.getXmlHttpRequestFunction = function()
{

};
/*************************************************************************************/
}});