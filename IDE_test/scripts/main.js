window.onload = function()
{
    var modelTextarea = document.getElementById("modelTextarea");
    var editor = CodeMirror.fromTextArea(document.getElementById("editor"),
    {
        lineNumbers: true,
        mode: {name: "text/html", globaVars: true},
        matchBrackets: true,
        extraKeys: {"Ctrl-Space": "autocomplete"}
    });

    editor.on("beforeSelectionChange", function(codeMirror, selection)
    {
        if(selection.ranges.length != 1) { return; }

        var anchor = selection.ranges[0].anchor;
        var head = selection.ranges[0].head;

        if(head.ch != anchor.ch || head.line != anchor.line)
        {
            console.log(anchor.line + ":" + anchor.ch + " - " + head.line + ":" + head.ch);
        }
    })

    var buttonRun = document.getElementById("buttonRun");
    buttonRun.onclick = function()
    {
        var builder = new Tautologistics.NodeHtmlParser.HtmlBuilder()
        var parser = new Tautologistics.NodeHtmlParser.Parser(builder);
        parser.parseComplete(editor.getValue());
        modelTextarea.textContent = JSON.stringify(builder.dom, null, 2);
    };
};