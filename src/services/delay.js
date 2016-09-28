'use strict';

app.service('delay', [
    '$timeout',
    '$q',
    function ($timeout, $q) {
        return function (time) {
            var promises = _.rest(arguments);
            promises.push($timeout(function () {
            }, time));
            return $q.all(promises).then(function (results) {
                return _.initial(results);
            });
        };
    }
]);
