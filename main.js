"use strict";
//Electron加载项
const electron = require('electron');
const app = electron.app;
const BW = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const globalShortcut = electron.globalShortcut;
var fs = require('fs');
var path = require('path');
var appPath = app.getAppPath();
var dataPath = app.getPath('userData');
//主要全局变量
var INDEX = 'file://' + __dirname + '/app/index.html';
var mainWindow = null;

//应用退出动作
app.on('window-all-closed', function() {
  globalShortcut.unregisterAll();
  if (process.platform != 'darwin') {
    app.quit();
  }
});

//应用就绪动作
app.on('ready', function() {
  hasInit();
  mainWindow = new BW({
    width: 960,
    height: 540,
    minWidth: 160,
    minHeight: 90,
    resizable: false,
    frame: false,
    show: false
  });
  mainWindow.loadURL(INDEX);
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.show();
  });
  shortcutRegister();
  ipcRegister();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
var hasInit = function() {
  console.log('检测' + path.join(dataPath, 'data') + '是否存在');
  if (!fs.existsSync(path.join(dataPath, 'data'))) {
    console.log('data不存在，转移初始数据');
    console.log('生成歌曲列表');
  } else {
    console.log('data文件夹存在');
  }
  var init = require(path.join(appPath, 'app/js/init.js'));
  init();
};
// 注册全局快捷键
var shortcutRegister = function() {
  globalShortcut.register('ctrl+d', function() {
    mainWindow.toggleDevTools();
    console.log('DevTools');
  });
  globalShortcut.register('ctrl+r', function() {
    mainWindow.reload();
    console.log('Reload');
  });

};

// 注册主进程与渲染进程通讯事件
var ipcRegister = function() {
  ipcMain.on('toggleFullScreen', function() {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    } else {
      mainWindow.setFullScreen(true);
    }
  });
  ipcMain.on('toggleDevTools', function() {
    mainWindow.toggleDevTools();
  });
  ipcMain.on('contentsReload', function() {
    mainWindow.reload();
  });
  ipcMain.on('closeWindow', function() {
    mainWindow.close();
  });
  ipcMain.on('changeWindow', function(event, arg) {
    console.log(arg);
    var width = 1280,
      height = 720,
      isfs = false;
    switch (arg) {
      case 'mini':
        height = 90;
        width = 200;
        break;
      case 'small':
        height = 480;
        width = 800;
        break;
      case 'middle':
        height = 540;
        width = 960;
        break;
      case 'large':
        height = 1080;
        width = 1920;
        break;
      case 'full':
        isfs = true;
        break;
      default:
        height = 720;
        width = 1280;
    }
    if (isfs) {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    } else {
      if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false);
      }
      mainWindow.setSize(width, height);
      console.log('窗口尺寸：' + width + '×' + height);
    }
  });
  ipcMain.on('chooseFiles', function(event, arg) {
    if (arg.filters == undefined) {
      arg.filters = [{
        name: '全部文件',
        extensions: ['*']
      }]
    }
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: arg.filters,
      title: '选择文件'
    }, function(fileobj) {
      event.sender.send('hasChooseFiles', fileobj);
    });
  });
};
