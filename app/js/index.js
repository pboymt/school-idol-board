'use strict';
const electron = require('electron');
window.$ = require('jquery.min.js');
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;
const sib = require('sib.js');

var mlist = function mlist() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "./data/music.json", false);
  xhr.send();
  var obj = JSON.parse(xhr.responseText);
  console.log(obj);
  for (var i = 3; i >= 0; i--) {
    var item = document.createElement('div');
    item.className = 'music-item';
    item.textContent = obj[i]['name'];
    item.setAttribute('mid', obj[i]['mid']);
    document.getElementsByClassName('music-list')[0].appendChild(item);
    item.addEventListener('click', function() {
      console.log(this.getAttribute('mid'));
      sib.loadMusic(this.getAttribute('mid'));
    });
  }
  for (var x = obj.length - 1; x > 3; x--) {
    var item = document.createElement('div');
    item.className = 'music-item';
    item.textContent = obj[x]['name'];
    item.setAttribute('mid', obj[x]['mid']);
    document.getElementsByClassName('music-list')[0].appendChild(item);
    item.addEventListener('click', function() {
      console.log(this.getAttribute('mid'));
      sib.loadMusic(this.getAttribute('mid'));
    });
  }
  console.log('ok');
  document.getElementsByClassName('music-list')[0].addEventListener('mousewheel', function() {
    if (event.deltaY > 0) {
      var la = this.lastChild;
      this.removeChild(la);
      this.insertBefore(la, this.childNodes[0]);
    } else {
      var fi = this.firstChild;
      this.removeChild(fi);
      this.appendChild(fi);
    }
  });
};



function autohideMouse() {
  var isMoving = true;
  var to = setTimeout(function() {
    document.getElementsByClassName('singers')[0].style.cursor = 'none';
    isMoving = true
  }, 3000);
  document.getElementsByClassName('singers')[0].addEventListener('mousemove', function() {
    if (!isMoving) {
      this.style.cursor = 'default';
    }
    clearTimeout(to);
    to = setTimeout(function() {
      document.getElementsByClassName('singers')[0].style.cursor = 'none';
      isMoving = false;
    }, 3000);
  })
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
window.onload = function() {
  var singers = document.getElementsByClassName('singer');
  var mainBtn = document.getElementsByClassName('main-btn');
  var ctrlBtn = document.getElementsByClassName('ctrl-btn');
  var s = new sib();
  var deMainBtn = [{
    width: 1920,
    value: '1920*1080'
  }, {
    width: 1366,
    value: '1280*720'
  }, {
    width: 1366,
    value: '1280*400'
  }, {
    width: 1920,
    value: 'large'
  }]
  for (var i = 0; i < singers.length; i++) {
    //console.log(singers[i].classList[1]);
    singers[i].style.backgroundImage = 'url(./data/package/default/' + singers[i].classList[1] + '.jpg)';
  }
  setTimeout(function() {
    document.getElementsByClassName('singers')[0].classList.add('fade');
  }, 500);
  autohideMouse();
  //mlist();
  //xmlConvert();
  mainBtn[0].addEventListener('change', function() {
    ipcRenderer.send('changeWindow', this.value);
    //console.log(this.value);
  });
  mainBtn[1].addEventListener('click', function() {
    ipcRenderer.send('closeWindow');
    //console.log(this.value);
  });
  ctrlBtn[0].addEventListener('click', function() {
    console.log(s.isPlaying);
    if (s.isPlaying) {
      s.mPause(this);
    } else {
      s.mPlay(this);
    }
  });
};
