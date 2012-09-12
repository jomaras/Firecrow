FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcValueTypeHelper = Firecrow.ValueTypeHelper;
var fcASTHelper = Firecrow.ASTHelper;

Firecrow.CloneDetector = {};

Firecrow.CloneDetector.CssCloneDetector =
{
    getPossibleClones: function(codeModel)
    {
        var cssRules = fcASTHelper.getCssRules(codeModel);

        var possibleClones = [];

        for(var i = 0; i < cssRules.length - 1; i++)
        {
            var iThRule = cssRules[i];

            for(var j = i + 1; j < cssRules.length; j++)
            {
                var jThRule = cssRules[j];

                var possibleClone = this.getPossibleClone(iThRule, jThRule);

                if(possibleClone != null)
                {
                    possibleClones.push(possibleClone);
                }
            }
        }

        possibleClones.sort(function(a, b)
        {
            return a.properties.length - b.properties.length;
        });

        return possibleClones;
    },

    getPossibleClone: function(iThRule, jThRule)
    {
        var ithProperties = iThRule.properties;
        var jthProperties = jThRule.properties;

        var sameProperties = {};

        for(var i = 0; i < ithProperties.length; i++)
        {
            var ithProperty = ithProperties[i];

            var foundProperty = this.findProperty(jThRule, ithProperty.key + ithProperty.value);

            if(foundProperty != null)
            {
                var foundPropertyKeyValue = foundProperty.key + foundProperty.value;
                if(sameProperties[foundPropertyKeyValue] == null)
                {
                    sameProperties[foundPropertyKeyValue] = foundProperty;
                }
            }
        }

        for(var j = 0; j < jthProperties.length; j++)
        {
            var jthProperty = jthProperties[j];
            var foundProperty = this.findProperty(iThRule, jthProperty.key + jthProperty.value);

            if(foundProperty != null)
            {
                var foundPropertyKeyValue = foundProperty.key + foundProperty.value;
                if(sameProperties[foundPropertyKeyValue] == null)
                {
                    sameProperties[foundPropertyKeyValue] = foundProperty;
                }
            }
        }

        var sharedProperties = [];

        for(var propName in sameProperties)
        {
            sharedProperties.push(sameProperties[propName]);
        }

        return sharedProperties.length > Firecrow.CloneDetector.CssCloneDetector.MIN_NUMBER_OF_RULES
            ? new Firecrow.CloneDetector.CssCloneDetector.CssCloneItem(iThRule, jThRule, sharedProperties)
            : null;
    },

    findProperty: function(cssRule, propertyNameValue)
    {
        if(cssRule == null || cssRule.properties == null) { return null; }

        var properties = cssRule.properties;

        for(var i = 0; i < properties.length; i++)
        {
            var property = properties[i];

            if(propertyNameValue == property.key + property.value)
            {
                return property;
            }
        }

        return null;
    }
};

Firecrow.CloneDetector.CssCloneDetector.MIN_NUMBER_OF_RULES = 5;

Firecrow.CloneDetector.CssCloneDetector.CssCloneItem = function(ruleA, ruleB, properties)
{
    this.ruleA = ruleA;
    this.ruleB = ruleB;
    this.properties = properties;

    this.ruleAShared = properties.length/ruleA.properties.length;
    this.ruleBShared = properties.length/ruleB.properties.length;
    this.jointShared = this.ruleAShared + this.ruleBShared;
};
/*************************************************************************************/
}});