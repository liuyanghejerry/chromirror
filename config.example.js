var path = require('path');

module.exports = {
	DOWNLOAD_BASE_DIR: path.resolve(__dirname, './web/public/chrome/windows/stable/'),
	STABLE_CHROME_PATH: path.resolve(__dirname, './web/public/chrome/windows/stable/ChromeStandaloneSetup.exe'),
	STABLE_CHROME_NAME: 'ChromeStandaloneSetup.exe',
	WEB_PORT: 3000,
	SYNC_CYCLE: 'every 5 hours',

	ENABLE_UPLOAD_TO_ALIYUN: false,

	ACCESS_KEY_ID: '',
	SECRET_ACCESS_KEY: '',
	SECURITY_TOKEN: '',
	ENDPOINT: '',
	API_VERSION: '2013-10-15',

	BUCKET: 'chromirror',
	KEY: 'windows/stable/ChromeStandaloneSetup.exe',
	REMOTE_STABLE_CHROME_PATH: ''
};
