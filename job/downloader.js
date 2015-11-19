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

var chromeUrlInfo = require('./chrome-url.js');

debugInfo('chrome url generated:', chromeUrlInfo);

var DOWNLOAD_BASE_DIR = path.resolve(__dirname, '../web/public/chrome/windows/stable/');

function download() {
  return Q.ninvoke(fs, 'ensureDir', DOWNLOAD_BASE_DIR)
  .then(function() {
    debugInfo('directory ensured', DOWNLOAD_BASE_DIR);
    var stream = fs.createWriteStream(path.join(DOWNLOAD_BASE_DIR, 'ChromeStandaloneSetup.exe'));

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
