## Chromirror

A mirror for downloading latest Google Chrome standalone installer.

This should be useful when you have problem access Google's sites, such as in mainland China.

### Usage

Copy `config.example.js` to `config.js` and tune the settings in config.

```
npm install
pm2 start deploy.json
```

Generally, `http://localhost:3000/download` will serve an installer, and the installer should be updated every 5 hours.

Example: [http://chromirror.com/]. The picture of Chrome is stolen from Google's site.

### Configuration

* `WEB_PORT`: web server port
* `SYNC_CYCLE`: time cycle that download Chrome from google.
* `ENABLE_UPLOAD_TO_ALIYUN`: After set to `true`, you must assign all configs about Aliyun OSS. And Chrome installer will be uploaded to your OSS storage and served from there.

### TODO

* grouped configs.
* More Chrome versions.
