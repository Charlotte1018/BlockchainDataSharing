angular.module("request", []).controller("request", function ($scope) {
    //账户部分初始化
    //初始取出账户
    $scope.accounts = web3.eth.accounts;
    $scope.requestDisabled = true;
    $scope.dataSets = [];
    /**
     * 动态搜索对应数据名称是否存在
     */
    $scope.isDataExist = function () {
        if (!$scope.dataName) {
            $scope.requestDisabled = true;
            $scope.nameError = "Please input data name!";
            return;
        }
        //检查数据名称是否存在
        if (!contractInstance.isDataNameExist.call($scope.dataName)) {
            $scope.requestDisabled = true;
            $scope.nameError = "The data name is not exist!";
            return;
        }
        $scope.nameError = "";
        $scope.requestDisabled = false;
    };

    /**
     * 请求数据
     */
    $scope.requestData = function () {
        //解锁账户
        try {
            web3.personal.unlockAccount($scope.selectedAccount, $scope.password);
        } catch (err) {
            console.log(err);
            alert("You haven't connect to ethereum or the password cannot match the account!");
            return;
        }
        //发送数据请求
        try {
            contractInstance.requestData($scope.dataName, {
                from: $scope.selectedAccount,
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
        //获取请求数据数量
        var requestDataNum = contractInstance.getDataNumByRequester.call($scope.selectedAccount).toNumber();
        for (var i = 0; i < requestDataNum; i++) {
            //获取数据名称
            var data = [];
            data.dataName = web3.toAscii(contractInstance.getRequestDataNameByIndex.call($scope.selectedAccount, i));
            //获取对应名称的权限合约
            var accessContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(data.dataName));
            data.provider = accessContractInstance.provider();
            //获取当前状态
            data.status = accessType[accessContractInstance.accessList($scope.selectedAccount)];
            //存入数据
            $scope.dataSets.push(data);
        }
    };

});