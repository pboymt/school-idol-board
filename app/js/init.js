"use strict";
var fs = require('fs');
var path = require('path');
var electron = require('electron');
var app = electron.app;
var appPath = app.getAppPath();
var dataPath = app.getPath('userData');
var copy = function(src, dst) {
    fs.createReadStream(src).pipe(fs.createWriteStream(dst));
};
var checkLrc = function(){

};
var checkPackage = function(){

};
var main = function(){
  console.log('appPath: '+appPath);
  var appDir = fs.readdirSync(path.join(appPath,'app/data'));
  console.log(appDir);
  if(!fs.existsSync(path.join(dataPath,'data'))){
    console.log('Build dataDir');
    fs.mkdirSync(path.join(dataPath,'data'));
  }
  var dataDir = fs.readdirSync(path.join(dataPath,'data'));
  console.log(dataDir.length);
};

module.exports = main;
