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

function setConfig(sibobj) {
  var conf = new electronConfig();
  var configEle = document.querySelectorAll('.config-value');
  var configs = conf.getAll();
  for (var x = 0; x < configEle.length; x++) {
    console.log(configs[configEle[x].getAttribute('name')]);
    if (configEle[x].getAttribute('type') == 'checkbox') {
      configEle[x].checked = configs[configEle[x].getAttribute('name')];
    } else {
      configEle[x].setAttribute('value', configs[configEle[x].getAttribute('name')]);
    }
    configEle[x].addEventListener('change', function() {
      console.log(this.checked);
      if (this.getAttribute('type') == 'checkbox') {
        conf.set(this.getAttribute('name'), this.checked, function(c) {
          console.log('重设成功！');
          sibobj.config = c;
        });
      } else {

      }
    });
  }
};

window.onload = function() {
  var mainBtn = document.getElementsByClassName('main-btn');
  var ctrlBtn = document.getElementsByClassName('ctrl-btn');
  var s = new sib(loadConfig());
  //console.log(s.config);
  setConfig(s);
  var beforeSize = 'default';
  setTimeout(function() {
    document.getElementsByClassName('singers')[0].classList.add('fade');
  }, 500);
  //autohideMouse();
  mainBtn[0].addEventListener('click', function() {
    var configFrame = document.querySelector('.config');
    if (configFrame.style.display == 'none') {
      configFrame.style.display = 'block';
    } else {
      configFrame.style.display = 'none';
    }
    //console.log(this.value);
  });
  mainBtn[1].addEventListener('change', function() {
    if (this.value != 'full') {
      beforeSize = this.value;
    }
    ipcRenderer.send('changeWindow', this.value);
    //console.log(this.value);
  });
  mainBtn[2].addEventListener('click', function() {
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
