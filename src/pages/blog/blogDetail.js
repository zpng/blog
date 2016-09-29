'use strict';

app.controller('BlogDetailCtrl', ['$routeParams', '$scope', 'Blog', function ($routeParams, $scope, Blog) {
    $scope.blog = Blog.get({id : $routeParams.id});
    $scope.loadingPromise = $scope.blog.$promise;
}]);