'use strict';

app.controller('BlogListCtrl', ['Toast', '$scope', 'Blog', function (Toast, $scope, Blog) {

    $scope.blogs = Blog.query();
    $scope.loadingPromise = $scope.blogs.$promise;
}]);