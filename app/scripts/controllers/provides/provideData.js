angular.module("provide", []).controller("provideData", function ($scope) {
  //账户部分初始化
  //初始取出账户
  $scope.tool_type = getToolType();
  $scope.purpose_type = getPurposeType();
  $scope.types = [];

  /**
   * 页面加载完后自动显示第一个用户名
   */
  $scope.$watch('$viewContentLoaded', function () {
  });

  /**
   * 创建数据
   */
  $scope.provideData = function (address, password, dataName, introduction, capability, cap_pwd, select_tool_type, select_purpose_type) {
    alert(web3.toHex(select_tool_type));
    return
    if (!address || !password || !dataName || !introduction || !capability || !cap_pwd
      || !select_tool_type || !select_purpose_type) {
      alert("请填写完善信息！");
      return;
    }
    if (!isNameLengthLegal(dataName, 32) || !isNameLengthLegal(cap_pwd, 32) ||
      !isNameLengthLegal(select_tool_type, 32) || !isNameLengthLegal(select_purpose_type, 32)) {
      alert("数据名称、权限密码、类型相关字段不能超过15个字符！");
      return;
    }

    if (isDataNameExist(dataName)) {
      alert("数据名称已注册!");
      return;
    }
    //判断是否增加type并判断是否超过长度
    for (var i = 0; i < $scope.types.length; i++) {
      if (!$scope.types[i].key || !$scope.types[i].value) {
        alert("Please input the types params!");
        return;
      }
      if (!isNameLengthLegal($scope.types[i].key) || !isNameLengthLegal($scope.types[i].value)) {
        alert("类型相关字段不能超过15个字符！");
        return;
      }
    }
    //解锁
    if (!unlockEtherAccount(address, password)) {
      return;
    }
    //添加数据
    try {
      //添加数据源
      contractInstance.createData(dataName, introduction, capability, cap_pwd, {
        from: address,
        gas: 80000000
      });
      alert($scope.tool_type.key + select_tool_type + dataName);
      //添加数据类型
      contractInstance.addTypeToData($scope.tool_type.key, select_tool_type, dataName, {
        from: address,
        gas: 8000000
      });
      contractInstance.addTypeToData($scope.purpose_type.key, select_purpose_type, dataName, {
        from: address,
        gas: 8000000
      });
      for (i = 0; i < $scope.types.length; i++) {
        contractInstance.addTypeToData($scope.types[i].key, $scope.types[i].value, dataName, {
          from: address,
          gas: 8000000
        });
      }
      alert("新增数据成功！");
      return true;
    } catch (err) {
      console.log(err);
      alert("新增数据失败!");
      return false;
    }
  };

  /**
   * 增加类型控件
   */
  $scope.addType = function () {
    $scope.types.push({key: "", value: ""});
  };

  /**
   * 删除类型控件
   */
  $scope.removeType = function () {
    if ($scope.types.length <= 0) {
      return;
    }
    $scope.types.splice($scope.types.length - 1, 1);
  };

  /**
   * 检查数据名称是否存在
   */
  $scope.checkDataNameExist = function (dataName) {
    if (!dataName) {
      $scope.nameError = "Please input data name.";
      return;
    }
    if (isDataNameExist(dataName)) {
      $scope.nameError = "The name is exist";
      return;
    }
    $scope.nameError = "";
  };

  /**
   * 查询对应账户所提供的数据列表
   */
  $scope.getProvideData = function () {
    $scope.dataSets = [];
    //获取提供者提供的数据总数
    var provideNum = contractInstance.getDataNumByProvider.call(getUserAddressByName($scope.selectedAccount)).toNumber();
    //逐个获取数据对象
    for (var i = 0; i < provideNum; i++) {
      var dataSet = [];
      dataSet.dataName = web3.toAscii(contractInstance.getProvideDataNameByIndex.call(getUserAddressByName($scope.selectedAccount), i));
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
  };

  $scope.getDataRequestList = function () {

  };
});
