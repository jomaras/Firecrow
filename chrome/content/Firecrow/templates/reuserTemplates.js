var usesModule = typeof module !== 'undefined' && module.exports;
if(usesModule)
{
    FBL =  { Firecrow: { Reuser: {}}, ns:  function(namespaceFunction){ namespaceFunction(); }};
    var ReuserTemplates;
}

FBL.ns(function() { with (FBL) {
// ************************************************************************************************
Firecrow.Reuser.Templates = ReuserTemplates =
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
    _HANDLER_MAPPER_SCRIPT_INVOKER: "ICAgICAgICAoZnVuY3Rpb24oKQogICAgICAgIHsKICAgICAgICAgICAgaWYoISh3aW5kb3cuX0ZJUkVDUk9XX0hBTkRMRVJfTUFQUEVSKSkgeyByZXR1cm47IH0KCiAgICAgICAgICAgIHZhciBnZXRIYW5kbGVyc09mVHlwZSA9IGZ1bmN0aW9uKGhhbmRsZXJUeXBlKQogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlcnMgPSBbXTsKICAgICAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgX0ZJUkVDUk9XX0hBTkRMRVJfTUFQUEVSLmxlbmd0aDtpKyspCiAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcCA9IF9GSVJFQ1JPV19IQU5ETEVSX01BUFBFUltpXTsKICAgICAgICAgICAgICAgICAgICBpZihoYW5kbGVyVHlwZSA9PSBtYXAudHlwZSkKICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzLnB1c2gobWFwLmhhbmRsZXIpOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcnM7CiAgICAgICAgICAgIH07CiAgICAgICAgICAgIHZhciBvbkxvYWRIYW5kbGVycyA9IGdldEhhbmRsZXJzT2ZUeXBlKCdvbmxvYWQnKTsKICAgICAgICAgICAgaWYob25Mb2FkSGFuZGxlcnMubGVuZ3RoICE9IDApCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgIHdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpCiAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7CiAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzOwogICAgICAgICAgICAgICAgICAgIG9uTG9hZEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24ob25sb2FkSGFuZGxlcikKICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICAgIG9ubG9hZEhhbmRsZXIuYXBwbHkodGhhdCwgYXJncyk7CiAgICAgICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgICAgICB9OwogICAgICAgICAgICB9CiAgICAgICAgfSgpKTsKICAgIA==",
    /*CONTAINS TEMPLATE STRINGS: {PROPERTY_NAME}; {PROPERTY_VALUE}, and multiple {NODE_ID} */
    _FOR_IN_SKIPPER: "ewoJImxvYyI6eyAic3RhcnQiOnsgImxpbmUiOjMsICJjb2x1bW4iOjggfSwgImVuZCI6eyAibGluZSI6MywgImNvbHVtbiI6MjcgfSwgInNvdXJjZSI6bnVsbH0sCgkidHlwZSI6IklmU3RhdGVtZW50IiwKCSJ0ZXN0Ijp7CgkJImxvYyI6eyAic3RhcnQiOnsgImxpbmUiOjMsICJjb2x1bW4iOjExIH0sICJlbmQiOnsgImxpbmUiOjMsICJjb2x1bW4iOjI1IH0sICJzb3VyY2UiOm51bGx9LAoJCSJ0eXBlIjoiQmluYXJ5RXhwcmVzc2lvbiIsIAoJCSJvcGVyYXRvciI6Ij09PSIsCgkJImxlZnQiOnsKCQkgICAibG9jIjp7ICJzdGFydCI6eyAibGluZSI6MywgImNvbHVtbiI6MTEgfSwgImVuZCI6eyAibGluZSI6MywgImNvbHVtbiI6MTUgfSwgInNvdXJjZSI6bnVsbCB9LAoJCSAgICJ0eXBlIjoiSWRlbnRpZmllciIsCgkJICAgIm5hbWUiOiJ7UFJPUEVSVFlfTkFNRX0iLAoJCSAgICJub2RlSWQiOntOT0RFX0lEfQoJCX0sCgkJInJpZ2h0Ijp7CgkJCSJsb2MiOnsgInN0YXJ0Ijp7ICJsaW5lIjozLCAiY29sdW1uIjoxOSB9LCAiZW5kIjp7ICJsaW5lIjozLCAiY29sdW1uIjoyNSB9LCAic291cmNlIjpudWxsIH0sCgkJICAgICJ0eXBlIjoiTGl0ZXJhbCIsCgkJICAgICJ2YWx1ZSI6IntQUk9QRVJUWV9WQUxVRX0iLCAKCQkJIm5vZGVJZCI6e05PREVfSUR9CgkJfSwKCQkibm9kZUlkIjp7Tk9ERV9JRH0KCX0sCgkiY29uc2VxdWVudCI6ewoJCSJsb2MiOnsgInN0YXJ0Ijp7ICJsaW5lIjozLCAiY29sdW1uIjoyNyB9LCAiZW5kIjp7ICJsaW5lIjozLCAiY29sdW1uIjoyNyB9LCAic291cmNlIjpudWxsIH0sCgkJInR5cGUiOiJDb250aW51ZVN0YXRlbWVudCIsCgkJImxhYmVsIjpudWxsLAoJCSJub2RlSWQiOntOT0RFX0lEfQoJfSwKCSJhbHRlcm5hdGUiOm51bGwsCgkibm9kZUlkIjp7Tk9ERV9JRH0KfQ=="
}

}});

if(usesModule)
{
    exports.ReuserTemplates = ReuserTemplates;
}