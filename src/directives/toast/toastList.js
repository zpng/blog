'use strict';
app.directive('toastList', [
    'Toast',
    function (Toast) {
        return {
            templateUrl: 'directives/toast/toastList.html',
            link: function ($scope) {
                $scope.toasts = Toast.toasts;

                $scope.closeToast = function (toast) {
                    Toast.dismiss(toast);
                };
            }
        };
    }
]);
