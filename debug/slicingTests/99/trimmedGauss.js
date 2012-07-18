var Vector = function(values)
{
    this.vector = values || [];
};

Vector.prototype =
{
    mode: function()
    {
        var map = {};
        var count = 1;
        var modes = new Vector();
        for (var i = 0; i < this.vector.length; i++)
        {
            var e = this.vector[i];

            if (map[e] == null)
                map[e] = 1;
            else
                map[e]++;

            if (map[e] > count)
            {
                modes = new Vector([e]);
                count = map[e];
            }
            else if (map[e] == count)
            {
                modes.push(e);
                count = map[e];
            }
        }

        return modes;
    },

    push: function() {
        var args = arguments;
        var end = args[args.length - 1];

        if (typeof end === 'function') {
            for (var i = 0; i < args.length - 1; i++) {
                this.vector.push(args[i]);
            }
            return end(this.vector);
        } else {
            for (var i = 0; i < args.length; i++) {
                this.vector.push(args[i]);
            }

            return this.vector;
        }
    }
};