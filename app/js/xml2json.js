"use strict";

function tom(t) {
  var timeReg = /^([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{3})/;
  var m = t.match(timeReg);
  var mm = m[1] * 3600000 + m[2] * 60000 + m[3] * 1000 + m[4] * 1;
  return mm;
};

function xmlConvert() {
  var j = {
    "name": "輝夜の城で踊りたい",
    "singer": "μ's",
    "position": [
      "umi",
      "maki",
      "eri",
      "nozomi",
      "honoka",
      "hanayo",
      "kotori",
      "niko",
      "rin"
    ],
    "timeline": []
  };
  console.warn('xmlConvert');
  var path = './data/lrc/1.xml';
  let xhr = new XMLHttpRequest();
  xhr.open("GET", path, false);
  xhr.send();
  $(xhr.responseText).find('p').each(function() {
    var obj = {
      from: sib.tom($(this).attr('begin')),
      to: sib.tom($(this).attr('end')),
      who: $(this).text().split(',')
    }
    j['timeline'].push(obj);
  });
  console.log(JSON.stringify(j));
};

module.exports = xmlConvert;
