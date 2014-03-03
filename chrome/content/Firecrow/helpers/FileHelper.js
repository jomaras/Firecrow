const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/NetUtil.jsm");
Cu.import("resource://gre/modules/FileUtils.jsm");

var FileHelper;
if(typeof FBL == "undefined")
{
    FBL =  { Firecrow: {}, ns:  function(namespaceFunction){ namespaceFunction(); }};
}

FBL.ns(function () { with (FBL) {
/******/

var firecrowFolderPath = ["Firecrow"];
var recordingsFolderPath = firecrowFolderPath.concat(["profiles"]);
var phantomJsModelFolder = firecrowFolderPath.concat(["phantomJs"]);
var nodeJsModelFolder = firecrowFolderPath.concat(["nodeJs"]);

Firecrow.FileHelper = FileHelper =
{
    userPickFile: function(window, title, filter)
    {
        const nsIFilePicker = Components.interfaces.nsIFilePicker;

        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        fp.init(window, title, nsIFilePicker.modeOpen);
        fp.appendFilter(filter, filter);

        var rv = fp.show();

        if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace)
        {
            return fp.file.path;
        }

        return null;
    },

    createFirecrowDirs: function()
    {
        this._createDirsIfNotExists("ProfD", recordingsFolderPath);
    },

    createFirecrowPhantomJsDirs: function()
    {
        this._createDirsIfNotExists("ProfD", phantomJsModelFolder);
    },

    createFirecrowNodeJsDirs: function()
    {
        this._createDirsIfNotExists("ProfD", nodeJsModelFolder);
    },

    _createDirsIfNotExists: function(key, pathArray)
    {
        return FileUtils.getDir(key, pathArray, true);
    },

    createEventProfilingFile: function(siteName, recordingId, eventProfilingInfo)
    {
        this._createProfilingFile(siteName, "events", recordingId, eventProfilingInfo);
    },

    createAllExecutionsProfilingFile: function(siteName, recordingId, executionProfilingInfo)
    {
        this._createProfilingFile(siteName, "executions", recordingId, executionProfilingInfo);
    },

    saveModelForPhantomJs: function(model, callback)
    {
        this.createFirecrowPhantomJsDirs();
        this._saveModelInFirecrowFolder(phantomJsModelFolder, "model.js", model, callback);
    },

    saveModelsForExternalApplications: function(models, wrapModelFunction, callback)
    {
        this.createFirecrowPhantomJsDirs();

        var modelFileLocations = [];
        models.forEach(function (model, index)
        {
            this.saveModelForExternalApplications(model, "model" + (index + 1) + ".js",
            wrapModelFunction,
            function(filePath)
            {
                modelFileLocations.push(filePath);
                if(modelFileLocations.length == models.length)
                {
                    callback && callback(modelFileLocations);
                }
            });
        }, this);
    },

    saveModelForExternalApplications: function(model, modelName, wrapModelFunction, callback)
    {
        this.createFirecrowNodeJsDirs();
        this._saveModelInFirecrowFolder(nodeJsModelFolder, modelName, model, wrapModelFunction, callback);
    },

    _saveModelInFirecrowFolder: function(pathArray, modelName, model, wrapModelFunction, callback)
    {
        this.deleteFilesInFolder(FileUtils.getFile("ProfD", pathArray).path);

        wrapModelFunction = wrapModelFunction || function(x) { return x; }

        var file = FileUtils.getFile("ProfD", pathArray.concat([modelName]));
        if(!file.exists())
        {
            file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);
        }

        var ostream = FileUtils.openSafeFileOutputStream(file);

        var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        var istream = converter.convertToInputStream(wrapModelFunction(JSON.stringify(model, function(key, value)
        {
            if(key=="value" && value != null && value.constructor != null && value.constructor.name === "RegExp")
            {
                return { type: 'RegExpLiteral',  RegExpBase64: btoa(value.toString())};
            }

            return value;
        })));

        NetUtil.asyncCopy(istream, ostream, function()
        {
            FileUtils.closeSafeFileOutputStream(ostream);
            callback && callback(file.path);
        });
    },

    transferScriptsForSlicing: function(callback)
    {
        this.copyFiles
        (
            [
                { fromLocation: "chrome://Firecrow/content/phantomJs/externalSlicerScript.js", toLocation: phantomJsModelFolder.concat(["externalSlicerScript.js"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/externalSlicedMarker.html", toLocation: phantomJsModelFolder.concat(["externalSlicedMarker.html"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/externalSlicer.html", toLocation: phantomJsModelFolder.concat(["externalSlicer.html"])},
                { fromLocation: "chrome://Firecrow/content/beautifier/beautify-All.js", toLocation: phantomJsModelFolder.concat(["beautify-All.js"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/Firecrow-all.js", toLocation: phantomJsModelFolder.concat(["Firecrow-all.js"])}
            ],
            function(copiedFilesInformation)
            {
                for(var i = 0; i < copiedFilesInformation.length; i++)
                {
                    if(copiedFilesInformation[i].path.indexOf("externalSlicerScript.js") != -1)
                    {
                        callback && callback(copiedFilesInformation[i].path);
                        return;
                    }
                }
            }
        );
    },

    transferScriptsForReuser: function(callback)
    {
        var reuserModules = nodeJsModelFolder.concat(["reuserModules"]);

        this._createDirsIfNotExists("ProfD", reuserModules);

        this.copyFiles
        (
            [
                { fromLocation: "chrome://FirecrowNode/content/reuserModules/ConflictFixer.js", toLocation: reuserModules.concat(["ConflictFixer.js"])},
                { fromLocation: "chrome://FirecrowNode/content/reuserModules/ConflictFixerCommon.js", toLocation: reuserModules.concat(["ConflictFixerCommon.js"])},
                { fromLocation: "chrome://FirecrowNode/content/reuserModules/CssConflictFixer.js", toLocation: reuserModules.concat(["CssConflictFixer.js"])},
                { fromLocation: "chrome://FirecrowNode/content/reuserModules/HtmlConflictFixer.js", toLocation: reuserModules.concat(["HtmlConflictFixer.js"])},
                { fromLocation: "chrome://FirecrowNode/content/reuserModules/JsConflictFixer.js", toLocation: reuserModules.concat(["JsConflictFixer.js"])},
                { fromLocation: "chrome://FirecrowNode/content/reuserModules/ResourceConflictFixer.js", toLocation: reuserModules.concat(["ResourceConflictFixer.js"])},
                { fromLocation: "chrome://FirecrowNode/content/reuserModules/Reuser.js", toLocation: reuserModules.concat(["Reuser.js"])},

                { fromLocation: "chrome://Firecrow/content/helpers/ASTHelper.js", toLocation: nodeJsModelFolder.concat(["ASTHelper.js"])},
                { fromLocation: "chrome://Firecrow/content/helpers/UriHelper.js", toLocation: nodeJsModelFolder.concat(["UriHelper.js"])},
                { fromLocation: "chrome://Firecrow/content/helpers/valueTypeHelper.js", toLocation: nodeJsModelFolder.concat(["valueTypeHelper.js"])},

                { fromLocation: "chrome://Firecrow/content/templates/reuserTemplates.js", toLocation: nodeJsModelFolder.concat(["reuserTemplates.js"])},

                { fromLocation: "chrome://Firecrow/content/codeMarkupGenerator/codeMarkupGenerator.js", toLocation: nodeJsModelFolder.concat(["codeMarkupGenerator.js"])},
                { fromLocation: "chrome://Firecrow/content/codeMarkupGenerator/codeTextGenerator.js", toLocation: nodeJsModelFolder.concat(["codeTextGenerator.js"])},
                { fromLocation: "chrome://Firecrow/content/parsers/CssSelectorParser.js", toLocation: nodeJsModelFolder.concat(["CssSelectorParser.js"])},

                { fromLocation: "chrome://Firecrow/content/nodeJs/reuser.js", toLocation: nodeJsModelFolder.concat(["reuser.js"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/Firecrow-all.js", toLocation: nodeJsModelFolder.concat(["Firecrow-all.js"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/reuserScenarioExecutorAnalyzer.html", toLocation: nodeJsModelFolder.concat(["reuserScenarioExecutorAnalyzer.html"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/reuserScenarioExecutorAnalyzer.js", toLocation: nodeJsModelFolder.concat(["reuserScenarioExecutorAnalyzer.js"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/reuserScenarioExecutorSlicer.html", toLocation: nodeJsModelFolder.concat(["reuserScenarioExecutorSlicer.html"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/reuserScenarioExecutorSlicer.js", toLocation: nodeJsModelFolder.concat(["reuserScenarioExecutorSlicer.js"])}
            ],
            function(copiedFilesInformation)
            {
                for(var i = 0; i < copiedFilesInformation.length; i++)
                {
                    if(copiedFilesInformation[i].path.indexOf("reuser.js") != -1)
                    {
                        callback && callback(copiedFilesInformation[i].path);
                        return;
                    }
                }
            }
        );
    },

    transferScriptsForScenarioGenerator: function(callback)
    {
        var scenarioGeneratorModules = nodeJsModelFolder.concat(["scenarioGeneratorModules"]);
        var constraintSolverFolder = nodeJsModelFolder.concat(["constraintSolver"]);
        var constraintSolverJsonFolder = constraintSolverFolder.concat(["jsonFiles"]);

        this._createDirsIfNotExists("ProfD", scenarioGeneratorModules);
        this._createDirsIfNotExists("ProfD", constraintSolverFolder);
        this._createDirsIfNotExists("ProfD", constraintSolverJsonFolder);
        this._createDirsIfNotExists("ProfD", nodeJsModelFolder.concat(["eventExecutions"]));

        this.copyFiles
        (
            [
                { fromLocation: "chrome://Firecrow/content/nodeJs/scenarioGeneratorScript.js", toLocation: nodeJsModelFolder.concat(["scenarioGeneratorScript.js"])},
                { fromLocation: "chrome://Firecrow/content/nodeJs/viewExecutedCode.html", toLocation: nodeJsModelFolder.concat(["viewExecutedCode.html"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/Firecrow-all.js", toLocation: nodeJsModelFolder.concat(["Firecrow-all.js"])},

                { fromLocation: "chrome://Firecrow/content/phantomJs/scenarioExecutor.js", toLocation: nodeJsModelFolder.concat(["scenarioExecutor.js"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/scenarioExecutor.html", toLocation: nodeJsModelFolder.concat(["scenarioExecutor.html"])},
                { fromLocation: "chrome://Firecrow/content/phantomJs/scenarioExecutor.txt", toLocation: nodeJsModelFolder.concat(["scenarioExecutor.txt"])},

                { fromLocation: "chrome://Firecrow/content/helpers/ASTHelper.js", toLocation: nodeJsModelFolder.concat(["ASTHelper.js"])},
                { fromLocation: "chrome://Firecrow/content/helpers/valueTypeHelper.js", toLocation: nodeJsModelFolder.concat(["valueTypeHelper.js"])},
                { fromLocation: "chrome://Firecrow/content/codeMarkupGenerator/codeMarkupGenerator.js", toLocation: nodeJsModelFolder.concat(["codeMarkupGenerator.js"])},
                { fromLocation: "chrome://Firecrow/content/codeMarkupGenerator/codeTextGenerator.js", toLocation: nodeJsModelFolder.concat(["codeTextGenerator.js"])},


                { fromLocation: "chrome://FirecrowConstraintSolver/content/constraintSolver.jar", toLocation: constraintSolverFolder.concat(["constraintSolver.jar"])},

                { fromLocation: "chrome://FirecrowConstraintSolver/content/jsonFiles/input.txt", toLocation: constraintSolverJsonFolder.concat(["input.txt"])},
                { fromLocation: "chrome://FirecrowConstraintSolver/content/jsonFiles/input.txt", toLocation: constraintSolverJsonFolder.concat(["output.txt"])},


                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/ConstraintResolver.js", toLocation: scenarioGeneratorModules.concat(["ConstraintResolver.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/Event.js", toLocation: scenarioGeneratorModules.concat(["Event.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/Expression.js", toLocation: scenarioGeneratorModules.concat(["Expression.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/NumberRange.js", toLocation: scenarioGeneratorModules.concat(["NumberRange.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/ObjectConverter.js", toLocation: scenarioGeneratorModules.concat(["ObjectConverter.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/PathConstraint.js", toLocation: scenarioGeneratorModules.concat(["PathConstraint.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/Scenario.js", toLocation: scenarioGeneratorModules.concat(["Scenario.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/ScenarioCollection.js", toLocation: scenarioGeneratorModules.concat(["ScenarioCollection.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/ScenarioGenerator.js", toLocation: scenarioGeneratorModules.concat(["ScenarioGenerator.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/ScenarioGeneratorHelper.js", toLocation: scenarioGeneratorModules.concat(["ScenarioGeneratorHelper.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/StringConstraint.js", toLocation: scenarioGeneratorModules.concat(["StringConstraint.js"])},
                { fromLocation: "chrome://FirecrowNode/content/scenarioGeneratorModules/ValueTypeHelper.js", toLocation: scenarioGeneratorModules.concat(["ValueTypeHelper.js"])}
            ],
            function(copiedFilesInformation)
            {
                for(var i = 0; i < copiedFilesInformation.length; i++)
                {
                    if(copiedFilesInformation[i].path.indexOf("scenarioGeneratorScript.js") != -1)
                    {
                        callback && callback(copiedFilesInformation[i].path);
                        return;
                    }
                }
            }
        );
    },

    getExecutedCodeMarkupPath: function()
    {
        return FileUtils.getFile("ProfD", nodeJsModelFolder.concat(["viewExecutedCode.html"])).path;
    },

    getAchievedCoverage: function()
    {
        var fileContent = this.readFromFile(FileUtils.getFile("ProfD", nodeJsModelFolder.concat(["achievedCoverage.txt"])).path);

        return (parseFloat(fileContent) * 100) + "%";
    },

    getGeneratedScenarios: function()
    {
        return this._getScenarios(nodeJsModelFolder.concat(["generatedScenarios.txt"]))
    },

    getKeptScenarios: function()
    {
        return this._getScenarios(nodeJsModelFolder.concat(["filteredScenarios.txt"]))
    },

    _getScenarios: function(pathArray)
    {
        var scenariosJSON = FileHelper.readFromFile(FileUtils.getFile("ProfD", pathArray).path);

        try
        {
            return JSON.parse(scenariosJSON);
        }
        catch(e)
        {
            Cu.reportError("Error when converting generated scenarios to objects: " + e);
        }
    },

    copyFiles: function(copyFilesInformation, callback)
    {
        var copiedFilesInformation = [];

        copyFilesInformation.forEach(function(copyFileInformation)
        {
            FileHelper.copyFile(copyFileInformation.fromLocation, copyFileInformation.toLocation, function(copiedFileInformation)
            {
                copiedFilesInformation.push(copiedFileInformation);

                if(copiedFilesInformation.length >= copyFilesInformation.length)
                {
                    callback && callback(copiedFilesInformation);
                }
            });
        });
    },

    copyFile: function(fromLocation, toLocation, callback)
    {
        NetUtil.asyncFetch(fromLocation, function(aInputStream, aResult)
        {
            if (!Components.isSuccessCode(aResult))
            {
                callback && callback({success: false, path: fromLocation});
                return;
            }

            var file = FileUtils.getFile("ProfD", toLocation);

            if(!file.exists())
            {
                file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);
            }

            var ostream = FileUtils.openSafeFileOutputStream(file);

            NetUtil.asyncCopy(aInputStream, ostream, function()
            {
                FileUtils.closeSafeFileOutputStream(ostream);
                callback && callback({success: false, path: file.path});
            });
        });
    },

    _createProfilingFile: function(siteName, profilingType, recordingId, info)
    {
        //Create directory if not exists
        FileUtils.getDir("ProfD", recordingsFolderPath.concat(siteName), true);

        recordingId += "-" + profilingType + ".json";

        var file = FileUtils.getFile("ProfD", recordingsFolderPath.concat([siteName, recordingId]));
        file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);

        var ostream = FileUtils.openSafeFileOutputStream(file)

        var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        var istream = converter.convertToInputStream(info);

        NetUtil.asyncCopy(istream, ostream, function()
        {
            FileUtils.closeSafeFileOutputStream(ostream);
        });

        Cu.reportError("Profiling file written to:" + file.path);
    },

    getEventRecordingsFiles: function(siteName)
    {
        var dir = FileUtils.getDir("ProfD", recordingsFolderPath.concat(siteName), true);

        var entries = dir.directoryEntries;
        var files = [];

        while(entries.hasMoreElements())
        {
            var entry = entries.getNext();

            entry.QueryInterface(Ci.nsIFile);

            if(!entry.isDirectory() && entry.path.indexOf("allExecutions.json") == -1)
            {
                files.push({path: entry.path, name: entry.leafName, content: this.readFromFile(entry.path)});
            }
        }

        return files;
    },

    getSavedPagesWithEventRecordings: function()
    {
        var dir = FileUtils.getDir("ProfD", recordingsFolderPath, true);

        var entries = dir.directoryEntries;
        var files = [];

        while(entries.hasMoreElements())
        {
            var entry = entries.getNext();

            entry.QueryInterface(Components.interfaces.nsIFile);

            if(entry.isDirectory())
            {
                files.push({path: entry.path, name: entry.leafName});
            }
        }

        return files;
    },

    readFromFile: function (absoluteFilePath)
    {
        try
        {
            var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);

            file.initWithPath(absoluteFilePath);

            if (!file.exists()) { Cu.reportError("File not found:" + absoluteFilePath); return ""; }

            var data = "";
            var fstream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
            var cstream = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);

            fstream.init(file, -1, 0, 0);
            cstream.init(fstream, "UTF-8", 0, 0); // you can use another encoding here if you wish

            var str = {};
            var read = 0;
            do
            {
                read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
                data += str.value;
            } while (read != 0);

            cstream.close(); // this closes fstream

            return data;
        } 
        catch (e) { alert("Error while reading from file:" + e); }
    },

    getNativePath: function(path)
    {
        var file = FileUtils.getFile("ProfD", path);

        return file.nativePath;
    },
    
    getFileContentFromUrl: function (fileUrl)
    {
        try
        {
        	return this.getFileLinesFromUrl(fileUrl).join("");
        }
        catch (e) { alert("Error while getting file content: " + fileUrl + " " + e); }
    },
    
    getFileLinesFromUrl: function (fileUrl)
    {
        try
        {
            var selectedBrowser = Firecrow.fbHelper.getCurrentBrowser();
            
            return new Firebug.SourceCache
            ({
                browser: selectedBrowser,
                window: selectedBrowser.contentWindow
            }).load(fileUrl);
        }
        catch (e) { alert("Error while getting file lines: " + fileUrl + " " + e); }
    },

    writeToFile: function (absoluteFilePath, content, charSet)
    {
        try
        {
            charSet = charSet || "UTF-8";
            
            absoluteFilePath = absoluteFilePath.replace(new RegExp("/", "g"), "\\");

            var stream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);

            stream.init(this.getFile(absoluteFilePath), 0x02 | 0x08 | 0x20, 0666, 0);

            var converter = Cc["@mozilla.org/intl/converter-output-stream;1"].createInstance(Ci.nsIConverterOutputStream);

            converter.init(stream, charSet, 0, 0);
            converter.writeString(content);

            converter.close();
            stream.close();
        }
        catch (e) { Cu.reportError("Error while writing to file:" + e); }
    },

    appendToFile: function (absoluteFilePath, content)
    {
        try
        {
            var totalContent = this.readFromFile(absoluteFilePath) + "\r\n" + content;

            this.writeToFile(absoluteFilePath, totalContent);

        } catch (e) { alert("Error while appending to file:" + e); }
    },
    
    cleanPath: function (relativeFilePath)
    {
        var indexOfQuestionmark = relativeFilePath.indexOf("?");
        
        if (indexOfQuestionmark >= 0)
        {
            relativeFilePath = relativeFilePath.substr(0, indexOfQuestionmark);
        }

        return relativeFilePath;
    },

    downloadFile: function (downloadFromLocation, downloadToLocation)
    {
        try
        {
            downloadToLocation = downloadToLocation.replace(new RegExp("/", "g"), "\\");

            var wbp = Cc['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Ci.nsIWebBrowserPersist);
            var ios = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);

            var uri = ios.newURI(downloadFromLocation, null, null);

            wbp.persistFlags &= ~Ci.nsIWebBrowserPersist.PERSIST_FLAGS_NO_CONVERSION; // don't save gzipped

            wbp.saveURI(uri, null, null, null, null, this.getFile(downloadToLocation));
        }
        catch (e) { alert("Error while downloading file" + e); }
    },

    downloadImage: function (url)
    {
        try
        {
            var ioserv = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
            var channel = ioserv.newChannel(url, 0, null);
            var stream = channel.open();

            if (channel instanceof Ci.nsIHttpChannel && channel.responseStatus != 200)
            {
                return "";
            }

            var bstream = Cc["@mozilla.org/binaryinputstream;1"].createInstance(Ci.nsIBinaryInputStream);
            bstream.setInputStream(stream);

            var size = 0;
            var file_data = "";
            
            while (size = bstream.available())
            {
                file_data += bstream.readBytes(size);
            }

            return file_data;
        }
        catch (e) { alert("Error while downloading image" + e); }
    },

    openFile: function (path)
    {
        try
        {
            var file = this.getFile(path.replace(new RegExp("/", "g"), "\\"));
            file.launch();
        }
        catch (e) { alert("Error while opening file: " + e); }
    },

    getFile: function (absoluteFilePath)
    {
        try
        {
            var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);

            file.initWithPath(absoluteFilePath);

            if (file.exists() == false)
            {
                file.create(Ci.nsIFile.NORMAL_FILE_TYPE, 420);
            }

            return file;
        }
        catch (e) { Cu.reportError("Trying to get file:" + absoluteFilePath + " " + e); }
    },

    getDirectoriesFromFolder: function(folderPath)
    {
        try
        {
            var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
            file.initWithPath(folderPath);

            var entries = file.directoryEntries;
            var directories = [];

            while(entries.hasMoreElements())
            {
                var entry = entries.getNext();
                entry.QueryInterface(Components.interfaces.nsIFile);
                if(entry.isDirectory())
                {
                    directories.push(entry.path + "\\");
                }
            }

            return directories;
        }
        catch(e) { alert("Error when getting directories from folder: " + e); }
    },
    
    deleteFilesInFolder: function(path)
    {
        try
        {
            var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
              
            file.initWithPath(path);
          
            var entries = file.directoryEntries;  
          
            while(entries.hasMoreElements())  
            {  
                var entry = entries.getNext();
                
                if(entry != null)
                {
                    entry.QueryInterface(Components.interfaces.nsIFile);  
                    entry.remove(true);
                }
            }
        }
        catch (e) { Cu.reportError("Error while deleting files in a folder " + e); }
    },

    deleteFile: function(path)
    {
        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

        file.initWithPath(path);

        if(file.exists())
        {
            file.remove(true);
        }
    }
}
/******/
}});

var EXPORTED_SYMBOLS = ["FileHelper"];