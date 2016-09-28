'use strict';

app.service('navFactory', [
    '$route',
    function ($route) {
        return {
            create: function (pages, templateUrl, listen, link, scope) {
                return {
                    templateUrl: templateUrl,
                    scope: _.extend({}, scope),
                    link: function ($scope) {
                        $scope.pages = {};

                        var onRouteChangeSuccess = function () {
                            if (!$route.current || !$route.current.$$route) {
                                $scope.pages = {};
                                return;
                            }

                            var controllerName = $route.current.$$route.controller;

                            Object.keys(pages).forEach(function (key) {
                                $scope.pages[key] = pages[key].indexOf(controllerName) !== -1;
                            });
                        };

                        if (listen) {
                            $scope.$on('$routeChangeSuccess', onRouteChangeSuccess);
                        } else {
                            onRouteChangeSuccess();
                        }

                        if (link) {
                            link.apply(this, arguments);
                        }
                        $scope.cmsContentUrl = (location.origin + location.pathname).replace('crm', 'cms') + '#/all/all/contents';
                        $scope.cmsEpisodeUrl = (location.origin + location.pathname).replace('crm', 'cms') + '#/all/all/episodes';
                    }
                };
            }
        };
    }
]);
