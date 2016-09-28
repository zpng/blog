'use strict';
app.directive('timeRange', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/form/timeRange.html',
            scope: {
                formData: '=',
                itemName: '@'
            },
            link: function ($scope) {
                $scope.itemName = $scope.itemName || '课程日期';
                $scope.today = moment().startOf('day').format();
            }
        };
    }
]);
