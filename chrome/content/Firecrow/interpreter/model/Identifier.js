/**
 * Created by Jomaras.
 * Date: 10.03.12.@09:49
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ASTHelper = Firecrow.ASTHelper;
var fcModel = Firecrow.Interpreter.Model;

fcModel.Identifier = function(name, value, codeConstruct, globalObject)
{
    try
    {
        this.id = fcModel.Identifier.LAST_ID++;

        this.name = name;
        this.value = value;
        this.globalObject = globalObject;

        this.modificationConstructs = [];
        this.lastModificationPosition = null;

        if(codeConstruct != null)
        {
            this.declarationConstruct = { codeConstruct: codeConstruct, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()};

            if(ASTHelper.isObjectExpressionPropertyValue(codeConstruct))
            {
                this.lastModificationPosition = { codeConstruct: codeConstruct.value, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()};
            }
            else
            {
                this.lastModificationPosition = this.declarationConstruct;
            }

            this.modificationConstructs.push(this.declarationConstruct);
        }
    }
    catch(e) { fcModel.Identifier.notifyError("Error when constructing: " + e ); }
};

Firecrow.Interpreter.Model.Identifier.notifyError = function(message) { alert("Identifier - " + message); };

Firecrow.Interpreter.Model.Identifier.prototype =
{
    setValue: function(newValue, modificationConstruct)
    {
        try
        {
            this.value = newValue;

            if(modificationConstruct != null)
            {
                this.lastModificationPosition = { codeConstruct: modificationConstruct, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()};
                this.modificationConstructs.push({ codeConstruct: modificationConstruct, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});
            }
        }
        catch(e) { Firecrow.Interpreter.Model.Identifier.notifyError("Error when setting value: " + e); }
    }
};

Firecrow.Interpreter.Model.Identifier.LAST_ID = 0;
/****************************************************************************/
}});