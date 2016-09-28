'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/blogList', {
        templateUrl: 'pages/blog/blogList.html',
        controller: 'BlogListCtrl'
    }).
    otherwise({
        redirectTo: '/blogList'
    });
}]);
