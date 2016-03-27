# School idol Board Music Player (μ'sic player)
----------
## 什么是School idol Board Music Player？
School idol Board Music Player（以下简称SIB），是一个基于[Electron](https://github.com/atom/electron)开发的，能够在播放时高亮显示歌唱者的跨平台应用。

## 开发版使用方法
1. 如果你没有npm，请先安装最新版本的Node.js
2. `cd /path/to/dir`
3. `git clone https://github.com/pboymt/school-idol-board.git`
4. `cd school-idol-board`
5. `npm install --save-dev electron-prebuilt`
6. 下载歌曲包并解压到`/path/to/dir/school-idol-board/app/data/music`
7. `npm start`

## 歌曲谱面制作说明
1. 歌曲的源建议使用[网易云音乐](http://music.163.com)的320K版本mp3文件（具体文件可在软件的离线文件夹中找到），由于chromium浏览器的原因，暂不支持flac等无损格式，貌似wav是支持的
2. 就如项目中所生成的谱面那样，结构比较简单，歌曲成员的点亮和熄灭是由from和to字段控制，单位为毫秒（ms）
3. 制作谱面推荐使用[Aegisub](http://www.aegisub.org)和制作时间轴的方式一样，设定准确时间，歌词部分写正在歌唱的人的名字（罗马音，多人用英文逗号隔开），例如：`nozomi,eri`将会被自动编译成`["nozomi","eri"]`，
        4
        00:00:21,066 --> 00:00:28,314
        eri,nozomi
会被编译成：
        {
          "from": 21066,
          "to": 28316,
          "who": ["eri","nozomi"]
        }
不过在特殊的情况下，可以单独为两个成员单独设置时间以提高性能
4. Aegisub制作的字幕文件需导出为.srt格式文件，并转换成TTML（Timed Text Markup Language）格式文件（[推荐转换地址](http://tools.rodrigopolo.com/srt2xml/)，勾选No CDATA选项），与mp3文件打包后提交到package.json的bugs字段提供的email即可

## 发行包
正在制作，将很快生成……
