// https://dl.google.com/chrome/mac/stable/GGRO/googlechrome.dmg

var url = require('url');
var urlJoin = require('url-join');
var Qs = require('qs');

function genRootPath() {
  return 'https://dl.google.com';
}

function genExecutablePath() {
  return '/chrome/mac/stable/GGRO/googlechrome.dmg';
}

function buildDlPath(rootPath, execPath) {
  return urlJoin(rootPath, execPath);
}

function genDownloadUrl() {


  return {
    url: buildDlPath(genRootPath(), genExecutablePath()),
  };
}

module.exports = genDownloadUrl();
