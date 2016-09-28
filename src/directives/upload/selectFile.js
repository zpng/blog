'use strict';
app.directive('selectFile', [
    'Toast',
    function (Toast) {
        return {
            scope: {
                file: '=',
                fileType: '@',
                fileTypeStrict: '@',
                sizeLimit: '@',//图片大小上限，支持单位为M、K、B
                onSizeLimitExceeded: '&',
                onFileTypeError: '&',
                onBeforeSelect: '=',//一个promise，resolve时才继续选择文件，v否则不进行文件选择
                onSelected: '&'
            },
            link: function ($scope, $elem) {
                var fileType = $scope.fileType || '*';
                $scope.sizeLimit = $scope.sizeLimit ? $scope.sizeLimit : '30M';
                var sizeLimitValue = parseInt($scope.sizeLimit.substring(0, $scope.sizeLimit.length - 1));
                var sizeLimitUnit = $scope.sizeLimit[$scope.sizeLimit.length - 1].toUpperCase();
                if (sizeLimitUnit === 'M') {
                    sizeLimitValue = sizeLimitValue * 1024 * 1024;
                } else if (sizeLimitUnit === 'K') {
                    sizeLimitValue = sizeLimitValue * 1024;
                }

                var $input = angular.element('<input type="file" accept="' + fileType + '"/>');
                var objectUrls = [];

                var handler = function () {
                    if ($scope.onBeforeSelect) {
                        $scope.onBeforeSelect.then(function () {
                            $input.click();
                        });
                    } else {
                        $input.click();
                    }
                };

                //因为onBeforeSelect为promise，每次resolve或者reject后会更换引用，因此需要重新绑定事件监听
                $scope.$watch('onBeforeSelect', function (val) {
                    if (!val) {
                        return;
                    }
                    $elem.off('click', handler);
                    $elem.on('click', handler);
                });

                $elem.on('click', handler);

                $input.on('change', function () {
                    $scope.$apply(function () {
                        var file = $input[0].files[0];
                        var uploadFileType = '.' + file.name.split('.').pop();
                        if (file.size > sizeLimitValue) {
                            Toast.error('文件上传失败，文件大小需小于 ' + $scope.sizeLimit);
                            $scope.onSizeLimitExceeded(file.size);
                        } else if ('on' === $scope.fileTypeStrict && uploadFileType.toUpperCase() !== $scope.fileType.toUpperCase()) {
                            Toast.error('文件上传失败，文件格式应为 ' + $scope.fileType);
                            $scope.onFileTypeError(file.type);
                        } else {
                            var url = URL.createObjectURL(file);
                            objectUrls.push(url);
                            $scope.file = url;
                        }
                        $scope.onSelected({file: file});
                        $input.val(null);
                    });
                });

                $scope.$on('$destroy', function () {
                    objectUrls.forEach(function () {
                        //URL.revokeObjectURL(url);
                    });
                });
            }
        };
    }
]);
