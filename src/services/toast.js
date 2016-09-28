'use strict';
app.service('Toast', [
    '$timeout',
    function ($timeout) {
        var toasts = [];
        var Toast = {
            toasts: toasts,
            success: function (msg, timeout) {
                Toast.toast('success', msg, timeout || 3000);
            },
            error: function (msg, timeout) {
                Toast.toast('danger', msg, timeout || 3000);
            },
            loading: function (loadingPromise, msg) {
                var cancel = Toast.toast('warning', msg, 3000000);
                loadingPromise.finally(cancel);
            },
            toast: function (type, msg, timeout) {
                msg = {
                    type: type,
                    msg: msg,
                    closeable: !timeout
                };

                //不会出现多个toast罗列显示
                if (toasts.length) {
                    toasts.splice(0, 1);
                }

                toasts.push(msg);

                var cancel = function () {
                    var idx = toasts.indexOf(msg);
                    if (idx !== -1) {
                        toasts.splice(idx, 1);
                    }
                };
                $timeout(cancel, timeout);

                return cancel;
            }
        };

        return Toast;
    }
]);
