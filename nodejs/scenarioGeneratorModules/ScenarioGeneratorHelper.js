var ScenarioGeneratorHelper =
{
    uiControlEventPriority: 0.4,

    endsWithSuffix: function(name, suffixID)
    {
        return name.match(new RegExp("_FC_" + suffixID + "$")) != null;
    },

    addSuffix: function(name, suffixID)
    {
        return name + "_FC_" + suffixID;
    },

    replaceSuffix: function(value, replacementArgument)
    {
        return value.replace(/_FC_([0-9+])/gi, replacementArgument)
    },

    removeSuffix: function(name)
    {
        var indexOfFcStart = name.indexOf("_FC_");

        if(indexOfFcStart == -1) { return name; }

        return name.substr(0, indexOfFcStart);
    },

    updatePropertyNameWithNewIndex: function(name, newNumber)
    {
        return this.replaceSuffix(name, function(match, number)
        {
            if(number !== undefined)
            {
                return match.replace(number, newNumber);
            }

            return match;
        });
    },

    addToPropertyName: function(name, increment)
    {
        return this.replaceSuffix(name, function(match, number)
        {
            if(number !== undefined)
            {
                return match.replace(number, parseInt(number) + increment);
            }

            return match;
        });
    }
};

exports.ScenarioGeneratorHelper = ScenarioGeneratorHelper;
