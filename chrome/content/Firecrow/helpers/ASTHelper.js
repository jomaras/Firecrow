FBL.ns(function () { with (FBL) {
/*******/

const ValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.ASTHelper = 
{
	parseSourceCodeToAST: function(sourceCode, sourceCodePath, startLine)
	{
		try
		{
			Components.utils.import("resource://gre/modules/reflect.jsm");
			
			return Reflect.parse
			(
				sourceCode, 
				{ loc:true, source: sourceCodePath, line: startLine }
			);
		}
		catch(e) { alert("Error while getting AST from source code@" + sourceCodePath + "; error: " + sourceCodePath); }
	},
	
	getTypeExpressionsFromProgram: function(program, types)
	{
		try
		{
			var result = {};
			
			var traverserFunction = function(elementValue, elementName, parentObject)
			{
				types.forEach(function(type)
				{
					if(elementName === "type" &&  elementValue === type)
					{
						if(result[type] == null) { result[type] = []; }
						
						result[type].push(parentObject);
					}
				});
			};
			
			this.traverseAst(program, traverserFunction);
			
			return result;
		}
		catch(e) { alert("Error while getting type expressions from program in ASTHelper: " + e);}
	},
	
	traverseAst: function(astElement, processElementFunction)
	{
		try
		{
			if(!(ValueTypeHelper.isObject(astElement))) { return; }

			for(var propName in astElement)
		    {
		        var propertyValue = astElement[propName];
		        
		        processElementFunction(propertyValue, propName, astElement);
		        
		        if(propertyValue == null) { continue; }
		        
		        if(ValueTypeHelper.isArray(propertyValue))
		        {
		            for(var i = 0; i < propertyValue.length; i++)
		            {
		            	this.traverseAst(propertyValue[i], processElementFunction);
		            }
		        }
		        else if (ValueTypeHelper.isObject(propertyValue))
		        {
		        	this.traverseAst(propertyValue, processElementFunction);
		        }
		    }
		}
		catch(e) { alert("Error while traversing AST in ASTHelper: " + e); }
	}
};

/******/
}});