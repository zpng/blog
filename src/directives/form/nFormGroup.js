'use strict';
app.directive('nFormGroup', [
    '$log',
    '$timeout',
    function ($log, $timeout) {
        return {
            require: ['^nForm', '^?form', '^?ngForm', '^?editMode'],
            restrict: 'AC', // 匹配 class 和 attribute
            link: function ($scope, $elem, $attrs, controllers) {
                var editMode = controllers[controllers.length - 1];
                if (!editMode || !editMode.isEditMode) {
                    editMode = false;
                } else {
                    editMode = editMode.isEditMode();
                }

                $timeout(function () {
                    if ($scope.$$destroyed) {
                        return;
                    }

                    var form = controllers[1] || controllers[2];

                    var ngModels = $elem.find('[ng-model][name]').toArray().map(function (el) {
                        return $(el).attr('name');
                    });

                    if (!form) {
                        if (editMode) {
                            $log.warn('nFormGroup: can\'t find form');
                        }
                        return;
                    }

                    if (!ngModels.length) {
                        if (editMode) {
                            $log.warn('nFormGroup: can\'t find ngModel, form=%s', form.$name);
                        }
                        return;
                    }

                    var watchExprs = ngModels.map(function (ngModel) {
                        return form.$name + '.needsAttention(\'' + ngModel + '\')';
                    });

                    $scope.$watchGroup(watchExprs, function (results) {
                        $elem.toggleClass('has-error', results.some(function (result) {
                            return result;
                        }));
                    });
                });
            }
        };
    }
]);
