FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
fcSymbolic.NumberRangeChain = function(chain)
{
    this.chain = chain || [];
};
fcSymbolic.NumberRangeChain.prototype =
{
    getFromRange: function()
    {
        if(this.chain.length == 0) { return Number.NaN; }
        if(this.chain.length == 1) { return this.chain[0].getFromRange(); }

        var cumulativeChain = fcSymbolic.NumberRangeChain.upgradeToChain(this.chain[0]);

        if(cumulativeChain == null) { return null; }

        return cumulativeChain.getFromRange();
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
        return new fcSymbolic.NumberRangeChain(this.chain.slice());
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

                var union = fcSymbolic.NumberRange.makeIntersection(firstRange, secondRange);

                if(union != null)
                {
                    ValueTypeHelper.pushAll(unionChain, union.chain);
                }
            }
        }

        return unionChain;
    }
};

fcSymbolic.NumberRangeChain.createSingleItemChain = function(lowerBound, upperBound)
{
    return new fcSymbolic.NumberRangeChain([new fcSymbolic.NumberRange(lowerBound, upperBound)]);
};
fcSymbolic.NumberRangeChain.upgradeToChain = function(numberRange)
{
    return new fcSymbolic.NumberRangeChain(numberRange);
};

fcSymbolic.NumberRangeChain.createTwoItemChain = function(lowerBoundA, upperBoundA, lowerBoundB, upperBoundB)
{
    return new fcSymbolic.NumberRangeChain([new fcSymbolic.NumberRange(lowerBoundA, upperBoundA), new fcSymbolic.NumberRange(lowerBoundB, upperBoundB)]);
};

fcSymbolic.NumberRangeChain.upgradeToTwoItemChain = function(numberRangeA, numberRangeB)
{
    return new fcSymbolic.NumberRangeChain([numberRangeA, numberRangeB]);
};

fcSymbolic.NumberRange = function(lowerBound, upperBound)
{
    this.lowerBound = Math.min(lowerBound, upperBound);
    this.upperBound = Math.max(lowerBound, upperBound);
};
fcSymbolic.NumberRange.prototype =
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

fcSymbolic.NumberRange.makeIntersection = function(rangeA, rangeB)
{
    if(rangeA == null || rangeB == null) { return new fcSymbolic.NumberRangeChain(); }

    if(this._areDisjunct(rangeA, rangeB)) { return new fcSymbolic.NumberRangeChain(); }
    if(this._areIntersecting(rangeA, rangeB) || this._arePartiallyOverlapping(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(Math.max(rangeA.lowerBound, rangeB.lowerBound), Math.min(rangeA.upperBound, rangeB.upperBound)); }
    if(this._areWhollyOverlapping(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeA.upperBound); }
    if(this._isContainedWithin(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeA.upperBound); }
    if(this._isContainedWithin(rangeB, rangeA)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeB.lowerBound, rangeB.upperBound); }

    alert("Should not be here when making intersection");

    return null;
};

fcSymbolic.NumberRange.makeUnion = function(rangeA, rangeB)
{
    if(rangeA == null && rangeB == null) { return new fcSymbolic.NumberRangeChain();}

    if(rangeA == null) { return fcSymbolic.NumberRangeChain.upgradeToChain(rangeB); }
    if(rangeB == null) { return fcSymbolic.NumberRangeChain.upgradeToChain(rangeA); }


    if(this._areDisjunct(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.upgradeToTwoItemChain(fcSymbolic.NumberRangeChain._getWithLowerLowerBound(rangeA, rangeB), fcSymbolic.NumberRangeChain._getWithHigherUpperBound(rangeA, rangeB)); }
    if(this._areIntersecting(rangeA, rangeB) || this._arePartiallyOverlapping(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(Math.min(rangeA.lowerBound, rangeB.lowerBound), Math.max(rangeA.upperBound, rangeB.upperBound)); }
    if(this._areWhollyOverlapping(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeA.upperBound); }
    if(this._isContainedWithin(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeB.lowerBound, rangeB.upperBound); }
    if(this._isContainedWithin(rangeB, rangeA)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeA.upperBound); }

    alert("Should not be here when making union!");
};

fcSymbolic.NumberRange._areDisjunct = function(rangeA, rangeB)
{
    return (rangeA.lowerBound < rangeB.lowerBound && rangeA.upperBound < rangeB.upperBound && rangeA.upperBound < rangeB.lowerBound)
        || (rangeB.lowerBound < rangeA.lowerBound && rangeB.upperBound < rangeA.upperBound && rangeB.upperBound < rangeA.lowerBound);
};

fcSymbolic.NumberRange._areIntersecting = function(rangeA, rangeB)
{
    return (rangeA.lowerBound < rangeB.lowerBound && rangeA.upperBound < rangeB.upperBound && rangeA.upperBound > rangeB.lowerBound)
        || (rangeB.lowerBound < rangeA.lowerBound && rangeB.upperBound < rangeA.upperBound && rangeB.upperBound > rangeA.lowerBound);
};

fcSymbolic.NumberRange._areWhollyOverlapping = function(rangeA, rangeB)
{
    return rangeA.lowerBound == rangeB.lowerBound
        && rangeA.upperBound == rangeB.upperBound;
};

fcSymbolic.NumberRange._arePartiallyOverlapping = function(rangeA, rangeB)
{
    return rangeA.lowerBound == rangeB.lowerBound
        || rangeA.upperBound == rangeB.upperBound;
};

fcSymbolic.NumberRange._isContainedWithin = function(innerRange, outerRange)
{
    return innerRange.lowerBound > outerRange.lowerBound && innerRange.upperBound < outerRange.upperBound;
}

fcSymbolic.NumberRangeChain._getWithLowerLowerBound = function(rangeA, rangeB)
{
    if(rangeA == null) { return rangeB; }
    if(rangeB == null) { return rangeA; }

    return rangeA.lowerBound < rangeB.lowerBound ? rangeA : rangeB;
};

fcSymbolic.NumberRangeChain._getWithHigherUpperBound = function(rangeA, rangeB)
{
    if(rangeA == null) { return rangeB; }
    if(rangeB == null) { return rangeA; }

    return rangeA.upperBound > rangeB.upperBound ? rangeA : rangeB;
};
/*****************************************************/
}});