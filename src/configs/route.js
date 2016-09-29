'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/blogList', {
        templateUrl: 'pages/blog/blogList.html',
        controller: 'BlogListCtrl'
    }).
    when('/blogs/:id', {
        templateUrl: 'pages/blog/blogDetail.html',
        controller: 'BlogDetailCtrl'
    }).
    otherwise({
        redirectTo: '/blogList'
    });
}]);
