'use strict';

app.config([
    '$provide',
    'ForbiddenException',
    '$injector',
    'API_SERVER',
    function (
        $provide,
        ForbiddenException,
        $injector,
        API_SERVER
    ) {
        $provide.decorator('$exceptionHandler', [
            '$delegate',
            function ($delegate) {
                var $location = null;
                var $log = null;

                return function (exception, cause) {
                    if (!$location) {
                        try {
                            $location = $injector.get('$location');
                        } catch (e) {
                            $location = null;
                        }
                    }

                    if (!$log) {
                        try {
                            $log = $injector.get('$log');
                        } catch (e) {
                            $log = null;
                        }
                    }

                    if (exception instanceof ForbiddenException) {
                        if ($location) {
                            $location.replace(API_SERVER.auth + 'login?service=' + encodeURIComponent($location.absUrl()));
                        } else {
                            window.location.replace(window.location.pathname + '#/login');
                        }
                    } else {
                        $delegate(exception, cause);
                    }
                };
            }
        ]);
    }
]);
