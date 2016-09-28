'use strict';
app.directive('greaterThan', [
    function () {
        return {
            require: 'ngModel',
            link: function ($scope, $elem, $attrs, ngModel) {
                $scope.$watchGroup([$attrs.greaterThan, $attrs.ngModel], function (ret) {
                    var target = ret[0];
                    var current = ret[1];

                    if (!target || !current) {
                        ngModel.$setValidity('greaterThan', true);
                        return;
                    }

                    ngModel.$setValidity('greaterThan', current > target);
                });
            }
        };
    }
]);
