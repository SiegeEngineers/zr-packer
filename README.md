# zr-packer
An automated Age of Empires 2 Zipped Random Map packer. This tool automatically detects changes in your RMS, SCX or SLP files and packs them into a ZR@.rms file.
## Download

## Usage
1. Unzip the zr-packer.exe into your active Script.RM folder.
2. Create a folder with your prefered mapname (without ZR@ and .rms) in that folder*
3. Place your RMS and optionally SCX and SLP files in that folder
4. Run zr-packer.exe
5. Happy editing and watch your ZR@maps appear in the Script.RM folder automatically.

*You can also make one or several folders to organize your ZR maps a bit better, and place your folders there: 
```
MyZRMaps
  MyMap1
    MyMap1.rms
    MyMap1.scx
    15007.slp
  MyMap2
    MyMap2.rms
    MyMap2.scx
    15007.slp
    15010.slp
```

## Build 

1. Install node
2. navigate to the folder in your favourite console
3. `npm install` 
4. Run it with `node index.js` to test if everything works.

Then to pack it into a exe file:
1. Install https://www.npmjs.com/package/pkg (with `npm install -g pkg`)
2. Run `pkg index.js`
