'use strict';

var env = null;
if (location.hostname.indexOf('local') !== -1) {
    env = 'local';
} else {
    env = 'online';
}

app.constant('API_SERVER', {
    local: {
        // 'auth': 'https://account.zhenguanyu.com/',
        'cms': 'http://local.sanksblog.com:8000/',
    },
    online: {
        // 'auth': 'https://account.zhenguanyu.com/',
        'cms': 'http://60.205.169.84/',
    }
}[env]);
