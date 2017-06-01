angular.module("accounts", []).controller("accounts", function ($scope) {
    //账户部分初始化
    //初始取出账户
    
    $scope.accounts = web3.eth.accounts;
    //初始账户余额
    if ($scope.accounts != null && $scope.accounts.length > 0) {
        $scope.balance = web3.eth.getBalance($scope.accounts[0]);
        $scope.balance = web3.fromWei($scope.balance, 'ether');
    }

    /**
     * 获取所有账户地址
     * return 所有账户地址数组
     */
    $scope.getAccounts = function () {
        $scope.accounts = web3.eth.accounts;
    }

    /**
     * 创建新账户
     * param  accountPassword-密码
     * return createAccountStatus-是否成功, newAccountAddress-新账户地址
     */
    $scope.createAccount = function () {

        if (web3.personal.newAccount($scope.accountPassword)) {
            $scope.createAccountStatus = "create success";
            $scope.newAccountAddress = web3.eth.accounts[web3.eth.accounts.length - 1];
            alert('Create Success!');
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
        $scope.balance = web3.eth.getBalance($scope.selectedAccount);
        $scope.balance = web3.fromWei($scope.balance, 'ether');
    }

    /**
     * 进行存储交易
     * param selectedAccountFrom-发送方地址, selectedAccountTo-交易方地址, chargeEthers-交易数额, unlockPassword-发送方密码
     * return msg-交易哈希
     */
    $scope.chargeAccount = function () {
        web3.personal.unlockAccount($scope.selectedAccountFrom, $scope.unlockPassword);
        // web3.personal.unlockAccount($scope.selectedAccountFrom,'1');
        $scope.msg = web3.eth.sendTransaction({
            from: $scope.selectedAccountFrom,
            to: $scope.selectedAccountTo,
            value: web3.toWei($scope.chargeEthers)
        });
    };
});

