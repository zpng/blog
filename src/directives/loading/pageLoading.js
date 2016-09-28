'use strict';
app.directive('pageLoading', function () {
    return {
        restrict: 'AE',
        templateUrl: 'directives/loading/pageLoading.html',
        scope: {
            pageLoading: '='
        },
        replace: true,
        link: function ($scope) {
            $scope.loading = true;

            $scope.$watch('pageLoading', function (val) {
                if (!val) {
                    $scope.loading = false;
                    return;
                }

                $scope.loading = true;
                val.finally(function () {
                    if ($scope.$$destroyed) {
                        return;
                    }

                    $scope.loading = false;
                });
            });
        }
    };
});

