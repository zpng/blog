'use strict';

app.controller('BlogListCtrl', ['$route', 'Toast', '$scope', 'Blog', function ($route, Toast, $scope, Blog) {

    $scope.blogs = Blog.query();
    $scope.loadingPromise = $scope.blogs.$promise;
}]);