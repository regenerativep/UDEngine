const fs = require("fs");
const path = require("path");
var settings = JSON.parse(fs.readFileSync("compileSettings.json", "utf-8"));

var files = [];
if(settings.from.constructor !== Array)
{
    settings.from = [settings.from];
}
for(var i = 0; i < settings.from.length; i++)
{
    var dirfiles = fs.readdirSync(settings.from[i]);
    for(var j = 0; j < dirfiles.length; j++)
    {
        var filename = dirfiles[j];
        if(filename.substring(filename.length - 3) == ".js")
        {
            files.push(path.join(settings.from[i], filename));
        }
    }
}

var newFile = fs.writeFileSync(settings.to, "");
for(var i = 0; i < files.length; i++)
{
    var data = fs.readFileSync(files[i], "utf-8") + "\n";
    fs.appendFileSync(settings.to, data);
    console.log(files[i]);
}