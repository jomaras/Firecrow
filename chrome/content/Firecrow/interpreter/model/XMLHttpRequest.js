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
    this.initObject(globalObject);

    this.isInternalFunction = true;
    this.name = "XMLHttpRequest";
};

fcModel.XMLHttpRequestFunction.prototype = new fcModel.Object();
/*************************************************************************************/
}});