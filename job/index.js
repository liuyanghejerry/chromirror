var debug = require('debug');
debug.enable('chromirror:*');

var debugLog = require('debug')('chromirror:job');
var debugInfo = require('debug')('chromirror:job');
debugInfo.log = console.info.bind(console);
var debugError = require('debug')('chromirror:job');
debugError.log = console.error.bind(console);

debugInfo('job runner lunched.');

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
  var later = require('later');

  var chromeDownloadSched = later.parse.text('every 10 seconds');
  var timer = later.setInterval(downloadNewChrome, chromeDownloadSched);
  later.date.localTime();
}

function downloadNewChrome() {
  debugInfo('downloadNewChrome started');
}

run();