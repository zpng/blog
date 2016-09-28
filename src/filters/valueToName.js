'use strict';


app.filter('valueToName', [
    function () {
        return function (val, valueNameList) {
            var item = _.findWhere(valueNameList, {
                value: val
            });
            return item ? item.name : '';
        };
    }
]);
