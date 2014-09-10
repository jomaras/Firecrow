window.onload = function()
{
    var editor = CodeMirror.fromTextArea(document.getElementById("editor"),
    {
        lineNumbers: true,
        mode: {name: "text/html", globaVars: true},
        matchBrackets: true,
        extraKeys: {"Ctrl-Space": "autocomplete"}
    });

    var exampleString = "<html>\n  <head>\n    <style>\n      .label { font-weight: 800; }\n      #sumContainer { color: red; }\n      #productContainer { color: blue; }\n    </style>\n  </head>\n  <body>\n    Sum: <span class=\"label\" id=\"sumContainer\"></span>\n    <br/>\n    Product: <span class=\"label\" id=\"productContainer\"></span>\n    <script>\n      var sum = 0; \n      var product = 1;\n      for(var i = 1; i < 4; i++)\n      {\n        sum += i;\n        product *= i;\n      }\n      document.getElementById(\"sumContainer\").textContent = sum;\n      document.getElementById(\"productContainer\").textContent = product;\n    </script>\n  </body>\n</html>";

    document.addEventListener("keydown", function(e)
    {
        var keyCode = e.keyCode;

        if(keyCode == 73 && e.ctrlKey) { e.preventDefault(); markFirstDependencies(); } //Ctrl + i
        if(keyCode == 82 && e.ctrlKey) { e.preventDefault(); execute(); } //Ctrl + r
        if(keyCode == 83 && e.ctrlKey) { e.preventDefault(); slice(); } //Ctrl + s
        if(keyCode == 79 && e.ctrlKey) { e.preventDefault(); markInfluenced(); } //Ctrl + o

    }, false);

    document.getElementById("demoExampleLink").onclick = function()
    {
        editor.setValue(exampleString);
        return false;
    };

    var nodeId = 0;
    var lineAstMapping, elementLineMapping, markedLinesNumbers = {};
    var isModelValid = false;
    var pageModel = null;
    var slicingCriteria = [];

    editor.on("change", function()
    {
        isModelValid = false;
    });

    editor.on("beforeSelectionChange", resetShownDependencies);

    function resetShownDependencies()
    {
        for(var line in markedLinesNumbers)
        {
            editor.removeLineClass(parseInt(line), "text");
        }
    }

    function slice()
    {
        if(!isModelValid) { execute(); }

        var selectedElements = getSelectedElements();

        slicingCriteria = [];

        selectedElements.forEach(function(selectedElement)
        {
            if(ASTHelper.isIdentifier(selectedElement))
            {
                slicingCriteria.push(Firecrow.DependencyGraph.SlicingCriterion.createReadIdentifierCriterion("", -1, selectedElement.name));
            }
            else if (selectedElement.domElement != null)
            {
                slicingCriteria.push(Firecrow.DependencyGraph.SlicingCriterion.createModifyDomCriterion(getSelector(selectedElement.domElement)));
            }
        })

        execute();

        ASTHelper.traverseAst(pageModel, function(element)
        {
            if(element.shouldBeIncluded)
            {
                var line = elementLineMapping[element.nodeId];

                if(line)
                {
                    markLine(line - 1);
                }
            }
        });
    }

    function getSelector(htmlElement)
    {
        if(htmlElement == null) { return ""; }

        if(htmlElement.id) { return "#" + htmlElement.id; }
    }

    function markFirstDependencies()
    {
        slicingCriteria = [];

        if(!isModelValid) { execute(); }

        var selectedElements = getSelectedElements();

        getValueInfluencingElements(selectedElements[0]).forEach(function(element)
        {
            markLine(elementLineMapping[element.nodeId]-1);
        });
    }


    function markInfluenced()
    {
        slicingCriteria = [];

        if(!isModelValid) { execute(); }

        var selectedElements = getSelectedElements();

        getDependentElements(selectedElements[0]).forEach(function(element)
        {
            markLine(elementLineMapping[element.nodeId]-1);
        });
    }

    function markLine(line)
    {
        if(Number.isNaN(line)) { return; }

        markedLinesNumbers[line] = true;
        editor.addLineClass(line, "text", "influencingLine");
    }

    function getValueInfluencingElements(element)
    {
        if(element == null || element.graphNode == null || element.graphNode.dataDependencies == null) { return [];}

        return element.graphNode.dataDependencies.filter(function(dataDependency)
        {
            return dataDependency.isValueDependency;
        }).map(function(valueDependency)
        {
            return valueDependency.destinationNode.model;
        });
    }

    function getDependentElements(element)
    {
        if(element == null || element.graphNode == null || element.graphNode.reverseDependencies == null) { return [];}

        return element.graphNode.reverseDependencies.filter(function(dataDependency)
        {
            return dataDependency.isValueDependency;
        }).map(function(valueDependency)
        {
            return valueDependency.sourceNode.model;
        });
    }

    function getSelectedElements()
    {
        var selections = editor.listSelections();
        if(lineAstMapping == null || elementLineMapping == null) { return []; }

        var elements = [];

        selections.forEach(function(selection)
        {
            var lowerPoint, higherPoint;

            if(selection.anchor.line < selection.head.line) { lowerPoint = selection.anchor, higherPoint = selection.head; }
            else if (selection.anchor.line == selection.head.line)
            {
                selection.anchor.ch <= selection.head.ch ? (lowerPoint = selection.anchor, higherPoint = selection.head)
                                                         : (lowerPoint = selection.head, higherPoint = selection.anchor);
            }
            else { lowerPoint = selection.head, higherPoint = selection.anchor;}

            var elementsInLine = getElementsStartingInLine(lowerPoint.line + 1);

            if(elementsInLine.length <= 1) { FBL.Firecrow.ValueTypeHelper.pushAll(elements, elementsInLine); return; }

            var columnMatchingElements = elementsInLine.filter(function(element)
            {
                if(element.loc == null) { return false; }

                return lowerPoint.ch >= element.loc.start.column && higherPoint.ch <= element.loc.end.column;
            });

            var withNoAncestors = [];
            for(var i = 0; i < columnMatchingElements.length; i++)
            {
                var iThElement = columnMatchingElements[i];
                var hasFoundAncestor = false;
                for(var j = 0; j < columnMatchingElements.length; j++)
                {
                    var jThElement = columnMatchingElements[j];

                    if(iThElement != jThElement && ASTHelper.isAncestor(jThElement, iThElement))
                    {
                        hasFoundAncestor = true;
                        break;
                    }
                }

                if(!hasFoundAncestor) {withNoAncestors.push(iThElement); }
            }

            FBL.Firecrow.ValueTypeHelper.pushAll(elements, withNoAncestors);
        });

        return elements;
    }

    function getElementsStartingInLine(line)
    {
        return FBL.Firecrow.ValueTypeHelper.convertObjectMapToArray(lineAstMapping.startLineMap[line]);
    }

    function execute()
    {
        var builder = new Tautologistics.NodeHtmlParser.HtmlBuilder()
        var parser = new Tautologistics.NodeHtmlParser.Parser(builder);

        parser.parseComplete(editor.getValue());

        nodeId = 0;
        lineAstMapping = { startLineMap: {}, endLineMap: {}};
        elementLineMapping = {};

        adjustToFirecrow(builder.dom);

        Firecrow.Slicer.slice({ htmlElement: getHtmlElement(builder.dom)}, slicingCriteria, "index.html", false, true);

        isModelValid = true;
        pageModel = builder.dom;
    }

    function getHtmlElement(elements)
    {
        for(var i = 0; i < elements.length; i++)
        {
            if(elements[i].type == "html") { return elements[i]; }
        }

        return null;
    }

    function adjustToFirecrow(domTree)
    {
        if(domTree == null) { return; }

        for(var i = 0; i < domTree.length; i++)
        {
            adjustElementToFirecrow(domTree[i])
        }
    }

    function adjustElementToFirecrow(element)
    {
        if(element == null) { return; }

        if(element.attributes != null) { adjustHtmlElementAttributes(element); }
        if(element.children != null) { element.childNodes = element.children; delete element.children; }
        if(element.location != null) { element.loc = element.location; delete element.location; element.loc.start = {line: element.loc.line}, element.loc.end = {line: element.loc.line}; }
        if(element.type == "tag") { element.type = element.name; delete element.raw; delete element.name; }
        if(element.type == "text") { element.type = "textNode"; element.textContent = element.data; delete element.data; }

        element.nodeId = nodeId++;

        createLineMapping(element);

             if (element.type.toLowerCase() == "style") { parseAndAdjustStyleElement(element); }
        else if (element.type.toLowerCase() == "script") { parseAndAdjustScriptElement(element); }
        else { adjustToFirecrow(element.childNodes); }
    }

    function parseAndAdjustStyleElement(element)
    {
        element.cssRules = cssParser.parse(element.childNodes[0].data, { position: true, lineModifier: element.loc.start.line - 1}).stylesheet.rules;
        element.pathAndModel = {model: {rules: element.cssRules }};

        var cssText = "";
        for(var i = 0; i < element.cssRules.length; i++)
        {
            var rule = element.cssRules[i];

            rule.cssText = getCssRuleText(rule);
            rule.selector = rule.selectors.join(", ");
            cssText += rule.cssText;
            rule.nodeId = nodeId++;
            rule.loc = rule.position;
            delete rule.position;

            createLineMapping(rule);
        }

        element.textContent = cssText;
    }

    function parseAndAdjustScriptElement(element)
    {
        element.pathAndModel = { model: esprima.parse(element.childNodes[0].data, {loc: true, raw: true}), lineAdjuster: element.loc.start.line - 1};

        if(element.pathAndModel.model != null)
        {
            element.pathAndModel.model.lineAdjuster = element.pathAndModel.lineAdjuster;
            ASTHelper.setParentsChildRelationships(element.pathAndModel);
            ASTHelper.traverseAst(element.pathAndModel.model, function(element)
            {
                element.nodeId = nodeId++;

                createLineMapping(element);
            });
        }
    }

    function createLineMapping(element)
    {
        if(element == null || element.loc == null || element.type == "textNode") { return; }

        if(lineAstMapping.startLineMap[element.loc.start.line] == null) { lineAstMapping.startLineMap[element.loc.start.line] = {}; }
        lineAstMapping.startLineMap[element.loc.start.line][element.nodeId] = element;

        if(lineAstMapping.endLineMap[element.loc.end.line] == null) { lineAstMapping.endLineMap[element.loc.end.line] = {}; }

        lineAstMapping.endLineMap[element.loc.end.line][element.nodeId] = element;

        elementLineMapping[element.nodeId] = element.loc.start.line;
    }

    function adjustHtmlElementAttributes(htmlElement)
    {
        if(htmlElement == null || htmlElement.attributes == null) { return; }

        var attributes = htmlElement.attributes;
        var attributesArray = [];

        for(var propName in attributes)
        {
            if(!attributes.hasOwnProperty(propName)) { continue; }

            attributesArray.push({name: propName, value: attributes[propName]});
        }

        htmlElement.attributes = attributesArray;
    }

    function getCssRuleText(cssRule)
    {
        var properties = "";

        for(var i = 0; i < cssRule.declarations.length; i++)
        {
            var declaration = cssRule.declarations[i];
            properties += "\t" + declaration.property + ":" + declaration.value + ";\n";
        }

        return cssRule.selectors.join(",") + "{" + "\n" + properties  + "}";
    }
};