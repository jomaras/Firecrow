var path = require('path');

var ValueTypeHelper = require(path.resolve(__dirname, "ValueTypeHelper.js")).ValueTypeHelper;

var NumberRangeChain = function(chain)
{
    this.chain = chain || [];
};

NumberRangeChain.prototype =
{
    getFromRange: function()
    {
        if(this.chain.length == 0) { return null; }

        return this.chain[0].getFromRange();
    },

    appendChain: function(rangeChain, operator)
    {
        if(rangeChain == null || rangeChain.chain == null || rangeChain.chain.length == 0) { return; }

        if(operator == "&&")
        {
            this.chain = this._getChainIntersection(this.chain, rangeChain.chain);
        }
        else
        {
            ValueTypeHelper.pushAll(this.chain, rangeChain.chain);
        }
    },

    createCopy: function()
    {
        return new NumberRangeChain(this.chain.slice());
    },

    toString: function()
    {
        var string = "";

        for(var i = 0; i < this.chain.length; i++)
        {
            if(i != 0) { string += " || "; }
            string += this.chain[i];
        }

        return string;
    },

    _getChainIntersection: function(firstChain, secondChain)
    {
        var unionChain = [];

        for(var i = 0; i < firstChain.length; i++)
        {
            var firstRange = firstChain[i];

            for(var j = 0; j < secondChain.length; j++)
            {
                var secondRange = secondChain[j];

                var union = NumberRange.makeIntersection(firstRange, secondRange);

                if(union != null)
                {
                    ValueTypeHelper.pushAll(unionChain, union.chain);
                }
            }
        }

        return unionChain;
    }
};

NumberRangeChain.createSingleItemChain = function(lowerBound, upperBound)
{
    return new NumberRangeChain([new fcSymbolic.NumberRange(lowerBound, upperBound)]);
};
NumberRangeChain.upgradeToChain = function(numberRange)
{
    return new NumberRangeChain(numberRange);
};

NumberRangeChain.createTwoItemChain = function(lowerBoundA, upperBoundA, lowerBoundB, upperBoundB)
{
    return new NumberRangeChain([new fcSymbolic.NumberRange(lowerBoundA, upperBoundA), new fcSymbolic.NumberRange(lowerBoundB, upperBoundB)]);
};

NumberRangeChain.upgradeToTwoItemChain = function(numberRangeA, numberRangeB)
{
    return new NumberRangeChain([numberRangeA, numberRangeB]);
};

NumberRangeChain.performOperation = function(chainA, chainB, operation)
{
    var a = 3;
};

NumberRangeChain._getWithLowerLowerBound = function(rangeA, rangeB)
{
    if(rangeA == null) { return rangeB; }
    if(rangeB == null) { return rangeA; }

    return rangeA.lowerBound < rangeB.lowerBound ? rangeA : rangeB;
};

NumberRangeChain._getWithHigherUpperBound = function(rangeA, rangeB)
{
    if(rangeA == null) { return rangeB; }
    if(rangeB == null) { return rangeA; }

    return rangeA.upperBound > rangeB.upperBound ? rangeA : rangeB;
};

NumberRange = function(lowerBound, upperBound)
{
    this.lowerBound = Math.min(lowerBound, upperBound);
    this.upperBound = Math.max(lowerBound, upperBound);
};

NumberRange.prototype =
{
    getFromRange: function()
    {
        if(isFinite(this.lowerBound)) { return this.lowerBound; }
        if(isFinite(this.upperBound)) { return this.upperBound; }

        return 0;
    },

    toString: function()
    {
        return "[" + this.lowerBound + ", " + this.upperBound + "]";
    }
};

NumberRange.performOperation = function(rangeA, rangeB, operation)
{
    if(operation == "&&") { return NumberRange.makeIntersection(rangeA, rangeB); }
    else if(operation == "||") { return NumberRange.makeUnion(rangeA, rangeB); }

    alert("Unknown operation in Number Range");
    return null;
};

NumberRange.makeIntersection = function(rangeA, rangeB)
{
    if(rangeA == null || rangeB == null) { return new NumberRangeChain(); }

    if(this._areDisjunct(rangeA, rangeB)) { return new NumberRangeChain(); }
    if(this._areIntersecting(rangeA, rangeB) || this._arePartiallyOverlapping(rangeA, rangeB) || this._areSharingOneBound(rangeA, rangeB)) { return NumberRangeChain.createSingleItemChain(Math.max(rangeA.lowerBound, rangeB.lowerBound), Math.min(rangeA.upperBound, rangeB.upperBound)); }
    if(this._areWhollyOverlapping(rangeA, rangeB)) { return NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeA.upperBound); }
    if(this._isContainedWithin(rangeA, rangeB)) { return NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeA.upperBound); }
    if(this._isContainedWithin(rangeB, rangeA)) { return NumberRangeChain.createSingleItemChain(rangeB.lowerBound, rangeB.upperBound); }
    if(this._areSharingOneBound(rangeA, rangeB)) { return NumberRangeChain.createSingleItemChain(); }

    alert("Should not be here when making intersection");

    return null;
};

NumberRange.makeUnion = function(rangeA, rangeB)
{
    if(rangeA == null && rangeB == null) { return new NumberRangeChain();}

    if(rangeA == null) { return NumberRangeChain.upgradeToChain(rangeB); }
    if(rangeB == null) { return NumberRangeChain.upgradeToChain(rangeA); }


    if(this._areDisjunct(rangeA, rangeB)) { return NumberRangeChain.upgradeToTwoItemChain(NumberRangeChain._getWithLowerLowerBound(rangeA, rangeB), NumberRangeChain._getWithHigherUpperBound(rangeA, rangeB)); }
    if(this._areIntersecting(rangeA, rangeB) || this._arePartiallyOverlapping(rangeA, rangeB) || this._areSharingOneBound(rangeA, rangeB)) { return NumberRangeChain.createSingleItemChain(Math.min(rangeA.lowerBound, rangeB.lowerBound), Math.max(rangeA.upperBound, rangeB.upperBound)); }
    if(this._areWhollyOverlapping(rangeA, rangeB)) { return NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeA.upperBound); }
    if(this._isContainedWithin(rangeA, rangeB)) { return NumberRangeChain.createSingleItemChain(rangeB.lowerBound, rangeB.upperBound); }
    if(this._isContainedWithin(rangeB, rangeA)) { return NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeA.upperBound); }

    alert("Should not be here when making union!");
};

NumberRange._areDisjunct = function(rangeA, rangeB)
{
    return (rangeA.lowerBound < rangeB.lowerBound && rangeA.upperBound < rangeB.upperBound && rangeA.upperBound < rangeB.lowerBound)
        || (rangeB.lowerBound < rangeA.lowerBound && rangeB.upperBound < rangeA.upperBound && rangeB.upperBound < rangeA.lowerBound);
};

NumberRange._areIntersecting = function(rangeA, rangeB)
{
    return (rangeA.lowerBound < rangeB.lowerBound && rangeA.upperBound < rangeB.upperBound && rangeA.upperBound > rangeB.lowerBound)
        || (rangeB.lowerBound < rangeA.lowerBound && rangeB.upperBound < rangeA.upperBound && rangeB.upperBound > rangeA.lowerBound);
};

NumberRange._arePartiallyOverlapping = function(rangeA, rangeB)
{
    return rangeA.lowerBound == rangeB.lowerBound
        || rangeA.upperBound == rangeB.upperBound;
};

NumberRange._areSharingOneBound = function(rangeA, rangeB)
{
    return (rangeA.upperBound == rangeB.lowerBound && rangeA.lowerBound != rangeB.upperBound)
        || (rangeB.upperBound == rangeA.lowerBound && rangeB.lowerBound != rangeA.upperBound);
};

NumberRange._areWhollyOverlapping = function(rangeA, rangeB)
{
    return rangeA.lowerBound == rangeB.lowerBound
        && rangeA.upperBound == rangeB.upperBound;
};

NumberRange._isContainedWithin = function(innerRange, outerRange)
{
    return innerRange.lowerBound > outerRange.lowerBound && innerRange.upperBound < outerRange.upperBound;
};

exports.NumberRange = NumberRange;