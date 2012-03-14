FBL.ns(function () { with (FBL) {
/******/

Firecrow.ValueTypeHelper =
{
    isOfType: function (variable, className)
    {
        return variable instanceof className;
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

    isInteger: function (variable)
    {
        if (this.isNull(variable)) { return false; }

        return (typeof variable) == "number" && variable == parseInt(variable,10);
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

    isArray: function (arrayOfElements)
    {
        if (this.isNull(arrayOfElements)) { return false; }

        return (typeof arrayOfElements) == "array" || arrayOfElements instanceof Array;
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

    arrayContains: function(array, item)
    {
        if(!this.isArray(array)) { return false; }
        
        for(var i = 0; i < array.length; i++)
        {
            if(array[i] === item) { return true; }
        }

        return false;
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
            if(index < 0 || index >= array.length) { alert("Index out of range when removing array in ValueTypeHelper"); return; }

            return array.splice(index, 1);
        }
        catch(e) { alert("Error while removing elements from array by index: " + e);}
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
            });
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

    pushAll: function(baseArray, arrayWithItems)
    {
        try
        {
            arrayWithItems.forEach(function (item)
            {
                baseArray.push(item);
            });
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
        catch(e) { alert("Error while finding in array: " + e); }
    },
    
    trim: function(str, chars) 
    {
    	return this.trimLeft(trimRight(str, chars), chars);
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
    }
}
/******/
}});