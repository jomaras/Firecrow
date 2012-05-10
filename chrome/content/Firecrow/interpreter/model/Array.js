/**
 * User: Jomaras
 * Date: 10.05.12.
 * Time: 09:56
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const fcModel = Firecrow.Interpreter.Model;
const ValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.Interpreter.Model.Array = function(globalObject, codeConstruct)
{
     this.items = [];
};

Firecrow.Interpreter.Model.Array.prototype = new Firecrow.Interpreter.Model.Object(null);

Firecrow.Interpreter.Model.Array.prototype.push = function(item, codeConstruct)
{
    this.items.push(item);
    this.addProperty(this.items.length - 1, item, codeConstruct);
}
}});
