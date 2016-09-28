'use strict';

app.directive('modal', [
    function () {
        return {
            restrict: 'C',
            scope: {
                onClose: '&'
            },
            link: function ($scope, $elem) {
                $elem.modal({
                    backdrop: 'static',
                    keyboard: true
                });

                var index = parseInt($('.modal-backdrop').css('z-index'), 10);
                $elem.css('z-index', index + 1);

                $elem.on('hidden.bs.modal', function () {
                    $scope.onClose();

                    var phase = $scope.$root.$$phase;
                    if (phase !== '$apply' && phase !== '$digest') {
                        $scope.$apply();
                    }
                });

                $scope.$on('$destroy', function () {
                    $elem.modal('hide');
                });
            }
        };
    }
]);
