var fs = require('fs');

var ScenarioGenerator = require("C:\\GitWebStorm\\Firecrow\\nodejs\\scenarioGeneratorModules\\ScenarioGenerator.js").ScenarioGenerator;

var scenarioEmpiricalDataPath = "C:\\GitWebStorm\\EventRecorder\\recordings\\aggregateJsonData.txt";

var visitedCodeTemplatePath = "C:\\GitWebStorm\\Firecrow\\phantomJs\\helperPages\\viewExecutedCodeTemplate.html";
var visitedCodePath = "C:\\GitWebStorm\\Firecrow\\phantomJs\\helperPages\\viewExecutedCode.html";

ScenarioGenerator.scriptPathsToIgnore = [];
ScenarioGenerator.shouldPrintDetailedMessages = true;

ScenarioGenerator.generateAdditionalMouseMoveEvents = true;
ScenarioGenerator.generateAdditionalTimingEvents = false;

var pageName = process.argv[2] || "24-rentingAgency";
ScenarioGenerator.prioritization = process.argv[3] || ScenarioGenerator.PRIORITIZATION.symbolicNewCoverage;
ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS = process.argv[4] != null ? parseInt(process.argv[4]) : 50;

console.log("Starting scenario generator: ", pageName ,  ScenarioGenerator.prioritization, ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS);

var coverageFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\results\\coverage\\" + ScenarioGenerator.prioritization + "\\";

ScenarioGenerator.setEmpiricalData(JSON.parse(fs.readFileSync(scenarioEmpiricalDataPath, { encoding: "utf-8"})));

ScenarioGenerator.generateScenarios("http://localhost/CodeModels/evaluation/scenarioGenerator/" + pageName + "/index.json", function(scenarios, message, coverage)
{
    console.log(message);
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
    catch(e) { console.log(e);}

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