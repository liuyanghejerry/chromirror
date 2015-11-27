var debug = require('debug');
debug.enable('chromirror:*');

var debugLog = require('debug')('chromirror:job');
var debugInfo = require('debug')('chromirror:job');
debugInfo.log = console.info.bind(console);
var debugError = require('debug')('chromirror:job');
debugError.log = console.error.bind(console);

debugInfo('job runner lunched.');

var later = require('later');
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
  downloadNewChrome()
  .then(function() {
    return uploader.upload(config.STABLE_CHROME_PATH);
  });
}

function downloadNewChrome() {
  debugInfo('downloadNewChrome started');
  return downloader.download()
  .then(downloader.saveToFile)
  .then(function() {
    debugInfo('a new chrome has been downloaded.');
  });
}

run();
