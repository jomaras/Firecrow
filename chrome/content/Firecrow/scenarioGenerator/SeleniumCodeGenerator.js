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

                code += this._getNotifyScenarioStarting(scenario);

                for(var j = 0; j < scenario.parametrizedEvents.length; j++)
                {
                    var parametrizedEvent = scenario.parametrizedEvents[j];
                    var eventType = parametrizedEvent.baseEvent.eventType;

                    if(eventType == "onclick" || eventType == "click")
                    {
                        code += parametrizedEvent.containsMousePosition() ? this.getClickAtCode(parametrizedEvent.baseEvent.thisObjectDescriptor, parametrizedEvent.parameters)
                                                                          : this.getClickCode(parametrizedEvent.baseEvent.thisObjectDescriptor);
                    }
                    else if(eventType == "onkeydown" || eventType == "keydown")
                    {
                        code += this.getKeyDownCode(parametrizedEvent.baseEvent.thisObjectDescriptor, parametrizedEvent.parameters);
                    }
                    else if(eventType == "onkeyup" || eventType == "keyup")
                    {
                        code += this.getKeyUpCode(parametrizedEvent.baseEvent.thisObjectDescriptor, parametrizedEvent.parameters);
                    }
                    else if(eventType == "onmousemove" || eventType == "mousemove")
                    {
                        code += parametrizedEvent.containsMousePosition() ? this.getMouseMoveAtCode(parametrizedEvent.baseEvent.thisObjectDescriptor, parametrizedEvent.parameters)
                                                                          : this.getMouseMoveCode(parametrizedEvent.baseEvent.thisObjectDescriptor);
                    }
                    else if(eventType == "onmousedown" || eventType == "mousedown")
                    {
                        code += parametrizedEvent.containsMousePosition() ? this.getMouseDownAtCode(parametrizedEvent.baseEvent.thisObjectDescriptor, parametrizedEvent.parameters)
                                                                          : this.getMouseDownCode(parametrizedEvent.baseEvent.thisObjectDescriptor);
                    }
                    else if(eventType == "onmouseup" || eventType == "mouseup")
                    {
                        code += parametrizedEvent.containsMousePosition() ? this.getMouseUpAtCode(parametrizedEvent.baseEvent.thisObjectDescriptor, parametrizedEvent.parameters)
                                                                          : this.getMouseUpCode(parametrizedEvent.baseEvent.thisObjectDescriptor);
                    }
                    else if(eventType == "onchange" || eventType == "change")
                    {
                        code += this.getOnChangeCode(parametrizedEvent.baseEvent.thisObjectDescriptor, parametrizedEvent.parameters);
                    }
                    else if(eventType == "interval" || eventType == "timeout")
                    {
                        code += this.getWaitingCode();
                    }
                    else if(eventType == "onreadystatechange") {}
                    else
                    {
                        debugger;
                        alert("Unhandled event type when generating event handling code in SeleniumCodeGenerator");
                    }

                    code += this._getNotifyEventExecuted(eventType, parametrizedEvent.baseEvent.thisObjectDescriptor, parametrizedEvent.parameters);
                }

                code += this._getNotifyScenarioEnded(scenario);
            }

            return code + this.getBottomSurroundingCode();
        },

        getTopSurroundingCode: function()
        {
            return "package SeleniumTestRunner;\n\n"
                 + "import org.openqa.selenium.WebDriver;\n"
                 + "import org.openqa.selenium.WebDriverBackedSelenium;\n"
                 + "import org.openqa.selenium.firefox.FirefoxDriver;\n"
                 + "import com.thoughtworks.selenium.Selenium;\n\n"
                 + "public class SeleniumTestRunner\n"
                 + "{\n"
                 + "  public static void main(String[] args)\n"
                 + "  {\n"
                 + "    WebDriver driver = new FirefoxDriver();\n"
                 + "    Selenium selenium;\n"
                 + "    Number elementX, elementY;\n"
                 + "    Number leftElementPosition, topElementPosition;\n"
                 + "    String selectDefaultValue = \"\";\n";
        },

        getBottomSurroundingCode: function()
        {
            return '    System.out.println("Test done!");\n  }\n}\n';
        },

        _getNotifyScenarioStarting: function(scenario)
        {
            return '    System.out.println("****Scenario ' + scenario.id + ' starting!****");\n'
        },

        _getNotifyEventExecuted: function(eventType, thisObjectDescriptor, parameters)
        {
            return '    System.out.println("  Event: ' + eventType + ' on ' + thisObjectDescriptor + ' -> ' + JSON.stringify(parameters).replace(/"/g,"") + '");\n';
        },

        _getNotifyScenarioEnded: function(scenario)
        {
            return '    System.out.println("----Scenario ' + scenario.id + ' ended!----");\n'
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

        getClickCode: function(objectDescriptor)
        {
            return '    selenium.click("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '");\n'
        },

        getClickAtCode: function(objectDescriptor, parameters)
        {
            return this._getMousePositionCode(objectDescriptor, parameters)
                +  '    selenium.clickAt("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '", elementX.intValue() + "," + elementY.intValue());\n';
        },

        getKeyDownCode: function(objectDescriptor, parameters)
        {
            var keyCode = parameters.keyCode || parameters.which || 0;

            return '    selenium.keyDown("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) +  '", "' + keyCode + '");\n';
        },

        getKeyUpCode: function(objectDescriptor, parameters)
        {
            var keyCode = parameters.keyCode || parameters.which || 0;

            return '    selenium.keyUp("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) +  '", "' + keyCode + '");\n';
        },

        getMouseMoveAtCode: function(objectDescriptor, parameters)
        {
            return this._getMousePositionCode(objectDescriptor, parameters)
                +  '    selenium.mouseMoveAt("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '", elementX.intValue() + "," + elementY.intValue());\n';
        },

        getMouseMoveCode: function(objectDescriptor, parameters)
        {
            return '    selenium.click("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '");\n'
        },

        getMouseDownAtCode: function(objectDescriptor, parameters)
        {
            return this._getMousePositionCode(objectDescriptor, parameters)
                +  '    selenium.mouseDownAt("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '", elementX.intValue() + "," + elementY.intValue());\n';
        },

        getMouseDownCode: function(objectDescriptor, parameters)
        {
            return '    selenium.mouseDown("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '");\n'
        },

        getMouseUpAtCode: function(objectDescriptor, parameters)
        {
            return this._getMousePositionCode(objectDescriptor, parameters)
                +  '    selenium.mouseUpAt("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '", elementX.intValue() + "," + elementY.intValue());\n';
        },

        getMouseUpCode: function(objectDescriptor, parameters)
        {
            return '    selenium.mouseUp("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '");\n'
        },

        getOnChangeCode: function(objectDescriptor, parameters)
        {
            var changeToValue = parameters.value || "";

            var code = "";

            if(changeToValue == "")
            {
                code += '    selectDefaultValue = selenium.getSelectedValue("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '");\n';
                changeToValue = 'selectDefaultValue';
            }
            else
            {
                changeToValue = '"' + changeToValue + '"';
            }

            return code + '    selenium.select("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '",' + changeToValue + ');\n';
        },

        getWaitingCode: function()
        {
            return '    try{selenium.wait(2000);}catch(Exception e) { System.out.println(e); }\n';
        },

        _getMousePositionCode: function(objectDescriptor, parameters)
        {
            var code = "    elementX = 0; elementY = 0;\n";

            code    += '    leftElementPosition = selenium.getElementPositionLeft("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '");\n';
            code    += '    topElementPosition = selenium.getElementPositionTop("' + this._getLocatorFromThisObjectDescriptor(objectDescriptor) + '");\n';

            if(parameters.pageX != null)   { code += "    elementX = " +  parameters.pageX + " - leftElementPosition.intValue();\n"; }
            else if(parameters.screenX != null) { code += "    elementX = " +  parameters.screenX + ";\n"; }
            else if(parameters.clientX != null) { code += "    elementX = " +  parameters.clientX + " - leftElementPosition.intValue();\n"; }

            if(parameters.pageY != null)   { code += "    elementY = " +  parameters.pageY + " - topElementPosition.intValue();\n"; }
            else if(parameters.screenY != null) { code += "    elementY = " +  parameters.screenY + ";\n"; }
            else if(parameters.clientY != null) { code += "    elementY = " +  parameters.clientY + " - leftElementPosition.intValue();\n"; }

            code += "    if(elementX.intValue() <= 0) { elementX = 1; }\n";
            code += "    if(elementY.intValue() <= 0) { elementY = 1; }\n";

            return code;
        },

        _getLocatorFromThisObjectDescriptor: function(objectDescriptor)
        {
            if(objectDescriptor == "document") { return "dom=document.documentElement"; }
            else if (objectDescriptor == "window") { debugger; }
            else { return "xpath=" + objectDescriptor; }
        }
    }
}});