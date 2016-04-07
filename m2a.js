"use strict";
var asar = require('asar');
var mid = process.argv[2];
var src = './build/asar/' + mid + '/';
var dest = './app/data/asar/' + mid + '.asar';

asar.createPackage(src, dest, function(err) {
  console.log(err);
});
