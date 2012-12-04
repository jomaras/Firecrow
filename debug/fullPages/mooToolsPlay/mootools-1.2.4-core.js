var MooTools = 
{
	'version': '1.2.4',
	'build': '0d9113241a90b9cd5643b926795852a2026710d4'
};

var Native = function(options)
{
	if(!options)
	{
		options = {};
	}
	
	var name = options.name;
	var legacy = options.legacy;
	var protect = options.protect;
	var methods = options.implement;
	var generics = options.generics;
	var initialize = options.initialize;
	
	if(options.afterImplement)
	{
		var afterImplement = options.afterImplement;
	}
	else
	{
		afterImplement = function(){};
	}
	
	if(initialize)
	{
		var object = initialize;
	}
	else
	{
		var object = legacy;
	}
	
	generics = generics !== false;

	object.constructor = Native;
	object.$family = {name: 'native'};
	if (legacy && initialize) 
	{
		object.prototype = legacy.prototype;
	}
	
	object.prototype.constructor = object;

	if (name)
	{
		var family = name.toLowerCase();
		object.prototype.$family = {name: family};
		Native.typize(object, family);
		Math.E + 1;
	}

	var add = function(obj, name, method, force)
	{
		if (!protect || force || !obj.prototype[name]) 
		{
			obj.prototype[name] = method;
		}
		
		if (generics) 
		{
			Native.genericize(obj, name, protect);
			Math.E + 1;
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
			Math.E + 1;
		}
		
		for (var a in a1) 
		{
			this.alias(a, a1[a], a2);
			Math.E + 1;
		}
		
		return this;
	};

	object.implement = function(a1, a2, a3)
	{
		if (typeof a1 == 'string') 
		{
			return add(this, a1, a2, a3);
		}
		
		for (var p in a1) 
		{
			add(this, p, a1[p], a2);
			Math.E + 1;
		}
		
		return this;
	};

	if (methods) 
	{
		object.implement(methods);
		Math.E + 1;
	}

	return object;
};

Native.genericize = function(object, property, check)
{
	if ((!check || !object[property]) && typeof object.prototype[property] == 'function') 
	{
		object[property] = function()
		{
			var args = Array.prototype.slice.call(arguments);
			return object.prototype[property].apply(args.shift(), args);
		};
		
		Math.E + 1;
	}
	
	Math.E + 1;
};

Native.implement = function(objects, properties)
{
	for (var i = 0, l = objects.length; i < l; i++) 
	{
		objects[i].implement(properties);
	}
	Math.E + 1;
};

Native.typize = function(object, family)
{
	if (!object.type) 
	{
		object.type = function(item)
		{
			return ($type(item) === family);
		};
		
		Math.E + 1;
	}
	
	Math.E + 1;
};

(function(){
	var natives = {'Array': Array, 'Date': Date, 'Function': Function, 'Number': Number, 'RegExp': RegExp, 'String': String};
	
	for (var n in natives) 
	{
		new Native({name: n, initialize: natives[n], protect: true});
		Math.E + 1;
	}

	var types = {'boolean': Boolean, 'native': Native, 'object': Object};
	
	for (var t in types)
	{	
		Native.typize(types[t], t);
		Math.E + 1;
	}

	var generics = 
	{
		'Array': ["concat", "indexOf", "join", "lastIndexOf", "pop", "push", "reverse", "shift", "slice", "sort", "splice", "toString", "unshift", "valueOf"],
		'String': ["charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "match", "replace", "search", "slice", "split", "substr", "substring", "toLowerCase", "toUpperCase", "valueOf"]
	};
	
	for (var g in generics)
	{
		for (var i = generics[g].length; i--;) 
		{
			Native.genericize(natives[g], generics[g][i], true);
			Math.E + 1;
		}
		
		Math.E + 1;
	}
})();

var Hash = new Native
({

	name: 'Hash',

	initialize: function(object)
	{
		if ($type(object) == 'hash') 
		{
			object = $unlink(object.getClean());
		}
		
		for (var key in object) 
		{
			this[key] = object[key];
		}
		
		return this;
	}

});

Hash.implement
({
	forEach: function(fn, bind)
	{
		for (var key in this)
		{
			if (this.hasOwnProperty(key)) 
			{
				fn.call(bind, this[key], key, this);
				Math.E + 1;
			}
			Math.E + 1;
		}
	},

	getClean: function()
	{
		var clean = {};
		for (var key in this)
		{
			if (this.hasOwnProperty(key)) 
			{
				clean[key] = this[key];
				Math.E + 1;
			}
			Math.E + 1;
		}
		
		return clean;
	},

	getLength: function()
	{
		var length = 0;
		for (var key in this)
		{
			if (this.hasOwnProperty(key)) 
			{
				length++;
			}
			Math.E + 1;
		}
		
		return length;
	}
});

Hash.alias('forEach', 'each');

Array.implement
({
	forEach: function(fn, bind)
	{
		for (var i = 0, l = this.length; i < l; i++) 
		{
			fn.call(bind, this[i], i, this);
			Math.E + 1;
		}
	}
});

Array.alias('forEach', 'each');

function $A(iterable)
{
	if (iterable.item)
	{
		var l = iterable.length, array = new Array(l);
		
		while (l--) 
		{
			array[l] = iterable[l];
			Math.E + 1;
		}
		
		return array;
	}
	
	return Array.prototype.slice.call(iterable);
};

function $arguments(i)
{
	return function()
	{
		return arguments[i];
	};
};

function $chk(obj)
{
	return !!(obj || obj === 0);
};

function $clear(timer)
{
	clearTimeout(timer);
	clearInterval(timer);

	return null;
};

function $defined(obj)
{
	return (obj != undefined);
};

function $each(iterable, fn, bind)
{
	var type = $type(iterable);
	var obj = null;
	
	if(type == 'arguments' || type == 'collection' || type == 'array')
	{
		obj = Array;
	}
	else
	{
		obj = Hash;
	}
	
	obj.each(iterable, fn, bind);
};

function $empty(){};

function $extend(original, extended)
{
	var obj = (extended || {});
	for (var key in obj) 
	{
		original[key] = extended[key];
	}
	
	return original;
};

function $H(object)
{
	return new Hash(object);
};

function $lambda(value)
{
	if($type(value) == 'function')
	{
		return value;
	}
	else
	{
		return function()
		{
			return value;
		}
	}
};

function $merge()
{
	var args = Array.slice(arguments);
	args.unshift({});
	return $mixin.apply(null, args);
};

function $mixin(mix)
{
	for (var i = 1, l = arguments.length; i < l; i++)
	{
		var object = arguments[i];
		
		if ($type(object) != 'object') 
		{
			continue;
		}
		
		for (var key in object)
		{
			var op = object[key], mp = mix[key];
			
			if(mp && $type(op) == 'object' && $type(mp) == 'object')
			{
				mix[key] =  $mixin(mp, op);
			}
			else
			{
				mix[key] = $unlink(op);
			}
		}
	}
	return mix;
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

function $random(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function $splat(obj)
{
	var type = $type(obj);
	
	if(type)
	{
		if((type != 'array' && type != 'arguments'))
		{
			return [obj];
		}
		else
		{
			return obj;
		}
	}
	
	return [];
};

var $time = Date.now || function()
{
	return +new Date;
};

function $try()
{
	for (var i = 0, l = arguments.length; i < l; i++)
	{
		try 
		{
			return arguments[i]();
		} 
		catch(e)
		{
			Math.E + 1;
		}
	}
	
	return null;
};

function $type(obj)
{
	if (obj == undefined) 
	{
		return false;
	}
	
	if (obj.$family) 
	{
		if((obj.$family.name == 'number' && !isFinite(obj)))
		{
			return false;
		}
		else
		{
			return obj.$family.name
		}
	}
	
	if (obj.nodeName)
	{
		switch (obj.nodeType)
		{
			case 1: 
				return 'element';
			case 3:
				if((/\S/).test(obj.nodeValue))
				{
					return 'textnode';
				}
				else
				{
					return 'whitespace';
				}
		}
	} 
	else if (typeof obj.length == 'number')
	{
		if (obj.callee) 
		{
			return 'arguments';
		}
		else if (obj.item)
		{ 
			return 'collection';
		}
	}
	
	return typeof obj;
};

function $unlink(object)
{
	var unlinked;
	switch ($type(object))
	{
		case 'object':
			unlinked = {};
			for (var p in object) 
			{
				unlinked[p] = $unlink(object[p]);
			}
		break;
		case 'hash':
			unlinked = new Hash(object);
		break;
		case 'array':
			unlinked = [];
			for (var i = 0, l = object.length; i < l; i++) 
			{
				unlinked[i] = $unlink(object[i]);
			}
		break;
		default: 
			return object;
	}
	
	return unlinked;
};


/*
---

script: Browser.js

description: The Browser Core. Contains Browser initialization, Window and Document, and the Browser Hash.

license: MIT-style license.

requires: 
- /Native
- /$util

provides: [Browser, Window, Document, $exec]

...
*/

//(window.orientation != undefined) ? 'ipod' : (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase()
var platformName = "";

if(window.orientation != undefined)
{
	platformName = 'ipod';
}
else
{
	platformName = (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase();
}

var Browser = $merge
({
	Engine: { name: 'unknown', version: 0},
	Platform: { name: platformName },
	Features: 
	{
		xpath: !!(document.evaluate), 
		air: !!(window.runtime), 
		query: !!(document.querySelector)
	},

	Plugins: {},

	Engines: 
	{
		presto: function()
		{
			//return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925));
			if(!window.opera) 
			{
				return false;
			}
			else
			{
				if(arguments.callee.caller)
				{
					return 960;
				}
				else
				{
					if(document.getElementsByClassName)
					{
						return 950;
					}
					else
					{
						return 925;
					}
				}
			}
		},

		trident: function()
		{
			//return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? ((document.querySelectorAll) ? 6 : 5) : 4);
			if(!window.ActiveXObject)
			{
				return false;
			}
			else
			{
				if(window.XMLHttpRequest)
				{
					if(document.querySelectorAll) 
					{
						return 6;
					}
					else
					{
						return 5;
					}
				}
				else
				{
					return 4;
				}
			}
		},

		webkit: function()
		{
			//return (navigator.taintEnabled) ? false : ((Browser.Features.xpath) ? ((Browser.Features.query) ? 525 : 420) : 419);
			if(navigator.taintEnabled)
			{
				return false;
			}
			else
			{
				if(Browser.Features.xpath)
				{
					if(Browser.Features.query)
					{
						return 525;
					}
					else
					{
						return 420;
					}
				}
				else
				{
					return 419;
				}
			}
		},

		gecko: function()
		{
			//return (!document.getBoxObjectFor && window.mozInnerScreenX == null) ? false : ((document.getElementsByClassName) ? 19 : 18);
			if((!document.getBoxObjectFor && window.mozInnerScreenX == null))
			{
				return false;
			}
			else
			{
				if(document.getElementsByClassName)
				{
					return 19;
				}
				else
				{
					return 18;
				}
			}
		}
	}

}, Browser || {});

Browser.Platform[Browser.Platform.name] = true;

Browser.detect = function()
{
	for (var engine in this.Engines)
	{
		var version = this.Engines[engine]();
		if (version)
		{
			this.Engine = {name: engine, version: version};
			this.Engine[engine] = this.Engine[engine + version] = true;
			break;
		}
	}

	return {
		name: engine, 
		version: version
	};
};

Browser.detect();

Browser.Request = function()
{
	var first = function()
	{
		return new XMLHttpRequest();
	};
	
	var second = function()
	{
		return new ActiveXObject('MSXML2.XMLHTTP');
	};
	
	var third = function()
	{
		return new ActiveXObject('Microsoft.XMLHTTP');
	};
	
	return $try(first, second, third);
};

Browser.Features.xhr = !!(Browser.Request());

Browser.Plugins.Flash = (function()
{
	var first = function()
	{
		return navigator.plugins['Shockwave Flash'].description;
	};
	
	var second = function()
	{
		return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
	};
	
	var versionArg = ($try(first, second) || '0 r0');
	
	var version = versionArg.match(/\d+/g);
	
	return {
		version: parseInt(version[0] || 0 + '.' + version[1], 10) || 0, 
		build: parseInt(version[2], 10) || 0
	};
})();

function $exec(text)
{
	if (!text) 
	{
		return text;
	}
	
	if (window.execScript)
	{
		window.execScript(text);
	} 
	else 
	{
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		var scriptProp = "";
		
		if(Browser.Engine.webkit && Browser.Engine.version < 420)
		{
			scriptProp = 'innerText';
		}
		else
		{
			scriptProp = "text";
		}
		
		script[scriptProp] = text;
		
		document.head.appendChild(script);
		
		document.head.removeChild(script);
	}
	return text;
};

Native.UID = 1;

var tridentFunction = function(item)
{
	var arg = null;
	
	if(item.uid)
	{
		arg = item.uid;
	}
	else
	{
		arg = item.uid = [Native.UID++];
	}
	
	//return (item.uid || (item.uid = [Native.UID++]))[0];
	return arg[0];
};

var nonTridentFunction = function(item)
{
	var arg = null;
	
	if(item.uid)
	{
		arg = item.uid;
	}
	else
	{
		arg = item.uid = Native.UID++;
	}
	
	return arg;
	//return item.uid || (item.uid = Native.UID++);
};

var $uid = null;
if(Browser.Engine.trident) 
{
	$uid = tridentFunction;
}
else
{
	$uid =nonTridentFunction;
}

var windowLegacy = null;

if(!Browser.Engine.trident)
{
	windowLegacy = window.Window;
}

var Window = new Native
({
	name: 'Window',

	legacy: windowLegacy,

	initialize: function(win)
	{
		$uid(win);
		
		if (!win.Element)
		{
			win.Element = $empty;
			
			if (Browser.Engine.webkit) 
			{
				win.document.createElement("iframe"); //fixes safari 2
			}
			
			if(Browser.Engine.webkit)
			{
				win.Element.prototype = window["[[DOMElement.prototype]]"];
			}
			else
			{
				win.Element.prototype = {};
			}
		}
		
		win.document.window = win;
		
		return $extend(win, Window.Prototype);
	},

	afterImplement: function(property, value)
	{
		window[property] = Window.Prototype[property] = value;
	}
});

Window.Prototype = {$family: {name: 'window'}};

new Window(window);

var documentLegacy = null;

if(!Browser.Engine.trident)
{
	documentLegacy = window.Document;
}

var Document = new Native
({
	name: 'Document',
	legacy: documentLegacy,

	initialize: function(doc)
	{
		$uid(doc);
		
		doc.head = doc.getElementsByTagName('head')[0];
		doc.html = doc.getElementsByTagName('html')[0];
		
		if (Browser.Engine.trident && Browser.Engine.version <= 4) 
		{
			$try(function()
			{
				doc.execCommand("BackgroundImageCache", false, true);
			});
		}
		
		if (Browser.Engine.trident) 
		{
			doc.window.attachEvent('onunload', function()
			{
				doc.window.detachEvent('onunload', arguments.callee);
				doc.head = doc.html = doc.window = null;
			});
		}
		
		return $extend(doc, Document.Prototype);
	},

	afterImplement: function(property, value)
	{
		document[property] = Document.Prototype[property] = value;
	}
});

Document.Prototype = {$family: {name: 'document'}};

new Document(document);

/*
---
script: Array.js

description: Contains Array Prototypes like each, contains, and erase.

license: MIT-style license.

requires:
- /$util
- /Array.each

provides: [Array]

...
*/

Array.implement
({
	every: function(fn, bind)
	{
		for (var i = 0, l = this.length; i < l; i++)
		{
			if (!fn.call(bind, this[i], i, this)) 
			{
				return false;
			}
		}
		
		return true;
	},

	filter: function(fn, bind)
	{
		var results = [];
		
		for (var i = 0, l = this.length; i < l; i++)
		{
			if (fn.call(bind, this[i], i, this)) 
			{
				results.push(this[i]);
			}
		}
		
		return results;
	},

	clean: function()
	{
		return this.filter($defined);
	},

	indexOf: function(item, from)
	{
		var len = this.length;
		for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++)
		{
			if (this[i] === item) 
			{
				return i;
			}
		}
		return -1;
	},

	map: function(fn, bind)
	{
		var results = [];
		
		for (var i = 0, l = this.length; i < l; i++) 
		{
			results[i] = fn.call(bind, this[i], i, this);
		}
		
		return results;
	},

	some: function(fn, bind)
	{
		for (var i = 0, l = this.length; i < l; i++)
		{
			if (fn.call(bind, this[i], i, this)) 
			{
				return true;
			}
		}
		
		return false;
	},

	associate: function(keys)
	{
		var obj = {}, length = Math.min(this.length, keys.length);
		
		for (var i = 0; i < length; i++) 
		{
			obj[keys[i]] = this[i];
		}
		
		return obj;
	},

	link: function(object)
	{
		var result = {};
		
		for (var i = 0, l = this.length; i < l; i++)
		{
			for (var key in object)
			{
				if (object[key](this[i]))
				{
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		
		return result;
	},

	contains: function(item, from)
	{
		return this.indexOf(item, from) != -1;
	},

	extend: function(array)
	{
		for (var i = 0, j = array.length; i < j; i++) 
		{
			this.push(array[i]);
		}
		
		return this;
	},
	
	getLast: function()
	{
		if(this.length)
		{
			return this[this.length - 1];
		}
		else
		{
			return null;
		}
	},

	getRandom: function()
	{
		if(this.length)
		{
			return this[$random(0, this.length - 1)];
		}
		else
		{
			return null;
		}
	},

	include: function(item)
	{
		if (!this.contains(item)) 
		{
			this.push(item);
		}
		
		return this;
	},

	combine: function(array)
	{
		for (var i = 0, l = array.length; i < l; i++) 
		{
			this.include(array[i]);
		}
		
		return this;
	},

	erase: function(item)
	{
		for (var i = this.length; i--; i)
		{
			if (this[i] === item) 
			{
				this.splice(i, 1);
			}
		}
		return this;
	},

	empty: function()
	{
		this.length = 0;
		return this;
	},

	flatten: function()
	{
		var array = [];
		
		for (var i = 0, l = this.length; i < l; i++)
		{
			var type = $type(this[i]);
			
			if (!type) 
			{
				continue;
			}
			
			var concatArg = null;
			
			if(type == 'array' || type == 'collection' || type == 'arguments')
			{
				concatArg = Array.flatten(this[i]);
			}
			else
			{
				concatArg = this[i];
			}
			
			array = array.concat(concatArg);
		}
		
		return array;
	},

	hexToRgb: function(array)
	{
		if (this.length != 3) 
		{
			return null;
		}
		
		var rgb = this.map(function(value)
		{
			if (value.length == 1) 
			{
				value += value;
			}
			
			return value.toInt(16);
		});
		
		if(array)
		{
			return rgb;
		}
		else
		{
			return 'rgb(' + rgb + ')';
		}
	},

	rgbToHex: function(array)
	{
		if (this.length < 3) 
		{
			return null;
		}
		
		if (this.length == 4 && this[3] == 0 && !array) 
		{
			return 'transparent';
		}
		
		var hex = [];
		
		for (var i = 0; i < 3; i++)
		{
			var bit = (this[i] - 0).toString(16);
			
			var item = null;

			if(bit.length == 1)
			{
				item = '0' + bit;
			}
			else
			{
				item = bit;
			}
			
			hex.push(item);
		}
		
		if(array)
		{
			return hex;
		}
		else
		{
			return  '#' + hex.join('')
		}
	}
});

/*
---
script: Function.js
description: Contains Function Prototypes like create, bind, pass, and delay.
license: MIT-style license.
requires:
- /Native
- /$util
provides: [Function]
...
*/

Function.implement
({
	extend: function(properties)
	{
		for (var property in properties)
		{
		    this[property] = properties[property];
		}
		
		return this;
	},
	create: function(options)
	{
		var self = this;
		if(!options)
		{
			options = {};
		}
		
		return function(event)
		{
			var args = options.arguments;
			if(args != undefined)
			{
				args = $splat(args);
			}
			else
			{
				var optionsEvent = null;
				if(options.event)
				{
					optionsEvent = 1;
				}
				else
				{
					optionsEvent = 0;
				}
				args = Array.slice(arguments, optionsEvent);
			}
			//args = (args != undefined) ? $splat(args) : Array.slice(arguments, (options.event) ? 1 : 0);
			if (options.event) 
			{
				var eventObj;
				if(event)
				{
					eventObj = event;
				}
				else
				{
					eventObj = window.event;
				}
				
				args = [eventObj].extend(args);
			}
			var returns = function()
			{
				var applyArg = null;
				
				if(options.bind)
				{
					applyArg = options.bind;
				}
				
				return self.apply(applyArg, args);
			};
			if (options.delay) 
			{
				return setTimeout(returns, options.delay);
			}
			
			if (options.periodical) 
			{
				return setInterval(returns, options.periodical);
			}
			if (options.attempt) 
			{
				return $try(returns);
			}
			return returns();
		};
	},

	run: function(args, bind)
	{
		return this.apply(bind, $splat(args));
	},

	pass: function(args, bind)
	{
		return this.create({bind: bind, arguments: args});
	},

	bind: function(bind, args)
	{
		return this.create({bind: bind, arguments: args});
	},

	bindWithEvent: function(bind, args)
	{
		return this.create({bind: bind, arguments: args, event: true});
	},

	attempt: function(args, bind)
	{
		return this.create({bind: bind, arguments: args, attempt: true})();
	},

	delay: function(delay, bind, args)
	{
		return this.create({bind: bind, arguments: args, delay: delay})();
	},

	periodical: function(periodical, bind, args)
	{
		return this.create({bind: bind, arguments: args, periodical: periodical})();
	}
});

/*
---
script: Number.js
description: Contains Number Prototypes like limit, round, times, and ceil.
license: MIT-style license.
requires:
- /Native
- /$util
provides: [Number]
...
*/

Number.implement
({
	limit: function(min, max)
	{
		return Math.min(max, Math.max(min, this));
	},
	round: function(precision)
	{
		precision = Math.pow(10, precision || 0);
		return Math.round(this * precision) / precision;
	},

	times: function(fn, bind)
	{
		for (var i = 0; i < this; i++) 
		{
			fn.call(bind, i, this);
		}
	},

	toFloat: function()
	{
		return parseFloat(this);
	},

	toInt: function(base)
	{
		return parseInt(this, base || 10);
	}
});

Number.alias('times', 'each');

(function(math)
{
	var methods = {};
	math.each(function(name)
	{
		if (!Number[name]) methods[name] = function()
		{
			return Math[name].apply(null, [this].concat($A(arguments)));
		};
	});
	Number.implement(methods);
})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);


/*
---
script: String.js
description: Contains String Prototypes like camelCase, capitalize, test, and toInt.
license: MIT-style license.
requires:
- /Native
provides: [String]
...
*/
String.implement
({
	test: function(regex, params)
	{
		var testObj = null;
		
		if((typeof regex == 'string'))
		{
			testObj = new RegExp(regex, params);
		}
		else
		{
			testObj = regex;
		}
		
		return regex.test(this);
		
		//return ((typeof regex == 'string') ? new RegExp(regex, params) : regex).test(this);
	},

	contains: function(string, separator)
	{
		if(separator)
		{
			return (separator + this + separator).indexOf(separator + string + separator) > -1;
		}
		else
		{
			return this.indexOf(string) > -1;
		}
		//return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
	},

	trim: function()
	{
		return this.replace(/^\s+|\s+$/g, '');
	},

	clean: function()
	{
		return this.replace(/\s+/g, ' ').trim();
	},

	camelCase: function()
	{
		return this.replace(/-\D/g, function(match)
		{
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function()
	{
		return this.replace(/[A-Z]/g, function(match)
		{
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	capitalize: function()
	{
		return this.replace(/\b[a-z]/g, function(match)
		{
			return match.toUpperCase();
		});
	},

	escapeRegExp: function()
	{
		return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	toInt: function(base)
	{
		return parseInt(this, base || 10);
	},

	toFloat: function()
	{
		return parseFloat(this);
	},

	hexToRgb: function(array)
	{
		var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		if(hex)
		{
			return hex.slice(1).hexToRgb(array);
		}
		else
		{
			return null;
		}
	},

	rgbToHex: function(array)
	{
		var rgb = this.match(/\d{1,3}/g);
		
		if(rgb) 
		{
			return rgb.rgbToHex(array);
		}
		else
		{
			return null;
		}
		//return (rgb) ? rgb.rgbToHex(array) : null;
	},

	stripScripts: function(option)
	{
		var scripts = '';
		var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function()
		{
			scripts += arguments[1] + '\n';
			return '';
		});
		if (option === true)
		{
			$exec(scripts);
		}
		else if ($type(option) == 'function') 
		{
			option(scripts, text);
		}
		
		return text;
	},

	substitute: function(object, regexp)
	{
		return this.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name)
		{
			if (match.charAt(0) == '\\') 
			{
				return match.slice(1);
			}
			
			if(object[name] != undefined)
			{
				return object[name];
			}
			else
			{
				return '';
			}
			
			//return (object[name] != undefined) ? object[name] : '';
		});
	}
});


/*
---
script: Hash.js
description: Contains Hash Prototypes. Provides a means for overcoming the JavaScript practical impossibility of extending native Objects.
license: MIT-style license.
requires:
- /Hash.base
provides: [Hash]
...
*/

Hash.implement
({
	has: Object.prototype.hasOwnProperty,

	keyOf: function(value)
	{
		for (var key in this)
		{
			if (this.hasOwnProperty(key) && this[key] === value) 
			{
				return key;
			}
		}
		
		return null;
	},

	hasValue: function(value)
	{
		return (Hash.keyOf(this, value) !== null);
	},

	extend: function(properties)
	{
		if(!properties)
		{
			properties = {};
		}
		
		Hash.each(properties, function(value, key)
		{
			Hash.set(this, key, value);
		}, this);
		
		return this;
	},

	combine: function(properties)
	{
		if(!properties)
		{
			properties = {};
		}
		
		Hash.each(properties, function(value, key)
		{
			Hash.include(this, key, value);
		}, this);
		
		return this;
	},

	erase: function(key)
	{
		if (this.hasOwnProperty(key)) 
		{
			delete this[key];
		}
		
		return this;
	},

	get: function(key)
	{
		if(this.hasOwnProperty(key))
		{
			return this[key];
		}
		else
		{
			return null;
		}
		
		//return (this.hasOwnProperty(key)) ? this[key] : null;
	},

	set: function(key, value)
	{
		if (!this[key] || this.hasOwnProperty(key)) 
		{
			this[key] = value;
		}
		
		return this;
	},

	empty: function()
	{
		Hash.each(this, function(value, key)
		{
			delete this[key];
		}, this);
		
		return this;
	},

	include: function(key, value)
	{
		if (this[key] == undefined) 
		{
			this[key] = value;
		}
		
		return this;
	},

	map: function(fn, bind)
	{
		var results = new Hash;
		
		Hash.each(this, function(value, key)
		{
			results.set(key, fn.call(bind, value, key, this));
		}, this);
		
		return results;
	},

	filter: function(fn, bind)
	{
		var results = new Hash;
		Hash.each(this, function(value, key)
		{
			if (fn.call(bind, value, key, this)) 
			{
				results.set(key, value);
			}
		}, this);
		return results;
	},

	every: function(fn, bind)
	{
		for (var key in this)
		{
			if (this.hasOwnProperty(key) && !fn.call(bind, this[key], key)) 
			{
				return false;
			}
		}
		return true;
	},

	some: function(fn, bind)
	{
		for (var key in this)
		{
			if (this.hasOwnProperty(key) && fn.call(bind, this[key], key)) 
			{
				return true;
			}
		}
		
		return false;
	},

	getKeys: function()
	{
		var keys = [];
		
		Hash.each(this, function(value, key)
		{
			keys.push(key);
		});
		
		return keys;
	},

	getValues: function()
	{
		var values = [];
		
		Hash.each(this, function(value)
		{
			values.push(value);
		});
		
		return values;
	},

	toQueryString: function(base)
	{
		var queryString = [];
		Hash.each(this, function(value, key)
		{
			if (base) 
			{
				key = base + '[' + key + ']';
			}
			
			var result;
			switch ($type(value))
			{
				case 'object': 
					result = Hash.toQueryString(value, key); 
					break;
				case 'array':
					var qs = {};
					value.each(function(val, i){
						qs[i] = val;
					});
					result = Hash.toQueryString(qs, key);
				break;
				default: 
					result = key + '=' + encodeURIComponent(value);
			}
			
			if (value != undefined) 
			{
				queryString.push(result);
			}
		});

		return queryString.join('&');
	}
});

Hash.alias({keyOf: 'indexOf', hasValue: 'contains'});


/*
---

script: Event.js

description: Contains the Event Class, to make the event object cross-browser.

license: MIT-style license.

requires:
- /Window
- /Document
- /Hash
- /Array
- /Function
- /String

provides: [Event]

...
*/

var Event = new Native
({

	name: 'Event',
	
	initialize: function(event, win)
	{
		if(!win)
		{
			win = window;
		}
		
		var doc = win.document;
		
		if(!event)
		{
			event = win.event;
		}
		
		if (event.$extended) 
		{
			return event;
		}
		
		this.$extended = true;
		var type = event.type;
		
		var target = null;
		
		if(event.target)
		{
			target = event.target;
		}
		else
		{
			target = event.srcElement;
		}
		
		while (target && target.nodeType == 3) 
		{
			target = target.parentNode;
		}

		if (type.test(/key/))
		{
			var code = "";
			if(event.which)
			{
				code = event.which;
			}
			else
			{
				code = event.keyCode;
			}
			
			var key = Event.Keys.keyOf(code);
			
			if (type == 'keydown')
			{
				var fKey = code - 111;
				if (fKey > 0 && fKey < 13) 
				{
					key = 'f' + fKey;
				}
			}
			
			if(!key)
			{
				key = String.fromCharCode(code).toLowerCase();
			}
		} 
		else if (type.match(/(click|mouse|menu)/i))
		{
			if((!doc.compatMode || doc.compatMode == 'CSS1Compat'))
			{
				doc = doc.html;
			}
			else
			{
				doc = doc.body;
			}
			
			var page = 
			{
				x: event.pageX || event.clientX + doc.scrollLeft,
				y: event.pageY || event.clientY + doc.scrollTop
			};
			
			var client = 
			{
				x: (event.pageX) ? event.pageX - win.pageXOffset : event.clientX,
				y: (event.pageY) ? event.pageY - win.pageYOffset : event.clientY
			};
			
			if (type.match(/DOMMouseScroll|mousewheel/))
			{
				var wheel = null;
				
				if(event.wheelDelta)
				{
					wheel = event.wheelDelta / 120;
				}
				else
				{
					wheel = -(event.detail || 0) / 3;
				}
				
				//(event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
			}
			var rightClick = (event.which == 3) || (event.button == 2);
			var related = null;
			
			if (type.match(/over|out/))
			{
				switch (type)
				{
					case 'mouseover':
						if(event.relatedTarget)
						{
							related = event.relatedTarget;
						}
						else
						{
							related = event.fromElement;
						}
						//related = event.relatedTarget || event.fromElement; 
						break;
					case 'mouseout': 
						if(event.relatedTarget)
						{
							related = event.relatedTarget;
						}
						else
						{
							related = event.toElement;
						}
						//related = event.relatedTarget || event.toElement;
				}
				
				var ifArg = !(function()
				{
					while (related && related.nodeType == 3) 
					{
						related = related.parentNode;
					}
					
					return true;
				}).create({attempt: Browser.Engine.gecko})();
				
				if (ifArg) 
				{
					related = false;
				}
			}
		}

		return $extend(this, 
		{
			event: event,
			type: type,

			page: page,
			client: client,
			rightClick: rightClick,

			wheel: wheel,

			relatedTarget: related,
			target: target,

			code: code,
			key: key,

			shift: event.shiftKey,
			control: event.ctrlKey,
			alt: event.altKey,
			meta: event.metaKey
		});
	}
});

Event.Keys = new Hash({
	'enter': 13,
	'up': 38,
	'down': 40,
	'left': 37,
	'right': 39,
	'esc': 27,
	'space': 32,
	'backspace': 8,
	'tab': 9,
	'delete': 46
});

Event.implement
({
	stop: function()
	{
		return this.stopPropagation().preventDefault();
	},

	stopPropagation: function()
	{
		if (this.event.stopPropagation) 
		{
			this.event.stopPropagation();
		}
		else 
		{
			this.event.cancelBubble = true;
		}
		return this;
	},

	preventDefault: function()
	{
		if (this.event.preventDefault) 
		{
			this.event.preventDefault();
		}
		else 
		{
			this.event.returnValue = false;
		}
		
		return this;
	}
});

/*
---

script: Class.js

description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.

license: MIT-style license.

requires:
- /$util
- /Native
- /Array
- /String
- /Function
- /Number
- /Hash

provides: [Class]

...
*/

function Class(params)
{
	if (params instanceof Function) 
	{
		params = {initialize: params};
	}
	
	var newClass = function()
	{
		Object.reset(this);
		if (newClass._prototyping) 
		{
			return this;
		}
		
		this._current = $empty;
		
		if(this.initialize)
		{
			var value = this.initialize.apply(this, arguments);
		}
		else
		{
			var value = this;
		}
		
		//var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		delete this._current;
		delete this.caller;
		return value;
	}.extend(this);
	
	newClass.implement(params);
	
	newClass.constructor = Class;
	newClass.prototype.constructor = newClass;

	return newClass;
};

Function.prototype.protect = function()
{
	this._protected = true;
	return this;
};

Object.reset = function(object, key)
{		
	if (key == null)
	{
		for (var p in object) 
		{
			Object.reset(object, p);
		}
		
		return object;
	}
	
	delete object[key];
	
	switch ($type(object[key]))
	{
		case 'object':
			var F = function(){};
			F.prototype = object[key];
			var i = new F;
			object[key] = Object.reset(i);
			break;
		case 'array': 
			object[key] = $unlink(object[key]); 
			break;
	}
	
	return object;
};

new Native({name: 'Class', initialize: Class}).extend
({
	instantiate: function(F)
	{
		F._prototyping = true;
		var proto = new F;
		delete F._prototyping;
		return proto;
	},
	
	wrap: function(self, key, method)
	{
		if (method._origin) 
		{
			method = method._origin;
		}
		
		return function()
		{
			if (method._protected && this._current == null) 
			{
				throw new Error('The method "' + key + '" cannot be called.');
			}
			var caller = this.caller, current = this._current;
			this.caller = current; this._current = arguments.callee;
			var result = method.apply(this, arguments);
			this._current = current; this.caller = caller;
			return result;
		}.extend({_owner: self, _origin: method, _name: key});
	}
});

Class.implement
({	
	implement: function(key, value)
	{
		if ($type(key) == 'object')
		{
			for (var p in key) 
			{
				this.implement(p, key[p]);
			}
			
			return this;
		}
		
		var mutator = Class.Mutators[key];
		
		if (mutator)
		{
			value = mutator.call(this, value);
			if (value == null) 
			{
				return this;
			}
		}
		
		var proto = this.prototype;

		switch ($type(value))
		{
			
			case 'function':
				if (value._hidden) 
				{
					return this;
				}
				proto[key] = Class.wrap(this, key, value);
			break;
			
			case 'object':
				var previous = proto[key];
				if ($type(previous) == 'object') 
				{
					$mixin(previous, value);
				}
				else 
				{
					proto[key] = $unlink(value);
				}
			break;
			
			case 'array':
				proto[key] = $unlink(value);
			break;
			default: 
				proto[key] = value;
		}
		
		return this;
	}
});

Class.Mutators = 
{
	Extends: function(parent)
	{
		this.parent = parent;
		this.prototype = Class.instantiate(parent);

		this.implement('parent', function()
		{
			var name = this.caller._name, previous = this.caller._owner.parent.prototype[name];
			if (!previous) 
			{
				throw new Error('The method "' + name + '" has no parent.');
			}
			
			return previous.apply(this, arguments);
		}.protect());
	},

	Implements: function(items)
	{
		$splat(items).each(function(item)
		{
			if (item instanceof Function) 
			{
				item = Class.instantiate(item);
			}
			
			this.implement(item);
		}, this);
	}
};


/*
---
script: Class.Extras.js
description: Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.
license: MIT-style license.
requires:
- /Class
provides: [Chain, Events, Options]
...
*/

var Chain = new Class
({
	$chain: [],
	chain: function()
	{
		this.$chain.extend(Array.flatten(arguments));
		return this;
	},

	callChain: function()
	{
		if(this.$chain.length)
		{
			return this.$chain.shift().apply(this, arguments);
		}
		else
		{
			return false;
		}

		//return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : false;
	},

	clearChain: function()
	{
		this.$chain.empty();
		return this;
	}

});

var Events = new Class(
{
	$events: {},

	addEvent: function(type, fn, internal)
	{
		type = Events.removeOn(type);
		if (fn != $empty)
		{
			if(!this.$events[type])
			{
				this.$events[type] = [];
			}

			this.$events[type].include(fn);
			if (internal) 
			{
				fn.internal = true;
			}
		}
		return this;
	},

	addEvents: function(events)
	{
		for (var type in events) 
		{
			this.addEvent(type, events[type]);
		}
		return this;
	},

	fireEvent: function(type, args, delay)
	{
		type = Events.removeOn(type);
		if (!this.$events || !this.$events[type]) 
		{
			return this;
		}
		this.$events[type].each(function(fn)
		{
			fn.create({'bind': this, 'delay': delay, 'arguments': args})();
		}, this);
		
		return this;
	},

	removeEvent: function(type, fn)
	{
		type = Events.removeOn(type);
		if (!this.$events[type]) 
		{
			return this;
		}
		
		if (!fn.internal) 
		{
			this.$events[type].erase(fn);
		}
		
		return this;
	},

	removeEvents: function(events)
	{
		var type;
		if ($type(events) == 'object')
		{
			for (type in events) 
			{
				this.removeEvent(type, events[type]);
			}
			
			return this;
		}
		if (events) 
		{
			events = Events.removeOn(events);
		}
		
		for (type in this.$events)
		{
			if (events && events != type) 
			{
				continue;
			}
			
			var fns = this.$events[type];
			
			for (var i = fns.length; i--; i) 
			{
				this.removeEvent(type, fns[i]);
			}
		}
		
		return this;
	}

});

Events.removeOn = function(string)
{
	return string.replace(/^on([A-Z])/, function(full, first)
	{
		return first.toLowerCase();
	});
};

var Options = new Class
({
	setOptions: function()
	{
		this.options = $merge.run([this.options].extend(arguments));
		if (!this.addEvent) 
		{
			return this;
		}
		
		for (var option in this.options)
		{
			if ($type(this.options[option]) != 'function' || !(/^on[A-Z]/).test(option)) 
			{
				continue;
			}
			
			this.addEvent(option, this.options[option]);
			
			delete this.options[option];
		}
		return this;
	}
});


/*
---

script: Element.js

description: One of the most important items in MooTools. Contains the dollar function, the dollars function, and an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

license: MIT-style license.

requires:
- /Window
- /Document
- /Array
- /String
- /Function
- /Number
- /Hash

provides: [Element, Elements, $, $$, Iframe]

...
*/

var Element = new Native({

	name: 'Element',

	legacy: window.Element,

	initialize: function(tag, props)
	{
		var konstructor = Element.Constructors.get(tag);
		
		if (konstructor) 
		{
			return konstructor(props);
		}
		
		if (typeof tag == 'string') 
		{
			return document.newElement(tag, props);
		}
		return document.id(tag).set(props);
	},

	afterImplement: function(key, value)
	{
		Element.Prototype[key] = value;
		if (Array[key]) 
		{
			return;
		}
		
		Elements.implement(key, function()
		{
			var items = [], elements = true;
			for (var i = 0, j = this.length; i < j; i++)
			{
				var returns = this[i][key].apply(this[i], arguments);
				
				items.push(returns);
				if (elements) 
				{
					elements = ($type(returns) == 'element');
				}
			}
			
			return (elements) ? new Elements(items) : items;
		});
	}

});

Element.Prototype = {$family: {name: 'element'}};

Element.Constructors = new Hash;

var IFrame = new Native({

	name: 'IFrame',

	generics: false,

	initialize: function()
	{
		var params = Array.link(arguments, {properties: Object.type, iframe: $defined});
		
		var props = {};
		
		if(params.properties) 
		{
			props = params.properties;
		}
		
		var onload = $empty;
		
		if(props.onload)
		{
			onload = props.onload;
		}

		var iframe = document.id(params.iframe);
		delete props.onload;
		
		props.id = props.name = $pick(props.id, props.name, iframe ? (iframe.id || iframe.name) : 'IFrame_' + $time());
		
		var aIframe = iframe;
		
		if(!iframe)
		{
			aIframe = 'iframe';
		}
		
		iframe = new Element(aIframe, props);
		
		var onFrameLoad = function()
		{
			var host = $try(function()
			{
				return iframe.contentWindow.location.host;
			});
			
			if (!host || host == window.location.host)
			{
				var win = new Window(iframe.contentWindow);
				new Document(iframe.contentWindow.document);
				$extend(win.Element.prototype, Element.Prototype);
			}
			onload.call(iframe.contentWindow, iframe.contentWindow.document);
		};
		var contentWindow = $try(function()
		{
			return iframe.contentWindow;
		});
		
		if(((contentWindow && contentWindow.document.body) || window.frames[props.id]))
		{
			onFrameLoad();
		}
		else
		{
			iframe.addListener('load', onFrameLoad);
		}
		
		return iframe;
	}

});

var Elements = new Native
({
	initialize: function(elements, options)
	{
		options = $extend({ddup: true, cash: true}, options);
		elements = elements || [];
		
		if (options.ddup || options.cash)
		{
			var uniques = {}, returned = [];
			for (var i = 0, l = elements.length; i < l; i++)
			{
				var el = document.id(elements[i], !options.cash);
				if (options.ddup)
				{
					if (uniques[el.uid]) 
					{
						continue;
					}
					uniques[el.uid] = true;
				}
				if (el) 
				{
					returned.push(el);
				}
			}
			elements = returned;
		}
		
		if(options.cash)
		{
			return $extend(elements, this);
		}
		else
		{
			return elements;
		}
		
		//return (options.cash) ? $extend(elements, this) : elements;
	}

});

Elements.implement
({
	filter: function(filter, bind)
	{
		if (!filter) 
		{
			return this;
		}
		
		var arg = null;
		
		if(typeof filter == 'string')
		{
			arg = function(item)
			{
				return item.match(filter);
			};
		}
		else
		{
			arg = filter;
		}
		
		return new Elements(Array.filter(this, arg, bind));
	}
});

Document.implement({

	newElement: function(tag, props)
	{
		if (Browser.Engine.trident && props)
		{
			['name', 'type', 'checked'].each(function(attribute)
			{
				if (!props[attribute]) 
				{
					return;
				}
				tag += ' ' + attribute + '="' + props[attribute] + '"';
				if (attribute != 'checked') 
				{
					delete props[attribute];
				}
			});
			tag = '<' + tag + '>';
		}
		return document.id(this.createElement(tag)).set(props);
	},

	newTextNode: function(text)
	{
		return this.createTextNode(text);
	},

	getDocument: function()
	{
		return this;
	},

	getWindow: function()
	{
		return this.window;
	},
	
	id: (function()
	{	
		var types = 
		{
			string: function(id, nocash, doc)
			{
				id = doc.getElementById(id);
				if(id)
				{
					return types.element(id, nocash);
				}
				else
				{
					return null;
				}
			},
			
			element: function(el, nocash)
			{
				$uid(el);
				if (!nocash && !el.$family && !(/^object|embed$/i).test(el.tagName))
				{
					var proto = Element.Prototype;
					for (var p in proto) 
					{
						el[p] = proto[p];
					}
				};
				
				return el;
			},
			
			object: function(obj, nocash, doc)
			{
				if (obj.toElement) 
				{
					return types.element(obj.toElement(doc), nocash);
				}
				
				return null;
			}
		};

		types.textnode = types.whitespace = types.window = types.document = $arguments(0);
		
		return function(el, nocash, doc)
		{
			if (el && el.$family && el.uid) 
			{
				return el;
			}
			var type = $type(el);
			
			if(types[type])
			{
				var docArg = document;
				
				if(doc)
				{
					docArg = doc
				}
			
				return types[type](el, nocash, docArg);
			}
			else
			{
				return null;
			}
			//return (types[type]) ? types[type](el, nocash, doc || document) : null;
		};

	})()

});

if (window.$ == null) Window.implement
({
	$: function(el, nc)
	{
		return document.id(el, nc, this.document);
	}
});

Window.implement
({
	$$: function(selector)
	{
		if (arguments.length == 1 && typeof selector == 'string') 
		{
			return this.document.getElements(selector);
		}
		var elements = [];
		var args = Array.flatten(arguments);
		
		for (var i = 0, l = args.length; i < l; i++)
		{
			var item = args[i];
			switch ($type(item))
			{
				case 'element': 
					elements.push(item); 
					break;
				case 'string': 
					elements.extend(this.document.getElements(item, true));
			}
		}
		
		return new Elements(elements);
	},

	getDocument: function()
	{
		return this.document;
	},

	getWindow: function()
	{
		return this;
	}

});

Native.implement([Element, Document], 
{
	getElement: function(selector, nocash)
	{
		return document.id(this.getElements(selector, true)[0] || null, nocash);
	},

	getElements: function(tags, nocash)
	{
		tags = tags.split(',');
		var elements = [];
		var ddup = (tags.length > 1);
		tags.each(function(tag)
		{
			var partial = this.getElementsByTagName(tag.trim());
			if(ddup)
			{
				elements.extend(partial);
			}
			else
			{
				elements = partial;
			}
			//(ddup) ? elements.extend(partial) : elements = partial;
		}, this);
		
		return new Elements(elements, {ddup: ddup, cash: !nocash});
	}

});

(function(){

var textAreaCondition = (Browser.Engine.webkit && Browser.Engine.version < 420);
var propNameTextArea = "value";

if(textAreaCondition)
{
	propNameTextArea = "innerHTML";
}

var collected = {}, storage = {};
var props = {input: 'checked', option: 'selected', textarea: propNameTextArea};

var get = function(uid)
{
	var arg = storage[uid];
	
	if(!arg)
	{
		arg = storage[uid] = {};
	}
	
	return arg;
	//return (storage[uid] || (storage[uid] = {}));
};

var clean = function(item, retain)
{
	if (!item) 
	{
		return;
	}
	
	var uid = item.uid;
	
	if (Browser.Engine.trident)
	{
		if (item.clearAttributes)
		{
			var clone = retain && item.cloneNode(false);
			item.clearAttributes();
			if (clone) 
			{
				item.mergeAttributes(clone);
			}
		} 
		else if (item.removeEvents)
		{
			item.removeEvents();
		}
		if ((/object/i).test(item.tagName))
		{
			for (var p in item)
			{
				if (typeof item[p] == 'function') 
				{
					item[p] = $empty;
				}
			}
			Element.dispose(item);
		}
	}	
	if (!uid) 
	{
		return;
	}
	collected[uid] = storage[uid] = null;
};

var purge = function()
{
	Hash.each(collected, clean);
	if (Browser.Engine.trident) 
	{
		$A(document.getElementsByTagName('object')).each(clean);
	}
	
	if (window.CollectGarbage) 
	{
		CollectGarbage();
	}
	
	collected = storage = null;
};

var walk = function(element, walk, start, match, all, nocash)
{
	var el = element[start || walk];
	var elements = [];
	while (el)
	{
		if (el.nodeType == 1 && (!match || Element.match(el, match)))
		{
			if (!all) 
			{
				return document.id(el, nocash);
			}
			elements.push(el);
		}
		el = el[walk];
	}
	
	if(all)
	{
		return new Elements(elements, {ddup: false, cash: !nocash});
	}
	else
	{
		return null;
	}
	//return (all) ? new Elements(elements, {ddup: false, cash: !nocash}) : null;
};

var propNameText = "textContent";

if((Browser.Engine.trident || (Browser.Engine.webkit && Browser.Engine.version < 420)))
{
	propNameText = "innerText"
}

var attributes = 
{
	'html': 'innerHTML',
	'class': 'className',
	'for': 'htmlFor',
	'defaultValue': 'defaultValue',
	'text':  propNameText
};
var bools = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readonly', 'multiple', 'selected', 'noresize', 'defer'];
var camels = ['value', 'type', 'defaultValue', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap'];

bools = bools.associate(bools);

Hash.extend(attributes, bools);
Hash.extend(attributes, camels.associate(camels.map(String.toLowerCase)));

var inserters = 
{
	before: function(context, element)
	{
		if (element.parentNode) 
		{
			element.parentNode.insertBefore(context, element);
		}
	},

	after: function(context, element)
	{
		if (!element.parentNode) 
		{
			return;
		}

		var next = element.nextSibling;
		
		if(next)
		{
			element.parentNode.insertBefore(context, next);
		}
		else
		{
			element.parentNode.appendChild(context);
		}
		
		//(next) ? element.parentNode.insertBefore(context, next) : element.parentNode.appendChild(context);
	},

	bottom: function(context, element)
	{
		element.appendChild(context);
	},

	top: function(context, element)
	{
		var first = element.firstChild;
		if(first)
		{
			return element.insertBefore(context, first);
		}
		else
		{
			return element.appendChild(context);
		}
		//(first) ? element.insertBefore(context, first) : element.appendChild(context);
	}
};

inserters.inside = inserters.bottom;

Hash.each(inserters, function(inserter, where)
{
	where = where.capitalize();

	Element.implement('inject' + where, function(el)
	{
		inserter(this, document.id(el, true));
		return this;
	});

	Element.implement('grab' + where, function(el)
	{
		inserter(document.id(el, true), this);
		return this;
	});
});

Element.implement(
{
	set: function(prop, value)
	{
		switch ($type(prop))
		{
			case 'object':
				for (var p in prop) 
				{
					this.set(p, prop[p]);
				}
				break;
			case 'string':
				var property = Element.Properties.get(prop);
				
				if((property && property.set))
				{
					property.set.apply(this, Array.slice(arguments, 1));
				}
				else
				{
					this.setProperty(prop, value);
				}
				
				//(property && property.set) ? property.set.apply(this, Array.slice(arguments, 1)) : this.setProperty(prop, value);
		}
		return this;
	},

	get: function(prop)
	{
		var property = Element.Properties.get(prop);
		
		if(property && property.get)
		{
			return property.get.apply(this, Array.slice(arguments, 1));
		}
		else
		{
			return this.getProperty(prop);
		}
	
		//return (property && property.get) ? property.get.apply(this, Array.slice(arguments, 1)) : this.getProperty(prop);
	},

	erase: function(prop)
	{
		var property = Element.Properties.get(prop);
		
		if(property && property.erase)
		{
			property.erase.apply(this);
		}
		else
		{
			this.removeProperty(prop);
		}
		//(property && property.erase) ? property.erase.apply(this) : this.removeProperty(prop);
		
		return this;
	},

	setProperty: function(attribute, value)
	{
		var key = attributes[attribute];
		
		if (value == undefined) 
		{
			return this.removeProperty(attribute);
		}
		
		if (key && bools[attribute]) 
		{
			value = !!value;
		}
		
		if(key)
		{
			this[key] = value;
		}
		else
		{
			this.setAttribute(attribute, '' + value);
		}
		
		//(key) ? this[key] = value : this.setAttribute(attribute, '' + value);
		return this;
	},

	setProperties: function(attributes)
	{
		for (var attribute in attributes) 
		{
			this.setProperty(attribute, attributes[attribute]);
		}
		
		return this;
	},

	getProperty: function(attribute)
	{
		var key = attributes[attribute];
		var value = null;
		
		if(key)
		{
			value = this[key];
		}
		else
		{
			value = this.getAttribute(attribute, 2);
		}
		//(key) ? this[key] : this.getAttribute(attribute, 2);
		
		if(bools[attribute])
		{
			return !!value;
		}
		else
		{
			if(key)
			{
				return value;
			}
			else
			{
				if(value) 
				{
					return value;
				}
				else
				{
					return null;
				}
			}
			//(key) ? value : value || null
		}
		
		//return (bools[attribute]) ? !!value : (key) ? value : value || null;
	},

	getProperties: function()
	{
		var args = $A(arguments);
		return args.map(this.getProperty, this).associate(args);
	},

	removeProperty: function(attribute)
	{
		var key = attributes[attribute];
		if(key)
		{
			if((key && bools[attribute]))
			{
				this[key] = false;
			}
			else
			{
				this[key] = '';
			}
		}
		else
		{
			this.removeAttribute(attribute);
		}
		//(key) ? this[key] = (key && bools[attribute]) ? false : '' : this.removeAttribute(attribute);
		return this;
	},

	removeProperties: function()
	{
		Array.each(arguments, this.removeProperty, this);
		return this;
	},

	hasClass: function(className)
	{
		return this.className.contains(className, ' ');
	},

	addClass: function(className)
	{
		if (!this.hasClass(className)) 
		{
			this.className = (this.className + ' ' + className).clean();
		}
		return this;
	},

	removeClass: function(className)
	{
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
		return this;
	},

	toggleClass: function(className)
	{
		if(this.hasClass(className))
		{
			return this.removeClass(className);
		}
		else
		{
			return this.addClass(className);
		}
		
		//return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
	},

	adopt: function(){
		Array.flatten(arguments).each(function(element)
		{
			element = document.id(element, true);
			if (element) 
			{
				this.appendChild(element);
			}
		}, this);
		
		return this;
	},

	appendText: function(text, where)
	{
		return this.grab(this.getDocument().newTextNode(text), where);
	},

	grab: function(el, where)
	{
		if(!where)
		{
			where = 'bottom';
		}
		inserters[where](document.id(el, true), this);
		return this;
	},

	inject: function(el, where)
	{
		if(!where)
		{
			where = 'bottom';
		}
		
		inserters[where](this, document.id(el, true));
		return this;
	},

	replaces: function(el)
	{
		el = document.id(el, true);
		el.parentNode.replaceChild(this, el);
		return this;
	},

	wraps: function(el, where)
	{
		el = document.id(el, true);
		return this.replaces(el).grab(el, where);
	},

	getPrevious: function(match, nocash)
	{
		return walk(this, 'previousSibling', null, match, false, nocash);
	},

	getAllPrevious: function(match, nocash)
	{
		return walk(this, 'previousSibling', null, match, true, nocash);
	},

	getNext: function(match, nocash)
	{
		return walk(this, 'nextSibling', null, match, false, nocash);
	},

	getAllNext: function(match, nocash)
	{
		return walk(this, 'nextSibling', null, match, true, nocash);
	},

	getFirst: function(match, nocash)
	{
		return walk(this, 'nextSibling', 'firstChild', match, false, nocash);
	},

	getLast: function(match, nocash)
	{
		return walk(this, 'previousSibling', 'lastChild', match, false, nocash);
	},

	getParent: function(match, nocash)
	{
		return walk(this, 'parentNode', null, match, false, nocash);
	},

	getParents: function(match, nocash)
	{
		return walk(this, 'parentNode', null, match, true, nocash);
	},
	
	getSiblings: function(match, nocash)
	{
		return this.getParent().getChildren(match, nocash).erase(this);
	},

	getChildren: function(match, nocash)
	{
		return walk(this, 'nextSibling', 'firstChild', match, true, nocash);
	},

	getWindow: function()
	{
		return this.ownerDocument.window;
	},

	getDocument: function()
	{
		return this.ownerDocument;
	},

	getElementById: function(id, nocash)
	{
		var el = this.ownerDocument.getElementById(id);
		if (!el) 
		{
			return null;
		}
		for (var parent = el.parentNode; parent != this; parent = parent.parentNode)
		{
			if (!parent) 
			{
				return null;
			}
		}
		return document.id(el, nocash);
	},

	getSelected: function()
	{
		return new Elements($A(this.options).filter(function(option)
		{
			return option.selected;
		}));
	},

	getComputedStyle: function(property)
	{
		if (this.currentStyle) 
		{
			return this.currentStyle[property.camelCase()];
		}
		var computed = this.getDocument().defaultView.getComputedStyle(this, null);
		
		if(computed)
		{
			return computed.getPropertyValue([property.hyphenate()]);
		}
		else
		{
			return null;
		}
		
		//return (computed) ? computed.getPropertyValue([property.hyphenate()]) : null;
	},

	toQueryString: function()
	{
		var queryString = [];
		this.getElements('input, select, textarea', true).each(function(el)
		{
			if (!el.name || el.disabled || el.type == 'submit' || el.type == 'reset' || el.type == 'file') 
			{
				return;
			}
			
			var value = null;
			
			if(el.tagName.toLowerCase() == 'select')
			{
				value = Element.getSelected(el).map(function(opt)
				{
					return opt.value;
				});
			}
			else
			{
				if((el.type == 'radio' || el.type == 'checkbox') && !el.checked)
				{
					value = null;
				}
				else
				{
					value = el.value;
				}
			}
			
			/*var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt)
			{
				return opt.value;
			}) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;*/
			
			$splat(value).each(function(val)
			{
				if (typeof val != 'undefined') 
				{
					queryString.push(el.name + '=' + encodeURIComponent(val));
				}
				
				Math.E + 1;
			});
		});
		return queryString.join('&');
	},

	clone: function(contents, keepid)
	{
		contents = contents !== false;
		var clone = this.cloneNode(contents);
		var clean = function(node, element)
		{
			if (!keepid) 
			{
				node.removeAttribute('id');
			}
			
			if (Browser.Engine.trident)
			{
				node.clearAttributes();
				node.mergeAttributes(element);
				node.removeAttribute('uid');
				if (node.options)
				{
					var no = node.options, eo = element.options;
					for (var j = no.length; j--;) 
					{
						no[j].selected = eo[j].selected;
					}
				}
			}
			
			var prop = props[element.tagName.toLowerCase()];
			
			if (prop && element[prop]) 
			{
				node[prop] = element[prop];
			}
		};

		if (contents)
		{
			var ce = clone.getElementsByTagName('*'), te = this.getElementsByTagName('*');
			
			for (var i = ce.length; i--;) 
			{
				clean(ce[i], te[i]);
				Math.E + 1;
			}
		}

		clean(clone, this);
		return document.id(clone);
	},

	destroy: function()
	{
		Element.empty(this);
		Element.dispose(this);
		clean(this, true);
		return null;
	},

	empty: function()
	{
		$A(this.childNodes).each(function(node)
		{
			Element.destroy(node);
		});
		return this;
	},

	dispose: function()
	{
		if(this.parentNode)
		{
			return this.parentNode.removeChild(this);
		}
		else
		{
			return this;
		}
		
		//return (this.parentNode) ? this.parentNode.removeChild(this) : this;
	},

	hasChild: function(el)
	{
		el = document.id(el, true);
		if (!el) 
		{
			return false;
		}
		if (Browser.Engine.webkit && Browser.Engine.version < 420) 
		{
			return $A(this.getElementsByTagName(el.tagName)).contains(el);
		}
		
		if(this.contains)
		{
			return (this != el && this.contains(el));
		}
		else
		{
			return !!(this.compareDocumentPosition(el) & 16);
		}
		
		//return (this.contains) ? (this != el && this.contains(el)) : !!(this.compareDocumentPosition(el) & 16);
	},

	match: function(tag)
	{
		return (!tag || (tag == this) || (Element.get(this, 'tag') == tag));
	}
});

Native.implement([Element, Window, Document], 
{
	addListener: function(type, fn){
	
		if (type == 'unload')
		{
			var old = fn, self = this;
			fn = function()
			{
				self.removeListener('unload', fn);
				old();
			};
		} 
		else 
		{
			collected[this.uid] = this;
		}
		
		if (this.addEventListener) 
		{
			this.addEventListener(type, fn, false);
		}
		else 
		{
			this.attachEvent('on' + type, fn);
		}
		
		return this;
	},

	removeListener: function(type, fn)
	{
		if (this.removeEventListener) 
		{
			this.removeEventListener(type, fn, false);
		}
		else 
		{
			this.detachEvent('on' + type, fn);
		}
		
		return this;
	},

	retrieve: function(property, dflt)
	{
		var storage = get(this.uid), prop = storage[property];
		
		if (dflt != undefined && prop == undefined) 
		{
			prop = storage[property] = dflt;
		}
		
		return $pick(prop);
	},

	store: function(property, value)
	{
		var storage = get(this.uid);
		storage[property] = value;
		return this;
	},

	eliminate: function(property)
	{
		var storage = get(this.uid);
		delete storage[property];
		return this;
	}

});

window.addListener('unload', purge);
})();

Element.Properties = new Hash;

Element.Properties.style = 
{

	set: function(style)
	{
		this.style.cssText = style;
	},

	get: function()
	{
		return this.style.cssText;
	},

	erase: function()
	{
		this.style.cssText = '';
	}
};

Element.Properties.tag = 
{
	get: function()
	{
		return this.tagName.toLowerCase();
	}
};

Element.Properties.html = (function()
{
	var wrapper = document.createElement('div');

	var translations = 
	{
		table: [1, '<table>', '</table>'],
		select: [1, '<select>', '</select>'],
		tbody: [2, '<table><tbody>', '</tbody></table>'],
		tr: [3, '<table><tbody><tr>', '</tr></tbody></table>']
	};
	translations.thead = translations.tfoot = translations.tbody;

	var html = 
	{
		set: function()
		{
			var html = Array.flatten(arguments).join('');
			var wrap = Browser.Engine.trident && translations[this.get('tag')];
			
			if (wrap)
			{
				var first = wrapper;
				first.innerHTML = wrap[1] + html + wrap[2];
				for (var i = wrap[0]; i--;) 
				{
					first = first.firstChild;
				}
				
				this.empty().adopt(first.childNodes);
			} 
			else 
			{
				this.innerHTML = html;
			}
		}
	};

	html.erase = html.set;

	return html;
})();

if (Browser.Engine.webkit && Browser.Engine.version < 420) 
{
	Element.Properties.text = 
	{
		get: function()
		{
			if (this.innerText) 
			{
				return this.innerText;
			}
			var temp = this.ownerDocument.newElement('div', {html: this.innerHTML}).inject(this.ownerDocument.body);
			var text = temp.innerText;
			temp.destroy();
			return text;
		}
	};
}


/*
---

script: Element.Event.js

description: Contains Element methods for dealing with events. This file also includes mouseenter and mouseleave custom Element Events.

license: MIT-style license.

requires: 
- /Element
- /Event

provides: [Element.Event]

...
*/

Element.Properties.events = {set: function(events)
{
	this.addEvents(events);
}};

Native.implement([Element, Window, Document], 
{
	addEvent: function(type, fn)
	{
		var events = this.retrieve('events', {});
		
		if(!events[type])
		{
			events[type] = {'keys': [], 'values': []};
		}
		
		//events[type] = events[type] || {'keys': [], 'values': []};
		if (events[type].keys.contains(fn)) 
		{
			return this;
		}
		events[type].keys.push(fn);
		var realType = type, custom = Element.Events.get(type), condition = fn, self = this;
		if (custom)
		{
			if (custom.onAdd) 
			{
				custom.onAdd.call(this, fn);
			}
			if (custom.condition)
			{
				condition = function(event)
				{
					if (custom.condition.call(this, event)) 
					{
						return fn.call(this, event);
					}
					return true;
				};
			}
			
			realType = custom.base || realType;
		}
		var defn = function()
		{
			return fn.call(self);
		};
		var nativeEvent = Element.NativeEvents[realType];
		
		if (nativeEvent)
		{
			if (nativeEvent == 2)
			{
				defn = function(event)
				{
					event = new Event(event, self.getWindow());
					if (condition.call(self, event) === false) 
					{
						event.stop();
					}
				};
			}
			
			this.addListener(realType, defn);
		}
		
		events[type].values.push(defn);
		
		return this;
	},

	removeEvent: function(type, fn)
	{
		var events = this.retrieve('events');
		if (!events || !events[type]) 
		{
			return this;
		}
		var pos = events[type].keys.indexOf(fn);
		
		if (pos == -1) 
		{
			return this;
		}
		
		events[type].keys.splice(pos, 1);
		var value = events[type].values.splice(pos, 1)[0];
		var custom = Element.Events.get(type);
		
		if (custom)
		{
			if (custom.onRemove) 
			{
				custom.onRemove.call(this, fn);
			}
			
			type = custom.base || type;
		}
		
		if(Element.NativeEvents[type])
		{
			return this.removeListener(type, value);
		}
		else
		{
			return this;
		}
		
		//return (Element.NativeEvents[type]) ? this.removeListener(type, value) : this;
	},

	addEvents: function(events)
	{
		for (var event in events) 
		{
			this.addEvent(event, events[event]);
		}
		
		return this;
	},

	removeEvents: function(events)
	{
		var type;
		if ($type(events) == 'object')
		{
			for (type in events) 
			{
				this.removeEvent(type, events[type]);
			}
			
			return this;
		}
		var attached = this.retrieve('events');
		if (!attached) 
		{
			return this;
		}
		if (!events)
		{
			for (type in attached) 
			{
				this.removeEvents(type);
			}
			this.eliminate('events');
		} 
		else if (attached[events])
		{
			while (attached[events].keys[0]) 
			{
				this.removeEvent(events, attached[events].keys[0]);
			}
			
			attached[events] = null;
		}
		return this;
	},

	fireEvent: function(type, args, delay)
	{
		var events = this.retrieve('events');
		if (!events || !events[type]) 
		{
			return this;
		}
		events[type].keys.each(function(fn)
		{
			fn.create({'bind': this, 'delay': delay, 'arguments': args})();
		}, this);
		
		return this;
	},

	cloneEvents: function(from, type)
	{
		from = document.id(from);
		var fevents = from.retrieve('events');
		if (!fevents) 
		{
			return this;
		}
		
		if (!type)
		{
			for (var evType in fevents) 
			{
				this.cloneEvents(from, evType);
			}
		} 
		else if (fevents[type])
		{
			fevents[type].keys.each(function(fn)
			{
				this.addEvent(type, fn);
			}, this);
		}
		
		return this;
	}

});

Element.NativeEvents = 
{
	click: 2, dblclick: 2, mouseup: 2, mousedown: 2, contextmenu: 2, //mouse buttons
	mousewheel: 2, DOMMouseScroll: 2, //mouse wheel
	mouseover: 2, mouseout: 2, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
	keydown: 2, keypress: 2, keyup: 2, //keyboard
	focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, //form elements
	load: 1, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
	error: 1, abort: 1, scroll: 1 //misc
};

(function(){

var $check = function(event)
{
	var related = event.relatedTarget;
	if (related == undefined) 
	{
		return true;
	}
	if (related === false) 
	{
		return false;
	}
	
	return ($type(this) != 'document' && related != this && related.prefix != 'xul' && !this.hasChild(related));
};

Element.Events = new Hash(
{
	mouseenter: 
	{
		base: 'mouseover',
		condition: $check
	},
	mouseleave: 
	{
		base: 'mouseout',
		condition: $check
	},
	mousewheel: 
	{
		base: (Browser.Engine.gecko) ? 'DOMMouseScroll' : 'mousewheel'
	}
});
})();
/*
---
script: DomReady.js
description: Contains the custom event domready.
license: MIT-style license.
requires:
- /Element.Event
provides: [DomReady]
...
*/

Element.Events.domready = 
{
	onAdd: function(fn)
	{
		if (Browser.loaded) 
		{
			fn.call(this);
		}
	}
};

(function(){

	var domready = function()
	{
		if (Browser.loaded) 
		{
			return;
		}
		
		Browser.loaded = true;
		window.fireEvent('domready');
		document.fireEvent('domready');
	};
	
	window.addEvent('load', domready);

	if (Browser.Engine.trident)
	{
		var temp = document.createElement('div');
		(function()
		{
			var condition = ($try(function()
			{
				temp.doScroll(); // Technique by Diego Perini
				return document.id(temp).inject(document.body).set('html', 'temp').dispose();
			}));
			
			if(condition)
			{
				domready();
			}
			else
			{
				arguments.callee.delay(50)
			}
		})();
	} 
	else if (Browser.Engine.webkit && Browser.Engine.version < 525)
	{
		(function()
		{
			if((['loaded', 'complete'].contains(document.readyState)))
			{
				domready();
			}
			else
			{
				arguments.callee.delay(50);
			}
		})();
	} 
	else 
	{
		document.addEvent('DOMContentLoaded', domready);
	}
})();