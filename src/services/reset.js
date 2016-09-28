'use strict';

app.service('Reset', ['$location', function ($location) {
        return function () {
            $location.search({rnd: _.random(Number.MAX_SAFE_INTEGER)});
        };
    }]
);