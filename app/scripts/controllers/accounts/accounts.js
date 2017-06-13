angular.module("accounts", []).controller("accounts", function ($scope) {
    //账户部分初始化
    //初始取出账户
    $scope.accounts = web3.eth.accounts;
    $scope.registerAccounts = getRegisterAccounts();
    /**
     * 页面加载完后自动显示第一个用户名
     */
    $scope.$watch('$viewContentLoaded', function () {
        if ($scope.accounts.length > 0) {
            $scope.selectedAccount = $scope.registerAccounts[0].userName;
        }
        //初始账户余额
        if ($scope.registerAccounts != null && $scope.registerAccounts.length > 0) {
            $scope.balance = web3.eth.getBalance(getUserAddressByName($scope.selectedAccount));
            $scope.balance = web3.fromWei($scope.balance, 'ether');
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
        // $scope.selectedAccountFrom = $scope.accounts[0];
        // $scope.selectedAccountTo = $scope.accounts[0];
        console.log('from'+$scope.selectedAccountFrom);
        console.log('to'+$scope.selectedAccountTo);
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
});

