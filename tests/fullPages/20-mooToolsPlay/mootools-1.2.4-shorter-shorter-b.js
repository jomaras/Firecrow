var MooTools = { 'version': '1.2.4', 'build': '0d9113241a90b9cd5643b926795852a2026710d4'};

var Native = function(options)
{
    var name = options.name;
    var legacy = options.legacy;
    var protect = options.protect;
    var methods = options.implement;
    var generics = options.generics;
    var initialize = options.initialize;

    var afterImplement = options.afterImplement || function(){};

    var object = initialize || legacy;

    object.constructor = Native;
    object.$family = {name: 'native'};

    object.prototype.constructor = object;

    if (name)
    {
        var family = name.toLowerCase();
        object.prototype.$family = {name: family};
    }

    var add = function(obj, name, method, force)
    {
        if (!protect || force || !obj.prototype[name])
        {
            obj.prototype[name] = method;
        }

        afterImplement.call(obj, name, method);

        return obj;
    };

    object.alias = function(a1, a2, a3)
    {
        if (typeof a1 == 'string')
        {
            var pa1 = this.prototype[a1];
            if ((a1 = pa1))
            {
                var res = add(this, a2, a1, a3);
                return res;
            }
        }

        for (var a in a1)
        {
            this.alias(a, a1[a], a2);
        }

        return this;
    };

    object.implement = function(a1, a2, a3)
    {
        for (var p in a1)
        {
            add(this, p, a1[p], a2);
        }

        return this;
    };

    return object;
};

Native.implement = function(objects, properties)
{
    for (var i = 0, l = objects.length; i < l; i++)
    {
        objects[i].implement(properties);
    }
};

new Native({name: 'Array', initialize: Array, protect: true});
new Native({name: 'Function', initialize: Function, protect: true});

Array.alias('forEach', 'each');

function $extend(original, extended)
{
    var obj = (extended || {});
    for (var key in obj)
    {
        original[key] = extended[key];
    }

    return original;
};

function $pick()
{
    for (var i = 0, l = arguments.length; i < l; i++)
    {
        if (arguments[i] != undefined)
        {
            return arguments[i];
        }
    }

    return null;
};

var Document = new Native
    ({
        name: 'Document',

        initialize: function(doc)
        {
            return $extend(doc, Document.Prototype);
        },

        afterImplement: function(property, value)
        {
            document[property] = Document.Prototype[property] = value;
        }
    });

Document.Prototype = {$family: {name: 'document'}};

new Document(document);

Function.implement
    ({
        create: function(options)
        {
            var self = this;

            options = options || {};

            var createdFunction = function(event)
            {
                var args = Array.slice(arguments, 0);

                var returnValue = function()
                {
                    var applyArg = null;

                    if(options.bind)
                    {
                        applyArg = options.bind;
                    }

                    return self.apply(applyArg, args);
                };

                return returnValue();
            };

            return createdFunction;
        }
    });

var storage = {};

var get = function()
{
    var arg = storage[0];

    if(!arg)
    {
        arg = storage[0] = {};
    }

    return arg;
};

Native.implement([Document],
    {
        retrieve: function(property, dflt)
        {
            var storage = get(), prop = storage[property];

            if (dflt != undefined && prop == undefined)
            {
                prop = storage[property] = dflt;
            }

            return $pick(prop);
        },

        addEvent: function(type, fn)
        {
            var events = this.retrieve('events', {});

            if(!events[type])
            {
                events[type] = {'keys': [], 'values': []};
            }

            events[type].keys.push(fn);

            var self = this;

            var defn = function()
            {
                return fn.call(self);
            };

            this.addEventListener(type, defn, false);

            events[type].values.push(defn);

            return this;
        },

        fireEvent: function(type, args)
        {
            var events = this.retrieve('events');

            events[type].keys.each(function(fn)
            {
                fn.create({'bind': this, 'arguments': args})();
            }, this);

            return this;
        }
    });

document.addEvent('DOMContentLoaded', function()
{
    document.fireEvent('domready');
});