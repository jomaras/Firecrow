var testObject = {};

var cssSelectors =
[
    "div", "body", "html",

    "body > div",

    "#byId", "body #byId", "body > #byId",

    ".myClass", "div.myClass", "#id.myClass",".myClass.otherClass",

    "#foo > bar.baz", "h1, h2, ul > li, .things",

    "div p *[href]", "div ol>li p", "span[class=example]", 'span[hello=Cleveland][goodbye=Columbus]',
    "a[rel~=copyright]", "a[href=http://www.w3.org/]", "*[lang=fr]", "*[lang|=en]", ".pastoral",
    "H1.pastoral", "p.marine.pastoral", "h1#chapter1", "div > p:first-child", "p:first-child em",
    "a:link", "*:link", "a.external:visited", "a:focus:hover", "p:first-line",

    "#intro .important", "#intro .important em", "*[title=W3Schools]", "input[type=text]"
];
var Firecrow = FBL.Firecrow;
cssSelectors.forEach(function(cssSelector)
{
    testObject["test " + cssSelector] = function()
    {
        assertEquals("Selectors do not match", cssSelector.replace(/(\r|\n| )+/g, ""), Firecrow.CssSelectorParser.parse(cssSelector).combine().replace(/(\r|\n| )+/g, ""));
    }
});

TestCase("Css Selector Joiner tests", testObject);