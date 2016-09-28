'use strict';

app.service('Gallery', [
    '$http',
    'API_SERVER',
    '$q',
    '$rootScope',
    'Utils',
    'GALLERY_CONFIG',
    function ($http, API_SERVER, $q, $rootScope, Utils, GALLERY_CONFIG) {
        function getBlobFromUrl(image) {
            var defer = $q.defer();

            var xhr = new XMLHttpRequest();
            xhr.open('GET', image, true);
            xhr.send();
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                if (this.status === 200) {
                    var blob = new Blob([this.response], {
                        type: this.getResponseHeader('content-type')
                    });
                    if (image.indexOf('blob:') === 0) {
                        URL.revokeObjectURL(image);
                    }
                    defer.resolve(blob);
                } else {
                    defer.reject(new Error('读取图片时出错'));
                }
            };

            return defer.promise;
        }

        var Gallery = {
            upload: function (imageUrl, isPrivateImage, fileName) {
                var defer = $q.defer();
                getBlobFromUrl(imageUrl).then(function (image) {
                    var formData = new FormData();
                    if(fileName){
                        formData.append('image', image, fileName);
                    }else {
                        formData.append('image', image);
                    }

                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', isPrivateImage === true ? Gallery.userImagePrefix : Gallery.imagePrefix, true);
                    xhr.responseType = 'text';
                    xhr.withCredentials = true;

                    xhr.upload.onprogress = function (e) {
                        defer.notify(e.total !== 0 ? e.loaded / e.total : 0);
                        Utils.safeApply($rootScope);
                    };

                    xhr.onerror = function () {
                        defer.reject(this);
                        Utils.safeApply($rootScope);
                    };

                    xhr.onload = function () {
                        if (this.status === 200) {
                            defer.resolve(JSON.parse(this.responseText));
                        } else {
                            defer.reject(this);
                        }
                        Utils.safeApply($rootScope);
                    };

                    xhr.send(formData);
                });

                return defer.promise;
            },
            userImagePrefix: API_SERVER.gallery + GALLERY_CONFIG.urlPrefix + GALLERY_CONFIG.owner.user,
            imagePrefix: API_SERVER.gallery + GALLERY_CONFIG.urlPrefix + GALLERY_CONFIG.owner.pub
        };

        return Gallery;
    }
]);
