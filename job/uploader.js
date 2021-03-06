var debug = require('debug');
debug.enable('chromirror:*');

var debugLog = require('debug')('chromirror:job:uploader');
var debugInfo = require('debug')('chromirror:job:uploader');
debugInfo.log = console.info.bind(console);
var debugError = require('debug')('chromirror:job:uploader');
debugError.log = console.error.bind(console);

var config = require('../config.js');
var ALY = require('aliyun-sdk');
var fs = require('fs-extra');
var Q = require('q');

var oss = new ALY.OSS({
  accessKeyId: config.ACCESS_KEY_ID,
  secretAccessKey: config.SECRET_ACCESS_KEY,
  securityToken: config.SECURITY_TOKEN,
  endpoint: config.ENDPOINT,
  apiVersion: config.API_VERSION,
});

function upload(filePath, key) {
  return Q.ninvoke(fs, 'readFile', filePath)
  .then(function(data) {
    return Q.ninvoke(oss, 'putObject', {
      Bucket: config.BUCKET,
      Key: key,  // 注意, Key 的值不能以 / 开头, 否则会返回错误.
      Body: data,
      AccessControlAllowOrigin: '',
      ContentType: 'application/x-msdownload',
      CacheControl: 'no-cache',
      ContentDisposition: '',
      ContentEncoding: 'utf-8',
      ServerSideEncryption: 'AES256',
      Expires: null
    });
  });
}

function uploadWindows() {
  debugInfo('start to upload Windows binary onto Aliyun...');
  return upload(config.STABLE_CHROME_PATH.WINDOWS, config.KEY.WINDOWS)
  .then(function(data) {
    debugInfo('Windows binary uploaded: ', data);
  });
}

function uploadMac() {
  debugInfo('start to upload Mac binary onto Aliyun...');
  return upload(config.STABLE_CHROME_PATH.MAC, config.KEY.MAC)
  .then(function(data) {
    debugInfo('Mac binary uploaded: ', data);
  });
}

module.exports = {
  uploadWindows: uploadWindows,
  uploadMac: uploadMac
};
