
'use strict';

app.service('Pager', function () {
    var PAGE_NUMBER_RANGE = 5;
    var Pager = {};

    Pager.transformResponse = function (transformResponse) {
        return function (data) {
            if (data && data.list) {
                var pageInfo = data.pageInfo;

                if (transformResponse) {
                    data.list = data.list.map(transformResponse);
                }

                if (data.list[0]) {
                    data.list[0]._pageInfo = pageInfo;
                }

                return data.list;
            }

            return data;
        };
    };

    Pager.setPageInfo = function ($promise, $scope) {
        $promise.then(function (ret) {
            if (ret[0] && ret[0]._pageInfo) {
                var pageInfo = ret[0]._pageInfo;
                delete ret[0]._pageInfo;

                $scope.pageInfo = pageInfo;
            } else {
                $scope.pageInfo = {
                    totalItem: 0,
                    totalPage: 0,
                    pageSize: 20,
                    currentPage: 0
                };
            }
        });
    };

    Pager.getPageList = function (currentPage, totalPage) {
        if (totalPage === 0) {
            return [];
        }

        var start = 1;
        var end = totalPage - 2;

        if (PAGE_NUMBER_RANGE < totalPage) {
            var leftLimit = Math.floor(PAGE_NUMBER_RANGE / 2);
            var rightLimit = Math.floor(PAGE_NUMBER_RANGE / 2);

            start = Math.max(1, currentPage - leftLimit);
            end = Math.min(totalPage - 2, currentPage + rightLimit);

            // 设置完边界后，有可能中间长度不到 PAGE_NUMBER_RANGE 个，得动态调整
            if (end - start + 1 <  PAGE_NUMBER_RANGE) {
                var gap = PAGE_NUMBER_RANGE - (end - start + 1);
                if (start === 1) {
                    end = Math.min(totalPage - 2, end + gap);
                } else {
                    start = Math.max(1, start - gap);
                }
            }
        }

        var items = [];
        items.push({
            isNumber: true,
            page: 0
        });

        if (start > 1) {
            items.push({
                isDots: true
            });
        }

        _.range(start, end + 1).forEach(function (number) {
            items.push({
                isNumber: true,
                page: number
            });
        });

        if (end < totalPage - 2) {
            items.push({
                isDots: true
            });
        }

        if (totalPage > 1) {
            items.push({
                isNumber: true,
                page: totalPage - 1
            });
        }

        return items;
    };

    return Pager;
});
