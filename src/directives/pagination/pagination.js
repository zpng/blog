'use strict';

app.directive('pagination', ['$location', 'Pager', function ($location, Pager) {
    return {
        scope: {
            pageInfo: '=',
            onPage: '=',
            hideAll: '='
        },
        restrict: 'E',
        templateUrl: 'directives/pagination/pagination.html',
        link: function ($scope) {
            $scope.showAll = function () {
                if ($scope.onPage) {
                    $scope.onPage(0, 999999999);
                } else {
                    $location.search(_.extend({}, $location.search(), {
                        page: 0,
                        pageSize: 999999999
                    }));
                }
            };

            $scope.switchPage = function (page) {
                if ($scope.onPage) {
                    $scope.onPage(page);
                } else {
                    $location.search('page', page);
                }
            };

            $scope.$watchGroup(['pageInfo.totalPage', 'pageInfo.currentPage'], function (ret) {
                var totalPage = ret[0];
                var currentPage = ret[1];

                if (totalPage !== undefined && currentPage !== undefined) {
                    $scope.pages = Pager.getPageList(currentPage, totalPage);
                } else {
                    $scope.pages = [];
                }
            });
        }
    };
}]);
