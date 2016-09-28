'use strict';
app.service('UploadHelper', [
    '$http',
    '$q',
    '$rootScope',
    'Utils',
    function ($http, $q, $rootScope, Utils) {
        function getBlobFromUrl(file) {
            var defer = $q.defer();

            var xhr = new XMLHttpRequest();
            xhr.open('GET', file, true);
            xhr.send();
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                if (this.status === 200) {
                    var blob = new Blob([this.response], {
                        type: this.getResponseHeader('content-type')
                    });
                    defer.resolve(blob);
                } else {
                    defer.reject(new Error('读取文件时出错'));
                }
            };

            return defer.promise;
        }

        var UploadHelper = {
            upload: function (imageUrl, target, paramName, fileName) {
                var defer = $q.defer();
                getBlobFromUrl(imageUrl).then(function (file) {
                    var formData = new FormData();
                    if (fileName) {
                        formData.append(paramName, file, fileName);
                    } else {
                        formData.append(paramName, file);
                    }

                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', target, true);
                    xhr.responseType = 'text';
                    xhr.withCredentials = true;

                    xhr.upload.onprogress = function (e) {
                        defer.notify(e.total !== 0 ? (e.loaded / e.total) : 0);
                        Utils.safeApply($rootScope);
                    };

                    xhr.onerror = function () {
                        defer.reject(this);
                        Utils.safeApply($rootScope);
                    };

                    xhr.onload = function () {
                        if (this.status === 200) {
                            if (this.responseText) {
                                defer.resolve(JSON.parse(this.responseText));
                            } else {
                                defer.resolve();
                            }
                        } else {
                            defer.reject(this);
                        }
                        Utils.safeApply($rootScope);
                    };

                    xhr.send(formData);
                });

                return defer.promise;
            }
        };

        return UploadHelper;
    }
]);
