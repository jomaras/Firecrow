/**
 * Created by Jomaras.
 * Date: 10.03.12.@20:02
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.GlobalObject = function(browser, documentFragment)
{
    try
    {
        this.__proto__ = new fcModel.Object(this);

        this.fcInternal = new fcModel.FcInternal(null, this);
        this.internalExecutor = new Firecrow.Interpreter.Simulator.InternalExecutor(this);

        Firecrow.Interpreter.Simulator.VariableObject.liftToVariableObject(this);

        this.arrayPrototype = new fcModel.ArrayPrototype(this);
        this.objectPrototype = new fcModel.ObjectPrototype(this);
        this.functionPrototype = new fcModel.FunctionPrototype(this);
        this.regExPrototype = new fcModel.RegExPrototype(this);
        this.stringPrototype = new fcModel.StringPrototype(this);

        this.stringFunction = new fcModel.StringFunction(this);
        this.arrayFunction = new fcModel.ArrayFunction(this);
        this.regExFunction = new fcModel.RegExFunction(this);
        this.emptyFunction = new fcModel.EmptyFunction(this);
        this.fcMath = new fcModel.Math(this);
        this.math = new fcModel.JsValue(this.fcMath, new fcModel.FcInternal(null, this.fcMath));
        this.document = new fcModel.Document(documentFragment, this);
        this.jsFcDocument = new fcModel.JsValue(this.document.documentFragment, new fcModel.FcInternal(null, this.document));
        this.browser = browser;

        this.addProperty("Array", this.arrayFunction , null);
        this.addProperty("RegExp", this.regExFunction, null);
        this.addProperty("String", this.stringFunction, null);
        this.addProperty("document",this.jsFcDocument, null);
        this.addProperty("Math",this.math, null);

        this.internalExecutor.expandInternalFunctions();

        this.identifierSlicingCriteria = [];

        this.registerSlicingCriteria = function(slicingCriteria)
        {
            if(slicingCriteria == null) { return; }

            this.identifierSlicingCriteria = [];

            for(var i = 0; i < slicingCriteria.length; i++)
            {
                var criterion = slicingCriteria[i];

                if(criterion.type == Firecrow.DependencyGraph.SlicingCriterion.TYPES.READ_IDENTIFIER)
                {
                    this.identifierSlicingCriteria.push(criterion);
                }
            }
        };

        this.checkIfSatisfiesIdentifierSlicingCriteria = function(codeConstruct)
        {
            if(codeConstruct == null) { return false; }
            if(this.identifierSlicingCriteria.length == 0) { return false; }

            for(var i = 0; i < this.identifierSlicingCriteria.length; i++)
            {
                var slicingCriterion = this.identifierSlicingCriteria[i];

                if(slicingCriterion.fileName != codeConstruct.loc.source) { continue; }
                //TODO - uncomment this!
                //if(slicingCriterion.lineNumber != codeConstruct.loc.start.line) { continue; }
                if(slicingCriterion.identifierName != codeConstruct.name) { continue; }

                return true;
            }

            return false;
        }

        this.evaluationPositionId = "root";
        this.getPreciseEvaluationPositionId = function() { return this.evaluationPositionId; } // + "-" + this.currentCommand.id; }
    }
    catch(e) { alert("Error when initializing global object:" + e); }
};

fcModel.GlobalObject.prototype = new fcModel.Object(null);
/*************************************************************************************/
}});