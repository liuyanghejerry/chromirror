var debug = require('debug');
debug.enable('chromirror:*');

var debugLog = require('debug')('chromirror:main');
var debugInfo = require('debug')('chromirror:main');
debugInfo.log = console.info.bind(console);
var debugError = require('debug')('chromirror:main');
debugError.log = console.error.bind(console);

var child_process = require('child_process');

function lunchJobs() {
  debugInfo('lunching job runner...');
  var child = child_process.fork('./job/index.js');
  
  child
  .on('error', function() {
    debugError('cannot lunch job runner', arguments);
  })
  .on('exit', function(code, sig) {
    if (code === 0) {
      debugInfo('job runner exit normally.');
      return;
    }

    debugError('job runner is down with code %d. Re-spawning one.', code);
    lunchWeb();
  });

  return child;
}

function lunchWeb() {
  debugInfo('lunching web interface...');
  var child = child_process.fork('./web/index.js');
  
  child
  .on('error', function() {
    debugError('cannot lunch web interface', arguments);
  })
  .on('exit', function(code, sig) {
    if (code === 0) {
      debugInfo('web interface exit normally.');
      return;
    }

    debugError('web interface is down with code %d. Re-spawning one.', code);
    lunchWeb();
  });

  return child;
}

function closeWeb(child) {
  if (!(child && child.connected)) {
    return;
  }
  child.send({
    command: 'close'
  });
}

function run() {
  lunchWeb();
  lunchJobs();
}

run();