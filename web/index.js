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
  express.static(path.join(__dirname, './public'));

  app.get('/', function(req, res) {
    res.send('hello world');
  });

  app.get('/download', function(req, res) {
    res.download(config.STABLE_CHROME_PATH, config.STABLE_CHROME_NAME);
  });

  app.listen(3000);
}

run();