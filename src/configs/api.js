'use strict';

var env = null;
if (location.hostname.indexOf('local') !== -1) {
    env = 'local';
} else if (location.hostname.indexOf('test') === -1) {
    env = 'online';
} else if (location.pathname.indexOf('-dev') !== -1) {
    env = 'dev';
} else {
    env = 'test';
}

app.constant('API_SERVER', {
    local: {
        'auth': 'https://account.zhenguanyu.com/',
        'cms': 'http://local.zhenguanyu.com:8000/',
        'gallery': 'http://local.zhenguanyu.com:8000/',
        'tarzan': 'http://tt.zhenguanyu.com/'
    },
    dev: {
        'auth': 'https://account.zhenguanyu.com/',
        'cms': 'http://tutor-dev.zhenguanyu.com/',
        'gallery': 'http://tutor-dev.zhenguanyu.com/',
        'tarzan': 'http://tt.zhenguanyu.com/'
    },
    test: {
        'auth': 'https://account.zhenguanyu.com/',
        'cms': 'http://tutor-test.zhenguanyu.com/',
        'gallery': 'http://tutor-test.zhenguanyu.com/',
        'tarzan': 'http://tt.zhenguanyu.com/'
    },
    online: {
        'auth': 'https://account.zhenguanyu.com/',
        'cms': 'http://tutor.zhenguanyu.com/',
        'gallery': 'http://tutor.zhenguanyu.com/',
        'tarzan': 'http://tarzan.zhenguanyu.com/'
    }
}[env]);
