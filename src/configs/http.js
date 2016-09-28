'use strict';

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push([
        '$q',
        '$injector',
        '$timeout',
        'API_SERVER',
        function (
            $q,
            $injector,
            $timeout,
            API_SERVER
        ) {
            return {
                request: function (config) {
                    if (!config) {
                        return config;
                    }

                    if (typeof config === 'string') {
                        config = {
                            url: config
                        };
                    }

                    if (config.url.indexOf('.html') !== -1) {
                        return config;
                    }

                    config.origUrl = config.url;
                    config.server = config.server || 'cms';

                    var host = API_SERVER[config.server];

                    config.url = (config.url[0] === '/' ? host.substr(0, host.length - 1) : host) + config.url;

                    if (!config.cache) {
                        // avoid cache
                        config.url = config.url + (config.url.indexOf('?') === -1 ? '?' : '&') + '_=' + Date.now();
                    }

                    return config;
                },

                responseError: function (resp) {
                    var processed = false;

                    resp.processed = function (code) {
                        if (!code || resp.status === code) {
                            processed = true;
                        }

                        return $q.reject(resp);
                    };

                    if (resp.config && resp.config.statusText && resp.config.statusText[resp.status]) {
                        resp.statusText = resp.config.statusText[resp.status];
                    }

                    if (resp.status === 401)  {
                        //todo
                        console.log(resp.status);
                        // location.replace(API_SERVER.auth + 'login?service=' + encodeURIComponent(location.href));
                    } else {
                        // next tick
                        $timeout(function () {
                            if (processed) {
                                return;
                            }

                            if (resp.config && resp.config.statusText && resp.config.statusText[resp.status]) {
                                $injector.get('Toast').error(resp.config.statusText[resp.status]);
                            } else if (resp && resp.data && resp.data.exceptionMessage) {
                                $injector.get('Toast').error('Oops，请求出错，错误原因: ' + resp.data.exceptionMessage);
                            } else if (resp && resp.data && resp.data.message) {
                                $injector.get('Toast').error('Oops，请求出错，错误原因: ' + resp.data.message);
                            } else {
                                $injector.get('Toast').error('Oops，请求出错，错误代码: ' + resp.status);
                            }
                        }, 25);
                    }

                    return $q.reject(resp);
                }
            };
        }
    ]);
}]);

app.run(['$http', '$location', function ($http, $location) {
    var origin = $location.protocol() + '://' + $location.host();
    if ($location.port()) {
        origin += ':' + $location.port();
    }

    $http.defaults.headers.Origin = origin;
    $http.defaults.withCredentials = true;
}]);
