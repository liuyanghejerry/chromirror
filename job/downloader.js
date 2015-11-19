var debug = require('debug');
debug.enable('chromirror:*');

var debugLog = require('debug')('chromirror:job:downloader');
var debugInfo = require('debug')('chromirror:job:downloader');
debugInfo.log = console.info.bind(console);
var debugError = require('debug')('chromirror:job:downloader');
debugError.log = console.error.bind(console);


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
  return Q.ninvoke(fs, 'ensureDir', DOWNLOAD_BASE_DIR)
  .then(function() {
    debugInfo('directory ensured', DOWNLOAD_BASE_DIR);
    var stream = fs.createWriteStream(STABLE_CHROME_PATH);

    superagent
    .get(chromeUrlInfo.url)
    .redirects(10)
    .on('error', function(err) {
      debugError('cannot download ChromeStandaloneSetup, error:', err);
    })
    .pipe(stream);

    debugInfo('download started');
  });
}

download();