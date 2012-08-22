/**
 * Vector: One dimensional array
 * Extends upon the Array datatype to do some serious number crunching.
 * @author Fredrick Galoso
 */

var Vector = function(values)
{
    this.vector = values || [];
    var that = this;
};

Vector.prototype =
{
    sortAscending: function()
    {
        this.vector.sort(function(a,b) { return a-b;})
    },

    sortDescending: function()
    {
        this.vector.sort(function(a,b) { return b-a;})
    },
    sum:  function(callback)
    {
        var sum = 0.0;

        for (var i = 0; i < this.vector.length;)
        {
            sum += this.vector[i++];
        }
        if (callback)
            return callback(sum);
        else
            return sum;
    },

    product: function(callback)
    {
        var product = 1.0;

        for (var i = 0; i < this.vector.length;)
        {
            product *= this.vector[i++];
        }
        if (callback)
            return callback(product);
        else
            return product;
    },

    mean: function(callback)
    {
        var mean = this.sum() / this.vector.length;
        if (callback)
            return callback(mean);
        else
            return mean;
    },
    gmean: function(callback)
    {
        var gmean = Math.pow(Math.abs(this.product()), 1 / this.vector.length);
        if (callback)
            return callback(gmean);
        else
            return gmean;
    },
    hmean: function(callback)
    {
        function reciprocalSum(set)
        {
            for (var i = 0, sum = 0.0; i < set.length;) {
                sum += 1 / Math.abs(set[i++]);
            }
            return sum;
        }
        var hmean = this.vector.length / reciprocalSum(this.vector);
        if (callback)
            return callback(hmean);
        else
            return hmean;
    },

    qmean: function(callback) {
        var qmean = Math.sqrt(this.pow(2).sum() / this.vector.length)
        if (callback)
            return callback(qmean);
        else
            return qmean;
    },

    median: function(callback)
    {
        var buffer = this.copy();
        buffer.sortAscending();
        var median = (this.vector.length % 2 === 0) ?
            (buffer.vector[this.vector.length / 2 - 1] + buffer.vector[this.vector.length / 2]) / 2 : buffer.vector[parseInt(this.vector.length / 2)];
        if (callback)
            return callback(median);
        else
            return median;
    },

    mode: function(callback)
    {
        var map = {};
        var count = 1;
        var modes = new Vector();
        for (var i = 0; i < this.vector.length; i++) {
            var e = this.vector[i];
            if (map[e] == null)
                map[e] = 1;
            else
                map[e]++;
            if (map[e] > count) {
                modes = new Vector([e]);
                count = map[e];
            } else if (map[e] == count) {
                modes.push(e);
                count = map[e];
            }
        }
        if (modes.length === 1)
            modes = modes[0];
        if (callback)
            return callback(modes);
        else
            return modes;
    },

    range: function(callback) {
        var range = this.max() - this.min();
        if (callback)
            return callback(range);
        else
            return range;
    },

    variance: function(callback) {
        var mean = 0.0,
            variance = 0.0;

        for (var i = 0; i < this.vector.length; i++) {
            var _mean = mean;
            mean += (this.vector[i] - _mean) / (i + 1);
            variance += (this.vector[i] - _mean) * (this.vector[i] - mean);
        }
        variance /= this.vector.length;

        if (callback)
            return callback(variance);
        else
            return variance;
    },

    stdev: function(percentile, callback) {
        var stdev = 0.0;
        if (!percentile)
            stdev = Math.sqrt(this.variance());
        else
            return this.density(percentile).stdev();
        if (callback)
            return callback(stdev);
        else
            return stdev;
    },

    frequency: function(element, callback) {
        var freq = 0;
        if (this.vector.indexOf(element) !== -1) {
            var buffer = this.copy();
            buffer.sortAscending();
            freq = buffer.vector.lastIndexOf(element) - buffer.vector.indexOf(element) + 1;
        }
        if (callback)
            return callback(freq);
        else
            return freq;
    },
    percentile:  function(percent, callback)
    {
        var buffer = this.copy();
        buffer.sortAscending();
        var percentile = buffer.vector[0];
        if (percent > 0)
            percentile = buffer.vector[Math.floor(this.vector.length * percent)];
        if (callback)
            return callback(percentile);
        else
            return percentile;
    },

    density: function(percent, callback) {
        var slice;
        var buffer = this.copy();
        buffer.sortAscending();
        if (percent == 1)
            return buffer;
        else {
            var begin = Math.round(this.vector.length * (0.5 - percent / 2) - 1);
            var end = Math.round(this.vector.length * (0.5 + percent / 2) - 1);
            slice = new Vector(buffer.vector.slice(begin, end));
        }
        if (callback)
            return callback(slice);
        else
            return slice;
    },

    distribution:  function(format, callback)
    {
        var buffer = this.copy();
        buffer.sortAscending();
        var map = function (array, index, format, distribution)
        {
            if (index === array.vector.length)
                return distribution;
            else {
                distribution[array.vector[index]] = (format === 'relative') ?
                    array.frequency(array.vector[index]) / array.vector.length : array.frequency(array.vector[index]);
                return map(array, array.vector.lastIndexOf(array.vector[index]) + 1, format, distribution);
            }
        }
        var result = (format === 'relative') ? map(buffer, 0, 'relative', {}) : map(buffer, 0, 'raw', {});
        if (callback)
            return callback(result);
        else
            return result;
    },


    quantile: function(quantity, callback) {
        var buffer = this.copy();
        buffer.sortAscending();
        var increment = 1.0 / quantity;
        var results = new Vector();
        if (quantity > this.vector.length)
            throw new RangeError('Subset quantity is greater than the Vector length');
        for (var i = increment; i < 1; i += increment) {
            var index = Math.round(buffer.vector.length * i) - 1;
            if (index < buffer.vector.length - 1)
                results.push(buffer.vector[index]);
        }
        if (callback)
            return callback(results);
        else
            return results;
    },

    delta: function(callback) {
        var delta = new Vector();
        for (var i = 1; i < this.vector.length; i++) {
            delta.push(this.vector[i] - this.vector[i - 1]);
        }
        if (callback)
            return callback(delta);
        else
            return delta;
    },
    sma: function(period, callback) {
        var sma;
        if (period === 1) sma = this.vector;
        else {
            // Memoize (rolling) sum to avoid additional O(n) overhead
            var sum = new Vector(this.vector.slice(0, period)).sum();
            sma = new Vector([sum / period]);
            for (var i = 1; i < this.vector.length - period + 1; i++) {
                sum += this.vector[i + period - 1] - this.vector[i - 1];
                sma.push(sum / period);
            }
        }
        if (callback)
            return callback(sma);
        else
            return sma;
    },

    ema: function(options, callback) {
        // Single numeric argument defining the smoothing period
        if (typeof options === 'number') {
            var length = options;
            options = {
                period: length,
                ratio: function(n) { return 2 / (n + 1); }
            };
        }
        var sum = new Vector(this.vector.slice(0, options.period)).sum(),
            ema = new Vector([sum / options.period]),
            ratio = options.ratio(options.period);
        for (var i = 1; i < this.vector.length - options.period + 1; i++) {
            ema.push(
                ratio
                    * (this.vector[i + options.period - 1] - ema.vector[i - 1])
                    + ema.vector[i - 1]
            );
        }
        if (callback)
            return callback(ema);
        else
            return ema;
    },

    max: function(callback) {
        var max = Math.max.apply({}, this.vector);
        if (callback)
            return callback(max);
        else
            return max;
    },

    min: function(callback) {
        var min = Math.min.apply({}, this.vector);
        if (callback)
            return callback(min);
        else
            return min;
    },

    abs: function(callback) {
        var abs = this.map(function(x) {
            return Math.abs(x);
        });
        if (callback)
            return callback(abs);
        else
            return abs;
    },

    acos: function(callback) {
        var acos = this.map(function(x) {
            return Math.acos(x);
        });
        if (callback)
            return callback(acos);
        else
            return acos;
    },

    asin: function(callback) {
        var asin = this.map(function(x) {
            return Math.asin(x);
        });
        if (callback)
            return callback(asin);
        else
            return asin;
    },

    atan: function(callback) {
        var atan = this.map(function(x) {
            return Math.atan(x);
        });
        if (callback)
            return callback(atan);
        else
            return atan;
    },

    ceil: function(callback) {
        var ceil = this.map(function(x) {
            return Math.ceil(x);
        });
        if (callback)
            return callback(ceil);
        else
            return ceil;
    },

    cos: function(callback) {
        var cos = this.map(function(x) {
            return Math.cos(x);
        });
        if (callback)
            return callback(cos);
        else
            return cos;
    },

    exp:function(callback) {
        var exp = this.map(function(x) {
            return Math.exp(x);
        });
        if (callback)
            return callback(exp);
        else
            return exp;
    },

    floor:function(callback) {
        var floor = this.map(function(x) {
            return Math.floor(x);
        });
        if (callback)
            return callback(floor);
        else
            return floor;
    },

    log: function(callback) {
        var log = this.map(function(x) {
            return Math.log(x);
        });
        if (callback)
            return callback(log);
        else
            return log;
    },

    pow: function(exponent, callback) {
        var pow = this.map(function(x) {
            return Math.pow(x, exponent);
        });
        if (callback)
            return callback(pow);
        else
            return pow;
    },

    round: function(callback) {
        var round = this.map(function(x) {
            return Math.round(x);
        });
        if (callback)
            return callback(round);
        else
            return round;
    },

    sin: function(callback) {
        var sin = this.map(function(x) {
            return Math.sin(x);
        });
        if (callback)
            return callback(sin);
        else
            return sin;
    },

    sqrt: function(callback) {
        var sqrt = this.map(function(x) {
            return Math.sqrt(x);
        });
        if (callback)
            return callback(sqrt);
        else
            return sqrt;
    },

    tan: function(callback) {
        var tan = this.map(function(x) {
            return Math.tan(x);
        });
        if (callback)
            return callback(tan);
        else
            return tan;
    },

    equal:function(that, callback) {
        var equality = !(this.vector < that || that < this.vector);
        if (callback)
            return callback(equality);
        else
            return equality;
    },

    clone: function(callback) {
        var object = Array.isArray(this.vector) ? [] : {};
        for (var i in this.vector) {
            if (i === 'clone') continue;
            if (this.vector[i] && typeof this.vector[i] === 'object') {
                object[i] = this.vector[i].clone();
            } else object[i] = this.vector[i]
        }
        if (callback)
            return callback(object);
        else
            return object;
    },

    copy:  function(callback) {
        var copy = new Vector(this.vector.slice());
        if (callback)
            return callback(copy);
        else
            return copy;
    },

    toArray: function(callback) {
        var array = this.vector.slice();
        if (callback)
            return callback(array);
        else
            return array;
    },

    push: function() {
        var mean = (this.vector.length === 0) ? 0.0 : this.sum() / this.vector.length;
        var variance = (this.vector.length === 0) ? 0.0 : this.variance() * this.vector.length;
        var args = arguments;
        var end = args[args.length - 1];

        if (typeof end === 'function') {
            for (var i = 0; i < args.length - 1; i++) {
                this.vector.push(args[i]);

                // Update variance
                var _mean = mean;
                mean += (args[i] - _mean) / this.vector.length;
                variance += (args[i] - _mean) * (args[i] - mean);
            }
            variance /= this.vector.length;
            return end(this.vector);
        } else {
            for (var i = 0; i < args.length; i++) {
                this.vector.push(args[i]);

                // Update variance
                var _mean = mean;
                mean += (args[i] - _mean) / this.vector.length;
                variance += (args[i] - _mean) * (args[i] - mean);
            }
            variance /= this.vector.length;

            return this.vector;
        }
    },

    concat:  function() {
        var args = [];
        for(var i = 0; i < arguments.length; i++) { args.push(arguments[i]);}

        var end = args[args.length - 1];
        if (typeof end === 'function') {
            if (typeof args[0] !== 'number')
                return end(new Vector(this.toArray().concat(args[0])));
            else
                return end(new Vector(this.toArray().concat(args.slice(0, args.length - 1))));
        }
        else if (typeof args[0] !== 'number')
            return new Vector(this.toArray().concat(args[0]));
        else
            return new Vector(this.toArray().concat(args));
    },

    slice: function(begin, end, callback) {
        var args = [];
        for(var i = 0; i < arguments.length; i++) { args.push(arguments[i]);}
        if (args.length === 3)
            return callback(new Vector(this.toArray().slice(begin, end)));
        else if (args.length === 2) {
            if (typeof args[1] === 'function')
                return callback(new Vector(this.toArray().slice(begin)));
            else
                return new Vector(this.toArray().slice(begin, end));
        }
        else if (args.length === 1)
            return new Vector(this.toArray().slice(begin));
        else
            return new Vector(this.toArray().slice());
    },

    filter: function(callback, next) {
        var filter = new Vector(this.toArray().filter(callback));
        if (next)
            return next(filter);
        else
            return filter;
    },

    every: function(callback, next) {
        var every = this.toArray().every(callback);
        if (next)
            return next(every);
        else
            return every;
    },

    map: function(callback, next) {
        var map = new Vector(this.toArray().map(callback));
        if (next)
            return next(map);
        else
            return map;
    },

    some: function(callback, next) {
        var some = this.toArray().some(callback);
        if (next)
            return next(some);
        else
            return some;
    },

    reduce: function(callback, initialValue, next) {
        var args = [];
        for(var i = 0; i < arguments.length; i++) { args.push(arguments[i]);}
        if (args.length === 3)
            return next(this.toArray().reduce(callback, initialValue));
        else if (args.length === 2) {
            if (typeof args[1] === 'function')
                return next(this.toArray().reduce(callback));
            else
                return this.toArray().reduce(callback, initialValue);
        }
        else
            return this.toArray().reduce(callback);
    },

    reduceRight: function(callback, initialValue, next) {
        var args = [];
        for(var i = 0; i < arguments.length; i++) { args.push(arguments[i]);}
        if (args.length === 3)
            return next(this.toArray().reduceRight(callback, initialValue));
        else if (args.length === 2) {
            if (typeof args[1] === 'function')
                return next(this.toArray().reduceRight(callback));
            else
                return this.toArray().reduceRight(callback, initialValue);
        }
        else
            return this.oArray().reduceRight(callback);
    }
};