'use strict';
app.directive('uploadFile', [
    '$timeout',
    'UploadHelper',
    'Toast',
    function ($timeout, UploadHelper, Toast) {
        return {
            scope: {
                fileUrl: '=',
                paramName: '@',//对应http接口的参数名
                fileName: '=',
                target: '=',
                fileType: '@',
                loadingText: '@',
                modelType: '@',
                onUploaded: '=',
                onUploadError: '=',
                onUploadedCallback: '&',
                onUploadErrorCallback: '&',
                idAttr: '@',
                uploadProgress: '=?'
            },
            require: '?ngModel',
            templateUrl: 'directives/upload/uploadFile.html',
            link: function ($scope, $elem, $attrs, ngModel) {
                $scope.uploadProgress = 0;

                $scope.idAttr = $scope.idAttr || 'fileId';

                function startTask(fileUrl) {
                    $scope.uploadProgress = 0;
                    $scope.uploadTask = UploadHelper.upload(fileUrl, $scope.target, $scope.paramName, $scope.fileName).then(function (result) {
                        if (result && ngModel) {
                            if ($scope.modelType === 'id') {
                                ngModel.$setViewValue(result[$scope.idAttr]);
                            } else if ($scope.modelType === 'meta') {
                                ngModel.$setViewValue(result);
                            }
                        }

                        if ($scope.onUploaded) {
                            $scope.onUploaded(result);
                        }

                        if ($scope.onUploadedCallback) {
                            $scope.onUploadedCallback({
                                result: result
                            });
                        }
                    }, function (xhr) {
                        Toast.error('网络出错，' + ($scope.fileType ? $scope.fileType : '文件') + '上传失败! ' + xhr.responseText);

                        //上传失败后如果需要其他处理
                        if ($scope.onUploadError) {
                            $scope.onUploadError(xhr);
                        }

                        if ($scope.onUploadErrorCallback) {
                            $scope.onUploadErrorCallback({
                                xhr: xhr
                            });
                        }

                        $scope.fileUrl = null;
                    }, function (progress) {
                        $scope.uploadProgress = Math.floor(progress * 100);
                    });
                }

                $scope.$watch('fileUrl', function (fileUrl) {
                    if (!fileUrl) {
                        return;
                    }

                    startTask(fileUrl);
                });
            }
        };
    }
]);
