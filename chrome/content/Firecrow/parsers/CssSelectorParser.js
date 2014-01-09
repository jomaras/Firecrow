//https://github.com/subtleGradient/slick/blob/master/Source/Slick.Parser.js
var usesModule = typeof module !== 'undefined' && module.exports;
var ASTHelper;
if(usesModule)
{
    var CssSelectorParser;
    FBL =  { Firecrow: {}, ns:  function(namespaceFunction){ namespaceFunction(); }};
    var path = require('path');
    FBL.Firecrow.ValueTypeHelper = require(path.resolve(__dirname, "../helpers/valueTypeHelper.js")).ValueTypeHelper;
}

FBL.ns(function() { with (FBL) {
/*****************************************************/
(function(){
    var parsed,
        separatorIndex,
        combinatorIndex,
        reversed,
        cache = {},
        reverseCache = {},
        reUnescape = /\\/g;

    var parse = function(expression, isReversed){
        if (!expression) return null;
        if (expression.Slick === true) return expression;
        expression = ('' + expression).replace(/^\s+|\s+$/g, '');
        reversed = !!isReversed;
        var currentCache = (reversed) ? reverseCache : cache;
        if (currentCache[expression]) return currentCache[expression];
        parsed = {Slick: true, expressions: [], raw: expression, reverse: function(){
            return parse(this.raw, true);
        }};
        separatorIndex = -1;
        while (expression != (expression = expression.replace(regexp, parser)));
        parsed.length = parsed.expressions.length;
        return currentCache[expression] = (reversed) ? reverse(parsed) : parsed;
    };

    var reverseCombinator = function(combinator){
        if (combinator === '!') return ' ';
        else if (combinator === ' ') return '!';
        else if ((/^!/).test(combinator)) return combinator.replace(/^!/, '');
        else return '!' + combinator;
    };

    var reverse = function(expression){
        var expressions = expression.expressions;
        for (var i = 0; i < expressions.length; i++){
            var exp = expressions[i];
            var last = {parts: [], tag: '*', combinator: reverseCombinator(exp[0].combinator)};

            for (var j = 0; j < exp.length; j++){
                var cexp = exp[j];
                if (!cexp.reverseCombinator) cexp.reverseCombinator = ' ';
                cexp.combinator = cexp.reverseCombinator;
                delete cexp.reverseCombinator;
            }

            exp.reverse().push(last);
        }
        return expression;
    };

    var escapeRegExp = function(string){// Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
        return string.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&");
    };

    var regexp = new RegExp(
        /*
         #!/usr/bin/env ruby
         puts "\t\t" + DATA.read.gsub(/\(\?x\)|\s+#.*$|\s+|\\$|\\n/,'')
         __END__
         "(?x)^(?:\
         \\s* ( , ) \\s*               # Separator          \n\
         | \\s* ( <combinator>+ ) \\s*   # Combinator         \n\
         |      ( \\s+ )                 # CombinatorChildren \n\
         |      ( <unicode>+ | \\* )     # Tag                \n\
         | \\#  ( <unicode>+       )     # ID                 \n\
         | \\.  ( <unicode>+       )     # ClassName          \n\
         |                               # Attribute          \n\
         \\[  \
         \\s* (<unicode1>+)  (?:  \
         \\s* ([*^$!~|]?=)  (?:  \
         \\s* (?:\
         ([\"']?)(.*?)\\9 \
         )\
         )  \
         )?  \\s*  \
         \\](?!\\]) \n\
         |   :+ ( <unicode>+ )(?:\
         \\( (?:\
         ([\"']?)((?:\\([^\\)]+\\)|[^\\(\\)]*)+)\\12\
         ) \\)\
         )?\
         )"
         */
        "^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|:+(<unicode>+)(?:\\((?:([\"']?)((?:\\([^\\)]+\\)|[^\\(\\)]*)+)\\12)\\))?)"
            .replace(/<combinator>/, '[' + escapeRegExp(">+~`!@$%^&={}\\;</") + ']')
            .replace(/<unicode>/g, '(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
            .replace(/<unicode1>/g, '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
    );

    function parser(
        rawMatch,

        separator,
        combinator,
        combinatorChildren,

        tagName,
        id,
        className,

        attributeKey,
        attributeOperator,
        attributeQuote,
        attributeValue,

        pseudoClass,
        pseudoQuote,
        pseudoClassValue
        ){
        if (separator || separatorIndex === -1){
            parsed.expressions[++separatorIndex] = [];
            combinatorIndex = -1;
            if (separator) return '';
        }

        if (combinator || combinatorChildren || combinatorIndex === -1){
            combinator = combinator || ' ';
            var currentSeparator = parsed.expressions[separatorIndex];
            if (reversed && currentSeparator[combinatorIndex])
                currentSeparator[combinatorIndex].reverseCombinator = reverseCombinator(combinator);
            currentSeparator[++combinatorIndex] = {combinator: combinator, tag: '*'};
        }

        var currentParsed = parsed.expressions[separatorIndex][combinatorIndex];

        if (tagName){
            currentParsed.tag = tagName.replace(reUnescape, '');

        } else if (id){
            currentParsed.id = id.replace(reUnescape, '');

        } else if (className){
            className = className.replace(reUnescape, '');

            if (!currentParsed.classList) currentParsed.classList = [];
            if (!currentParsed.classes) currentParsed.classes = [];
            currentParsed.classList.push(className);
            currentParsed.classes.push({
                value: className,
                regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
            });

        } else if (pseudoClass){
            pseudoClassValue = pseudoClassValue ? pseudoClassValue.replace(reUnescape, '') : null;

            if (!currentParsed.pseudos) currentParsed.pseudos = [];
            currentParsed.pseudos.push({
                key: pseudoClass.replace(reUnescape, ''),
                value: pseudoClassValue
            });

        } else if (attributeKey){
            attributeKey = attributeKey.replace(reUnescape, '');
            attributeValue = (attributeValue || '').replace(reUnescape, '');

            var test, regexp;

            switch (attributeOperator){
                case '^=' : regexp = new RegExp(       '^'+ escapeRegExp(attributeValue)            ); break;
                case '$=' : regexp = new RegExp(            escapeRegExp(attributeValue) +'$'       ); break;
                case '~=' : regexp = new RegExp( '(^|\\s)'+ escapeRegExp(attributeValue) +'(\\s|$)' ); break;
                case '|=' : regexp = new RegExp(       '^'+ escapeRegExp(attributeValue) +'(-|$)'   ); break;
                case  '=' : test = function(value){
                    return attributeValue == value;
                }; break;
                case '*=' : test = function(value){
                    return value && value.indexOf(attributeValue) > -1;
                }; break;
                case '!=' : test = function(value){
                    return attributeValue != value;
                }; break;
                default   : test = function(value){
                    return !!value;
                };
            }

            if (!test) test = function(value){
                return value && regexp.test(value);
            };

            if (!currentParsed.attributes) currentParsed.attributes = [];
            currentParsed.attributes.push({
                key: attributeKey,
                operator: attributeOperator,
                value: attributeValue,
                test: test
            });
        }

        return '';
    };

    Firecrow.CssSelectorParser = CssSelectorParser =
    {
        isIdSelector: function(selector) { return selector != null && selector.indexOf("#") == 0; },
        isClassSelector: function(selector) { return selector != null && selector.indexOf(".") == 0; },

        getSimpleSelectors: function(selector)
        {
            return selector && selector.split ? selector.split(",") : [];
        },

        getCssProperties: function(cssText)
        {
            var startOfPropertiesIndex = cssText.indexOf("{");
            var endOfPropertiesIndex = cssText.indexOf("}");

            var properties = cssText.substring(startOfPropertiesIndex + 1, endOfPropertiesIndex);

            return properties.replace(/(\r)?\n/g, " ");
        },

        containsTypeSelector: function(selector)
        {
            if(selector == null || selector == "") { return false; }

            var simpleSelectors = selector.split(",");

            for(var i = 0; i < simpleSelectors.length; i++)
            {
                var simpleSelector = simpleSelectors[i].trim();

                if(simpleSelector.indexOf(".") == -1 && simpleSelector.indexOf("#") == -1)
                {
                    return true;
                }
            }

            return false;
        },

        endsWithPseudoSelector: function(selector)
        {
            var lastSelector = this._getLastPseudoSelector(selector);

            return lastSelector != null && lastSelector.pseudos != null && lastSelector.pseudos.length != 0;
        },

        appendBeforeLastPseudoSelector: function(selector, toAppend)
        {
            return Firecrow.ValueTypeHelper.insertIntoStringAtPosition(selector, toAppend, selector.lastIndexOf(":"));
        },

        _getLastPseudoSelector: function(selector)
        {
            var parsed = this.parse(selector);

            if(parsed == null) { return false; }

            var lastSimpleSelector = parsed.expressions[parsed.expressions.length - 1];

            if(lastSimpleSelector == null) { return false; }

            return lastSimpleSelector[lastSimpleSelector.length-1];
        },

        getCssPrimitives: function(cssSelector)
        {
            if(cssSelector == null) { return []; }

            var parts = cssSelector.split(/((\s)+|\.|>|\+|~|#)/gi);
            var primitives = [];

            for(var i = 0; i < parts.length; i++)
            {
                var part = parts[i];

                if(part == null) { continue; }

                var trimmed = part.trim();

                if(trimmed === "") { trimmed = " "; }

                primitives.push
                ({
                    value: trimmed,
                    isSeparator: trimmed === " " || trimmed == "+" || trimmed == "." || trimmed == "+" || trimmed == "~"
                });
            }

            return primitives;
        },

        parse: function(expression)
        {
            if(expression == null) { debugger; }

            var result = parse(expression);

            if(result == null) { return null; }

            result.combine = function()
            {
                var combined = "";
                var expressions = result.expressions;

                for(var i = 0; i < expressions.length; i++)
                {
                    if(i != 0 && combined.trim() != "") { combined += ", "; }

                    var subExpressions = expressions[i];

                    for(var j = 0; j < subExpressions.length; j++)
                    {
                        var subExpression = subExpressions[j];

                        combined += subExpression.combinator;

                        if(subExpression.tag != "*" || (subExpression.id == null && subExpression.classList == null))
                        {
                            combined += subExpression.tag;
                        }

                        if(subExpression.id != null)
                        {
                            combined += "#" + subExpression.id;
                        }

                        if(subExpression.classList != null)
                        {
                            subExpression.classList.forEach(function(className)
                            {
                                combined += "." + className;
                            });
                        }

                        if(subExpression.attributes != null)
                        {
                            subExpression.attributes.forEach(function(attribute)
                            {
                                combined += "[" + attribute.key + attribute.operator + attribute.value + "]";
                            });
                        }

                        if(subExpression.pseudos != null)
                        {
                            subExpression.pseudos.forEach(function(pseudo)
                            {
                                combined += ":" + pseudo.key;

                                if(pseudo.value != null)
                                {
                                    combined += "(" + pseudo.value + ")";
                                }
                            });
                        }
                    }
                }

                return combined.trimLeft();
            };

            return result;
        },

        escapeRegExp: escapeRegExp
    };
})();
/*******************************************************/
}});

if(usesModule)
{
    exports.CssSelectorParser = CssSelectorParser;
}