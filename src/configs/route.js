'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/blogList', {
        templateUrl: 'pages/blog/blogList.html',
        controller: 'BlogListCtrl'
    }).
    when('/blogs/create', {
        templateUrl: 'pages/blog/blogCreate.html',
        controller: 'BlogCreateCtrl'
    }).
    when('/blogs/:id', {
        templateUrl: 'pages/blog/blogDetail.html',
        controller: 'BlogDetailCtrl'
    }).
    otherwise({
        redirectTo: '/blogList'
    });
}]);
