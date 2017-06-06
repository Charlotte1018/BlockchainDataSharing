
angular.module("searchTask", [])
    .controller("searchTask", function ($scope) {
      $scope.taskSets = [];
      /**
       * 根据名字搜索数据详细信息
       */
      $scope.searchTaskByName = function () {
        if(!$scope.taskName){
          alert("Please input the task name!");
          return;
        }
        //检查数据名称是否存在
        if (!contractInstance.isTaskNameExist.call($scope.taskName)) {
          alert("Can't find the task!");
          return;
        }
        $scope.task = [];
        //若存在则显示详细信息
        var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByTaskName.call($scope.taskName));
        //获取数据名称
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
       * 根据类型搜索数据
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

        //循环获取数据并显示
        for(var i = 0; i < taskNum; i++){
          //获取数据对象合约
          var taskObjectInstance = taskContract.at(typeObjectInstance.taskSets.call(i));
          var task = [];
          //获取数据名称
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
