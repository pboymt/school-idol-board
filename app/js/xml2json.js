"use strict";
var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');
var arg = process.argv.splice(2);
var inpath = path.join('app/data/lrc', arg[0] + '.xml');
var outpath = path.join('app/data/lrc', arg[0] + '.json');

function tom(t) {
  var timeReg = /^([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{3})/;
  var m = t.match(timeReg);
  var mm = m[1] * 3600000 + m[2] * 60000 + m[3] * 1000 + m[4] * 1;
  return mm;
};

function xmlConvert(inpath, outpath) {
  var j = {
    "name": "友情ノーチェンジ",
    "singer": "μ's",
    "package": "first",
    "packageFormat": "png",
    "position": [
      "niko",
      "kotori",
      "nozomi",
      "umi",
      "rin",
      "eri",
      "honoka",
      "hanayo",
      "maki"
    ],
    "timeline": []
  };
  console.log('xmlConvert');
  var xmlstr = fs.readFileSync(inpath).toString();
  var $ = cheerio.load(xmlstr);
  $(xmlstr).find('p').each(function() {
    var obj = {
      from: tom($(this).attr('begin')),
      to: tom($(this).attr('end')),
      who: $(this).text().split(',')
    }
    j['timeline'].push(obj);
  });
  var fd = fs.openSync(outpath, 'a');
  fs.writeSync(fd, JSON.stringify(j));
};
xmlConvert(inpath, outpath);
