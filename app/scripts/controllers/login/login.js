angular.module('login',[])
.controller('login',function($scope){
    $scope.User=function (){
       $scope.toggle=true;
    }
    $scope.Administrator=function (){
       $scope.toggle=false;
    }






})
