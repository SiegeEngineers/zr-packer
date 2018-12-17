// Parses a folder and adds it to the JSZip object

'use strict';

const fs = require('fs');
const path = require("path");
const JSZip = require("jszip");

const out = {
    zipFolderAsync : function (folderPath, zip, zipLocation = "" ) 
    {
        console.log(folderPath);
        return new Promise((resolve, reject) => {
            fs.readdir(folderPath, (error, filenames) => {
                if(error){ return reject(error); }
                let promises = [];
                for(let i = 0; i < filenames.length; i++) {
                    if (fs.statSync(path.join(folderPath, filenames[i])).isDirectory()) { // TODO: use async instead?
                        promises.push(this.zipFolderAsync(path.join(folderPath, filenames[i]), zip, path.join(zipLocation, filenames[i])));
                    } else {
                        promises.push(out.zipFileAsync(folderPath, filenames[i], zip, zipLocation));
                    }
                }
                Promise.all(promises).then((value) => {
                    resolve(zip);
                }, (error) => {return reject(error);});
            });
        })
    },

    zipFileAsync : function (folderPath, filename, zip, zipLocation = "") 
    {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(folderPath, filename), (error, content) => {
                if (error){ return reject(error); }
                resolve(zip.file(path.join(zipLocation, filename), content));
            });
        });
    }
};

module.exports = out;
