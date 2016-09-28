'use strict';
app.directive('toastInform', [
    'Toast',
    function (Toast) {
        return {
            restrict: 'A',
            link: function ($scope) {
                $scope.inform = function (value) {
                    Toast.error('【' + value + '】功能还未实现。');
                };
            }
        };
    }
]);
