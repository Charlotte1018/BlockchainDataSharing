
angular.module("searches", [])
  .controller("search", function ($scope) {
    $scope.dataSets = [];
    /**
     * 根据名字搜索数据详细信息
     */
    $scope.searchDataByName = function () {
      if (!$scope.dataName) {
        alert("Please input the data name!");
        return;
      }
      //检查数据名称是否存在
      if (!contractInstance.isDataNameExist.call($scope.dataName)) {
        alert("Can't find the data!");
        return;
      }
      $scope.data = [];
      //若存在则显示详细信息
      var dataObjectInstance = dataContract.at(contractInstance.getDataAddressByDataName.call($scope.dataName));
      //获取数据名称
      $scope.data.dataName = web3.toAscii(dataObjectInstance.dataName());
      //获取对象介绍
      $scope.data.introduction = dataObjectInstance.introduction();
      //获取对象类型
      $scope.data.types = [];
      for (var j = 0; j < dataObjectInstance.typeNum().toNumber(); j++) {
        //循环添加类型
        var type = [];
        type.key = web3.toAscii(dataObjectInstance.dataTypes(j)[0]);
        type.value = web3.toAscii(dataObjectInstance.dataTypes(j)[1]);
        $scope.data.types.push(type);
      }
      $scope.data.provider = getUserNameByAddress(dataObjectInstance.provider());
    };

    /**
     * 根据类型搜索数据
     */
    $scope.searchDataByType = function () {
      if (!$scope.type_key || !$scope.type_value) {
        alert("Please input the type key and value!");
        return;
      }
      $scope.dataSets = [];

      //获取类型对象合约
      var typeAddress = contractInstance.getTypeAddressByName.call($scope.type_key, $scope.type_value);
      var typeObjectInstance = typeContract.at(typeAddress);
      var dataNum = typeObjectInstance.dataNum().toNumber();
      if (dataNum == 0) {
        alert("Can't find the data set!");
        return;
      }

      //循环获取数据并显示
      for (var i = 0; i < dataNum; i++) {
        //获取数据对象合约
        var dataObjectInstance = dataContract.at(typeObjectInstance.dataSets.call(i));
        var data = [];
        //获取数据名称
        data.dataName = web3.toAscii(dataObjectInstance.dataName());
        //获取对象介绍
        data.introduction = dataObjectInstance.introduction();
        //获取对象类型
        data.types = [];
        for (var j = 0; j < dataObjectInstance.typeNum().toNumber(); j++) {
          //循环添加类型
          var type = [];
          type.key = web3.toAscii(dataObjectInstance.dataTypes(j)[0]);
          type.value = web3.toAscii(dataObjectInstance.dataTypes(j)[1]);
          data.types.push(type);
        }
        $scope.dataSets.push(data);
      }
    };
  });
