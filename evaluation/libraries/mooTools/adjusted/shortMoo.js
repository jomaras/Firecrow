var typeOf = function(item)
{
    if(item.$family != null)
        return item.$family();

    return typeof item;
};
var Function = this.Function;
Function.prototype.overloadSetter = function(usePlural)
{
    var self = this;
    return function(a, b)
    {
        if(usePlural || typeof a != 'string')
        {
            for(var k in a)
                self.call(this, k, a[k]);
        }
        else
        {
            self.call(this, a, b);
        }

        return this;
    };
};
Function.prototype.extend = (function(key, value)
{
    this[key] = value;
}).overloadSetter();
Function.prototype.implement = (function(key, value)
{
    this.prototype[key] = value;
}).overloadSetter();
var slice = Array.prototype.slice;
Array.from = function(item)
{
    return Type.isEnumerable(item) && typeof item != 'string' ? typeOf(item) == 'array' ? item : 0 : [item];
};
Function.implement({
    hide: function()
    {
        return this;
    },
    protect: function()
    {
        this.$protected = true;
        return this;
    }
});
var Type = function(name, object)
{
    if(name)
    {
        var lower = name.toLowerCase();
        if(object != null)
        {
            object.prototype.$family = (function()
            {
                return lower;
            }).hide();
        }
    }

    if(object == null) { return null; }

    object.extend(this);
    return object;
};
var toString = Object.prototype.toString;
Type.isEnumerable = function(item)
{
    return item != null && typeof (item.length) == 'number' && toString.call(item) != '[object Function]';
};
var hooks = {};
var hooksOf = function(object)
{
    var type = typeOf(object.prototype);
    return hooks[type] || (hooks[type] = []);
};
var implement = function(name, method)
{
    var hooks = hooksOf(this);
    for(var i = 0;i < hooks.length;i++)
    {
        var hook = hooks[i];
        if(typeOf(hook) == 'type');
        else
            hook.call(this, name, method);
    }

    var previous = this.prototype[name];
    if(previous == null || !(previous.$protected))
        this.prototype[name] = method;

    if(this[name] == null && typeOf(method) == 'function')
        extend.call(this, name, function(item)
        {
            return method.apply(item, slice.call(arguments, 1));
        });
};
var extend = function(name, method)
{
    var previous = this[name];
    if(previous == null)
        this[name] = method;
};
Type.implement({
    implement: implement.overloadSetter(),
    alias: (function(name, existing)
    {
        implement.call(this, name, this.prototype[existing]);
    }).overloadSetter(),
    mirror: function(hook)
    {
        hooksOf(this).push(hook);
    }
});
var force = function(name, object, methods)
{
    var isType = object != Object, prototype = object.prototype;
    if(isType)
        object = new Type(name, object);

    for(var i = 0, l = methods.length;i < l;i++)
    {
        var key = methods[i], proto = prototype[key];
        if(isType && proto)
            object.implement(key, proto.protect());
    }

    return force;
};
force('Array', Array, ['push', 'slice', 'forEach', 'every', 'map'])('Function', Function, ['apply', 'call', 'bind']);
new Type('Boolean', Boolean);
Array.implement({
    forEach: function(fn, bind){},
    each: function(fn, bind)
    {
        Array.forEach(this, fn, bind);
    }
});

new Type('Object');

Array.implement({
    every: function(fn, bind){},
    invoke: function(methodName)
    {
        var args = Array.slice(arguments, 1);
        return this.map(function(item)
        {
            return item[methodName].apply(item, args);
        });
    }
});

var Class = this.Class = new Type('Class', function(params)
{
    var newClass = (function()
    {
        if(newClass.$prototyping)
            return this;

        var value = this.initialize ? this.initialize.apply(this, arguments) : 0;
        return value;
    }).extend(this).implement(params);
    return newClass;
});
var wrap = function(self, key, method)
{
    var wrapper = (function()
    {
        var result = method.apply(this, arguments);
        return result;
    }).extend({
            $owner: self
        });
    return wrapper;
};
var implement = function(key, value, retain)
{
    if(Class.Mutators.hasOwnProperty(key))
    {
        Class.Mutators[key].call(this, value);
    }

    if(typeOf(value) == 'function')
    {
        this.prototype[key] = retain ? 0 : wrap(this, key, value);
    }
};
var getInstance = function(klass)
{
    klass.$prototyping = true;
    var proto = new klass();
    return proto;
};
Class.implement('implement', implement.overloadSetter());
Class.Mutators = {
    Extends: function(parent)
    {
        this.prototype = getInstance(parent);
    },
    Implements: function(items)
    {
        Array.from(items).each(function(item){}, this);
    }
};

this.Chain = new Class({});

var Fx = new Class({
    Implements: [Chain]
});

var Swiff = new Class({
    Implements: [Chain],
    options: {
        id: null,
        height: 1,
        width: 1,
        properties: {},
        params: {quality: 'high', allowScriptAccess: 'always', wMode: 'window', swLiveConnect: true},
        callBacks: {},
        vars: {}
    },
    toElement: function(){},
    initialize: function(path, options){},
    replaces: function(element){},
    inject: function(element){},
    remote: function(){}
});