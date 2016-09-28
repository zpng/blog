'use strict';
// Date 和 timestamp 互转，viewModel 用 Date， model 用 timestamp
app.directive('timestamp', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        priority: 1000, // 初始化时间应该早于 datetime
        link: function (scope, element, attrs, ngModel) {
            ngModel.$formatters.push(function (val) {
                if (!val) {
                    return val;
                }

                val = parseInt(val);
                return new Date(val);
            });

            ngModel.$parsers.push(function (val) {
                if (!val) {
                    return val;
                }

                return val.getTime();
            });
        }
    };
});
