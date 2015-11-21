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

var chromeUrlInfo = require('./chrome-url.js');

debugInfo('chrome url generated:', chromeUrlInfo);

var DOWNLOAD_BASE_DIR = config.DOWNLOAD_BASE_DIR;
var STABLE_CHROME_PATH = config.STABLE_CHROME_PATH;

function download() {
  var deferred = Q.defer();
  debugInfo('directory ensured', DOWNLOAD_BASE_DIR);
  var tempFileName = genTempFileName();
  debugInfo('temp file name generated', tempFileName);
  var stream = fs.createWriteStream(tempFileName);

  superagent
  .get(chromeUrlInfo.url)
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

function saveToFile(tempFileName) {
  debugInfo('moving to destnation...');
  return Q.ninvoke(fs, 'ensureDir', DOWNLOAD_BASE_DIR)
  .then(function() {
    return Q.ninvoke(fs, 'move', tempFileName, STABLE_CHROME_PATH, {
      clobber: true
    });
  })
  .then(function() {
    debugInfo('moving done.');
  });
}

function genTempFileName() {
  var dir = os.tmpdir();
  var filename = parseInt(Math.abs(Math.random()) * 100000);
  return path.join(dir, filename.toString(16));
}

module.exports = {
  download: download,
  saveToFile: saveToFile,
};
