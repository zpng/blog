'use strict';

app.filter('verifyStatus', [
    function () {
        return function (val) {
            return {
                verifySuccess: '审核通过，等待发布上线',
                published: '已发布上线',
                verifyFail: '审核拒绝，等待重新提交'
            }[val] || val;
        };
    }
]);
