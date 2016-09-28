'use strict';

app.service('ExceptionHandler', [
    'Toast',
    '$exceptionHandler',
    function (Toast, $exceptionHandler) {
        return function (exception, cause) {
            try {
                Toast.error(exception.message);
                $exceptionHandler(exception, cause);
            } catch (e) {}
        };
    }
]);
