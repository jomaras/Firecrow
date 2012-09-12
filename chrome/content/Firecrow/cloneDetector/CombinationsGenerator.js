/**
 * User: Jomaras
 * Date: 22.07.12.
 * Time: 21:42
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/

var fcValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.CloneDetector.CombinationsGenerator =
{
    generateCombinations: function(endNumber)
    {
        var combinations = [];

        if(endNumber <= 0) { return []; }

        for(var windowSize = 1; windowSize <= endNumber; windowSize++)
        {
            fcValueTypeHelper.pushAll(combinations, this.generateCombinationsInWindow(endNumber, windowSize));
        }

        return combinations;
    },

    generateCombinationsInWindow: function(endNumber, windowSize)
    {
        var combinations = [];

        for(var i = 0; i <= endNumber - windowSize; i++)
        {
            var combination = [];

            for(var j = i; j < i + windowSize; j++)
            {
                combination.push(j);
            }

            combinations.push(combination);
        }

        return combinations;
    }
};
/*************************************************************************************/
}});