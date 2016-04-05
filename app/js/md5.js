"use strict";

var crypto = require('crypto');
var fs = require('fs');
//var filename = process.argv.slice(2);
// if(!filename[0]){
//   filename[0] = process.argv[1];
// };
var main = function(filename,callback) {
  var md5sum = crypto.createHash('md5');
  var s = fs.ReadStream();
  s.on('data', function(d) {
    md5sum.update(d);
  });

  s.on('end', function() {
    var d = md5sum.digest('hex');
    if(typeof callback == 'function'){
      callback(d);
    }
  });
};

module.exports = main;
