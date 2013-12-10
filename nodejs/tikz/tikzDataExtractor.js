var fs = require('fs');

var dataFileOriginal = "C:\\GitWebStorm\\Firecrow\\nodejs\\tikz\\ajaxTabsContent.txt";
var applicationName = "ajaxTabsContent";

var fileContent = fs.readFileSync(dataFileOriginal, "utf-8");

var lines = fileContent.split(/\r\n/gi);
var data = {};
for(var i = 0; i < lines.length; i++)
{
    var line = lines[i];
    if(line.trim() != "")
    {
        var dataItems = line.split(/\s+/);

        var firstItem = dataItems.splice(0, 1);

        data[firstItem[0]] = dataItems.map(function(item, index)
        {
            return "(" + index + "," + item.replace(",", ".") + ")";
        });
    }
}

for(var prop in data)
{
    console.log(data[prop].join("--"));
}