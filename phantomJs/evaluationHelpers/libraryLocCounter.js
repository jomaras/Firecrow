var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var libraryName = system.args[1] || "underscore";
var librariesRootFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\";

var libraryFolder = librariesRootFolder + libraryName + "\\adjusted\\";

var startLocCount = 0;
switch(libraryName)
{
    case "gauss": startLocCount = 678; break;
    case "jQuery": startLocCount = 9790; break;
    case "mooTools": startLocCount = 5975; break;
    case "prototype": startLocCount = 7036; break;
    case "sylvester": startLocCount = 1756; break;
    case "underscore": startLocCount = 1258; break;
    default: startLocCount = 0;
}

var files = fs.list(libraryFolder).map(function(fileName)
{
    var fullPath = libraryFolder + fileName;

    if(fs.isFile(fullPath) && fullPath.indexOf('.html') != -1)
    {
        return fullPath;
    }
}).filter(function(item){ return item != null; });

var html = "<table>";

files.forEach(function(file)
{
    var fileContent = fs.read(file);
    var noOfFileLines = fileContent.split("\n").length;

    noOfFileLines += startLocCount;
    html += "<tr><td>" + file + "</td>";
    if(libraryName == "prototype")
    {
        if(file.indexOf("Class") == 0) { noOfFileLines += 82; }
        if(file.indexOf("Enumerable") == 0) { noOfFileLines += 29;}
        if(file.indexOf("Hash") == 0) { noOfFileLines += 25; }
    }

    html +="<td>" + noOfFileLines + "</td></tr>";

    console.log(file, noOfFileLines);
});

html += "</table>";

fs.write(librariesRootFolder + libraryName + "-loc.html", html);

phantom.exit();