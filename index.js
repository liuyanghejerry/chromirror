var debug = require('debug');
debug.enable('chromirror:*');

var debugLog = require('debug')('chromirror:main');
var debugInfo = require('debug')('chromirror:main');
debugInfo.log = console.info.bind(console);
var debugError = require('debug')('chromirror:main');
debugError.log = console.error.bind(console);

var child_process = require('child_process');
var Q = require('q');

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
    setTimeout(lunchJobs, 10*1000);
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
    setTimeout(lunchWeb, 10*1000);
  });

  return child;
}

function closeChild(child) {
  var deferred = Q.defer();
  if (!(child && child.connected)) {
    deferred.reject();
    return deferred.promise;
  }
  child.send({
    command: 'close'
  }, function(err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    deferred.resolve();
  });

  return deferred.promise;
}

function run() {
  var webHandle = null;
  var jobHandle = null;
  setTimeout(function() {
    webHandle = lunchWeb();
  }, 1000);
  setTimeout(function() {
    jobHandle = lunchJobs();
  }, 2000);

  process.on('SIGINT', function() {
    debugInfo('Got SIGINT, exiting...');
    exit();
  }).on('SIGTERM', function() {
    debugInfo('Got SIGTERM, exiting...');
    exit();
  });
}

function exit() {
  return Q.all([
    closeChild.bind(null, webHandle),
    closeChild.bind(null, jobHandle),
  ])
  .catch(function(err) {
    debugError('cannot close child: ', err);
  })
  .done(function() {
    process.exit(0);
  });
}

run();
