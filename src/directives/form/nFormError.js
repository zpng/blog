'use strict';
app.directive('nFormError', [
    '$log',
    '$timeout',
    function ($log, $timeout) {
        return {
            require: ['^nForm', '?^form', '?^ngForm'],
            restrict: 'A',
            link: function ($scope, $elem, $attrs, controllers) {
                var errors = [];
                var rewatch = null;
                var rel = $attrs.rel;

                $scope.$watch($attrs.nFormError, function (val) {
                    errors = val;

                    if (typeof errors === 'string') {
                        errors = [errors];
                    }

                    if (rewatch) {
                        rewatch();
                    }
                });

                $timeout(function () {
                    if ($scope.$$destroyed) {
                        return;
                    }

                    var form = controllers[1] || controllers[2];
                    if (!rel) {
                        var $input = $elem.parent().find('[ng-model][name]:first');
                        var ngModel = $input.controller('ngModel');

                        if (!form) {
                            $log.warn('nFormError: can\'t find form');
                            return;
                        }

                        if (!ngModel) {
                            $log.warn('nFormError: can\'t find ngModel');
                            return;
                        }

                        rel = ngModel.$name;
                    }

                    var cancelWatch = null;

                    rewatch = function () {
                        if (cancelWatch) {
                            cancelWatch();
                        }

                        cancelWatch = $scope.$watch(form.$name + '.needsAttention(\'' + rel + '\', ' + JSON.stringify(errors) + ',' + ($attrs.bypassAttempted || 'false') + ')', function (val) {
                            $elem.toggleClass('hide', !val);
                        });
                    };

                    rewatch();
                });
            }
        };
    }
]);
