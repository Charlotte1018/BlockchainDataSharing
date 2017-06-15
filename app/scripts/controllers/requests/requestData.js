angular.module("request", []).controller("requestData", function ($scope) {
  $scope.updateDisabled = true;
  $scope.information = "";

  /**
   * 页面加载完后自动显示第一个用户名
   */
  $scope.$watch('$viewContentLoaded', function () {
  });

  /**
   * 请求数据
   */
  $scope.requestData = function (dataName, requester, password, requestT, information) {
    if (!dataName || !requester || !password || !requestT || !information) {
      alert("请完备信息！");
      return;
    }
    if (!isNameLengthLegal(dataName) || !isNameLengthLegal(requestT)) {
      alert("数据名和请求密码不能为空或者大于32字符！");
      return;
    }
    //解锁账户
    if (!unlockEtherAccount(requester, password)) {
      return;
    }
    if (requestData(dataName, requester, password, requestT, information)) {
      alert("请求成功！");
      return;
    }
    alert("请求失败！");
  };

  /**
   * 获取对应请求者请求数据列表
   */
  $scope.getRequestList = function (requester) {
    if (!isAddress(requester)) {
      return;
    }
    $scope.dataSet = getRequestDataList(requester);
  };

  /**
   * 更新请求备注
   */
  $scope.updateInfo = function () {
    if (!$scope.dataName || !$scope.information) {
      alert("请输入数据名称或备注");
      return;
    }
    if (!$scope.isDataExist()) {
      alert("数据名称不存在");
      return;
    }
    //解锁账户
    if (!unlockEtherAccount(getUserAddressByName($scope.selectedAccount), $scope.password)) return;

    //发送修改请求
    try {
      contractInstance.changeDataRequestInfo($scope.dataName, $scope.information, {
        from: getUserAddressByName($scope.selectedAccount),
        gas: 80000000
      });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 判断更新备注是否合法
   */
  $scope.isUpdateLegal = function () {
    //判断数据是否存在
    if (!$scope.dataName || !$scope.isDataExist()) {
      $scope.updateDisabled = true;
      $scope.nameError = "数据不存在";
      return;
    }
    $scope.nameError = "";
    //判断输入的请求备注是否合法
    if (!$scope.information) {
      $scope.updateDisabled = true;
      $scope.infoError = "请输入备注";
      return;
    }
    $scope.infoError = "";

    //判断数据是否已经被确认或者拒绝
    if (isDataAudited($scope.dataName, getUserAddressByName($scope.selectedAccount))) {
      $scope.infoError = "该数据已被审核，无法修改！";
      $scope.updateDisabled = true;
      return;

    }
    $scope.infoError = "";
    $scope.updateDisabled = false;
  };
});

/**
 * 请求数据
 * @param dataName
 * @param requester
 * @param password
 * @param requestT
 * @param information
 * @returns {boolean}
 */
function requestData(dataName, requester, password, requestT, information) {
  if (!isRequestDataNameLegal(dataName, requester)) {
    return false;
  }
  try {
    //解锁账户
    if (!unlockEtherAccount(requester, password)) {
      return false;
    }
    //发送请求
    contractInstance.requestData(formatBytes(dataName), formatBytes(requestT), information, {
      from: requester,
      gas: 80000000
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

/**
 * 返回请求的数据名称是否合法
 * @param dataName
 * @param requester
 * @returns {boolean}
 */
function isRequestDataNameLegal(dataName, requester) {
  if (!dataName || !isAddress(requester)) {
    alert("数据名称与请求者地址不能为空！");
    return false;
  }
  if (!isDataNameExist(dataName)) {
    alert("该数据不存在！");
    return false;
  }
  if (isRequested(dataName, requester)) {
    alert("该数据已经被该账户请求！");
    return false;
  }
  //判断是否与数据名称相同
  var data = searchDataByName(dataName);
  if (getUserAddressByName(data.provider) == requester) {
    alert("不能申请自己提供的数据！");
    return false;
  }
  return true;
}

/**
 * 根据请求者返回数据列表
 * @param requster
 * @returns {Array}
 */
function getRequestDataList(requester) {
  var dataSet = [];
  try {
    //获取请求数据数量
    var requestDataNum = contractInstance.getDataNumByRequester.call(requester).toNumber();
    for (var i = 0; i < requestDataNum; i++) {
      //获取数据名称
      var data = [];
      data.dataName = web3.toAscii(contractInstance.getRequestDataNameByIndex.call(requester, i));
      data = getRequestDataByName(data.dataName, requester);
      //存入数据
      dataSet.push(data);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return dataSet;
}

/**
 * 根据数据名称获取请求数据信息及状态
 * @param dataName
 * @returns {Array}
 */
function getRequestDataByName(dataName, requester) {
  var data = [];
  try {
    //获取数据基本信息
    data = searchDataByName(dataName);
    //获取对应名称的权限合约
    var accessContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(dataName));
    //获取当前状态
    data.status = accessType[accessContractInstance.accessList(accessContractInstance.requestList(requester))];
    //如果没有请求过，返回空
    if (data.status == accessType[0]) {
      return [];
    }
    //获取当前请求备注信息
    var requestContractInstance = requestContract.at(contractInstance.getDataRequest.call(dataName, requester));
    data.information = requestContractInstance.information();
  } catch (err) {
    console.log(err);
    return [];
  }
  return data;
}

/**
 * 返回是否已经请求过该数据
 * @param dataName
 * @param requester
 * @returns {boolean}
 */
function isRequested(dataName, requester) {
  var data = getRequestDataByName(dataName, requester);
  if (data) {
    //判断是否已经审核
    return (data.status == accessType[1] || data.status == accessType[2] || data.status == accessType[3]);
  }
  return false;
}

/**
 * 返回对应数据是否已经被确认或者拒绝
 * @param dataName
 * @param requester
 * @returns {boolean}
 */
function isDataAudited(dataName, requester) {
  var data = getRequestDataByName(dataName, requester);
  if (data) {
    //判断是否已经审核
    return (data.status == accessType[2] || data.status == accessType[3]);
  }
  return false;
}

/**
 * 更新请求备注
 * @param dataName
 * @param requester
 * @param password
 * @param information
 * @returns {boolean}
 */
function updateInformation(dataName, requester, password, information){
  return true;
}
