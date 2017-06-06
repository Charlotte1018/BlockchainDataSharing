
angular.module("datamanagementstask", [])
    .controller("provideCtrlTask", function ($scope) {
      //账户部分初始化
      //初始取出账户
      $scope.accounts = getRegisterAccounts();
      $scope.taskSets = [];
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
      $scope.getProvideTask = function () {
        $scope.taskSets = [];
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        //获取提供者提供的数据总数
        var provideNum = contractInstance.getTaskNumByProvider.call(accountAddress).toNumber();
        //逐个获取数据对象
        for (var i = 0; i < provideNum; i++) {
          var taskSet = [];
          taskSet.taskName = web3.toAscii(contractInstance.getProvideTaskNameByIndex.call(accountAddress, i));
          //根据数据名称获取数据对象合约
          var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByTaskName.call(taskSet.taskName));
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
          $scope.taskSets.push(taskSet);
        }
        //设置默认名称
        if (provideNum > 0) $scope.selectedTask = $scope.taskSets[0].taskName;
        $scope.getTaskRequestList();
      };

      /**
       * 查询对应数据的提供者列表
       */
      $scope.getTaskRequestList = function () {
        $scope.requesters = [];
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        //若未选择数据则返回
        if (!$scope.selectedTask) return;
        //获取权限对象
        var accessContractInstance = accessContract.at(contractInstance.getTaskAccessByName.call($scope.selectedTask));
        var requesterNum = accessContractInstance.requesterNum.call().toNumber();
        for (var i = 0; i < requesterNum; i++) {
          //存入数组
          var requester = [];
          requester.address = accessContractInstance.requesterList(i);
          requester.userName = getUserNameByAddress(requester.address);
          //获取当前请求备注信息
          var requestContractInstance = requestContract.at(contractInstance.getTaskRequest.call($scope.selectedTask, requester.address));
          requester.information = requestContractInstance.information();
          //获取请求者对应请求地址的权限
          requester.status = accessType[accessContractInstance.accessList(accessContractInstance.requestList(requester.address))];
          //设置是否能够操作权限，已审计则不能操作，返回true
          requester.control_disable = isTaskAudited($scope.selectedTask, requester.address);
          $scope.requesters.push(requester);
        }
      };

      /**
       * 刷新函数
       */
      $scope.refresh = function () {
        $scope.getTaskRequestList();
      };

      /**
       * 页面加载完后自动显示对应列表
       */
      $scope.$watch('$viewContentLoaded', function () {
        $scope.getProvideTask();
      });

      /**
       * 确认数据请求
       */
      $scope.confirmTask = function (taskName, requester) {
        if (!$scope.password) {
          alert("Please input the password!");
          return;
        }
        //解锁账户
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        if (!unlockEtherAccount(accountAddress, $scope.password)) return;
        //调用函数确认数据请求
        try {
          contractInstance.confirmTask(taskName, requester, {
            from: accountAddress,
            gas: 80000000
          });
        }
        catch (err) {
          console.log(err);
        }
      };

      /**
       * 拒绝任务请求
       */
      $scope.rejectTask = function (taskName, requester) {
        if (!$scope.password) {
          alert("Please input the password!");
          return;
        }
        //解锁账户
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        if (!unlockEtherAccount(accountAddress, $scope.password)) return;
        //调用函数确认数据请求
        try {
          contractInstance.rejectTask(taskName, requester, {
            from: accountAddress,
            gas: 80000000
          });
        }
        catch (err) {
          console.log(err);
        }
      };

      /**
       * 关闭任务
       */
      $scope.endTask = function () {
        //如果任务已经关闭则返回
        if ($scope.isTaskFinished()) {
          alert("任务已关闭");
          return;
        }
        //解锁账户
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        if (!unlockEtherAccount(accountAddress, $scope.password)) return;
        //调用函数确认数据请求
        try {
          contractInstance.endTask($scope.selectedTask, {
            from: accountAddress,
            gas: 80000000
          });
        }
        catch (err) {
          console.log(err);
        }
      };

      /**
       * 判断任务是否已经完成
       */
      $scope.isTaskFinished = function () {
        //获取数据对象合约
        var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByTaskName.call($scope.selectedTask));
        if (taskObjectInstance.isTaskStatusFinished.call()) {
          $scope.nameError = "The task is finished!";
          return true;
        }
        return false;
      };
    })
    .controller("personalTask", function ($scope) {
      //账户部分初始化
      //初始取出账户
      $scope.accounts = getRegisterAccounts();
      $scope.taskSets = [];
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
      function getProvideTaskList() {
        $scope.provideTaskSet = [];
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        //获取提供者提供的数据总数
        var provideNum = contractInstance.getTaskNumByProvider.call(accountAddress).toNumber();
        $scope.provideSum = provideNum;
        //逐个获取数据对象
        for (var i = 0; i < provideNum; i++) {
          var taskSet = [];
          taskSet.taskName = web3.toAscii(contractInstance.getProvideTaskNameByIndex.call(accountAddress, i));
          //根据数据名称获取数据对象合约
          var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByTaskName.call(taskSet.taskName));
          //获取对象类型
          taskSet.types = [];
          for (var j = 0; j < taskObjectInstance.typeNum().toNumber(); j++) {
            //循环添加类型
            var type = [];
            type.key = web3.toAscii(taskObjectInstance.dataTypes(j)[0]);
            type.value = web3.toAscii(taskObjectInstance.dataTypes(j)[1]);
            taskSet.types.push(type);
          }
          //获取权限对象
          var accessObjectContractInstance = accessContract.at(contractInstance.getTaskAccessByName.call(taskSet.taskName));
          taskSet.requestNum = accessObjectContractInstance.requesterNum().toNumber();
          $scope.provideTaskSet.push(taskSet);
        }
      }


      /**
       * 获取请求数据列表
       */
      function getRequestTaskList() {
        $scope.requestTaskSet = [];
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        //获取请求数据数量
        var requestTaskNum = contractInstance.getTaskNumByRequester.call(accountAddress).toNumber();
        $scope.requestSum = requestTaskNum;
        for (var i = 0; i < requestTaskNum; i++) {
          //获取数据名称
          var task = [];
          task.taskName = web3.toAscii(contractInstance.getRequestTaskNameByIndex.call(accountAddress, i));
          //获取对应名称的权限合约
          var accessContractInstance = accessContract.at(contractInstance.getTaskAccessByName.call(task.taskName));
          task.provider = getUserNameByAddress(accessContractInstance.provider());
          //获取当前状态
          task.status = accessType[accessContractInstance.accessList(accessContractInstance.requestList(accountAddress))];
          //获取当前请求备注信息
          var requestContractInstance = requestContract.at(contractInstance.getTaskRequest.call(task.taskName, accountAddress));
          task.information = requestContractInstance.information();
          //存入数据
          $scope.requestTaskSet.push(task);
        }
      }

      /**
       * 获取个人数据列表
       */
      $scope.getPersonalTaskList = function () {
        getProvideTaskList();
        getRequestTaskList();
      }


      $scope.refresh = function () {
        $scope.getPersonalTaskList();
      };
    });
