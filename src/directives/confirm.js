'use strict';

app.directive('confirm', [
    'Confirm',
    function (Confirm) {
        return {
            templateUrl: 'directives/confirm.html',
            link: function ($scope) {
                $scope.confirmInfo = Confirm.confirmInfo;
            }
        };
    }
]);
