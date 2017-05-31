
angular.module("provide", []).controller("provide", function ($scope) {
    //账户部分初始化
    //初始取出账户
    $scope.accounts = web3.eth.accounts;
    $scope.types = [{key: "", value: ""}];
    $scope.dataSets = [];
    /**
     * 创建数据
     */
    $scope.provideData = function () {
        //检查是否都有值
        if (!$scope.dataName) {
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
        if (contractInstance.isDataNameExist.call($scope.dataName)) {
            alert("The data name exist");
            return;
        }
        //解锁账户
        try {
            web3.personal.unlockAccount($scope.selectedAccount, $scope.password);
        } catch (err) {
            console.log(err);
            alert("You haven't connect to ethereum or the password cannot match the account!");
            return;
        }
        //添加数据
        try {
            //添加数据源
            contractInstance.createData($scope.dataName, $scope.introduction, {
                from: $scope.selectedAccount,
                gas: 80000000
            });
            //添加数据类型
            for (var i = 0; i < $scope.types.length; i++) {
                contractInstance.addTypeToData($scope.types[i].key, $scope.types[i].value, $scope.dataName, {
                    from: $scope.selectedAccount,
                    gas: 80000000
                });
            }
        } catch (err) {
            alert(err);
            return;
        }
    };

    $scope.showProvideList = function () {

    }

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
        if ($scope.types.length <= 1) {
            alert("Must have one type");
            return;
        }
        $scope.types.splice($scope.types.length - 1, 1);
    };
    /**
     * 检查数据名称是否存在
     */
    $scope.checkDataNameExist = function () {
        if (contractInstance.isDataNameExist.call($scope.dataName)) {
            $scope.nameError = "The name is exist";
        }
        else {
            if (!$scope.dataName) {
                $scope.nameError = "Please input data name.";
            }
            else $scope.nameError = "";
        }
    };

    /**
     * 查询对应账户所提供的数据列表
     */
    $scope.getProvideData = function () {
        $scope.dataSets = [];
        //获取提供者提供的数据总数
        var provideNum = contractInstance.getDataNumByProvider.call($scope.selectedAccount).toNumber();
        //逐个获取数据对象
        for (var i = 0; i < provideNum; i++) {
            var dataSet = [];
            dataSet.dataName = web3.toAscii(contractInstance.getProvideDataNameByIndex.call($scope.selectedAccount, i));
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
        if(provideNum > 0) $scope.selectedData = $scope.dataSets[0].dataName;
    };

    $scope.getDataRequestList = function () {

    };
});
