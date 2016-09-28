'use strict';

app.service('formError', ['$q', function ($q) {
    return function ($scope, formErrorVar) {
        return function (xhr) {
            if (xhr.statusText) {
                xhr.processed();
                $scope[formErrorVar] = xhr.statusText;
                return;
            }

            return $q.reject(xhr);
        };
    };
}]);
