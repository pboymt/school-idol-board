'use strict';
var rcedit = require('rcedit');
var packager = require('electron-packager');
var pkgjson = require('./package.json')
var appVer = pkgjson.version;
var appName = 'SIB';
var fs = require('fs');
var path = require('path');
var iconPath = path.join('resources', 'icon@512.ico');
var outPath = path.join('build/release', appVer);
var rcopt = {
  'icon': iconPath
}
console.log(iconPath);
var options = {
  'arch': 'ia32',
  'dir': '.',
  'platform': 'win32',
  'app-copyright': 'pboymt',
  'app-version': appVer,
  'asar': true,
  'name': appName,
  //'build-version':'0.1.1',
  //'icon':iconPath,
  'ignore': 'build',
  'out': outPath,
  'overwrite': true
}
packager(options, function(err, appPath) {
  console.log('fuck');
  let exePath = path.join(appPath[0], appName + '.exe');
  console.log(exePath);
  console.log(fs.existsSync(exePath));
  rcedit(exePath, rcopt, function(err) {
    if (!err) {
      console.log('Success!');
    } else {
      console.log(err);
    }
  })
});
