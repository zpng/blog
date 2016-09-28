'use strict';
app.directive('nForm', [
    '$log',
    function ($log) {
        return {
            restrict: 'A',
            require: ['nForm', '?form', '?ngForm', '^?editMode'],
            controller: ['$scope', function ($scope) {
                this.$attempted = false;
                this.$setAttempted = function () {
                    this.$attempted = true;
                };

                $scope.$on('checkSubmit', function () {
                    this.$setAttempted();
                }.bind(this));
            }],
            link: function ($scope, formElement, attributes, controllers) {
                var form = controllers[1] || controllers[2];

                var editMode = controllers[controllers.length - 1];
                if (!editMode || !editMode.isEditMode) {
                    editMode = false;
                } else {
                    editMode = editMode.isEditMode();
                }
                if (!form) {
                    return;
                }

                var nForm = controllers[0];

                $scope.nForm = nForm;

                form.checkSubmit = function (callback) {
                    nForm.$setAttempted();

                    $scope.$broadcast('checkSubmit');

                    if (form.$invalid) {
                        return;
                    }

                    var args = _.rest(_.toArray(arguments));
                    callback.apply(this, args);
                };

                form.needsAttention = function (item, checkErrors, bypassAttempted) {
                    bypassAttempted = Boolean(bypassAttempted);

                    if (!item) {
                        return !form.$valid && nForm.$attempted;
                    }

                    if (!form[item]) {
                        if (editMode) {
                            $log.warn('nForm: Can\'t find form item: %s.%s', form.$name, item);
                        }
                        return false;
                    }

                    var needsAttention = !form[item].$pending && form[item].$invalid && (nForm.$attempted || bypassAttempted);

                    if (!checkErrors) {
                        return needsAttention;
                    }

                    if (typeof checkErrors === 'string') {
                        checkErrors = [checkErrors];
                    }

                    return needsAttention && (!checkErrors.length || checkErrors.some(function (key) {
                            return form[item].$error && form[item].$error[key];
                        }));
                };
            }
        };
    }
]);
