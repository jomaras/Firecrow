var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var esprima = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\esprima");
var escodegen = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\escodegen");

var sourceFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\medialize\\test\\cases";
var destinationFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\medialize\\adjusted";

fs.list(sourceFolder).forEach(function(testFolder)
{
    if(testFolder.length <= 2) { return; }
    var testIndexPath = sourceFolder + "\\" + testFolder + "\\index.html";

    var fileContent = fs.read(testIndexPath);

    fileContent = fileContent.replace("../../URI.js", "http://localhost/Firecrow/evaluation/libraries/medialize/URI-src.js");
    console.log(destinationFolder + "\\" + testFolder + ".html");
    //fs.write(destinationFolder + "\\" + testFolder + ".html", fileContent);
});

phantom.exit();