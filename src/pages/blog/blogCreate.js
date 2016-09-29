'use strict';

app.controller('BlogCreateCtrl', ['$location', '$route', 'Toast', '$scope', 'Blog', function ($location, $route, Toast, $scope, Blog) {

    $scope.save = function () {
        Blog.save($scope.blog).$promise.then(function () {
            $location.url('/blogList');
        });
    };
}]);