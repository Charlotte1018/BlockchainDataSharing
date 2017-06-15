
angular.module("searchTask", [])
    .controller("searchTask", function ($scope) {
      $scope.taskSets = [];
      /**
       * 根据名字搜索任务详细信息
       */
      $scope.searchTaskByName = function () {
        if(!$scope.taskName){
          alert("Please input the task name!");
          return;
        }
        //检查任务名称是否存在
        if (!contractInstance.isTaskNameExist.call($scope.taskName)) {
          alert("Can't find the task!");
          return;
        }
        $scope.task = [];
        //若存在则显示详细信息
        var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByTaskName.call($scope.taskName));
        //获取任务名称
        $scope.task.taskName = web3.toAscii(taskObjectInstance.dataName());
        //获取对象介绍
        $scope.task.introduction = taskObjectInstance.introduction();
        //获取对象状态
        $scope.task.taskStatus = taskStatus[taskObjectInstance.taskStatus()];
        //获取对象类型
        $scope.task.types = [];
        for (var j = 0; j < taskObjectInstance.typeNum().toNumber(); j++) {
          //循环添加类型
          var type = [];
          type.key = web3.toAscii(taskObjectInstance.dataTypes(j)[0]);
          type.value = web3.toAscii(taskObjectInstance.dataTypes(j)[1]);
          $scope.task.types.push(type);
        }
        $scope.task.provider = getUserNameByAddress(taskObjectInstance.provider());
      };

      /**
       * 根据类型搜索任务
       */
      $scope.searchTaskByType = function () {
        if(!$scope.type_key || !$scope.type_value){
          alert("Please input the type key and value!");
          return;
        }
        $scope.taskSets = [];

        //获取类型对象合约
        var typeAddress = contractInstance.getTypeAddressByName.call($scope.type_key, $scope.type_value);
        var typeObjectInstance = typeContract.at(typeAddress);
        var taskNum = typeObjectInstance.taskNum().toNumber();
        if(taskNum == 0){
          alert("Can't find the task set!");
          return;
        }

        //循环获取任务并显示
        for(var i = 0; i < taskNum; i++){
          //获取任务对象合约
          var taskObjectInstance = taskContract.at(typeObjectInstance.taskSets.call(i));
          var task = [];
          //获取任务名称
          task.taskName = web3.toAscii(taskObjectInstance.dataName());
          //获取对象介绍
          task.introduction = taskObjectInstance.introduction();
          //获取对象状态
          task.taskStatus = taskStatus[taskObjectInstance.taskStatus()];
          //获取对象类型
          task.types = [];
          for (var j = 0; j < taskObjectInstance.typeNum().toNumber(); j++) {
            //循环添加类型
            var type = [];
            type.key = web3.toAscii(taskObjectInstance.dataTypes(j)[0]);
            type.value = web3.toAscii(taskObjectInstance.dataTypes(j)[1]);
            task.types.push(type);
          }
          $scope.taskSets.push(task);
        }
      };
    });

/**
 * 根据任务名称搜索
 * @param taskName
 * @returns {Array}
 */
function searchTaskByName(taskName) {
  var task = [];
  if (!isNameLengthLegal(taskName)) {
    alert("输入任务名称不为空且不能超过32字符");
    return [];
  }
  //检查任务名称是否存在
  if (!isTaskNameExist(taskName)) {
    alert("查询不到该任务信息!");
    return [];
  }
  //获取任务详细信息
  try {
    //若存在则显示详细信息
    var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByTaskName.call(taskName));
    //获取任务名称
    task.taskName = taskName;
    //获取对象介绍
    task.introduction = taskObjectInstance.introduction();
    //获取对象类型
    task.types = [];
    for (var j = 0; j < taskObjectInstance.typeNum().toNumber(); j++) {
      //循环添加类型
      var type = [];
      type.key = web3.toAscii(taskObjectInstance.dataTypes(j)[0]);
      type.value = web3.toAscii(taskObjectInstance.dataTypes(j)[1]);
      task.types.push(type);
    }
    //获取任务状态
    task.status = taskStatus[taskObjectInstance.taskStatus()];
    task.provider = getUserNameByAddress(taskObjectInstance.provider());
  } catch (err) {
    console.log(err);
    return [];
  }
  return task;
}

/**
 * 根据任务类型查找任务集
 * @param type_key
 * @param type_value
 * @returns {Array}
 */
function searchTaskByType(type_key, type_value) {
  var taskSet = [];
  if (!isNameLengthLegal(type_key) || !isNameLengthLegal(type_value)) {
    alert("输入任务类型字段不为空且不能超过32字符");
    return [];
  }
  try {
    //获取类型对象合约
    var typeAddress = contractInstance.getTypeAddressByName.call(type_key, type_value);
    var typeObjectInstance = typeContract.at(typeAddress);
    var taskNum = typeObjectInstance.taskNum().toNumber();
    if (taskNum == 0) {
      alert("Can't find the task set!");
      return [];
    }

    //循环获取任务并显示
    for (var i = 0; i < taskNum; i++) {
      //获取任务对象合约
      var taskObjectInstance = taskContract.at(typeObjectInstance.taskSets.call(i));
      var task = [];
      //获取任务名称
      task.taskName = web3.toAscii(taskObjectInstance.dataName());
      task = searchTaskByName(task.taskName);
      taskSet.push(task);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return taskSet;
}
