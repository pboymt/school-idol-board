'use strict';
const electron = require('electron');
window.$ = require('./js/jquery.min.js');
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;
const sib = require('./js/sib.js');

function loadConfig(){
  if(!window.localStorage.config){
    let defaultConfig = {
      "autoPlayAfterClickList":true,
      "useCustomPackage":false,
      "musicListFile":["./data/muisc.json"],
      "userDefalutPackage":"default"
    };
    window.localStorage.config = JSON.stringify(defaultConfig);
    return defaultConfig;
  }else{
    return JSON.parse(window.localStorage.config);
  }
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
  // for (var i = 0; i < singers.length; i++) {
  //   //console.log(singers[i].classList[1]);
  //   singers[i].style.backgroundImage = 'url(./data/package/default/' + singers[i].classList[1] + '.jpg)';
  // }
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
