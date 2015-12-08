var path = require('path');

module.exports = {
	DOWNLOAD_BASE_DIR: {
		WINDOWS: path.resolve(__dirname, './web/public/chrome/windows/stable/'),
		MAC: path.resolve(__dirname, './web/public/chrome/mac/stable/'),
	},
	STABLE_CHROME_PATH: {
		WINDOWS: path.resolve(__dirname, './web/public/chrome/windows/stable/ChromeStandaloneSetup.exe'),
		MAC: path.resolve(__dirname, './web/public/chrome/mac/stable/googlechrome.dmg'),
	},
	STABLE_CHROME_NAME: {
		WINDOWS: 'ChromeStandaloneSetup.exe',
		MAC: 'googlechrome.dmg'
	},
	WEB_PORT: 3000,
	SYNC_CYCLE: 'every 5 hours',

	ENABLE_UPLOAD_TO_ALIYUN: false,

	ACCESS_KEY_ID: '',
	SECRET_ACCESS_KEY: '',
	SECURITY_TOKEN: '',
	ENDPOINT: '',
	API_VERSION: '2013-10-15',

	BUCKET: 'chromirror',
	KEY: {
		WINDOWS: 'windows/stable/ChromeStandaloneSetup.exe',
		MAC: 'mac/stable/googlechrome.dmg'
	},
	REMOTE_STABLE_CHROME_PATH: {
		WINDOWS: '',
		MAC: '',
	}
};
