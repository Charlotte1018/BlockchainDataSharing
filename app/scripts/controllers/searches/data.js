angular.module("data", [])
  .controller("data", function ($scope) {
    $scope.dataSets = [];

    //获取数据
    $scope.getDatas = function () {
      $scope.dataSets = [];
      //获取数据数目
      var dataSetNum = contractInstance.getDataNum.call().toNumber();
      //逐个获取数据对象
      for (var i = 0; i < dataSetNum; i++) {
        //获取数据对象合约
        var dataObjectInstance = dataContract.at(contractInstance.getDataAddressByIndex.call(i));
        var dataSet = [];
        //获取对象名称
        dataSet.dataName = web3.toAscii(dataObjectInstance.dataName());
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
        //获取数据提供者
        dataSet.provider = getUserNameByAddress(dataObjectInstance.provider());
        $scope.dataSets.push(dataSet);
      }
    };
  });

/**
 * 判断
 * @param dataName
 * @returns {boolean}
 */
function isDataNameExist(dataName) {
  try {
    if (contractInstance.isDataNameExist.call(dataName)) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return true;
  }
}
