"use strict";
var fs = require('fs');
var path = require('path');
var http = require('http');
var electron = require('electron');
var qiniu = require('qiniu');
var app = electron.app;
var appPath = app.getAppPath();
var dataPath = app.getPath('userData');
var asarPath = path.join(dataPath, 'data/asar');
var fs = require("fs");
var bucket = 'osip';
qiniu.conf.ACCESS_KEY = 'P5uYXO-BRXYzk9Sf0esfWBcpCxMZ1ppqboM-yOCu';
qiniu.conf.SECRET_KEY = 'RID8unaIxpPz5Gz3Ye-T0cHtSExCv6t_jsghPF4s';
// var writeFile = function(p, data) {
//   console.log(data);
//   fs.writeFile(p, data, 'utf8', function(error) {
//     if (error) {
//       throw error;
//     } else {
//       console.log("文件已保存");
//     }
//   });
// };
// var copyFile = function(src, dst) {
//   console.log('--------开始读取文件--------');
//   var fs = require('fs');
//   fs.readFile(src, 'utf-8', function(err, data) {
//     if (err) {
//       console.log("读取失败");
//     } else {
//       writeFile(dst, data) return data;
//     }
//   });
//   console.log('--------读取结束--------');
// };

var copy = function(src, dst, callback) {
  var wStream = fs.createWriteStream(dst);
  var rStream = fs.createReadStream(src);
  rStream.on('data', function() {
    rStream.pipe(wStream);
  });
  rStream.on('end', function() {
    wStream.end();
    callback();
  });
};
var checkAsar = function(callback) {
  console.log('check');
  var musics = JSON.parse(fs.readFileSync(path.join(appPath, 'app/data/music.json')));
  var needdown = [];
  for (let x in musics) {
    let copyto = path.join(asarPath, musics[x]['mid'] + '.asar');
    if (!fs.existsSync(copyto)) {
      needdown.push(musics[x]);
    }
  }
  if (needdown.length) {
    let a = 0;
    dlPackage(needdown, a, callback);
  } else {
    console.log('无需下载');
    callback();
  }
};
var dlPackage = function(getfrom, a, callback) {
  console.log(getfrom[a]['mid']);
  let cto = path.join(asarPath, getfrom[a]['mid'].toString());
  let ctoasar = path.join(asarPath, getfrom[a]['mid'] + '.asar');
  console.log(cto);
  if (!fs.existsSync(ctoasar)) {
    let fd = fs.openSync(cto, 'w');
    fs.closeSync(fd);
    let writestream = fs.createWriteStream(cto);
    let url = 'http://7xsop3.com2.z0.glb.clouddn.com/' + getfrom[a]['mid'] + '.asar';
    var policy = new qiniu.rs.GetPolicy();
    var downloadUrl = policy.makeRequest(url);
    console.log(downloadUrl);
    http.get(downloadUrl, function(res) {
      res.pipe(writestream);
    });
    writestream.on('finish', function() {
      console.log('Download Completed!');
      fs.renameSync(cto, ctoasar);
      a++;
      if (getfrom[a]) {
        dlPackage(getfrom, a, callback);
      } else {
        callback();
      }
    });
  } else {
    callback();
  }
};
var main = function(callback) {
  console.log('appPath: ' + appPath);
  var appDir = fs.readdirSync(path.join(appPath, 'app/data'));
  console.log(appDir);
  if (!fs.existsSync(path.join(dataPath, 'data'))) {
    console.log('Build dataDir');
    fs.mkdirSync(path.join(dataPath, 'data'));
  }
  if (!fs.existsSync(asarPath)) {
    console.log('Build dataDir');
    fs.mkdirSync(asarPath);
  }
  checkAsar(callback);
};

module.exports = main;
