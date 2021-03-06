var debug = require('debug');
debug.enable('chromirror:*');

var debugLog = require('debug')('chromirror:web');
var debugInfo = require('debug')('chromirror:web');
debugInfo.log = console.info.bind(console);
var debugError = require('debug')('chromirror:web');
debugError.log = console.error.bind(console);

var path = require('path');
var config = require('../config.js');

debugInfo('web interface lunched.');

function hookMessage() {
  process.on('message', function(m) {
    debugInfo('web worker got message:', m);
    if (m.command && m.command === 'close') {
      process.exit(0);
    }
  });
}

hookMessage();

function run() {
  var express = require('express');
  var app = express();
  app.use(express.static(path.join(__dirname, './public')));

  app.get('/download', function(req, res) {
    res.redirect('/download/windows');
  });

  app.get('/download/windows', function(req, res) {
    if (config.ENABLE_UPLOAD_TO_ALIYUN) {
      res.redirect(config.REMOTE_STABLE_CHROME_PATH.WINDOWS);
      return;
    }

    res.download(config.STABLE_CHROME_PATH.WINDOWS, config.STABLE_CHROME_NAME.WINDOWS);
  });

  app.get('/download/mac', function(req, res) {
    if (config.ENABLE_UPLOAD_TO_ALIYUN) {
      res.redirect(config.REMOTE_STABLE_CHROME_PATH.MAC);
      return;
    }

    res.download(config.STABLE_CHROME_PATH.MAC, config.STABLE_CHROME_NAME.MAC);
  });

  app.listen(config.WEB_PORT);
}

run();
