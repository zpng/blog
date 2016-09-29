'use strict';

app.service('Blog', [
    '$resource',
    function ($resource) {
        return $resource('/sanks-blog/api/blogs/:id', {
            id: '@id'
        });
    }
]);
