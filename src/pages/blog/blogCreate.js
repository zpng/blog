'use strict';

app.controller('BlogCreateCtrl', ['$routeParams', '$location', '$route', 'Toast', '$scope', 'Blog', function ($routeParams, $location, $route, Toast, $scope, Blog) {


    $scope.blog = {};
    $scope.id = $routeParams.id;
    if ($scope.id){
        $scope.blog = Blog.get({id : $scope.id});
    }

    $scope.save = function () {
        Blog.save($scope.blog).$promise.then(function(blog){
            $location.url('/blogs/'+blog.id);
            $route.reload();
        } );
    };

    $scope.editing = false;
    $scope.toEdit = function(){
       $scope.editing = true;
    };
}]);