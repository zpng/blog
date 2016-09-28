'use strict';
app.directive('loading', [
    'delay',
    function (delay) {
        return {
            transclude: true,
            template: '<ng-transclude></ng-transclude>',
            link: function ($scope, $elem, $attr) {
                $scope.loading = false;

                $scope.$watch($attr.loading, function (val) {
                    if (!val) {
                        return;
                    }

                    $scope.loading = true;
                    delay(500, val).finally(function () {
                        if ($scope.$$destroyed) {
                            return;
                        }

                        $scope.loading = false;
                    });
                });
            }
        };
    }
]);
