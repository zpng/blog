'use strict';
app.directive('endOfDate', function () {
    return {
        require: '^ngModel',
        restrict: 'A',
        priority: 100,
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                if (!val) {
                    return val;
                }

                return parseInt(val, 10) + 86400000 - 1;
            });

            ngModel.$formatters.push(function (val) {
                if (!val) {
                    return val;
                }

                return parseInt(val, 10) - 86400000 + 1;
            });
        }
    };
});
