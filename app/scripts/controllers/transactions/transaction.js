angular.module("transactions", [])
  .controller("transactions", function ($scope) {
    $scope.transAddressTo = web3.eth.accounts[3];
    $scope.transAddressFrom = web3.eth.accounts[0];
    /**
     * 获取所有相关交易
     */
    $scope.getTrans = function () {
      $scope.tranSets = [];
      if (!checkAddressFilled()) {
        alert("请输入正确地址");
        return;
      }
      for (var i = 1; i <= web3.eth.blockNumber; i++) {
        //获取区块所有交易
        var blockTranSets = web3.eth.getBlock(i, true);
        if (blockTranSets && blockTranSets.transactions) {
          //循环查找
          blockTranSets.transactions.forEach(function (trans) {
            if (trans.to == $scope.transAddressTo && trans.from == $scope.transAddressFrom) {
              var tranSet = [];
              tranSet.to = $scope.transAddressTo;
              tranSet.from = $scope.transAddressFrom;
              tranSet.amount = trans.value.toString();
              tranSet.amount = web3.fromWei(tranSet.amount, 'ether');
              tranSet.blockNum = i;
              $scope.tranSets.push(tranSet);
            }
          });
        }
      }

    };

    function checkAddressFilled() {
      if (!$scope.transAddressFrom || !$scope.transAddressTo) {
        return false;
      }
      return true;
    }
  });


