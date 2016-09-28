'use strict';

app.service('Confirm', [
    '$q',
    function ($q) {
        var confirmInfo = {};

        function emptyConfirmInfo() {
            delete confirmInfo.title;
            delete confirmInfo.text;
            delete confirmInfo.confirmText;
            delete confirmInfo.cancelText;
            delete confirmInfo.isAlert;
            delete confirmInfo.cancel;
            delete confirmInfo.submit;
        }

        var Confirm = function (opts) {
            var defer = $q.defer();

            confirmInfo.title = opts.title;
            confirmInfo.confirmText = opts.confirmText;
            confirmInfo.cancelText = opts.cancelText;
            confirmInfo.isAlert = opts.isAlert;
            confirmInfo.zIndex = 10000;

            //opts.text为数组时用于多行显示，数组中每一项占一行
            if (Object.prototype.toString.call(opts.text) === '[object Array]') {
                confirmInfo.text = opts.text;
            } else {
                confirmInfo.text = [opts.text];
            }

            //opts.imageIds为数组时用于多行显示，数组中每一项占一行
            if (Object.prototype.toString.call(opts.imageIds) === '[object Array]') {
                confirmInfo.imageIds = opts.imageIds;
            } else {
                confirmInfo.imageIds = [opts.imageIds];
            }

            //opts.tag存在，封装opts.tag为数组
            if (opts.tag !== undefined && Object.prototype.toString.call(opts.tag) !== '[object Array]') {
                opts.tag = [opts.tag];
            }

            var idx = 0;
            //opts.tag存在且opts.tag.length=confirmInfo.text.length，confirmInfo.text设置成带有tag
            if (opts.tag !== undefined && opts.tag.length === confirmInfo.text.length) {
                idx = confirmInfo.text.length;
                while (idx--) {
                    confirmInfo.text[idx] = {
                        tag: opts.tag[idx] + ': ',
                        content: confirmInfo.text[idx]
                    };
                }
            } else {
                idx = confirmInfo.text.length;
                while (idx--) {
                    confirmInfo.text[idx] = {
                        tag: '',
                        content: confirmInfo.text[idx]
                    };
                }
            }

            //opts.tag存在且opts.length=confirmInfo.imageIds.length，confirmInfo.imageIds设置成带有tag
            if (opts.tag !== undefined && opts.tag.length === confirmInfo.imageIds.length) {
                idx = confirmInfo.imageIds.length;
                while (idx--) {
                    confirmInfo.imageIds[idx] = {
                        tag: opts.tag[idx] + ': ',
                        src: confirmInfo.imageIds[idx]
                    };
                }
            } else {
                idx = confirmInfo.text.length;
                while (idx--) {
                    confirmInfo.imageIds[idx] = {
                        tag: '',
                        src: confirmInfo.imageIds[idx]
                    };
                }
            }

            confirmInfo.cancel = function (signal) {
                emptyConfirmInfo();
                defer.reject(signal ? signal : false);
            };

            confirmInfo.submit = function () {
                emptyConfirmInfo();
                defer.resolve(true);
            };

            return defer.promise;
        };

        return {
            show: Confirm,
            confirmInfo: confirmInfo
        };
    }
]);
