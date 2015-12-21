var debug = require('debug');
debug.enable('chromirror:*');

var debugLog = require('debug')('chromirror:job');
var debugInfo = require('debug')('chromirror:job');
debugInfo.log = console.info.bind(console);
var debugError = require('debug')('chromirror:job');
debugError.log = console.error.bind(console);

debugInfo('job runner lunched.');

var later = require('later');
var Q = require('q');
var downloader = require('./downloader.js');
var uploader = require('./uploader.js');
var config = require('../config.js');

function hookMessage() {
  process.on('message', function(m) {
    debugInfo('job worker got message:', m);
    if (m.command && m.command === 'close') {
      process.exit(0);
    }
  });
}

hookMessage();

function run() {
  var chromeDownloadSched = later.parse.text(config.SYNC_CYCLE);
  var timer = later.setInterval(downloadNewChrome, chromeDownloadSched);
  later.date.localTime();
  downloadNewChrome();
}

function downloadNewChrome() {
  debugInfo('downloadNewChrome started');
  return Q.all([
    downloader.downloadWindows()
    .then(downloader.saveToFileForWindows)
    .then(function() {
      debugInfo('a new Windows chrome has been downloaded.');
    }),
    downloader.downloadMac()
    .then(downloader.saveToFileForMac)
    .then(function() {
      debugInfo('a new Mac chrome has been downloaded.');
    }),

  ])
  .then(function() {
    if (!config.ENABLE_UPLOAD_TO_ALIYUN) {
      return;
    }
    return Q.all([
      uploader.uploadWindows(),
      uploader.uploadMac(),
    ]);
  });
}

run();
