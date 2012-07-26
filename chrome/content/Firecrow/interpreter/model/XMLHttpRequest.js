/**
 * User: Jomaras
 * Date: 26.07.12.
 * Time: 16:21
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
fcModel.XMLHttpRequestFunction = function(globalObject)
{
    this.__proto__ = new fcModel.Object(globalObject);

    this.isInternalFunction = true;
    this.name = "XMLHttpRequest";
    this.fcInternal = { object: this };
};
/*************************************************************************************/
}});