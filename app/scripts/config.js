'use strict';
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
/**
 * Created by su on 2017/5/14.
 */
/**
 * 管理合约
 * 功能：负责对数据和权限总体的控制
 * 包含直接访问变量：无
 * 包含函数如下：
 * registerUser(bytes32 userName) —— 创建用户，返回是否成功(bool)
 * isUserNameExist(bytes32 userName) —— 返回用户名是否存在(bool)
 * getUserNameByAddress(address adr) —— 根据用户地址返回用户名(bytes32)
 * getUserAddressByName(bytes32 userName) —— 根据用户名返回用户地址(address)
 * createData(bytes32 daNa, string intro) —— 根据用户名和介绍创建数据，返回数据对象地址(address)
 * isDataNameExist(bytes32 daNa) —— 根据数据名，返回是否存在(bool)
 * addTypeToData(bytes32 type_level1, bytes32 type_level2, bytes32 dataName) —— 根据类型名，类型值和数据名称，向数据中添加类型
 * getDataNum() —— 获取数据总数(uint)
 * getDataAddressByIndex(uint index) —— 根据下标获取数据对象地址(address)
 * getDataAddressByDataName(bytes32 dataName) —— 根据数据名称获取数据对象地址(address)
 * getDataNameByIndex(uint index) —— 根据下标获取数据名称(bytes32)
 * getTypeAddressByName(bytes32 type_level1, bytes32 type_level2) —— 根据数据类型名称获取类型地址(address)
 * isTypeExist(bytes32 type_level1, bytes32 type_level2) —— 判断数据类型是否存在(bool)
 * getDataAccessByName(bytes32 dataName) —— 根据数据名称获取权限对象地址(address)
 * getDataNumByProvider(address provider) —— 根据提供者地址返回该提供者提供的数据量(uint)
 * getProvideDataNameByIndex(address provider, uint index) —— 根据提供者地址和下标返回对应数据名称(bytes32)
 * getDataNumByRequester(address requester) —— 根据请求者地址，获取请求者请求的数据量(uint)
 * getRequestDataNameByIndex(address requester, uint index) —— 根据请求者地址和下标，获取请求的数据名称(bytes32)
 * requestData(bytes32 dataName) —— 根据数据名称对数据发起请求，返回是否成功(bool)
 * rejectData(bytes32 dataName, address requester) —— 根据地址和数据名称，拒绝数据请求
 * confirmData(bytes32 dataName, address requester) —— 根据地址和数据名称，确认数据请求
 *
 */
var contractAddress = "0x164ba96BA1ead8714b9cFEB89784ee5C8340d2d0";
var abi = [{
    "constant": false,
    "inputs": [{"name": "adr", "type": "address"}],
    "name": "getUserNameByAddress",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "adr", "type": "address"}],
    "name": "isUserAddressExist",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "userName", "type": "bytes32"}],
    "name": "registerUser",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "type_level1", "type": "bytes32"}, {
        "name": "type_level2",
        "type": "bytes32"
    }, {"name": "dataName", "type": "bytes32"}],
    "name": "addTypeToData",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "requester", "type": "address"}, {"name": "index", "type": "uint256"}],
    "name": "getRequestDataNameByIndex",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}],
    "name": "requestData",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "requester", "type": "address"}],
    "name": "getDataNumByRequester",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "type_level1", "type": "bytes32"}, {"name": "type_level2", "type": "bytes32"}],
    "name": "getTypeAddressByName",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "daNa", "type": "bytes32"}],
    "name": "isDataNameExist",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "index", "type": "uint256"}],
    "name": "getDataNameByIndex",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}, {"name": "requester", "type": "address"}],
    "name": "rejectData",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "userName", "type": "bytes32"}],
    "name": "isUserNameExist",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "getDataNum",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}],
    "name": "getDataAddressByDataName",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "type_level1", "type": "bytes32"}, {"name": "type_level2", "type": "bytes32"}],
    "name": "isTypeExist",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}],
    "name": "getDataAccessByName",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}, {"name": "requester", "type": "address"}],
    "name": "confirmData",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "provider", "type": "address"}, {"name": "index", "type": "uint256"}],
    "name": "getProvideDataNameByIndex",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "userName", "type": "bytes32"}],
    "name": "getUserAddressByName",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "provider", "type": "address"}],
    "name": "getDataNumByProvider",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "index", "type": "uint256"}],
    "name": "getDataAddressByIndex",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "daNa", "type": "bytes32"}, {"name": "intro", "type": "string"}],
    "name": "createData",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {"inputs": [], "payable": false, "type": "constructor"}];

/**
 * 数据对象合约
 * 功能：获取数据详细信息
 * 可访问变量：
 * dataTypes[] —— 根据下标返回类型结构体json对象{bytes32 type_level1,bytes32 type_level2,address type_address}
 * typeNum —— 返回类型数量(uint)
 * dataName —— 数据名称(bytes32)
 * introduction —— 数据介绍(string)
 * provider —— 数据提供者地址(address)
 */
var abiDataObject = [{
    "constant": true,
    "inputs": [],
    "name": "provider",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "dataName",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "typeNum",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "dataTypes",
    "outputs": [{"name": "type_level1", "type": "bytes32"}, {
        "name": "type_level2",
        "type": "bytes32"
    }, {"name": "type_address", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "t1", "type": "bytes32"}, {"name": "t2", "type": "bytes32"}, {
        "name": "td",
        "type": "address"
    }],
    "name": "setDataType",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "introduction",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "type": "function"
}, {
    "inputs": [{"name": "daNa", "type": "bytes32"}, {"name": "intro", "type": "string"}, {
        "name": "pro",
        "type": "address"
    }, {"name": "dAuth", "type": "address"}], "payable": false, "type": "constructor"
}];

/**
 * 类型对象合约
 * 功能：记录各个类型拥有的数据地址，可提供根据类型进行快速检索
 * 可访问变量：
 * typeName —— 类型名称(bytes32)
 * dataSets[] —— 数据地址集合(address)
 * dataNum —— 数据总数(uint)
 */
var abiTypeObject = [{
    "constant": true,
    "inputs": [],
    "name": "dataNum",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "dataSets",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataSet", "type": "address"}],
    "name": "addDataSet",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "typeName",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {"inputs": [{"name": "tyNa", "type": "bytes32"}], "payable": false, "type": "constructor"}];

/**
 * 权限对象合约
 * 功能：负责记录对应数据对象的权限控制信息
 * 可访问变量：
 * accessList(address=>accessType) —— 根据请求者地址返回权限类型
 * requesterList[] —— 根据下标获取请求者地址
 * requesterNum —— 返回请求者数量
 * provider —— 返回数据提供者地址
 *
 * 可调用函数：
 * isRequestExist(address requester) —— 返回请求者是否请求过该数据(bool)
 * isRequestConfirm(address requester) —— 返回是否确认对应请求者的数据请求(bool)
 * isRequestReject(address requester) —— 返回是否拒绝对应请求者的数据请求(bool)
 */
var abiAccessObject = [{
    "constant": true,
    "inputs": [],
    "name": "provider",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "requesterNum",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "requester", "type": "address"}],
    "name": "isRequestExist",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "requester", "type": "address"}],
    "name": "isRequestReject",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}],
    "name": "accessList",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "requester", "type": "address"}],
    "name": "isRequestConfirm",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "requester", "type": "address"}],
    "name": "confirmRequest",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "requester", "type": "address"}],
    "name": "rejectRequest",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "requesterList",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "requester", "type": "address"}],
    "name": "addRequest",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "type": "function"
}, {
    "inputs": [{"name": "pro", "type": "address"}, {"name": "dataM", "type": "address"}],
    "payable": false,
    "type": "constructor"
}];

//获取管理合约
var contract = web3.eth.contract(abi);
var contractInstance = contract.at(contractAddress);
var dataContract = web3.eth.contract(abiDataObject);
var typeContract = web3.eth.contract(abiTypeObject);
var accessContract = web3.eth.contract(abiAccessObject);

//设置权限数组
var accessType = ["Init", "Pending", "Reject", "Confirm"];
angular
  .module('uiRouterApp', [
    'ui.router',
    'mainrouter',
    'directiveModule'
  ])
  .config(function ($urlRouterProvider) {
    $urlRouterProvider.when("/", "app");
    $urlRouterProvider.otherwise('app');
  })
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode({
      enabled: false, // true隐藏# false显示#
      requireBase: false
    })
  }])
