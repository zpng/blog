'use strict';

app.directive('mainNav', [
    'API_SERVER',
    'User',
    'navFactory',
    '$route',
    function (API_SERVER, User, navFactory, $route) {
        var pages = {
            blogList: ['BlogListCtrl','BlogDetailCtrl'],
        };

        return navFactory.create(pages, 'directives/mainNav.html', true, function ($scope) {
            $scope.authUrl = API_SERVER.auth;
            // $scope.user = User.current();

            var onRouteChangeSuccess = function () {
                if (!$route.current || !$route.current.$$route) {
                    $scope.fullScreen = false;
                    return;
                }

                var fullScreenControllers = [];
                var controllerName = $route.current.$$route.controller;
                if (fullScreenControllers.indexOf(controllerName) !== -1) {
                    $scope.fullScreen = true;
                } else {
                    $scope.fullScreen = false;
                }
            };

            $scope.$on('$routeChangeSuccess', onRouteChangeSuccess);
        });
    }
]);
