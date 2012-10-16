FBL.ns(function() { with (FBL) {
// ************************************************************************************************
Firecrow.Reuser.Templates =
{
    _HANDLER_CONFLICT_TEMPLATE:
    {
        "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }},
        "type":"CallExpression",
        "shouldBeIncluded": true,
        "callee":
        {
            "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }},
            "type":"MemberExpression",
            "shouldBeIncluded": true,
            "object":
            {
                "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }},
                "type":"Identifier", "name":"_FIRECROW_HANDLER_MAPPER",
                "shouldBeIncluded": true,
                "nodeId":"{ID_PREFIX}-18"
            },
            "property": { "loc":null, "type":"Identifier", "name":"push", "shouldBeIncluded": true, "nodeId":"{ID_PREFIX}-19", "computed":false},
            "nodeId":"{ID_PREFIX}-17"
        },
        "arguments":
        [{
            "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }},
            "type":"ObjectExpression",
            "shouldBeIncluded": true,
            "properties":
            [{
                "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }},
                "type":"Property",
                "shouldBeIncluded": true,
                "key":
                {
                    "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }},
                    "type":"Identifier",
                    "name":"type",
                    "shouldBeIncluded": true,
                    "nodeId":"{ID_PREFIX}-24"
                },
                "value":
                {
                    "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }},
                    "type":"Literal",
                    "value":"{PROPERTY_NAME}",
                    "shouldBeIncluded": true,
                    "nodeId":"{ID_PREFIX}-25"
                },
                "kind":"init",
                "nodeId":"{ID_PREFIX}-23"
            },
            {
                "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }},
                "type":"Property",
                "shouldBeIncluded": true,
                "key":
                {
                    "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }},
                    "type":"Identifier",
                    "shouldBeIncluded": true,
                    "name":"handler",
                    "nodeId":"{ID_PREFIX}-27"
                },
                "value":
                {
                    "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }},
                    "type":"Literal",
                    "shouldBeIncluded": true,
                    "value":"{HANDLER_LITERAL_TEMPLATE}",
                    "nodeId":"{ID_PREFIX}-25"
                },
                "kind":"init",
                "nodeId":"{ID_PREFIX}-26"
            }],
            "nodeId":"{ID_PREFIX}-21"
        }],
        "nodeId":"{ID_PREFIX}-16"
    }
}

}});

