/**
 * Created by Jomaras.
 * Date: 16.03.12.@15:36
 */
FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    const ValueTypeHelper = Firecrow.ValueTypeHelper;
    const fcModelInternals = Firecrow.Interpreter.Model.Internals;
    const fcModel = Firecrow.Interpreter.Model;

    fcModelInternals.StringFunction = function(globalObject)
    {
        //this.__proto__ = fcModel.createNativeFunction("String", globalObject, false);

        this._prototype = new fcModelInternals.StringObjectPrototype(globalObject);

        this.executeAsConstructor = function(arguments, callConstruct)
        {
            try
            {
                var stringObject = new fcModelInternals.StringObject(globalObject, callConstruct, arguments[0]);

                stringObject.setPropertyValue("constructor", this, callConstruct);

                return stringObject;
            }
            catch(e)  { alert("An error occurred in String when creating String object: " + e); }
        };
    };

    fcModelInternals.StringObject = function(globalObject, codeConstruct, value)
    {
        this.__proto__ = new fcModel.Object(globalObject, codeConstruct);
        this.value = value || "";

        this.proto = globalObject.getStringFunction()._prototype;

        this.addProperty("length", new fcModelInternals.NumberObject(globalObject, codeConstruct, this.value.length), codeConstruct, false);

        this.executeMethod = function(method, arguments, callConstruct)
        {
            this.proto.executeMethod(this, method, arguments, callConstruct);
        };
    };

    fcModelInternals.StringObjectPrototype = function(globalObject)
    {
        try
        {
            this.__proto__ = new fcModel.Object(globalObject);

            this.methods =
            [
                "charAt","charCodeAt","concat","indexOf","lastIndexOf","localeCompare",
                "match","replace","search","slice","split","substr","substring","toLocaleLowerCase",
                "toLocaleUpperCase","toLowerCase","toString","toUpperCase","trim","trimLeft","trimRight","valueOf"
            ];

            this.internalMethods = this.methods.map(function(methodName)
            {
                //return fcModel.FunctionObject.createNativeFunction(methodName, globalObject);
            });

            this.internalMethods.forEach(function(internalMethod)
            {
                //this.addProperty(internalMethod.name, internalMethod, null, false);
            });

            this.executeMethod = function(stringObject, method, arguments, callConstruct)
            {
                try
                {
                    if(method.name == "replace") { alert("Replace is not yet supported in string!"); return; }

                    if(this.methods.indexOf(method.name) != -1)
                    {
                        if(method.name == "charAt"
                            || method.name == "charCodeAt"
                            || method.name == "concat")
                        {
                            return new fcModel.StringObject
                                (
                                    stringObject.globalObject,
                                    callConstruct,
                                    stringObject.value[method.name](arguments[0].value)
                                );
                        }
                        else if (method.name == "indexOf"
                            || method.name == "lastIndexOf")
                        {

                        }
                    }
                    else
                    {
                        alert("Unsupported method when executing string!");
                    }
                }
                catch(e) { alert("Error when executing string methods - String:" + e);}
            };
        }
        catch(e)
        {
            alert("Interpreter.model.internal.String error in StringObjectPrototype: " + e);
        }
    };

    fcModelInternals.StringObjectPrototype.CONST =
    {
        INTERNAL_PROPERTIES :
        {
            METHODS: ["charAt","charCodeAt","concat","indexOf","lastIndexOf","localeCompare", "match","replace","search","slice","split","substr","substring","toLocaleLowerCase", "toLocaleUpperCase","toLowerCase","toString","toUpperCase","trim","trimLeft","trimRight","valueOf"]
        }
    };
    /*************************************************************************************/
}});