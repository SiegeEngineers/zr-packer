// Parses a folder and adds it to the JSZip object

'use strict';

const fs = require('fs');
const JSZip = require("jszip");

const out = {
    zipFolderAsync : function (path, zip, zipLocation = "" ) 
    {
        console.log(path);
        if(path && !path.endsWith("/") && !path.endsWith("\\"))
        {
            path += "\\";
        }
        if(zipLocation && !zipLocation.endsWith("/") && !zipLocation.endsWith("\\"))
        {
            zipLocation += "\\";
        }
        return new Promise((resolve, reject) => {
            fs.readdir(path, (error, filenames) => {
                if(error){ return reject(error); }
                let promises = [];
                for(let i = 0; i < filenames.length; i++) {
                    if (fs.statSync(path + filenames[i]).isDirectory()) { // TODO: use async instead?
                        promises.push(this.zipFolderAsync(path + filenames[i], zip, zipLocation+filenames[i]));
                    } else {
                        promises.push(out.zipFileAsync(path, filenames[i], zip, zipLocation));
                    }
                }
                Promise.all(promises).then((value) => {
                    resolve(zip);
                }, (error) => {return reject(error);});
            });
        })
    },

    zipFileAsync : function (path, filename, zip, zipLocation = "") 
    {
        if(path && !path.endsWith("/") && !path.endsWith("\\"))
        {
            path += "\\";
        }
        if(zipLocation && !zipLocation.endsWith("/") && !zipLocation.endsWith("\\"))
        {
            zipLocation += "\\";
        }
        return new Promise((resolve, reject) => {
            fs.readFile(path+filename, (error, content) => {
                if (error){ return reject(error); }
                resolve(zip.file(zipLocation+filename, content));
            });
        });
    }
};

module.exports = out;