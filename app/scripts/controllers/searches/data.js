
angular.module("data", [])
.controller("data", function ($scope) {
  $scope.taskSets = [];

  //获取数据
  $scope.getTasks = function () {
    $scope.taskSets = [];
    //获取数据数目
    var taskSetNum = contractInstance.getTaskNum.call().toNumber();
    //逐个获取数据对象
    for (var i = 0; i < taskSetNum; i++) {
      //获取数据对象合约
      var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByIndex.call(i));
      var taskSet = [];
      //获取对象名称
      taskSet.taskName = web3.toAscii(taskObjectInstance.dataName());
      //获取对象介绍
      taskSet.introduction = taskObjectInstance.introduction();
      //获取对象类型
      taskSet.types = [];
      for (var j = 0; j < taskObjectInstance.typeNum().toNumber(); j++) {
        //循环添加类型
        var type = [];
        type.key = web3.toAscii(taskObjectInstance.dataTypes(j)[0]);
        type.value = web3.toAscii(taskObjectInstance.dataTypes(j)[1]);
        taskSet.types.push(type);
      }
      //获取数据提供者
      taskSet.provider = getUserNameByAddress(taskObjectInstance.provider());
      $scope.taskSets.push(taskSet);
    }
  };
});
