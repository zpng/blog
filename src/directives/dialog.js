'use strict';

app.directive('dialog', [
    function () {
        return {
            scope: {
                showModal: '=',
                onClose: '&'
            },
            link: function ($scope, $elem) {
                $scope.$watch('open', function (val) {
                    if (val === undefined || val) {
                        $elem[0].showModal();
                    } else {
                        $elem[0].close();
                    }
                });

                function close(evt) {
                    evt.preventDefault();

                    $elem[0].close();

                    if ($scope.onClose) {
                        $scope.onClose();
                    }

                    var phase = $scope.$root.$$phase;
                    if (phase !== '$apply' && phase !== '$digest') {
                        $scope.$apply();
                    }
                }

                $elem.on('cancel', close);

                $elem.on('click', '.dialog-header .close', close);

                $scope.$on('$destroy', function () {
                    $elem.off('cancel', close);
                    $elem.off('click', '.dialog-header .close', close);
                });
            }
        };
    }
]);
