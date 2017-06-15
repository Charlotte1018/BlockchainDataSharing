angular.module("dataManagement", [])
  .controller("personalData", function ($scope) {
    //账户部分初始化
    $scope.dataSets = [];
    $scope.provideSum = 0;
    $scope.requestSum = 0;
    /**
     * 页面加载完后自动显示第一个用户名
     */
    $scope.$watch('$viewContentLoaded', function () {

    });

    /**
     * 获取个人数据列表
     */
    $scope.getPersonalDataList = function (address) {
      $scope.provideDataSet = getProvideDataList(address);
      $scope.provideSum = $scope.provideDataSet.length;
      $scope.requestDataSet = getRequestDataList(address);
      $scope.requestSum = $scope.requestDataSet.length;
    }


    $scope.refresh = function (address) {
      $scope.getPersonalDataList(address);
    };
  });
