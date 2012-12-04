FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
fcModel.EventListenerMixin =
{
    addEventListener: function(args, callExpression, globalObject)
    {
        try
        {
            if(args.length < 2) { fcModel.Object.notifyError("Too few arguments when executing addEventListener"); return; }
            if(this.eventListenerInfo == null) { this.eventListenerInfo = {}; }

            var eventTypeName = args[0].jsValue;
            var handler = args[1];

            if(this.eventListenerInfo[eventTypeName] == null) { this.eventListenerInfo[eventTypeName] = []; }

            this.eventListenerInfo[eventTypeName].push
            ({
                handler: handler,
                thisObject: this,
                registrationPoint:
                {
                    codeConstruct: callExpression,
                    evaluationPositionId: globalObject.getPreciseEvaluationPositionId()
                },
                eventType: eventTypeName
            });
        }
        catch(e) { fcModel.Object.notifyError("Error when adding event listener: " + e); }
    },

    removeEventListener: function(args, callExpression, globalObject)
    {
        try
        {
            if(args.length < 2) { fcModel.Object.notifyError("Too few arguments when executing addEventListener"); return;}
            if(this.eventListenerInfo == null) { this.eventListenerInfo = {}; }

            var eventTypeName = args[0].jsValue;
            var handler = args[1].jsValue;

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
    },

    getEventListeners: function(eventName)
    {
        if(this.eventListenerInfo == null) { return []; }

        return this.eventListenerInfo[eventName] || [];
    }
};
/*************************************************************************************/
}});