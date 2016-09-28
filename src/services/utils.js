'use strict';

app.service('Utils', function () {
        var Utils = {
            url: function (path, query) {
                query = Object.keys(query).map(function (key) {
                    return key + '=' + encodeURIComponent(query[key]);
                }).join('&');

                return path + (path.indexOf('?') !== -1 ? '&' : '?') + query;
            },
            doubleLength: function (val) {
                return (val || '').replace(/[\uFE30-\uFFA0\u2E80-\u9FFF\uac00-\ud7ff\u3000‘“”’]/g, '**').length;
            },
            safeApply: function ($scope, fn) {
                var phase = $scope.$root.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    if (fn && (typeof(fn) === 'function')) {
                        $scope.$apply(fn);
                    } else {
                        $scope.$apply();
                    }
                }
            },
            empty: function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    obj.splice(0, obj.length);
                    return;
                }
                _.forEach(obj, function (val, key) {
                    obj[key] = null;
                    delete obj[key];
                });
            },
            containsRecursive: function (tree, childrenKey, match, callback) {
                if (match(tree)) {
                    callback(tree);
                    return true;
                }

                var children = tree[childrenKey];
                if (!children || !children.length) {
                    return false;
                }

                var contains = children.some(function (child) {
                    return Utils.containsRecursive(child, childrenKey, match, callback);
                });

                if (contains) {
                    callback(tree);
                    return true;
                }

                return false;
            },
            smartType: function (obj) {
                if (obj === 'true') {
                    return true;
                }

                if (obj === 'false') {
                    return false;
                }

                if (obj === 'null') {
                    return null;
                }

                if (obj === 'undefined') {
                    return undefined;
                }

                if (typeof obj === 'string') {
                    if (String(parseInt(obj, 10)) === obj) {
                        return parseInt(obj, 10);
                    }

                    return obj;
                }

                if (obj instanceof Array) {
                    return obj.map(Utils.smartType);
                }

                if (typeof obj === 'number') {
                    return obj;
                }

                return Object.keys(obj).reduce(function (memo, curr) {
                    memo[curr] = Utils.smartType(obj[curr]);
                    return memo;
                }, {});
            },
            checkPristine: function (oldData, newData, keyNames, ignoreOrder) {
                ignoreOrder = ignoreOrder || false;
                var isDirty = _.some(keyNames, function (keyName) {
                    //考虑数组内容的顺序，[1, 2]与[2, 1]不等
                    if (!ignoreOrder) {
                        return !angular.equals(oldData[keyName], newData[keyName]);
                    }
                    //不考虑数组顺序，[1, 2]与[2, 1]相等（树状结构仅考虑第一层，不进行深入处理）
                    if (Object.prototype.toString.call(oldData[keyName]) === '[object Array]') {
                        if (oldData[keyName].length !== newData[keyName].length) {
                            return true;
                        } else if (!oldData[keyName].length) {
                            return false;
                        }

                        var sortKey = Object.keys(oldData[keyName][0])[0];
                        var sortedOldItem = _.sortBy(oldData[keyName], sortKey);
                        var sortedNewItem = _.sortBy(newData[keyName], sortKey);

                        return !angular.equals(sortedOldItem, sortedNewItem);
                    } else {
                        return !angular.equals(oldData[keyName], newData[keyName]);
                    }
                });
                return !isDirty;
            },
            //获取多个对象都拥有的且值完全一样的属性并返回包含这些属性和值的对象
            intersectionObject: function () {
                var allObjects = arguments;
                var result = {};
                var objectKeys = [];
                _.each(allObjects, function (object) {
                    objectKeys.push(_.keys(object));
                });
                var intersectionKeys = _.intersection.apply(null, objectKeys);
                _.each(intersectionKeys, function (key) {
                    var values = _.map(allObjects, function (object) {
                        return object[key];
                    });
                    var uniqueValues = _.uniq(values);
                    if (uniqueValues.length === 1) {
                        result[key] = uniqueValues[0];
                    }
                });
                return result;
            },
            //获取多个对象都拥有的但是值不完全一样的属性名列表
            diffenceObjectKeys: function () {
                var allObjects = arguments;
                var objectKeys = [];
                _.each(allObjects, function (object) {
                    objectKeys.push(_.keys(object));
                });
                var intersectionKeys = _.intersection.apply(null, objectKeys);
                var result = _.filter(intersectionKeys, function (key) {
                    var values = _.map(allObjects, function (object) {
                        return object[key];
                    });
                    var uniqueValues = _.uniq(values);
                    return uniqueValues.length > 1;
                });
                return result;
            }
        };
        return Utils;
    }
);
