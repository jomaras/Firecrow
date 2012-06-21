/**
 * Created by Jomaras.
 * Date: 10.03.12.@09:49
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ASTHelper = Firecrow.ASTHelper;
var fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Model.Identifier = function(name, value, codeConstruct, globalObject)
{
    try
    {
        this.id = fcModel.Identifier.LAST_IDENTIFIER_ID++;
        this.name = name;
        this.value = value;
        this.modificationConstructs = [];
        this.lastModificationConstruct = null;
        this.globalObject = globalObject;

        if(codeConstruct != null)
        {
            this.declarationConstruct = { codeConstruct: codeConstruct, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()};

            if(ASTHelper.isVariableDeclarator(codeConstruct)) {}
            if(ASTHelper.isObjectExpressionPropertyValue(codeConstruct))
            {
                this.lastModificationConstruct = { codeConstruct: codeConstruct.value, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()};
            }
            else
            {
                this.lastModificationConstruct = this.declarationConstruct;
            }

            this.modificationConstructs.push(this.declarationConstruct);
        }
    }
    catch(e) { alert("Identifier - Error when constructing: " + e ); }
};

Firecrow.Interpreter.Model.Identifier.prototype =
{
    setValue: function(newValue, modificationConstruct)
    {
        try
        {
            this.value = newValue;

            if(modificationConstruct != null)
            {
                this.lastModificationConstruct = { codeConstruct: modificationConstruct, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()};
                this.modificationConstructs.push({ codeConstruct: modificationConstruct, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});
            }
        }
        catch(e) { alert("Identifier - Error when setting value: " + e); }
    }
};

Firecrow.Interpreter.Model.Identifier.LAST_IDENTIFIER_ID = 0;
/****************************************************************************/
}});