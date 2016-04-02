"use strict";
const fs = require('fs');
const path = require('path');
const electron = require('electron');
const app = electron.remote.app;
const appPath = app.getAppPath();
class sib {
  constructor(options) {
    let su = this;
    //console.log('run');
    /*
     * 重要属性
     */
    this.singers = document.getElementsByClassName('singer');
    this.mainBtn = document.getElementsByClassName('main-btn');
    this.ctrlBtn = document.getElementsByClassName('ctrl-btn');
    console.log(this.ctrlBtn[0]);
    this.player = document.getElementById('player');
    this.singer = document.getElementsByClassName('singer');
    this.mlist = document.getElementsByClassName('music-list')[0];
    this.playingTimeline = {
      show: [],
      hide: []
    };
    this.playingMID = 0;
    this.isPlaying = false;
    this.playBoard = {};
    this.playList = [];
    this.isListReset = true;
    this.themeBoard = 'first';
    //设置
    this.config = options;
    //console.log(options);
    // 初始化方法
    this.loadList();
    this.loadMusic(this.mlist.childNodes[3].getAttribute('mid'), this.config['autoPlay']);
    //初始化监听事件
    this.player.addEventListener('ended', function() {
      console.log('ended');
      su.mPause();
      if (su.config['autoNext']) {
        let eve = document.createEvent('HTMLEvents');
        eve.initEvent("click", true, true);
        eve.eventType = 'message';
        let pl = document.querySelector('.music-item.playing');
        console.log(pl.nextSibling.dispatchEvent(eve));
      } else {
        su.isPlaying = false;
      }
    });
    this.player.addEventListener('pause', function() {
      console.log('pause');
      su.isPlaying = false;
    });
    this.player.addEventListener('play', function() {
      console.log('play');
      su.isPlaying = true;
    });
  };
  //鼠标滚轮事件
  wheelEvent(delt) {
    //console.log('wheelEvent');
    let ml = document.getElementsByClassName('music-list')[0];
    delt = event ? event.deltaY : delt;
    if (delt > 0) {
      var la = ml.lastChild;
      ml.removeChild(la);
      ml.insertBefore(la, ml.childNodes[0]);
    } else if (delt < 0) {
      var fi = ml.firstChild;
      ml.removeChild(fi);
      ml.appendChild(fi);
    }
  };
  resetList(parent) {
    let ml = document.getElementsByClassName('music-item');
    let pl = document.querySelector('.music-item.playing');
    console.log(parent);
    for (let i = 0; i < ml.length; i++) {
      if (ml[i] == pl) {
        //console.log(i);
        let x = i;
        let itv = setInterval(function() {
          if (x > 3) {
            parent.wheelEvent(-100);
            x--;
          } else {
            parent.wheelEvent(100);
            x++;
          }
          if (x == 3) {
            clearInterval(itv);
          }
        }, 150);
        // for (let x = i; x != 3;) {
        //   if (x > 3) {
        //     this.wheelEvent(-100);
        //     x--;
        //   } else {
        //     this.wheelEvent(100);
        //     x++;
        //   }
        // }
        break;
      }
    }
  };
  //载入音乐列表
  loadList() {
    let parent = this;
    this.mlist.innerHTML = '';
    let l = JSON.parse(this.getFile('./data/music.json'));
    this.playList = l;
    //console.log(l);
    let bindClick = function() {
      let ml = document.getElementsByClassName('music-item');
      for (let i = 0; i < ml.length; i++) {
        ml[i].classList.remove('playing');
        if (ml[i] == this) {
          ml[i].classList.add('playing');
          setTimeout(function() {
            parent.resetList(parent);
          }, 50);
        }
      }
      parent.mPause();
      //console.log(this.getAttribute('mid'));
      parent.loadMusic(this.getAttribute('mid'), parent.config['autoNextPlay']);
    }
    for (let i = l.length - 3; i < l.length; i++) {
      //console.log(i);
      let item = document.createElement('div');
      item.className = 'music-item';
      item.textContent = l[i]['name'];
      item.setAttribute('mid', l[i]['mid']);
      this.mlist.appendChild(item);
      item.addEventListener('click', bindClick);
    }
    for (let x = 0; x < l.length - 3; x++) {
      //console.log(x);
      let item = document.createElement('div');
      item.className = 'music-item';
      if (x == 0) {
        item.classList.add('playing');
      }
      item.textContent = l[x]['name'];
      item.setAttribute('mid', l[x]['mid']);
      this.mlist.appendChild(item);
      item.addEventListener('click', bindClick);
    }
    this.mlist.removeEventListener('mousewheel', function() {
      parent.wheelEvent();
      if (parent.isListReset) {
        clearTimeout(parent.isListReset);
      }
      parent.isListReset = setTimeout(function() {
        parent.resetList(parent);
      }, 3000); //列表回弹延迟
    });
    this.mlist.addEventListener('mousewheel', function() {
      parent.wheelEvent();
      if (parent.isListReset) {
        clearTimeout(parent.isListReset);
      }
      parent.isListReset = setTimeout(function() {
        parent.resetList(parent);
      }, 3000); //列表回弹延迟
    });
  };
  //载入站位
  loadBoard(mid) {
    let d = JSON.parse(this.getMFile(mid));
    let pkg = this.config['defaultPackage'];
    if (!this.config['useCustomPackage']) {
      pkg = d['package'];
    }
    let p = d['position'];
    for (let x = 0; x < this.singer.length; x++) {
      this.singer[x].className = 'singer ' + p[x];
      this.singer[x].style.backgroundImage = 'url(./data/package/' + pkg + '/' + p[x] + '.' + d['packageFormat'] + ')';
      this.playBoard[p[x]] = this.singer[x];
    }
    this.playBoard['singer'] = document.getElementsByClassName('singers')[0];
  };
  //谱面生成
  //设置定时
  timeOut(s, from, to) {
    //console.log('set');
    this.playingTimeline['show'].push(setTimeout(function() {
      s.classList.add('show');
    }, from - Math.round(this.player.currentTime * 1000)));
    this.playingTimeline['hide'].push(setTimeout(function() {
      s.classList.remove('show');
    }, to - Math.round(this.player.currentTime * 1000)));
  };
  //遍历对象
  setShow(who, from, to) {
    //console.log(who);
    for (let x in who) {
      //for (let y = 0; y < showSingers.length; y++) {
      this.timeOut(this.playBoard[who[x]], from, to);
      //}
    }
  };
  //读取音乐所有相关文件
  loadMusic(mid, autoplay) {
    console.log('Load Music ID: ' + mid);
    this.playingMID = mid;
    this.getMusic(mid);
    this.getMFile(mid);
    this.loadBoard(mid);
    if (autoplay) {
      this.mPlay();
    }
  };
  //载入文件
  getFile(p) {
    // let xhr = new XMLHttpRequest();
    // xhr.open("GET", path, false);
    // xhr.send();
    // return xhr.responseText;
    return fs.readFileSync(path.join(appPath,'app', p));
  };
  //载入谱面文件
  getMFile(mid) {
    mid = mid ? mid : this.playingMID;
    return this.getFile("data/lrc/" + mid + ".json");
  };
  //载入音乐
  getMusic(mid) {
    mid = mid ? mid : this.playingMID;
    this.player.setAttribute('src', 'data/music/' + mid + '.mp3');
  };

  /*
   * 播放控制 - 播放
   */
  mPlay() {
    if (!this.isPlaying) {
      var d = JSON.parse(this.getMFile());
      var j = d['timeline'];
      this.player.play();
      document.getElementsByClassName('singers')[0].className = 'singers fade singing';
      //console.log(JSON.stringify(j));
      for (let x in j) {
        //console.log(x);
        this.setShow(j[x]['who'], j[x]['from'], j[x]['to']);
      }
      this.ctrlBtn[0].setAttribute('role', 'mpause');
      this.isPlaying = true;
    }
  };
  /*
   * 播放控制 - 暂停
   */
  mPause() {
    if (this.isPlaying) {
      this.player.pause();
      for (let x in this.playingTimeline['show']) {
        clearTimeout(this.playingTimeline['show'][x]);
      }
      for (let x in this.playingTimeline['hide']) {
        clearTimeout(this.playingTimeline['hide'][x]);
      }
      document.getElementsByClassName('singers')[0].className = 'singers show';
      this.playingTimeline['show'] = [];
      this.playingTimeline['hide'] = [];
      this.ctrlBtn[0].setAttribute('role', 'mplay');
      this.isPlaying = false;
    }
  };
};
module.exports = sib;
