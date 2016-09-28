'use strict';

app.service('URLHelper', function () {
    var toNumberIfIsNumber = function (value) {
        return (typeof value === 'string' && String(parseInt(value, 10)) === value) ? parseInt(value, 10) : value;
    };

    var smartType = function (value) {
        if (value === 'true') {
            return true;
        }

        if (value === 'false') {
            return false;
        }

        return toNumberIfIsNumber(value);
    };

    var URLHelper = {
        /**
         * 用来对 url 进行操作
         * 比如 resolve('/a/', 'b', '/c/', {foo: 'bar'}) => /a/b/c?foo=bar
         */
        resolve: function () {
            var args = _.toArray(arguments);
            var query = _.last(args);
            var path = _.initial(args).join('/').replace(/\/\//g, '/');

                path = path.replace('/?', '?');

            if (path.lastIndexOf('/') === path.length - 1) {
                path = path.substr(0, path.length - 1);
            }

            if (!_.isObject(query)) {
                query = URLHelper.queryToObj(query);
            }

            var idx = path.indexOf('?');
            if (idx !== -1) {
                var originQuery = path.substring(idx + 1, path.length);
                path = path.substring(0, idx);
                if (originQuery.length > 0) {
                    originQuery = URLHelper.queryToObj(originQuery);
                    _.defaults(query, originQuery);
                }
            }
            query = URLHelper.objToQuery(query);
            if (query.length > 0) {
                path = path + '?' + query;
            }

            return path;
        },

        queryToObj: function (queryString) {
            queryString = (queryString || '').replace(/^[\?#]/, '');

            return queryString.split('&').reduce(function (memo, pair) {
                pair = pair.split('=').map(decodeURIComponent);
                if (pair[0]) {
                    memo[pair[0]] = smartType(pair[1]);
                }
                return memo;
            }, {});
        },

        objToQuery: function (obj) {
            var keys = Object.keys(obj).filter(function (key) {
                return !!key;
                
            });
            obj = keys.map(function (key) {
                return [key, obj[key]].map(encodeURIComponent).join('=');
            }).join('&');
            return obj;
        }
    };
    return URLHelper;
});
