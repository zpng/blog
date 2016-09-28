'use strict';

app.controller('ErrorCtrl', ['$location', '$routeParams', function ($location, $routeParams) {
    this.code = $routeParams.code || 404;
    this.currentLink = $location.url();
}]);
