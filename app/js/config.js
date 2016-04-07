'use strict';
const path = require('path');
const fs = require('fs');
const electron = require('electron');
const app = electron.remote.app;
class electronConfig {
  constructor() {
    //console.log('electronConfig');
    let dataPath = app.getPath('userData');
    let appPath = app.getAppPath();
    //console.log(appPath);
    let defaultPath = path.join(appPath, 'app/data', 'defaultConfig.json');
    let defaultFile = fs.readFileSync(defaultPath);
    this.defaultConfig = JSON.parse(defaultFile);
    this.configPath = path.join(dataPath, 'config.json');
    //console.log('appPath: ' + appPath);
    //console.log(this.configPath);
    if (fs.existsSync(this.configPath) && fs.readFileSync(this.configPath) != '') {
      this.config = require(this.configPath);
      if (this.defaultConfig['configVer'] > this.config['configVer']) {
        this.upgradeConfig();
      }
      //console.log(this.config);
    } else {
      //console.log(fs.writeFileSync(this.configPath, defaultFile));
      //console.log(JSON.parse(this.defaultConfig));
    }
  };
  upgradeConfig() {
    this.config['configVer'] = this.defaultConfig['configVer'];
    for (let x in this.defaultConfig) {
      if (this.config[x] == null || this.config[x] == undefined) {
        this.config[x] = this.defaultConfig[x];
      }
    }
    for (let x in this.config) {
      if (this.defaultConfig[x] == undefined) {
        delete this.config[x];
      }
    }
    fs.writeFileSync(this.configPath, JSON.stringify(this.config));
    //console.log('Config upgradeConfig!');
  };
  getAll() {
    return this.config;
  }
  get(key) {
    return this.config[key];
  };
  set(key, value, callback) {
    this.config[key] = value;
    fs.writeFileSync(this.configPath, JSON.stringify(this.config));
    if (typeof callback == 'function') {
      callback(this.config);
    }
  };
};
module.exports = electronConfig;
