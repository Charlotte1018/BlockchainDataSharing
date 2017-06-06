angular.module("request", []).controller("request", function ($scope) {
  //账户部分初始化
  //初始取出账户
  $scope.accounts = getRegisterAccounts();
  $scope.requestDisabled = true;
  $scope.updateDisabled = true;
  $scope.dataSets = [];
  $scope.information = "";

  /**
   * 页面加载完后自动显示第一个用户名
   */
  $scope.$watch('$viewContentLoaded', function () {
    if ($scope.accounts.length > 0) {
      $scope.selectedAccount = $scope.accounts[0].userName;
    }
  });

  /**
   * 动态检测是否合法
   */
  $scope.isRequestLegal = function () {
    //若数据不存在或者请求者和数据提供者一致，则不合法
    if (!$scope.isDataExist() || $scope.isDataRequestSame()) {
      $scope.requestDisabled = true;
      return;
    } else {
      $scope.nameError = "";
      if (!$scope.information) {
        $scope.infoError = "Please input the request information";
        return;
      }
      $scope.infoError = "";
      $scope.requestDisabled = false;
    }
  };

  /**
   * 动态搜索对应数据名称是否存在
   */
  $scope.isDataExist = function () {
    if (!$scope.dataName) {
      $scope.nameError = "Please input data name!";
      return false;
    }
    //检查数据名称是否存在
    if (!contractInstance.isDataNameExist.call($scope.dataName)) {
      $scope.nameError = "The data name is not exist!";
      return false;
    }
    return true;
  };

  /**
   * 动态搜索请求者是否与数据提供者相同
   */
  $scope.isDataRequestSame = function () {
    //获取数据对象合约
    var dataObjectInstance = dataContract.at(contractInstance.getDataAddressByDataName.call($scope.dataName));
    if ($scope.selectedAccount == getUserNameByAddress(dataObjectInstance.provider())) {
      $scope.nameError = "The data requester can't not request own data!";
      return true;
    }
    return false;
  };

  /**
   * 请求数据
   */
  $scope.requestData = function () {
    //解锁账户
    if (!unlockEtherAccount(getUserAddressByName($scope.selectedAccount), $scope.password)) return;

    //发送数据请求(需要添加参数)
    try {
      contractInstance.requestData($scope.dataName, $scope.information, {
        from: getUserAddressByName($scope.selectedAccount),
        gas: 80000000
      });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 获取对应请求者请求数据列表
   */
  $scope.getRequestList = function () {
    $scope.dataSets = [];
    var address = getUserAddressByName($scope.selectedAccount);
    //获取请求数据数量
    var requestDataNum = contractInstance.getDataNumByRequester.call(address).toNumber();
    for (var i = 0; i < requestDataNum; i++) {
      //获取数据名称
      var data = [];
      data.dataName = web3.toAscii(contractInstance.getRequestDataNameByIndex.call(address, i));
      //获取对应名称的权限合约
      var accessContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(data.dataName));
      data.provider = getUserNameByAddress(accessContractInstance.provider());
      //获取当前状态
      data.status = accessType[accessContractInstance.accessList(accessContractInstance.requestList(address))];
      //获取当前请求备注信息
      var requestContractInstance = requestContract.at(contractInstance.getDataRequest.call(data.dataName, address));
      data.information = requestContractInstance.information();
      //存入数据
      $scope.dataSets.push(data);
    }
  };

  /**
   * 更新请求备注
   */
  $scope.updateInfo = function () {
    if (!$scope.dataName || !$scope.information) {
      alert("请输入数据名称或备注");
      return;
    }
    if (!$scope.isDataExist()) {
      alert("数据名称不存在");
      return;
    }
    //解锁账户
    if (!unlockEtherAccount(getUserAddressByName($scope.selectedAccount), $scope.password)) return;

    //发送修改请求
    try {
      contractInstance.changeDataRequestInfo($scope.dataName, $scope.information, {
        from: getUserAddressByName($scope.selectedAccount),
        gas: 80000000
      });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 判断更新备注是否合法
   */
  $scope.isUpdateLegal = function () {
    //判断数据是否存在
    if (!$scope.dataName || !$scope.isDataExist()) {
      $scope.updateDisabled = true;
      $scope.nameError = "数据不存在";
      return;
    }
    $scope.nameError = "";
    //判断输入的请求备注是否合法
    if (!$scope.information) {
      $scope.updateDisabled = true;
      $scope.infoError = "请输入备注";
      return;
    }
    $scope.infoError = "";

    //判断数据是否已经被确认或者拒绝
    if (isDataAudited($scope.dataName, getUserAddressByName($scope.selectedAccount))) {
      $scope.infoError = "该数据已被审核，无法修改！";
      $scope.updateDisabled = true;
      return;

    }
    $scope.infoError = "";
    $scope.updateDisabled = false;
  };

});
