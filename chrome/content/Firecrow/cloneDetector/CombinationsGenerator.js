/**
 * User: Jomaras
 * Date: 22.07.12.
 * Time: 21:42
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
Firecrow.CloneDetector.CombinationsGenerator =
{
    cache: {},
    generateCombinations: function(endNumber, classNumber)
    {
        var Combination = function (n, k, set)
        {
            if (typeof Combination._initialized == "undefined")
            {
                Combination.choose = function(n, k)
                {
                    if (n < 0 || k < 0) { return -1; }
                    if (n < k) { return 0; }
                    if (n == k) { return 1; }

                    var delta;
                    var iMax;
                    var ans;

                    if (k < n - k) {   delta = n - k; iMax = k;}
                    else {  delta = k; iMax = n - k; }

                    ans = delta + 1;

                    for (var i = 2; i <= iMax; ++i)
                    {
                        ans *= (delta + i) / i;
                    }

                    return ans;
                }
            }
            //"private" instance variables
            this._n = n;
            this._k = k;
            this._set = set.sort(function(a,b) { return a - b; });
            this._numCombinations = Combination.choose(this._n, this._k);

            if (typeof Combination._initialized == "undefined")
            {
                // return largest value v where v < a and  Choose(v,b) <= x
                Combination._getLargestV = function(a, b, x)
                {
                    var v = a - 1;

                    while (Combination.choose(v, b) > x)   { --v; }

                    return v >= 0 ? v : 0;
                }

                //tgd original
                Combination.prototype.getIndex = function(set)
                {
                    var retVal = 0;
                    var tempIdxArr = [];
                    var tempIdx = 0;

                    set = set.sort(function(a,b) { return a - b; });

                    for (var i = 0; i < this._set.length && tempIdx != this._k; ++i)
                    {
                        if (set[tempIdx] == this._set[i])
                        {
                            tempIdxArr[tempIdx++] = i;
                        }
                    }

                    for (var i = 0; i < this._k; ++i)
                    {
                        tempIdxArr[i] = this._n - 1 - tempIdxArr[i];
                    }

                    for (var i = 0; i < this._k; ++i)
                    {
                        retVal += Combination.choose(tempIdxArr[i], this._k - i);
                    }

                    return this._numCombinations - 1 - retVal;
                }

                //ported from msdn
                Combination.prototype.element = function(m)
                {
                    var retVal = [];  //the mth lexicographic combination
                    var ans = [];  //used to calc the indexes into this._set
                    var a = this._n;
                    var b = this._k;
                    var x = this._numCombinations - 1 - m;  // x is the "dual" of m

                    for (var i = 0; i < this._k; ++i)
                    {
                        ans[i] = Combination._getLargestV(a, b, x);  // largest value v, where v < a and vCb < x
                        x -= Combination.choose(ans[i], b);
                        a = ans[i];
                        b -= 1;
                    }

                    for (var i = 0; i < this._k; ++i)
                    {
                        ans[i] = (n - 1) - ans[i];
                    }

                    for (var i = 0; i < this._k; ++i)
                    {
                        retVal[i] = this._set[ans[i]];
                    }

                    return retVal;
                }

                Combination.prototype.toString = function()
                {
                    return this._set.join();
                }

                Combination._initialized = true;
            }
        }

        var set = [];
        var id = endNumber + "-" + classNumber;

        if(this.cache[id] != null) { return this.cache[id]; }

        for(i = 0; i < endNumber; i++)
        {
            set.push(i);
        }

        var a = new Combination(endNumber, classNumber, set);
        var allCombinations = [];

        for(var i = 0; i < a._numCombinations; i++)
        {
            allCombinations.push(a.element(i));
        }

        this.cache[id] = allCombinations;

        return allCombinations;
    }
};
/*************************************************************************************/
}});