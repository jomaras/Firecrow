var usesModule = typeof module !== 'undefined' && module.exports
if(usesModule)
{
    FBL =  { Firecrow: {}, ns:  function(namespaceFunction){ namespaceFunction(); }};
}

FBL.ns(function () { with (FBL) {
/*************************************************************/
Firecrow.ValueTypeHelper =
{
    expand: function(base, expander)
    {
        if(base == null || expander == null) { return; }

        for(var prop in expander)
        {
            base[prop] = expander[prop];
        }
    },

    objectHasProperties: function(object)
    {
        if(object == null) { return false; }

        for(var prop in object)
        {
            return true;
        }

        return false;
    },

    getHighestIndexProperty: function(object)
    {
        if(object == null) { return null; }

        var highestIndex = Number.NEGATIVE_INFINITY;

        for(var prop in object)
        {
            if(this.isStringInteger(prop) || this.isInteger(prop))
            {
                var number = prop * 1;

                if(number > highestIndex)
                {
                    highestIndex = number;
                }
            }
        }

        if(highestIndex == Number.NEGATIVE_INFINITY) { return null; }

        return highestIndex;
    },

    isOfType: function (variable, className)
    {
        return variable instanceof className;
    },

    isOneOfTypes: function(variable, classNames)
    {
        for(var i = 0, length = classNames.length; i < length; i++)
        {
            if(this.isOfType(variable, classNames[i]))
            {
                return true;
            }
        }

        return false;
    },

    isPrimitive: function(variable)
    {
        return typeof variable == "undefined" || typeof variable == "number"
            || typeof variable == "string" || typeof variable == "boolean"
            || variable == null;
    },

    arePrimitive: function()
    {
        if(arguments.length == 0) { return false; }

        for(var i = 0; i < arguments.length; i++)
        {
            if(!this.isPrimitive(arguments[i]))
            {
                return false;
            }
        }

        return true;
    },

    isFunction: function(variable)
    {
        return this.isOfType(variable, Function) || (typeof variable == "function");
    },

    isRegExp: function(variable)
    {
        if(variable == null) { return false; }

        return variable instanceof RegExp || (variable.constructor && variable.constructor.name == "RegExp");
    },

    isXMLHttpRequest: function(variable)
    {
        if(variable == null) { return false; }

        return variable instanceof XMLHttpRequest || (variable.constructor && variable.constructor.name == "XMLHttpRequest");
    },

    isBoolean: function(variable)
    {
        if (this.isNull(variable)) { return false; }

        return typeof(variable) == "boolean";
    },

    isString: function (variable)
    {
        if (this.isNull(variable)) { return false; }

        return (typeof variable) == "string" || variable instanceof String;
    },

    isNumber: function(variable)
    {
        if (this.isNull(variable)) { return false; }

        return (typeof variable) == "number";
    },

    isInteger: function (variable)
    {
        if (this.isNull(variable)) { return false; }

        return (typeof variable) == "number" && variable == parseInt(variable,10);
    },

    isStringInteger: function(variable)
    {
        if (this.isNull(variable)) { return false; }

        return variable == parseInt(variable,10);
    },

    isNull: function (variable)
    {
        return variable === null;
    },

    isObject: function(potentialObject)
    {
        if(potentialObject == null) { return false; }

        return 'object' == typeof potentialObject;
    },

    isEmptyObject: function(object)
    {
        if(object == null) { return false; }

        for(var prop in object)
        {
            if(object.hasOwnProperty(prop)) { return false; }
        }

        return true;
    },

    isArray: function (arrayOfElements)
    {
        if (this.isNull(arrayOfElements)) { return false; }

        return (typeof arrayOfElements) == "array" || arrayOfElements instanceof Array;
    },

    isArrayLike: function(arrayLike)
    {
        if(arrayLike == null || arrayLike.length === null || arrayLike.length === undefined) { return false; }

        return !this.isString(arrayLike);
    },

    isArrayOf: function (arrayOfElements, type)
    {
        if (!this.isArray(arrayOfElements)) { return false; }

        for (var i = 0; i < arrayOfElements.length; i++)
        {
            if (!this.isOfType(arrayOfElements[i], type)) { return false; }
        }

        return true;
    },

    isStringArray: function(arrayOfElements)
    {
        if (!this.isArray(arrayOfElements)) { return false; }

        for (var i = 0; i < arrayOfElements.length; i++)
        {
            if (!this.isString(arrayOfElements[i])) { return false; }
        }

        return true;
    },

    isIntegerArray: function(arrayOfElements)
    {
        if (!this.isArray(arrayOfElements)) { return false; }

        for (var i = 0; i < arrayOfElements.length; i++)
        {
            if (!this.isInteger(arrayOfElements[i])) { return false; }
        }

        return true;
    },

    reverseArray: function(array)
    {
        if(array == null || array.length <= 1) { return; }

        var length = array.length;
        var halfLength = length/2;

        for(var i = 0; i < halfLength; i++)
        {
            var temp = array[i];
            array[i] = array[length - i - 1];
            array[length - i - 1] = temp;
        }
    },

    arrayContains: function(array, item)
    {
        for(var i = 0; i < array.length; i++)
        {
            if(array[i] === item) { return true; }
        }

        return false;
    },

    deepClone: function(object)
    {
        try
        {
            return JSON.parse(JSON.stringify(object));
        }
        catch(e) { alert("Error when deep cloning object:" + e);}
    },

    flattenArray: function(array)
    {
        var flattened = [];

        for(var i = 0; i < array.length; i++)
        {
            var item = array[i];

            this.isArray(item) ? this.pushAll(flattened, item)
                               : flattened.push(item);
        }

        return flattened;
    },

    getSubList: function(array, startIndex, endIndex)
    {
        var subList = [];

        for(var i = startIndex; i < endIndex; i++)
        {
            subList.push(array[i]);
        }

        return subList;
    },

    getArraySum: function(array)
    {
        var sum = 0;

        for(var i = 0; i < array.length; i++)
        {
            sum += array[i];
        }

        return sum;
    },

    getWithoutFirstElement: function(array)
    {
        var withoutFirst = [];

        for(var i = 1; i < array.length; i++)
        {
            withoutFirst.push(array[i]);
        }

        return withoutFirst;
    },

    getRandomElementFromArray: function(array)
    {
        if(array == null) { return null; }

        return array[this.getRandomInt(0, array.length)];
    },

    getRandomInt: function (min, max)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    cleanDuplicatesFromArray: function(array)
    {
        var cleansedArray = [];

        for(var i = 0; i < array.length; i++)
        {
            if(!this.arrayContains(cleansedArray, array[i]))
            {
                cleansedArray.push(array[i]);
            }
        }

        return cleansedArray;
    },

    sortArray: function(array)
    {
        for(var i = 0; i < array.length; i++)
        {
            for(var j = 0 ; j < array.length; j++)
            {
                if(array[i] < array[j])
                {
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
        }
        
        return array;   
    },

    createFilledIntArray: function(startIndex, endIndex)
    {
        var array = [];
		
		for(var currentNumber = startIndex; currentNumber <= endIndex; currentNumber++)
		{
			array.push(currentNumber);
		}
		
		return array;
    },

    removeAfter: function(string, character)
    {
        var index = string.indexOf(character);

        if(index >= 0)
        {
            return string.substr(0, index);
        }

        return string;
    },
    
    convertToArray: function(arrayLikeStructure)
    {
    	var array = [];
    	
    	for(var i = 0; i < arrayLikeStructure.length; i++)
    	{
    		array.push(arrayLikeStructure[i]);
    	}
    	
    	return array;
    },

    convertObjectMapToArray: function(object)
    {
        var array = [];

        for(var prop in object)
        {
            array.push(object[prop]);
        }

        return array;
    },

    convertObjectPropertyNamesToArray: function(object)
    {
        var array = [];

        for(var prop in object)
        {
            array.push(prop);
        }

        return array;
    },

    removeFromArrayByElement:function(array, element)
    {
        try
        {
            var elementIndex = array.indexOf(element);
            return this.removeFromArrayByIndex(array, elementIndex);
        }
        catch(e) { alert("Error while removing elements from array by element: " + e);}
    },

    removeFromArrayByIndex:function(array, index)
    {
        try
        {
            if(index < 0 || index >= array.length) { debugger; alert("Index out of range when removing array in ValueTypeHelper"); return; }

            return array.splice(index, 1);
        }
        catch(e) { alert("Error while removing elements from array by index: " + e);}
    },

    insertIntoStringAtPosition: function(baseString, insertionString, position)
    {
        if(baseString == "") { return insertionString; }
        if(insertionString == "") { return baseString; }

        return baseString.substr(0, position) + insertionString + baseString.substr(position);
    },

    insertIntoArrayAtIndex: function(array, element, index)
    {
      try
      {
          array.splice(index, 0, element);
      }
      catch(e) { alert("Error occured when inserting into array in ValueTypeHelper:" + e); }
    },

    insertElementsIntoArrayAtIndex: function(array, elements, index)
    {
        try
        {
            elements.forEach(function(element)
            {
                this.insertIntoArrayAtIndex(array, element, index++);
            }, this);
        }
        catch(e) { alert("Error when inserting elements into array: " + e);}
    },

    createArrayCopy: function(array)
    {
        try
        {
            return array.slice();
        }
        catch(e) { alert("Error when Creating array copy - ValueTypeHelper:" + e);}
    },

    concatArray: function(firstArray, secondArray)
    {
        if(firstArray == null) { return secondArray; }
        if(secondArray == null) { return firstArray; }

        var joinedArray = [];

        for(var i = 0; i < firstArray.length; i++) { joinedArray.push(firstArray[i]); }
        for(var i = 0; i < secondArray.length; i++) { joinedArray.push(secondArray[i]); }

        return joinedArray;
    },

    pushAll: function(baseArray, arrayWithItems)
    {
        try
        {
            baseArray.push.apply(baseArray, arrayWithItems);
        }
        catch(e) { alert("Error while pushing all in ValueTypeHelper:" + e); }
    },

    findInArray: function(array, searchForItem, checkFunction)
    {
        try
        {
            for(var i = 0; i < array.length; i++)
            {
                var currentItem = array[i];

                if(checkFunction(currentItem, searchForItem))
                {
                    return currentItem;
                }
            }

            return null;
        }
        catch(e)
        {
            debugger;
            alert("ValueTypeHelper - Error while finding in array: " + e);
        }
    },

    clearArray: function(array)
    {
        for (var i = 0; i < array.length; i++)
        {
            if (array[i] == null)
            {
                array.splice(i, 1);
                i--;
            }
        }
    },
    
    trim: function(str, chars) 
    {
    	return this.trimLeft(this.trimRight(str, chars), chars);
    },
     
    trimLeft: function(str, chars) 
    {
    	chars = chars || "\\s";
    	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
    },
     
    trimRight: function(str, chars) 
    {
    	chars = chars || "\\s";
    	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
    },
    
    regexIndexOf: function(string, regex, startpos) 
    {
        var indexOf = string.substring(startpos || 0).search(regex);
        return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    },

    //TODO - quickfixing the Firefox create RegEx from literal bug
    adjustForRegExBug: function(regExElement, regExString)
    {
        if(regExElement == null || regExElement.parent == null
        || regExElement.parent.loc == null || regExElement.parent.loc.source == null || regExElement.parent.loc.source.indexOf("medialize") == -1)
        {
            return regExString;
        }

        //IT seems that Firefox regEx functionality differs if it /someRegEx/gi or /someRegEx/ig -> bug, iritating bug
        //but in the parse tree it does not show //ig but //gi regardless of what is put
        //So if it is part of the medialize library that i'm testing do that replacement
        return regExString.replace(/\/gi$/, "/ig");
    },

    isHtmlElement: function(object)
    {
        if(object == null) { return false; }
        //It seems that Chrome creates new instances of HTML functions for each frame
        return object instanceof HTMLElement //works in Firefox
            || (object.nodeType == 1 && object.nodeName !== ""); //For Chrome
    },

    isDocumentFragment: function(object)
    {
        if(object == null) { return false; }

        return object instanceof DocumentFragment
            || (object.nodeType == 11 && object.nodeName !== "");
    },

    isImageElement: function(object)
    {
        if(object == null) { return false; }

        return object instanceof Image || object instanceof HTMLImageElement
            || (object.nodeType == 1 && object.nodeName === "IMG");
    },

    isCanvasElement: function(object)
    {
        if(object == null) { return false; }

        return object instanceof HTMLCanvasElement
            || (object.nodeType == 1 && object.nodeName === "CANVAS");
    },

    isScriptElement: function(object)
    {
        if(object == null) { return false; }

        return object instanceof HTMLScriptElement
            || (object.nodeType == 1 && object.nodeName === "SCRIPT");
    },

    isIFrameElement: function(object)
    {
        if(object == null) { return false; }

        return object instanceof HTMLScriptElement
            || (object.nodeType == 1 && object.nodeName === "IFRAME");
    },

    isTextNode: function(object)
    {
        if(object == null) { return false; }

        return object instanceof Text
            || (object.nodeType == 3 && object.nodeName !== "");
    },

    isComment: function(object)
    {
        if(object == null) { return false; }

        return object instanceof Text
            || (object.nodeType == 8 && object.nodeName !== "");
    },

    isDocument:function(object)
    {
        if(object == null) { return false; }

        return object instanceof Document
            || (object.nodeType == 9 && object.nodeName !== "");
    },

    isHtmlSelectElement: function (object)
    {
        if(object == null) { return false; }

        return object instanceof HTMLSelectElement
            || (object.nodeType == 1 && object.nodeName == "SELECT");
    },

    isHtmlInputElement: function(object)
    {
        if(object == null) { return false; }

        return object instanceof HTMLSelectElement
            || (object.nodeType == 1 && object.nodeName == "INPUT");
    },

    isHtmlTextAreaElement: function(object)
    {
        if(object == null) { return false; }

        return object instanceof HTMLTextAreaElement
            || (object.nodeType == 9 && object.nodeName == "TEXTAREA");
    },

    isHtmlFormElement: function(object)
    {
        if(object == null) { return false; }

        return object instanceof HTMLFormElement
           || (object.nodeType == 1 && object.nodeName == "FORM");
    }
};

//https://github.com/timgilbert/js-weighted-list/blob/master/js-weighted-list.js
/*  Example usage
 var data = [['a', 10], ['b',  1], ['c',  1], ['d',  5], ['e',  3]];
 var wl = new WeightedList(data); - in my case i would make the first element the index, and the second the probability
 var result = wl.peek();   // Ex: ['a']
 */
Firecrow.ValueTypeHelper.WeightedList = (function() {

    function _WeightedList(initial) {
        this.weights = {};
        this.data = {};
        this.length = 0;
        this.hasData = false;

        initial = typeof initial !== 'undefined' ? initial : [];

        if (Array.isArray(initial)) {
            for (var i = 0; i < initial.length; i++) {
                //var item = initial[i];
                //this.push(item[0], item[1], item[2]);
                this.push(initial[i]);
            }
        } else {
            throw new Error('Unknown object "' + initial.toString() + '" passed to ' +
                'WeightedList constructor! (Expected array or nothing)');
        }
    }

    _WeightedList.prototype = {
        /**
         * Add a single item to the list.  The parameter passed in represents a single
         * key, with a weight and optionally some data attached.
         *
         * The parameter to this function can either be a 2-3 element array of
         * [k, w, d] for key, weight and data (data is optional) or an object with the
         * values {'key': k, 'weight': w, 'data': d} where d is optional.
         */
        push: function(element) {
            var key, weight, data;

            if (Array.isArray(element)) {
                key = element[0], weight = element[1], data = element[2];
                if (typeof key === 'undefined') {
                    // Eg, wl.push([])
                    throw new Error('In WeightedList.push([ ... ]), need at least two elements');
                } else if (typeof weight === 'undefined') {
                    // I suppose we could default to 1 here, but the API is already too forgiving
                    throw new Error('In array passed to WeightedList.push([ ... ]), second ' +
                        'element is undefined!');
                }
            } else if (typeof element === 'object') {
                // We expect {"key": "zombies", "weight": 10, "data": {"fast": true}}
                key = element.key, weight = element.weight, data = element.data;
                if (typeof key === 'undefined') {
                    throw new Error("In WeightedList.push({ ... }), no {'key': 'xyzzy'} pair found");
                } else if (typeof weight === 'undefined') {
                    // I suppose we could default to 1 here, but the API is already too forgiving
                    throw new Error('In array passed to WeightedList.push({ ... }), no ' +
                        "{'weight': 42} pair found");
                }
            } else {
                // else what the heck were you trying to give me?
                throw new Error('WeightedList.push() passed unknown type "' + typeof element +
                    '", expected [key, weight] or {"key": k, "weight": w}');
            }
            return this._push_values(key, weight, data);

        },
        /**
         * Add an item to the list
         * @access private
         * @param {String} key the key under which this item is stored
         * @param {number} weight the weight to assign to this key
         * @param {?Object} data any optional data associated wth this key
         */
        _push_values: function(key, weight, data) {
            //console.debug('k:', key, 'w:', weight, 'd:', data);

            if (this.weights[key]) {
                throw new Error('');
            }
            if (typeof weight !== typeof 1) {
                throw new Error('Weight must be numeric (got ' + weight.toString() + ')');
            }
            if (weight <= 0)  {
                throw new Error('Weight must be >= 0 (got ' + weight + ')');
            }

            this.weights[key] = weight;

            if (typeof data !== 'undefined') {
                this.hasData = true;
                this.data[key] = data;
            }
            this.length++;
        },

        /**
         * Add the given weight to the list item with the given key.  Note that if
         * the key does not already exist, this operation will silently create it.
         *
         * @todo might be nice to have a version of this that would throw an error
         *       on an unknown key.
         */
        addWeight: function(key, weight) {
            this.weights[key] += weight;
        },

        /**
         * Select n random elements (without replacement), default 1.
         * If andRemove is true (default false), remove the elements
         * from the list.  (This is what the pop() method does.)
         */
        peek: function(n, andRemove) {
            if (typeof n === 'undefined') {
                n = 1;
            }
            andRemove = !!andRemove;

            if (this.length - n < 0) {
                throw new Error('Stack underflow! Tried to retrieve ' + n +
                    ' element' + (n === 1 ? '' : 's') +
                    ' from a list of ' + this.length);
            }

            var heap = this._buildWeightedHeap();
            //console.debug('heap:', heap);
            var result = [];

            for (var i = 0; i < n; i++) {
                var key = heap.pop();
                //console.debug('k:', key);
                if (this.hasData) {
                    result.push({key: key, data: this.data[key]});
                } else {
                    result.push(key);
                }
                if (andRemove) {
                    delete this.weights[key];
                    delete this.data[key];
                    this.length--;
                }
            }
            return result;
        },

        /**
         * Return the entire list in a random order (note that this does not mutate the list)
         */
        shuffle: function() {
            return this.peek(this.length);
        },

        /**
         *
         */
        pop: function(n) {
            return this.peek(n, true);
        },

        /**
         * Build a WeightedHeap instance based on the data we've got
         */
        _buildWeightedHeap: function() {
            var items = [];
            for (var key in this.weights) if (this.weights.hasOwnProperty(key)) {
                items.push([key, this.weights[key]]);
            }
            //console.log('items',items);
            return new _WeightedHeap(items);
        }
    };

    /**
     * This is a javascript implementation of the algorithm described by
     * Jason Orendorff here: http://stackoverflow.com/a/2149533/87990
     */
    function _HeapNode(weight, value, total) {
        this.weight = weight;
        this.value = value;
        this.total = total;  // Total weight of this node and its children
    }
    /**
     * Note, we're using a heap structure here for its tree properties, not as a
     * classic binary heap. A node heap[i] has children at heap[i<<1] and at
     * heap[(i<<1)+1]. Its parent is at h[i>>1]. Heap[0] is vacant.
     */
    function _WeightedHeap(items) {
        this.heap = [null];   // Math is easier to read if we index array from 1

        // First put everything on the heap
        for (var i = 0; i < items.length; i++) {
            var weight = items[i][1];
            var value = items[i][0];
            this.heap.push(new _HeapNode(weight, value, weight));
        }
        // Now go through the heap and add each node's weight to its parent
        for (i = this.heap.length - 1; i > 1; i--) {
            this.heap[i>>1].total += this.heap[i].total;
        }
        //console.debug('_Wh heap', this.heap);
    }

    _WeightedHeap.prototype = {
        pop: function() {
            // Start with a random amount of gas
            var gas = this.heap[1].total * Math.random();

            // Start driving at the root node
            var i = 1;

            // While we have enough gas to keep going past i:
            while (gas > this.heap[i].weight) {
                gas -= this.heap[i].weight;     // Drive past i
                i <<= 1;                        // Move to first child
                if (gas > this.heap[i].total) {
                    gas -= this.heap[i].total;    // Drive past first child and its descendants
                    i++;                          // Move on to second child
                }
            }
            // Out of gas - i is our selected node.
            var value = this.heap[i].value;
            var selectedWeight = this.heap[i].weight;

            this.heap[i].weight = 0;          // Make sure i isn't chosen again
            while (i > 0) {
                // Remove the weight from its parent's total
                this.heap[i].total -= selectedWeight;
                i >>= 1;  // Move to the next parent
            }
            return value;
        }
    };

    //  NB: another binary heap implementation is at
    // http://eloquentjavascript.net/appendix2.html

    return _WeightedList;
})();
/******/
}});

if(usesModule)
{
    exports.ValueTypeHelper = FBL.Firecrow.ValueTypeHelper;
}