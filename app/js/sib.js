"use strict";
class sib {
  constructor(options) {
    let su = this;
    console.log('run');
    /*
     * 重要属性
     */
    this.defalutList = {
      auth: '漫头',
      list: [{
        name: '輝夜の城で踊りたい',
        singer: "μ's",
        filename: '1.mp3',
        lrc: '1.lrc',
        timeline: '1.json'
      }]
    };
    this.singers = document.getElementsByClassName('singer');
    this.mainBtn = document.getElementsByClassName('main-btn');
    this.ctrlBtn = document.getElementsByClassName('ctrl-btn');
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
    this.themeBoard = 'default';
    // 初始化方法
    this.loadList();
    this.loadMusic(0);
    //初始化监听事件
    this.player.addEventListener('ended', function() {
      console.log('ended');
      su.isPlaying = false;
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
  static tom(t) {
    var timeReg = /^([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{3})/;
    var m = t.match(timeReg);
    var mm = m[1] * 3600000 + m[2] * 60000 + m[3] * 1000 + m[4] * 1;
    return mm;
  };
  //载入音乐列表
  loadList() {
    let parent = this;
    this.mlist.innerHTML = '';
    let l = JSON.parse(this.getFile('./data/music.json'));
    console.log(l);
    for (let i = 3; i >= 0; i--) {
      let item = document.createElement('div');
      item.className = 'music-item';
      item.textContent = l[i]['name'];
      item.setAttribute('mid', l[i]['mid']);
      this.mlist.appendChild(item);
      item.addEventListener('click', function() {
        parent.mPause();
        console.log(this.getAttribute('mid'));
        parent.loadMusic(this.getAttribute('mid'));
        parent.mPlay();
      });
    }
    for (let x = l.length - 1; x > 3; x--) {
      let item = document.createElement('div');
      item.className = 'music-item';
      item.textContent = l[x]['name'];
      item.setAttribute('mid', l[x]['mid']);
      this.mlist.appendChild(item);
      item.addEventListener('click', function() {
        parent.mPause();
        console.log(this.getAttribute('mid'));
        parent.loadMusic(this.getAttribute('mid'));
        parent.mPlay();
      });
    }
    let wheelEvent = function() {
      if (event.deltaY > 0) {
        var la = this.lastChild;
        this.removeChild(la);
        this.insertBefore(la, this.childNodes[0]);
      } else {
        var fi = this.firstChild;
        this.removeChild(fi);
        this.appendChild(fi);
      }
    }
    this.mlist.removeEventListener('mousewheel', wheelEvent)
    this.mlist.addEventListener('mousewheel', wheelEvent);
  };
  //载入站位
  loadBoard(pkg) {
    pkg = pkg ? pkg : 'default';
    var d = JSON.parse(this.getMFile(this.playingMID));
    var p = d['position'];
    for (let x = 0; x < this.singer.length; x++) {
      this.singer[x].className = 'singer ' + p[x];
      this.singer[x].style.backgroundImage = 'url(./data/package/' + pkg + '/' + p[x] + '.jpg)';
      this.playBoard[p[x]] = this.singer[x];
    }
    this.playBoard['singer'] = document.getElementsByClassName('singers')[0];
  };
  //谱面生成
  //设置定时
  timeOut(s, from, to) {
    console.log('set');
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
  loadMusic(mid) {
    console.log('Load Music ID: ' + mid);
    this.playingMID = mid;
    this.getMusic(mid);
    this.getMFile(mid);
    this.loadBoard(this.themeBoard);

  };
  //载入文件
  getFile(path) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send();
    return xhr.responseText;
  };
  //载入谱面文件
  getMFile(mid) {
    mid = mid ? mid : this.playingMID;
    return this.getFile("./data/lrc/" + mid + ".json");
  };
  //载入音乐
  getMusic(mid) {
    mid = mid ? mid : this.playingMID;
    this.player.setAttribute('src', './data/music/' + mid + '.mp3');
  };

  /*
   * 播放控制 - 播放
   */
  mPlay(btn) {
    if (!this.isPlaying) {
      btn = btn?btn:this.ctrlBtn[0];
      var d = JSON.parse(this.getMFile());
      var j = d['timeline'];
      this.player.play();
      document.getElementsByClassName('singers')[0].className = 'singers fade singing';
      //console.log(JSON.stringify(j));
      for (let x in j) {
        //console.log(x);
        this.setShow(j[x]['who'], j[x]['from'], j[x]['to']);
      }
      btn.setAttribute('role', 'mpause');
      this.isPlaying = true;
    }
  };
  /*
   * 播放控制 - 暂停
   */
  mPause(btn) {
    if (this.isPlaying) {
      btn = btn?btn:this.ctrlBtn[0];
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
      btn.setAttribute('role', 'mplay');
      this.isPlaying = false;
    }
  };
};
module.exports = new sib();