/**
 * Reversed-engineered from https://www.google.com/chrome/browser/thankyou.html?standalone=1&system=true&platform=win&installdataindex=defaultbrowser
 */

var url = require('url');
var urlJoin = require('url-join');
var Qs = require('qs');


function getIid() {
  function genSimpeUuid() {
    function internal() {
      for (var it = 65536, it = Math.floor(Math.random() * it), it = it.toString(16); 4 > it.length; )
        it = '0' + it;
      return it.toUpperCase()
    }
    return '{' + internal() + internal() + '-' + internal() + '-' + internal() + '-' + internal() + '-' + internal() + internal() + internal() + '}'
  }

  return genSimpeUuid();
}

function genRootPath() {
  return 'https://dl.google.com';
}

function genExecutablePath() {
  return '/update2/installers/ChromeStandaloneSetup.exe';
}

function buildDlPath(info, rootPath, execPath) {
  info.appname = encodeURIComponent(info.appname)
  .replace(/~/g, "%7E")
  .replace(/\!/g, "%21")
  .replace(/\*/g, "%2A")
  .replace(/\(/g, "%28")
  .replace(/\)/g, "%29")
  .replace(/\'/g, "%27");

  var params = Qs.stringify(info).replace(/\=/gi, '%3D').replace(/\&/, '%26');
  return urlJoin(rootPath, '/tag/s/', params, execPath);
}

function genDownloadUrl() {
  var info = {
    // canary vs. chrome
    appguid:  false ? '{4ea16ac7-fd5a-47c3-875b-dbf4a2008c20}' : '{8A69D345-D564-463C-AFF1-A69D9E530F96}',
    iid: getIid(),
    appname: 'Google Chrome',
    needsadmin: 'true',
    lang: 'zh-CN',
    browser: 4,
    usagestats: 0,
    installdataindex: 'defaultbrowser',
  };

  return {
    url: buildDlPath(info, genRootPath(), genExecutablePath()),
  };
}

module.exports = genDownloadUrl();