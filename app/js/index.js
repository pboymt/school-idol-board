'use strict';
const electron = require('electron');
window.$ = require('./js/jquery.min.js');
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;
const sib = require('./js/sib.js');
const electronConfig = require('./js/config.js');

function loadConfig() {
  let conf = new electronConfig();
  return conf.getAll();
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

window.onload = function() {
  var mainBtn = document.getElementsByClassName('main-btn');
  var ctrlBtn = document.getElementsByClassName('ctrl-btn');
  var s = new sib(loadConfig());
  var beforeSize = 'default';
  setTimeout(function() {
    document.getElementsByClassName('singers')[0].classList.add('fade');
  }, 500);
  //autohideMouse();
  mainBtn[0].addEventListener('change', function() {
    if (this.value != 'full') {
      beforeSize = this.value;
    }
    ipcRenderer.send('changeWindow', this.value);
    //console.log(this.value);
  });
  mainBtn[1].addEventListener('click', function() {
    ipcRenderer.send('closeWindow');
    //console.log(this.value);
  });
  ctrlBtn[0].addEventListener('click', function() {
    //console.log(s.isPlaying);
    if (s.isPlaying) {
      s.mPause();
    } else {
      s.mPlay();
    }
  });
  window.addEventListener('keydown', function() {
    console.log(event.keyCode);
    if (event.keyCode == 32) {
      if (s.isPlaying) {
        s.mPause();
      } else {
        s.mPlay();
      }
    } else if (event.keyCode == 27) {
      if (mainBtn[0].value == 'full') {
        ipcRenderer.send('changeWindow', beforeSize);
        mainBtn[0].value = beforeSize;
      }
    }
  })
};
