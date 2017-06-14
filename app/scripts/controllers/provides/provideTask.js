'use strict';
angular.module("provideTask", []).controller("provideTask", function ($scope) {
  //数据类型初始化
  $scope.tool_type = getToolType();
  console.log($scope.tool_type);
  $scope.types = [{key: "", value: ""}];
  $scope.taskSets = [];
  $scope.nameError = "";
  /**
   * 页面加载完后自动显示第一个用户名
   */
  $scope.$watch('$viewContentLoaded', function () {
    if ($scope.accounts.length > 0) {
      $scope.selectedAccount = $scope.accounts[0].userName;
    }
  });

  /**
   * 创建数据
   */
  $scope.provideTask = function () {
    //检查是否都有值
    if (!$scope.taskName) {
      alert("The data name must be filled!");
      return;
    }
    for (var i = 0; i < $scope.types.length; i++) {
      if (!$scope.types[i].key || !$scope.types[i].value) {
        alert("Please input the types params!");
        return;
      }
    }
    if (!$scope.introduction) {
      alert("Please input the introduction!");
      return;
    }
    if (!$scope.password) {
      alert("Please input the password!");
      return;
    }
    //检查数据名称是否存在
    if (contractInstance.isTaskNameExist.call($scope.taskName)) {
      alert("The task name exist");
      return;
    }
    //解锁账户
    if (!unlockEtherAccount(getUserAddressByName($scope.selectedAccount), $scope.password)) {
      return;
    }
    //添加数据
    try {
      //添加数据源
      contractInstance.createTask($scope.taskName, $scope.introduction, {
        from: getUserAddressByName($scope.selectedAccount),
        gas: 80000000
      });
      //添加数据类型
      for (i = 0; i < $scope.types.length; i++) {
        contractInstance.addTypeToTask($scope.types[i].key, $scope.types[i].value, $scope.taskName, {
          from: getUserAddressByName($scope.selectedAccount),
          gas: 80000000
        });
      }
    } catch (err) {
      alert(err);
      return;
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
  $scope.checkDataNameExist = function () {
    if (contractInstance.isTaskNameExist.call($scope.taskName)) {
      $scope.nameError = "The name is exist";
    }
    else {
      if (!$scope.taskName) {
        $scope.nameError = "Please input data name.";
      }
      else {
        $scope.nameError = "";
      }
    }
  };

  /**
   * 查询对应账户所提供的数据列表
   */
  $scope.getProvideTask = function () {
    $scope.taskSets = [];
    var address = getUserAddressByName($scope.selectedAccount);
    //获取提供者提供的数据总数
    var provideNum = contractInstance.getTaskNumByProvider.call(address).toNumber();
    //逐个获取数据对象
    for (var i = 0; i < provideNum; i++) {
      var taskSet = [];
      taskSet.taskName = web3.toAscii(contractInstance.getProvideTaskNameByIndex.call(address, i));
      //根据数据名称获取数据对象合约
      var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByTaskName.call(taskSet.taskName));
      //获取对象介绍
      taskSet.introduction = taskObjectInstance.introduction();
      //获取对象状态
      taskSet.status = taskStatus[taskObjectInstance.taskStatus()];
      //获取对象类型
      taskSet.types = [];
      for (var j = 0; j < taskObjectInstance.typeNum().toNumber(); j++) {
        //循环添加类型
        var type = [];
        type.key = web3.toAscii(taskObjectInstance.dataTypes(j)[0]);
        type.value = web3.toAscii(taskObjectInstance.dataTypes(j)[1]);
        taskSet.types.push(type);
      }
      $scope.taskSets.push(taskSet);
    }
    //设置默认名称
    if (provideNum > 0) {
      $scope.selectedTask = $scope.taskSets[0].taskName;
    }
  };
});
