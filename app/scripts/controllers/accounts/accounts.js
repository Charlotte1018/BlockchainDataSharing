"use strict";
angular.module("accounts", []).controller("accounts", function ($scope) {
  //账户部分初始化
  //初始取出账户
  $scope.accounts = web3.eth.accounts;
  $scope.registerAccounts = getRegisterAccounts();
  /**
   * 页面加载完后自动显示第一个用户名
   */
  $scope.$watch('$viewContentLoaded', function () {
    // if ($scope.accounts.length > 0) {
    //     $scope.selectedAccount = $scope.registerAccounts[0].userName;
    // }
    //初始账户余额
    if ($scope.registerAccounts != null && $scope.registerAccounts.length > 0) {
      //$scope.balance = web3.eth.getBalance(getUserAddressByName($scope.selectedAccount));
      //$scope.balance = web3.fromWei($scope.balance, 'ether');
    }
  });


  /**
   * 获取所有账户地址
   * return 所有账户地址数组
   */
  $scope.getAccounts = function () {
    $scope.accounts = web3.eth.accounts;
  };

  $scope.getRegisterAccounts = function () {
    $scope.registerAccounts = getRegisterAccounts();

  };

  /**
   * 创建新账户
   * param  accountPassword-密码
   * return createAccountStatus-是否成功, newAccountAddress-新账户地址
   */
  $scope.createAccount = function () {

    if (web3.personal.newAccount($scope.accountPassword)) {
      $scope.createAccountStatus = "create success";
      $scope.newAccountAddress = web3.eth.accounts[web3.eth.accounts.length - 1];
    } else {
      $scope.createAccountStatus = "create fail";
    }
  }

  /**
   * 获取账户余额
   * param selectedAccount-选中的账户地址
   * return balance-账户余额（单位为以太）
   */
  $scope.getBalance = function () {
    $scope.balance = web3.eth.getBalance(getUserAddressByName($scope.selectedAccount));
    $scope.balance = web3.fromWei($scope.balance, 'ether');
  }

  /**
   * 进行存储交易
   * param selectedAccountFrom-发送方地址, selectedAccountTo-交易方地址, chargeEthers-交易数额, unlockPassword-发送方密码
   * return msg-交易哈希
   */
  $scope.chargeAccount = function () {
    $scope.selectedAccountFrom = $scope.accounts[0];
    $scope.selectedAccountTo = $scope.accounts[0];
    console.log("Charge from " + $scope.selectedAccountFrom + "  to " + $scope.selectedAccountTo);
    web3.personal.unlockAccount($scope.selectedAccountFrom, $scope.unlockPassword);
    $scope.msg = web3.eth.sendTransaction({
      from: $scope.selectedAccountFrom,
      to: $scope.selectedAccountTo,
      value: web3.toWei($scope.chargeEthers)
    });
  };

  /**
   * 进行账户注册
   * param
   */
  $scope.registerAccount = function () {
    //解锁账户
    if (!unlockEtherAccount($scope.selectedAccount, $scope.password)) return;
    //如果用户已经注册，返回
    if (isTheUserAddressRegister($scope.selectedAccount)) {
      alert("用户已注册！");
      return;
    }
    //判断用户名是否合法，若存在则返回
    if (!$scope.isUserNameLegal()) {
      alert("用户姓名不合法");
      return;
    }
    //判断账户是否小于0.1 ether
    if (web3.fromWei(web3.eth.getBalance($scope.selectedAccount), 'ether') < 0.1) {
      alert("余额不足！");
      return;
    }
    //发送注册请求
    try {
      contractInstance.registerUser($scope.userName, {
        from: $scope.selectedAccount,
        gas: 80000000
      });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 判断用户名是否合法，包括是否已经存在及为空
   * @returns {boolean}
   */
  $scope.isUserNameLegal = function () {
    if (contractInstance.isUserNameExist.call($scope.userName)) {
      $scope.nameError = "User name is exist";
      return false;
    }
    else {
      if (!$scope.userName) {
        $scope.nameError = "Please input user name.";
        return false;
      }
    }
    $scope.nameError = "";
    return true;
  };

  /**
   * 单击菜单后进行更新操作
   */
  $scope.clickMenu = function () {
    //获取新权限
    $scope.auth = auth;
  };
});


//账户相关通用函数
/**
 * 获取所有账户
 * @returns {*}
 */
function getAllAccounts() {
  return web3.eth.accounts;
}

/**
 * 解锁账户，成功则返回true，否则返回false
 * @param accountAddress
 * @param password
 */
function unlockEtherAccount(accountAddress, password) {
  //解锁账户
  try {
    web3.personal.unlockAccount(accountAddress, password);
    return true;
  } catch (err) {
    console.log(err);
    alert("You haven't connect to ethereum or the password cannot match the account!");
    return false;
  }
}

/**
 * 判断地址是否合法
 * @param address
 * @returns {Boolean|*}
 */
function isAddress(address) {
  return web3.isAddress(address);
}

/**
 * 获取所有已经注册的用户
 */
function getRegisterAccounts() {
  var allUser = web3.eth.accounts;
  registerAccounts = [];
  //循环判断所有账户名称
  for (var i = 0; i < allUser.length; i++) {
    if (isTheUserAddressRegister(allUser[i])) {
      var account = [];
      account.address = allUser[i];
      account.userName = getUserNameByAddress(account.address);
      registerAccounts.push(account);
    }
  }
  return registerAccounts;
}

/**
 * 根据地址返回用户名
 * @param accountAddress
 * @returns {string}
 */
function getUserNameByAddress(accountAddress) {
  //判断用户是否存在
  if (!isTheUserAddressRegister(accountAddress)) return "";
  //返回用户名
  return web3.toAscii(contractInstance.getUserNameByAddress.call(accountAddress));
}
/**
 * 根据用户名返回地址
 * @param userName
 * @returns {*}
 */
function getUserAddressByName(userName) {
  return contractInstance.getUserAddressByName.call(userName);
}

/**
 * 根据用户地址返回是否已经注册
 * @param address
 * @returns {boolean}
 */
function isTheUserAddressRegister(address) {
  return contractInstance.isUserAddressExist.call(address);
}



