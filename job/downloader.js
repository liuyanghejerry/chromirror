var debug = require('debug');
debug.enable('chromirror:*');

var debugLog = require('debug')('chromirror:job:downloader');
var debugInfo = require('debug')('chromirror:job:downloader');
debugInfo.log = console.info.bind(console);
var debugError = require('debug')('chromirror:job:downloader');
debugError.log = console.error.bind(console);

var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var superagent = require('superagent');
var Q = require('q');

var config = require('../config.js');

var windowsUrlInfo = require('./chrome-url/').windows;
var macUrlInfo = require('./chrome-url/').mac;

debugInfo('chrome url generated:', windowsUrlInfo, macUrlInfo);

function download(url) {
  var deferred = Q.defer();
  var tempFileName = genTempFileName();
  debugInfo('temp file name generated', tempFileName);
  var stream = fs.createWriteStream(tempFileName);

  superagent
  .get(url)
  .redirects(10)
  .on('error', function(err) {
    debugError('cannot download ChromeStandaloneSetup, error:', err);
    deferred.reject(err);
  })
  .pipe(stream);

  stream.once('close', function() {
    debugInfo('download finished');
    deferred.resolve(tempFileName);
  });

  debugInfo('download started');
  return deferred.promise;
}

function downloadWindows() {
  return download(windowsUrlInfo.url);
}

function downloadMac() {
  return download(macUrlInfo.url);
}

function saveToFile(tempFileName, dir, filepath) {
  debugInfo('moving to destnation...');
  return Q.ninvoke(fs, 'ensureDir', dir)
  .then(function() {
    debugInfo('directory ensured', dir);
    return Q.ninvoke(fs, 'move', tempFileName, filepath, {
      clobber: true
    });
  })
  .then(function() {
    debugInfo('moving done.');
  });
}

function saveToFileForWindows(tempFileName) {
  return saveToFile(tempFileName, config.DOWNLOAD_BASE_DIR.WINDOWS, config.STABLE_CHROME_PATH.WINDOWS);
}

function saveToFileForMac(tempFileName) {
  return saveToFile(tempFileName, config.DOWNLOAD_BASE_DIR.MAC, config.STABLE_CHROME_PATH.MAC);
}

function genTempFileName() {
  var dir = os.tmpdir();
  var filename = parseInt(Math.abs(Math.random()) * 100000);
  return path.join(dir, filename.toString(16));
}

module.exports = {
  downloadWindows: downloadWindows,
  downloadMac: downloadMac,
  saveToFileForWindows: saveToFileForWindows,
  saveToFileForMac: saveToFileForMac,
};
