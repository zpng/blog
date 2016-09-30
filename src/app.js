'use strict';

var APP_MODULE_NAME = 'blog-web';

var app = angular.module(APP_MODULE_NAME, [
    'ngRoute',
    'ngCookies',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'ui',
    'ui.bootstrap',
    'monospaced.qrcode',
    'sprintf',
    'textAngular'
]);

window.app = app;

$(function () {
    document.body.innerHTML =
        '<main-nav></main-nav>' +
        '<toast-list></toast-list>' +
        '<confirm></confirm>' +
        '<div ng-view></div>';

    angular.bootstrap(document, [APP_MODULE_NAME]);
});

function onUpdateReady() {
    if(window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        window.location.reload();
    }
}

window.applicationCache.addEventListener('updateready', onUpdateReady);

setInterval(function () {
    try {
        window.applicationCache.update();
    } catch (e) {}
}, 60000);

try {
    window.applicationCache.update();
} catch (e) {}
