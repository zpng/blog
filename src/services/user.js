'use strict';

app.service('User', [
    '$resource',
    function ($resource) {
        return $resource('/api/users/:id', {
            id: '@id'
        }, {
            current: {
                url: '/api/users/current',
                method: 'GET'
            }
        });
    }
]);
