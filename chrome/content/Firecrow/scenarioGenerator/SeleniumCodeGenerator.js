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

                for(var j = 0; j < scenario.events.length; j++)
                {
                    var event = scenario.events[j];

                    if(event.eventType == "onclick")
                    {
                        code += this.getClickCode(event.thisObjectDescriptor);
                    }
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
                 + "    Selenium selenium;\n";
        },

        getBottomSurroundingCode: function()
        {
            return "  }\n" + "}\n";
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
        }
    }
}});