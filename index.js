// Automated ZR Packer for Age of Empires 2 zipped random map scripts.

'use strict';

const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const recursiveWatch = require("recursive-watch");

// Some functions to iteratively and asynchrously zip a folder
const zf = require("./zipFolder.js");

// the list of files to update
const updates = []; 
const updateInterval = 1000; // time between updates in ms

const checkAndAddFolder = function (sourceFilePath) 
{
    const ext = path.extname(sourceFilePath);
    if((ext === ".rms" || 
    ext === ".scx" || 
    ext === ".slp") 
    && 
    (sourceFilePath.includes(path.sep)))
    {
        let folderPath = path.dirname(sourceFilePath);
        if(!folderPath){
            return; // we don't bother about root files
        }

        let folderName = path.basename(folderPath);

        // decide RMS name
        let zrName = "ZR@"+folderName+".rms";
        let filenames = [];
        fs.readdirSync(folderPath).forEach((str) => {
            if(str.endsWith(".rms") || str.endsWith(".scx") || str.endsWith(".slp"))
            {
                filenames.push(str);    
            }
        });
        let zrCTime = null;

        // check last updated versions
        if(fs.existsSync(zrName)){
            zrCTime = fs.statSync(zrName).ctimeMs;
        }
        // save for updating the ZR in intervals
        updates[zrName] = {
            sourceCTime: fs.statSync(sourceFilePath).ctimeMs, 
            zrCTime:zrCTime, 
            filenames: filenames, 
            folderPath: folderPath, 
            zrName: zrName
        };
    }
}

const saveZip = function (name, zip)
{
    zip.generateAsync({type:"nodebuffer", compression:"STORE"}).then((content) => {
        fs.writeFile(name, content, (error) => {
            if(error){
                if(error.code == "EBUSY")
                {
                    return console.log("\x1b[41m%s\x1b[0m", "Can not update ZR file. Is it opened in another application?");
                }
                return console.log(error);
            }
            console.log(`Updated ${name}`);
        });
    }, (error) => {
        console.log(error);
    });
}

const updateZips = function()
{
    let nUpdates = 0;
    for (let key in updates) 
    {
        let entry = updates[key];
        if(entry.zrCTime == null || entry.sourceCTime > entry.zrCTime)
        {
            let zip = new JSZip();
            let promises = [];
            for(let i = 0; i < entry.filenames.length; i++) {
                promises.push(zf.zipFileAsync(entry.folderPath, entry.filenames[i], zip));
            }
            Promise.all(promises).then((result) => {
                saveZip(entry.zrName, zip);
            }, (error) => {
                console.log(error);
            });
            nUpdates++;
        }
        delete updates[key];
    };
    if(nUpdates > 0) {
        console.log(`${nUpdates} ZR files updated. Listening for further changes...`);
    }
}


///////////////////////////////////////////////////////////
setInterval(updateZips, updateInterval);
console.log("Listening for changes...");

// This function might get called several times per change
// so we cache the results instead and update on a timer
recursiveWatch("./", (changedPath) => {
    console.log('changed', changedPath);
    checkAndAddFolder(changedPath);
});
///////////////////////////////////////////////////////////
