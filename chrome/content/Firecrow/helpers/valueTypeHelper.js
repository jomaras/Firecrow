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