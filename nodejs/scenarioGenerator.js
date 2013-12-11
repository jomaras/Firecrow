var fs = require('fs');
var path = require('path');

var os = require('os');
var isWin = os.platform().indexOf("win") != -1 ? true : false;

var ScenarioGenerator = require(path.resolve(__dirname, "scenarioGeneratorModules/ScenarioGenerator.js")).ScenarioGenerator;
var scenarioEmpiricalDataPath = path.resolve(__dirname, "../../EventRecorder/recordings/aggregateJsonData.txt");

var visitedCodeTemplatePath = path.resolve(__dirname, "../phantomJs/helperPages/viewExecutedCodeTemplate.html");
var visitedCodePath = path.resolve(__dirname, "../phantomJs/helperPages/viewExecutedCode.html")
ScenarioGenerator.scriptPathsToIgnore = [];
ScenarioGenerator.shouldPrintDetailedMessages = true;

ScenarioGenerator.generateAdditionalMouseMoveEvents = true;
ScenarioGenerator.generateAdditionalTimingEvents = false;

var pageName = process.argv[2] || "24-rentingAgency";
ScenarioGenerator.prioritization = process.argv[3] || ScenarioGenerator.PRIORITIZATION.symbolicNewCoverage;
ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS = process.argv[4] != null ? parseInt(process.argv[4]) : 50;

console.log("Starting scenario generator: ", pageName ,  ScenarioGenerator.prioritization, ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS);

var coverageFolder = path.resolve(__dirname, "../evaluation/results/coverage") + path.sep + ScenarioGenerator.prioritization + path.sep;
var scenarioModelPath = isWin ? path.resolve(__dirname, "../../CodeModels/evaluation/scenarioGenerator/" + pageName + "/index.json")
                              : "http://pzi.fesb.hr/josip.maras/CodeModels/evaluation/scenarioGenerator/"+ pageName + "/index.json";

//ScenarioGenerator.setEmpiricalData(JSON.parse(fs.readFileSync(scenarioEmpiricalDataPath, { encoding: "utf-8"})));

ScenarioGenerator.generateScenarios(scenarioModelPath, function(scenarios, message, coverage)
{
    console.log("ScenarioGenerator", message);
    console.log("The process has achieved statement coverage: " + (coverage != null ? coverage.statementCoverage : 0));

    /*var markupCode = ScenarioGenerator.generateVisitedMarkup();

    var template = fs.readFileSync(visitedCodeTemplatePath);
    var content = template.replace("{SOURCE_CODE}", markupCode);

    fs.writeFileSync(visitedCodePath, content);
    console.log("Generated executed code markup: " + visitedCodePath);*/
    var coverageFile = coverageFolder + pageName + ".txt";
    try
    {
        fs.mkdirSync(coverageFolder);
    }
    catch(e) { console.log("Error when creating coverageFolders", e);}

    console.log("Writing scenGen", coverageFile);
    fs.writeFileSync(coverageFile, getCoverageData());

    var filteredScenarios = scenarios.getSubsumedProcessedScenarios();

    console.log("Kept scenarios: ", filteredScenarios.length);

    for(var i = 0; i < filteredScenarios.length; i++)
    {
        console.log("Scenario", i, filteredScenarios[i].getEventsQuery());
    }

    process.exit();
});

function getCoverageData()
{
    var data = "";

    ScenarioGenerator.coverages.forEach(function(item, index)
    {
        data += item.expressionCoverage + "@" + item.branchCoverage + "@" + item.statementCoverage;

        if(index != ScenarioGenerator.coverages.length - 1)
        {
            data += "\r\n";
        }
    });

    return data;
}