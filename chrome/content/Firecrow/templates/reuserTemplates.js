FBL.ns(function() { with (FBL) {
// ************************************************************************************************
Firecrow.Reuser.Templates =
{
    _HANDLER_MAPPER_SCRIPT_CREATION_TEMPLATE:
    {
        "type":"script",
        "attributes":[{"name":"origin", "value": "Firecrow"}],
        "childNodes":[{"type":"textNode", "attributes":[], "childNodes":[], "nodeId":"{FIRECROW_HANDLER_MAPPER_ID}-3", "textContent":"\n        _FIRECROW_HANDLER_MAPPER = [];\n    "}],
        "nodeId":"{FIRECROW_HANDLER_MAPPER_ID}-4",
        "textContent":"\n        _FIRECROW_HANDLER_MAPPER = [];\n    ",
        "pathAndModel":
        {
            "path":"",
            "model":
            {
                "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }, "source":null},
                "type":"Program",
                "body":
                [{
                    "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }, "source":null },
                    "type":"ExpressionStatement",
                    "expression":
                    {
                        "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }, "source":null},
                        "type":"AssignmentExpression",
                        "operator":"=",
                        "left":
                        {
                            "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }, "source":null },
                            "type":"Identifier",
                            "name":"_FIRECROW_HANDLER_MAPPER",
                            "nodeId":"{FIRECROW_HANDLER_MAPPER_ID}-8"
                        },
                        "right":
                        {
                            "loc":{ "start":{ "line":0, "column":0 }, "end":{ "line":0, "column":0 }, "source":null },
                            "type":"ArrayExpression",
                            "elements":[],
                            "nodeId":"{FIRECROW_HANDLER_MAPPER_ID}-9"
                        },
                        "nodeId":"{FIRECROW_HANDLER_MAPPER_ID}-7"
                    },
                    "nodeId":"{FIRECROW_HANDLER_MAPPER_ID}-6"
                }],
                "source":""
            }
        }
    },

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
    },
    _HANDLER_MAPPER_SCRIPT_INVOKER: "ICAgICAgICAoZnVuY3Rpb24oKQogICAgICAgIHsKICAgICAgICAgICAgaWYoISh3aW5kb3cuX0ZJUkVDUk9XX0hBTkRMRVJfTUFQUEVSKSkgeyByZXR1cm47IH0KCiAgICAgICAgICAgIHZhciBnZXRIYW5kbGVyc09mVHlwZSA9IGZ1bmN0aW9uKGhhbmRsZXJUeXBlKQogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlcnMgPSBbXTsKICAgICAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgX0ZJUkVDUk9XX0hBTkRMRVJfTUFQUEVSLmxlbmd0aDtpKyspCiAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcCA9IF9GSVJFQ1JPV19IQU5ETEVSX01BUFBFUltpXTsKICAgICAgICAgICAgICAgICAgICBpZihoYW5kbGVyVHlwZSA9PSBtYXAudHlwZSkKICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzLnB1c2gobWFwLmhhbmRsZXIpOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcnM7CiAgICAgICAgICAgIH07CiAgICAgICAgICAgIHZhciBvbkxvYWRIYW5kbGVycyA9IGdldEhhbmRsZXJzT2ZUeXBlKCdvbmxvYWQnKTsKICAgICAgICAgICAgaWYob25Mb2FkSGFuZGxlcnMubGVuZ3RoICE9IDApCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgIHdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpCiAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7CiAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzOwogICAgICAgICAgICAgICAgICAgIG9uTG9hZEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24ob25sb2FkSGFuZGxlcikKICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICAgIG9ubG9hZEhhbmRsZXIuYXBwbHkodGhhdCwgYXJncyk7CiAgICAgICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgICAgICB9OwogICAgICAgICAgICB9CiAgICAgICAgfSgpKTsKICAgIA=="
}

}});

