FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
fcModel.EventListenerMixin =
{
    expand: function(objectToExpand)
    {
        if(objectToExpand == null) { return; }

        objectToExpand.eventListenerInfo = {};
        objectToExpand.addEventListener = this.addEventListener;
        objectToExpand.removeEventListener = this.removeEventListener;
    },

    addEventListener: function(args, callExpression, globalObject)
    {
        try
        {
            if(args.length < 2) { fcModel.Object.notifyError("Too few arguments when executing addEventListener"); return; }

            var eventTypeName = args[0].value;
            var handler = args[1];

            if(this.eventListenerInfo[eventTypeName] == null) { this.eventListenerInfo[eventTypeName] = []; }

            this.eventListenerInfo[eventTypeName].push
            ({
                handler: handler,
                registrationPoint:
                {
                    codeConstruct: callExpression,
                    evaluationPositionId: globalObject.getPreciseEvaluationPositionId()
                }
            });
        }
        catch(e) { fcModel.Object.notifyError("Error when adding event listener: " + e); }
    },

    removeEventListener: function(args, callExpression, globalObject)
    {
        try
        {
            if(args.length < 2) { fcModel.Object.notifyError("Too few arguments when executing addEventListener"); return;}

            var eventTypeName = args[0].value;
            var handler = args[1].value;

            var eventHandlers = this.eventListenerInfo[eventTypeName];

            if(eventHandlers == null) { return; }

            for(var i = 0; i < eventHandlers.length; i++)
            {
                if(eventHandlers[i].handler === handler)
                {
                    ValueTypeHelper.removeFromArrayByIndex(eventHandlers, i);
                    i--;
                }
            }
        }
        catch(e) { fcModel.Object.notifyError ("Error when removing event listener: " + e); }
    }
};
/*************************************************************************************/
}});