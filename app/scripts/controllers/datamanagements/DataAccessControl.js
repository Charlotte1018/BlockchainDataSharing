
angular.module("datamanagements", [])
  .controller("provideCtrl", function ($scope) {
    //账户部分初始化
    //初始取出账户
    $scope.accounts = getRegisterAccounts();
    $scope.dataSets = [];
    $scope.requesters = [];

    /**
     * 页面加载完后自动显示第一个用户名
     */
    $scope.$watch('$viewContentLoaded', function () {
      if ($scope.accounts.length > 0) {
        $scope.selectedAccount = $scope.accounts[0].userName;
      }
    });

    /**
     * 查询对应账户所提供的数据列表
     */
    $scope.getProvideData = function () {
      $scope.dataSets = [];
      var accountAddress = getUserAddressByName($scope.selectedAccount);
      //获取提供者提供的数据总数
      var provideNum = contractInstance.getDataNumByProvider.call(accountAddress).toNumber();
      //逐个获取数据对象
      for (var i = 0; i < provideNum; i++) {
        var dataSet = [];
        dataSet.dataName = web3.toAscii(contractInstance.getProvideDataNameByIndex.call(accountAddress, i));
        //根据数据名称获取数据对象合约
        var dataObjectInstance = dataContract.at(contractInstance.getDataAddressByDataName.call(dataSet.dataName));
        //获取对象介绍
        dataSet.introduction = dataObjectInstance.introduction();
        //获取对象类型
        dataSet.types = [];
        for (var j = 0; j < dataObjectInstance.typeNum().toNumber(); j++) {
          //循环添加类型
          var type = [];
          type.key = web3.toAscii(dataObjectInstance.dataTypes(j)[0]);
          type.value = web3.toAscii(dataObjectInstance.dataTypes(j)[1]);
          dataSet.types.push(type);
        }
        $scope.dataSets.push(dataSet);
      }
      //设置默认名称
      if (provideNum > 0) $scope.selectedData = $scope.dataSets[0].dataName;
      $scope.getDataRequestList();
    };

    /**
     * 查询对应数据的提供者列表
     */
    $scope.getDataRequestList = function () {
      $scope.requesters = [];
      var accountAddress = getUserAddressByName($scope.selectedAccount);
      //若未选择数据则返回
      if (!$scope.selectedData) return;
      //获取权限对象
      var accessContractInstance = accessContract.at(contractInstance.getDataAccessByName.call($scope.selectedData));
      var requesterNum = accessContractInstance.requesterNum.call().toNumber();
      for (var i = 0; i < requesterNum; i++) {
        //存入数组
        var requester = [];
        requester.address = accessContractInstance.requesterList(i);
        requester.userName = getUserNameByAddress(requester.address);
        //获取当前请求备注信息
        var requestContractInstance = requestContract.at(contractInstance.getDataRequest.call($scope.selectedData, requester.address));
        requester.information = requestContractInstance.information();
        //获取请求者对应请求地址的权限
        requester.status = accessType[accessContractInstance.accessList(accessContractInstance.requestList(requester.address))];
        $scope.requesters.push(requester);
      }
    };

    /**
     * 刷新函数
     */
    $scope.refresh = function () {
      $scope.getDataRequestList();
    };

    /**
     * 页面加载完后自动显示对应列表
     */
    $scope.$watch('$viewContentLoaded', function () {
      $scope.getProvideData();
    });

    /**
     * 确认数据请求
     */
    $scope.confirmData = function (dataName, requester) {
      if (!$scope.password) {
        alert("Please input the password!");
        return;
      }
      //解锁账户
      var accountAddress = getUserAddressByName($scope.selectedAccount);
      if (!unlockEtherAccount(accountAddress, $scope.password)) return;
      //调用函数确认数据请求
      try {
        contractInstance.confirmData(dataName, requester, {
          from: accountAddress,
          gas: 80000000
        });
      }
      catch (err) {
        console.log(err);
      }
    };

    /**
     * 拒绝数据请求
     */
    $scope.rejectData = function (dataName, requester) {
      if (!$scope.password) {
        alert("Please input the password!");
        return;
      }
      //解锁账户
      var accountAddress = getUserAddressByName($scope.selectedAccount);
      if (!unlockEtherAccount(accountAddress, $scope.password)) return;
      //调用函数确认数据请求
      try {
        contractInstance.rejectData(dataName, requester, {
          from: accountAddress,
          gas: 80000000
        });
      }
      catch (err) {
        console.log(err);
      }
    };
  })
  .controller("personalData", function ($scope) {
    //账户部分初始化
    //初始取出账户
    $scope.accounts = getRegisterAccounts();
    $scope.dataSets = [];
    $scope.provideSum = 0;
    $scope.requestSum = 0;
    /**
     * 页面加载完后自动显示第一个用户名
     */
    $scope.$watch('$viewContentLoaded', function () {
      if ($scope.accounts.length > 0) {
        $scope.selectedAccount = $scope.accounts[0].userName;
      }
    });


    /**
     * 获取提供数据列表
     */
    function getProvideDataList() {
      $scope.provideDataSet = [];
      var accountAddress = getUserAddressByName($scope.selectedAccount);
      //获取提供者提供的数据总数
      var provideNum = contractInstance.getDataNumByProvider.call(accountAddress).toNumber();
      $scope.provideSum = provideNum;
      //逐个获取数据对象
      for (var i = 0; i < provideNum; i++) {
        var dataSet = [];
        dataSet.dataName = web3.toAscii(contractInstance.getProvideDataNameByIndex.call(accountAddress, i));
        //根据数据名称获取数据对象合约
        var dataObjectInstance = dataContract.at(contractInstance.getDataAddressByDataName.call(dataSet.dataName));
        //获取对象类型
        dataSet.types = [];
        for (var j = 0; j < dataObjectInstance.typeNum().toNumber(); j++) {
          //循环添加类型
          var type = [];
          type.key = web3.toAscii(dataObjectInstance.dataTypes(j)[0]);
          type.value = web3.toAscii(dataObjectInstance.dataTypes(j)[1]);
          dataSet.types.push(type);
        }
        //获取权限对象
        var accessObjectContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(dataSet.dataName));
        dataSet.requestNum = accessObjectContractInstance.requesterNum().toNumber();
        $scope.provideDataSet.push(dataSet);
      }
    }


    /**
     * 获取请求数据列表
     */
    function getRequestDataList() {
      $scope.requestDataSet = [];
      var accountAddress = getUserAddressByName($scope.selectedAccount);
      //获取请求数据数量
      var requestDataNum = contractInstance.getDataNumByRequester.call(accountAddress).toNumber();
      $scope.requestSum = requestDataNum;
      for (var i = 0; i < requestDataNum; i++) {
        //获取数据名称
        var data = [];
        data.dataName = web3.toAscii(contractInstance.getRequestDataNameByIndex.call(accountAddress, i));
        //获取对应名称的权限合约
        var accessContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(data.dataName));
        data.provider = getUserNameByAddress(accessContractInstance.provider());
        //获取当前状态
        data.status = accessType[accessContractInstance.accessList(accessContractInstance.requestList(accountAddress))];
        //获取当前请求备注信息
        var requestContractInstance = requestContract.at(contractInstance.getDataRequest.call(data.dataName, accountAddress));
        data.information = requestContractInstance.information();
        //存入数据
        $scope.requestDataSet.push(data);
      }
    }

    /**
     * 获取个人数据列表
     */
    $scope.getPersonalDataList = function () {
      getProvideDataList();
      getRequestDataList();
    }


    $scope.refresh = function () {
      $scope.getPersonalDataList();
    };
  });
