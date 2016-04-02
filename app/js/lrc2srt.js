"use strict";
var fs = require('fs');
var path = require('path');
console.log('start\n');
var arg = process.argv.splice(2);
//npm run lrc <in&outpath>
//console.log(arg);
//console.log(path.resolve(arg[0]));
var inpath = path.join('app/data/lrc', arg[0] + '.lrc');
var outpath = path.join('app/data/lrc', arg[0] + '.srt');
console.log(fs.existsSync(inpath) + '\n');
var arr = fs.readFileSync(inpath).toString().split(/\r\n/);
var fd = fs.openSync(outpath, 'a');
for (var x = 0, y = 0; x < arr.length; x++) {
  if (arr[x]) {
    var thisline = arr[x].match(/\[([0-9]{2,}):([0-6][0-9])\.([0-9]{2})]/);
    if (arr[x + 1]) {
      var nextline = arr[x + 1].match(/\[([0-9]{2,}):([0-6][0-9])\.([0-9]{2})]/);
    }
    var lyric = arr[x].replace(/\[([0-9]{2,}):([0-6][0-9])\.([0-9]{2})]/, '');
    if (thisline) {
      y++;
      console.log(y);
      fs.writeSync(fd, y + '\r\n');
      var begin = '00:' + thisline[1] + ':' + thisline[2] + ',' + thisline[3] * 10;
      if (nextline) {
        var end = '00:' + nextline[1] + ':' + nextline[2] + ',' + (nextline[3] * 1 - 1) * 10;
      } else {
        var end = '00:' + thisline[1] + ':' + thisline[2] + ',' + (thisline[3] * 1 + 1) * 10;
      }
      console.log(begin + ' --> ' + end);
      fs.writeSync(fd, begin + ' --> ' + end + '\r\n');
      console.log(lyric);
      fs.writeSync(fd, lyric + '\r\n');
      console.log('\r\n');
      fs.writeSync(fd, '\r\n');
    }
  }

}
