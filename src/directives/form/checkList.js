'use strict';
app.directive('checkListScope', [
    function () {
        return {
            controller: function () {
                this.allValues = [];
            }
        };
    }
]);

app.directive('checkAll', [
    function () {
        return {
            require: ['^checkListScope', 'ngModel'],
            priority: 700,
            link: function ($scope, $elem, $attrs, ctrls) {
                var checkListScopeCtrl = ctrls[0];
                var ngModel = ctrls[1];
                var trueValue = $attrs.ngTrueValue ? $scope.$eval($attrs.ngTrueValue) : $attrs.value;
                if (_.isUndefined(trueValue) || _.isNull(trueValue)) {
                    trueValue = true;
                }
                var falseValue = $scope.$eval($attrs.ngFalseValue);
                if (_.isUndefined(trueValue) || _.isNull(trueValue)) {
                    falseValue = false;
                }
                var allValues = checkListScopeCtrl.allValues;

                ngModel.$formatters.push(function (val) {
                    if (val === trueValue) {
                        return trueValue;
                    }

                    if (val && val.indexOf && allValues.length !== 0 && val.length === 0) {
                        return trueValue;
                    }

                    return falseValue;
                });

                ngModel.$parsers.push(function (val) {
                    if (val === trueValue) {
                        return trueValue;
                    } else {
                        return angular.copy(allValues);
                    }
                });
            }
        };
    }
]);

app.directive('checkList', [
    'Toast',
    function (Toast) {
        return {
            require: ['?^checkListScope', 'ngModel'],
            priority: 700,
            link: function ($scope, $elem, $attrs, ctrls) {
                var checkListScopeCtrl = ctrls[0];
                var ngModel = ctrls[1];
                var trueValue = $attrs.ngTrueValue ? $scope.$eval($attrs.ngTrueValue) : $attrs.value;
                if (_.isUndefined(trueValue) || _.isNull(trueValue)) {
                    trueValue = true;
                }
                var falseValue = $scope.$eval($attrs.ngFalseValue);
                if (_.isUndefined(trueValue) || _.isNull(trueValue)) {
                    falseValue = false;
                }
                var limit = $scope.$eval($attrs.listLimit) || -1;
                var text = $attrs.text;

                if (checkListScopeCtrl) {
                    checkListScopeCtrl.allValues.push(trueValue);
                }

                ngModel.$formatters.push(function (val) {
                    console[console.debug ? 'debug' : 'log']('-- formatter ----------------');
                    if (!val) {
                        return;
                    }
                    var index = -1;
                    if (typeof trueValue === 'object') {
                        index = _.findIndex(val, function (v) {
                            return _.isEqual(v, trueValue);
                        });
                    } else {
                        index = val.indexOf(trueValue);
                    }
                    if (val && val.indexOf && index !== -1) {
                        return trueValue;
                    }
                    return falseValue;
                });

                ngModel.$parsers.push(function (val) {
                    console[console.debug ? 'debug' : 'log']('-- parser ----------------');
                    var list = angular.isArray(ngModel.$modelValue) ? ngModel.$modelValue : [];

                    if (val && list.length === limit) {
                        ngModel.$setViewValue(falseValue);
                        Toast.error(text || '达到上限');
                        return list;
                    } else if (val) {
                        list = _.uniq(list.concat([trueValue]), function (v) {
                            return JSON.stringify(v);
                        });
                    } else {
                        //移除时包含object的情况
                        list = _.filter(list, function (v) {
                            return JSON.stringify(v) !== JSON.stringify(trueValue);
                        });
                    }
                    ngModel.$render();
                    return list;
                });

                $scope.$watchCollection($attrs.ngModel, function (ngModelIds) {
                    console.group('watch collection');
                    console[console.debug ? 'debug' : 'log']('-- watched ----------------');
                    if (!ngModelIds || !ngModelIds.indexOf) {
                        console[console.debug ? 'debug' : 'log']('-- direct return ----------------');
                        return;
                    }

                    var found = ngModelIds.indexOf(trueValue) !== -1;
                    if (found && !ngModel.$viewValue) {
                        console[console.debug ? 'debug' : 'log']('-- set true ----------------');
                        ngModel.$setViewValue(true);
                    } else if (!found && ngModel.$viewValue) {
                        console[console.debug ? 'debug' : 'log']('-- set false ----------------');
                        ngModel.$setViewValue(false);
                    }
                    console.groupEnd('watch collection');
                });

                $scope.$on('select', function () {
                    var list = angular.isArray(ngModel.$modelValue) ? ngModel.$modelValue : [];


                    var index = -1;
                    if (typeof trueValue === 'object') {
                        index = _.findIndex(list, function (v) {
                            return _.isEqual(v, trueValue);
                        });
                    } else {
                        index = list.indexOf(trueValue);
                    }

                    if (index !== -1) {
                        ngModel.$setViewValue(falseValue);
                    } else {
                        ngModel.$setViewValue(trueValue);
                    }
                });
            }
        };
    }
]);
