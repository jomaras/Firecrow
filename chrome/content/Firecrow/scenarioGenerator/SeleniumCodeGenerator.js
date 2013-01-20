FBL.ns(function() { with (FBL) {
/*****************************************************/
    var fcScenarioGenerator = Firecrow.ScenarioGenerator;
    var ValueTypeHelper = Firecrow.ValueTypeHelper;
    var ASTHelper = Firecrow.ASTHelper;
    var fcSymbolic = fcScenarioGenerator.Symbolic;

    fcScenarioGenerator.SeleniumCodeGenerator =
    {
        generateCode: function(scenarios, pageUrl)
        {
            var code = this.getTopSurroundingCode();

            if(scenarios.length == 0)
            {
                code += this.getOpenPageCode(pageUrl);
            }

            for(var i = 0; i < scenarios.length; i++)
            {
                var scenario = scenarios[i];

                code += this.getOpenPageCode(pageUrl);

                for(var j = 0; j < scenario.parametrizedEvents.length; j++)
                {
                    var parametrizedEvent = scenario.parametrizedEvents[j];

                    code += this.getClickAtCode(parametrizedEvent.baseEvent.thisObjectDescriptor, parametrizedEvent.parameters)
                }
            }

            return code + this.getBottomSurroundingCode();
        },

        getTopSurroundingCode: function()
        {
            return "package test;\n\n"
                 + "import org.openqa.selenium.WebDriver;\n"
                 + "import org.openqa.selenium.WebDriverBackedSelenium;\n"
                 + "import org.openqa.selenium.firefox.FirefoxDriver;\n"
                 + "import com.thoughtworks.selenium.Selenium;\n\n"
                 + "public class test\n"
                 + "{\n"
                 + "  public static void main(String[] args)\n"
                 + "  {\n"
                 + "    WebDriver driver = new FirefoxDriver();\n"
                 + "    Selenium selenium;\n"
                 + "    Number elementX, elementY;\n"
                 + "    Number leftElementPosition, topElementPosition;\n";
        },

        getBottomSurroundingCode: function()
        {
            return "  }\n }\n";
        },

        getWaitForPageToLoadCode: function()
        {
            return '    selenium.waitForPageToLoad("30000");\n';
        },

        getOpenPageCode: function(pageUrl)
        {
            return '    driver.get("' + pageUrl + '");\n'
                 + '    selenium = new WebDriverBackedSelenium(driver, "' + pageUrl + '");\n'
                 + this.getWaitForPageToLoadCode();
        },

        getClickCode: function(elementXPath)
        {
            return '    selenium.click("xpath=' + elementXPath + '");\n'
        },

        getClickAtCode: function(elementXPath, parameters)
        {
            var x = 0, y = 0;

            var code = "    elementX = 0; elementY = 0;\n";
            code    += '    leftElementPosition = selenium.getElementPositionLeft("xpath=' + elementXPath + '");\n';
            code    += '    topElementPosition = selenium.getElementPositionTop("xpath=' + elementXPath + '");\n';

                 if(parameters.pageX != null)   { code += "    elementX = " +  parameters.pageX + " - leftElementPosition.intValue();\n"; }
            else if(parameters.screenX != null) { code += "    elementX = " +  parameters.screenX + ";\n"; }
            else if(parameters.clientX != null) { code += "    elementX = " +  parameters.clientX + " - leftElementPosition.intValue();\n"; }

                 if(parameters.pageY != null)   { code += "    elementY = " +  parameters.pageY + " - topElementPosition.intValue();\n"; }
            else if(parameters.screenY != null) { code += "    elementY = " +  parameters.screenY + ";\n"; }
            else if(parameters.clientY != null) { code += "    elementY = " +  parameters.clientY + " - leftElementPosition.intValue();\n"; }

            code += "    if(elementX.intValue() <= 0) { elementX = 1; }\n";
            code += "    if(elementY.intValue() < 0) { elementY = 1; }\n";

            code += '    selenium.clickAt("xpath=' + elementXPath + '", elementX.intValue() + "," + elementY.intValue());\n';

            return code;
        }
    }
}});