'use strict';

var ForbiddenException = function () {
    Error.apply(this, arguments);
};

ForbiddenException.prototype = new Error();

app.constant('ForbiddenException', ForbiddenException);
