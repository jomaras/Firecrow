var Sylvester = {
    precision: 1e-6
};

Sylvester.Vector = function ()
{};

Sylvester.Vector.create = function (elements)
{
    var V = new Sylvester.Vector();
    return V.setElements(elements);
};
var $V = Sylvester.Vector.create;

Sylvester.Vector.Random = function (n)
{
    var elements = [];
    while (n--)
    {
        elements.push(Math.random());
    }
    return Sylvester.Vector.create(elements);
};

Sylvester.Vector.Zero = function (n)
{
    var elements = [];
    while (n--)
    {
        elements.push(0);
    }
    return Sylvester.Vector.create(elements);
};

Sylvester.Vector.prototype = {
    e: function (i)
    {
        return (i < 1 || i > this.elements.length) ? null : this.elements[i - 1];
    },

    dimensions: function ()
    {
        return this.elements.length;
    },

    modulus: function ()
    {
        return Math.sqrt(this.dot(this));
    },

    eql: function (vector)
    {
        var n = this.elements.length;
        var V = vector.elements || vector;
        if (n !== V.length)
        {
            return false;
        }
        while (n--)
        {
            if (Math.abs(this.elements[n] - V[n]) > Sylvester.precision)
            {
                return false;
            }
        }
        return true;
    },

    dup: function ()
    {
        return Sylvester.Vector.create(this.elements);
    },

    dot: function (vector)
    {
        var V = vector.elements || vector;
        var i, product = 0,
            n = this.elements.length;
        if (n !== V.length)
        {
            return null;
        }
        while (n--)
        {
            product += this.elements[n] * V[n];
        }
        return product;
    },

    map: function (fn, context)
    {
        var elements = [];
        this.each(function (x, i)
        {
            elements.push(fn.call(context, x, i));
        });
        return Sylvester.Vector.create(elements);
    },

    forEach: function (fn, context)
    {
        var n = this.elements.length;
        for (var i = 0; i < n; i++)
        {
            fn.call(context, this.elements[i], i + 1);
        }
    },

    subtract: function (vector)
    {
        var V = vector.elements || vector;
        if (this.elements.length !== V.length)
        {
            return null;
        }
        return this.map(function (x, i)
        {
            return x - V[i - 1];
        });
    },

    to3D: function ()
    {
        var V = this.dup();
        switch (V.elements.length)
        {
        case 3:
            break;
        case 2:
            V.elements.push(0);
            break;
        default:
            return null;
        }
        return V;
    },

    setElements: function (els)
    {
        this.elements = (els.elements || els).slice();
        return this;
    }
};

Sylvester.Vector.prototype.x = Sylvester.Vector.prototype.multiply;
Sylvester.Vector.prototype.each = Sylvester.Vector.prototype.forEach;

Sylvester.Vector.i = Sylvester.Vector.create([1, 0, 0]);
Sylvester.Vector.j = Sylvester.Vector.create([0, 1, 0]);
Sylvester.Vector.k = Sylvester.Vector.create([0, 0, 1]);

Sylvester.Line = function ()
{};

Sylvester.Line.prototype = {
    eql: function (line)
    {
        return (this.isParallelTo(line) && this.contains(line.anchor));
    },

    dup: function ()
    {
        return Sylvester.Line.create(this.anchor, this.direction);
    },

    setVectors: function (anchor, direction)
    {
        // Need to do this so that line's properties are not references to the
        // arguments passed in
        anchor = Sylvester.Vector.create(anchor);
        direction = Sylvester.Vector.create(direction);
        if (anchor.elements.length === 2)
        {
            anchor.elements.push(0);
        }
        if (direction.elements.length === 2)
        {
            direction.elements.push(0);
        }
        if (anchor.elements.length > 3 || direction.elements.length > 3)
        {
            return null;
        }
        var mod = direction.modulus();
        if (mod === 0)
        {
            return null;
        }
        this.anchor = anchor;
        this.direction = Sylvester.Vector.create([direction.elements[0] / mod, direction.elements[1] / mod, direction.elements[2] / mod]);
        return this;
    }
};

Sylvester.Line.create = function (anchor, direction)
{
    var L = new Sylvester.Line();
    return L.setVectors(anchor, direction);
};
var $L = Sylvester.Line.create;

Sylvester.Line.Segment = function ()
{};

Sylvester.Line.Segment.prototype = {
    eql: function (segment)
    {
        return (this.start.eql(segment.start) && this.end.eql(segment.end)) || (this.start.eql(segment.end) && this.end.eql(segment.start));
    },

    dup: function ()
    {
        return Sylvester.Line.Segment.create(this.start, this.end);
    },

    toVector: function ()
    {
        var A = this.start.elements,
            B = this.end.elements;
        return Sylvester.Vector.create([B[0] - A[0], B[1] - A[1], B[2] - A[2]]);
    },

    setPoints: function (startPoint, endPoint)
    {
        startPoint = Sylvester.Vector.create(startPoint).to3D();
        endPoint = Sylvester.Vector.create(endPoint).to3D();
        if (startPoint === null || endPoint === null)
        {
            return null;
        }
        this.line = Sylvester.Line.create(startPoint, endPoint.subtract(startPoint));
        this.start = startPoint;
        this.end = endPoint;
        return this;
    }
};

Sylvester.Line.Segment.create = function (v1, v2)
{
    var S = new Sylvester.Line.Segment();
    return S.setPoints(v1, v2);
};