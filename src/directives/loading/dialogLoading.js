'use strict';
app.directive('dialogLoading', [function () {
    return {
        restrict: 'AE',
        templateUrl: 'directives/loading/dialogLoading.html',
        scope: {
            dialogLoading: '='
        },
        link: function ($scope) {
            $scope.loading = true;

            $scope.$watch('dialogLoading', function (val) {
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
}]);
