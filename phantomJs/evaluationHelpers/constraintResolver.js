var fs = require('fs');
var webPage = require('webpage');
var page = webPage.create();

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

var isWin = fs.workingDirectory.indexOf("C:/") != -1 ? true : false;

var solverUrl = isWin ? "http://localhost/Firecrow/constraintSolver/index.php"
                      : "http://pzi.fesb.hr/josip.maras/Firecrow/constraintSolver/index.php";

var constraintDataFile = fs.workingDirectory + fs.separator + "dataFiles" + fs.separator + "constraint.txt";
var constraintSolutionDataFile = fs.workingDirectory + fs.separator + "dataFiles" + fs.separator + "constraintSolution.txt";

page.open(solverUrl, function()
{
    var result = page.evaluate(function(solverUrl, json)
    {
        var http = new XMLHttpRequest();

        try
        {
            http.open("POST", solverUrl, false);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.send("Constraint=" + encodeURIComponent(json));

            return {
                isSuccessful: http.status == 200,
                response: http.responseText
            };
        }
        catch(e)
        {
            console.log(e);

            return {
                isSuccessful: false,
                response: e
            };
        }
    }, solverUrl, fs.read(constraintDataFile));

    fs.write(constraintSolutionDataFile, JSON.stringify(result));

    phantom.exit();
});


