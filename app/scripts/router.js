'use strict';
angular.module('mainrouter', [
    'ctrlModule',
    'accounts',
    'datamanagements',
    'datamanagementstask',
    'provide',
    'provideTask',
    'request',
    'requestTask',
    'searches',
    'searchTask',
    'login',
    'config',
    'task',
    'data',
    'registerModule'
])
    .config(function ($stateProvider) {
        $stateProvider
            .state("app", {
                url: "/app",
                templateUrl: "views/blockchain/Admin.html",
                controller: 'accounts'
            })
            .state('app.home', {
                url: '/home',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/home.html',
                        controller: 'config'
                    }
                }
            })
            .state('app.accountsList', {
                url: '/accountsList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/accountsList.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app.chargeAccount', {
                url: '/chargeAccount',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/chargeAccount.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app.creatAccount', {
                url: '/creatAccount',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/createAccount.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app.getBalance', {
                url: '/getBalance',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/getBalance.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app.registerAccounts', {
                url: '/registerAccounts',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/registerAccounts.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app.registerAccountsList', {
                url: '/registerAccountsList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/registerAccountsList.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app.personalDataList', {
                url: '/personalDataList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/datamanagements/personalDataList.html',
                        controller: 'personalData'
                    }
                }
            })
            .state('app.personalTaskList', {
                url: '/personalTaskList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/datamanagements/personalTaskList.html',
                        controller: 'personalTask'
                    }
                }
            })
            .state('app.personalDataControl', {
                url: '/personalDataControl',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/datamanagements/provideDataControl.html',
                        controller: 'provideCtrl'
                    }
                }
            })
            .state('app.personalTaskControl', {
                url: '/personalTaskControl',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/datamanagements/provideTaskControl.html',
                        controller: 'provideCtrlTask'
                    }
                }
            })
            .state('app.provideData', {
                url: '/provideData',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/provides/provideData.html',
                        controller: 'provide'
                    }
                }
            })
            .state('app.provideTask', {
                url: '/provideTask',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/provides/provideTask.html',
                        controller: 'provideTask'
                    }
                }
            })

            .state('app.provideDataList', {
                url: '/provideDataList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/provides/provideDataList.html',
                        controller: 'provide'
                    }
                }
            })
            .state('app.provideTaskList', {
                url: '/provideTaskList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/provides/provideTaskList.html',
                        controller: 'provideTask'
                    }
                }
            })
            .state('app.requestData', {
                url: '/requestData',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/requests/requestData.html',
                        controller: 'request'
                    }
                }
            })
            .state('app.requestTask', {
                url: '/requestTask',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/requests/requestTask.html',
                        controller: 'requestTask'
                    }
                }
            })
            .state('app.requestDataList', {
                url: '/requestDataList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/requests/requestDataList.html',
                        controller: 'request'
                    }
                }
            })
            .state('app.requestTaskList', {
                url: '/requestTaskList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/requests/requestTaskList.html',
                        controller: 'requestTask'
                    }
                }
            })
            .state('app.searchData', {
                url: '/searchData',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/searches/searchData.html',
                        controller: 'search'
                    }
                }
            })
            .state('app.searchTask', {
                url: '/searchTask',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/searches/searchtask.html',
                        controller: 'searchTask'
                    }
                }
            })
            .state('app.dataList', {
                url: '/data',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/searches/DataList.html',
                        controller: 'data'
                    }
                }
            })
            .state('app.taskList', {
                url: '/taskList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/searches/taskList.html',
                        controller: 'task'
                    }
                }
            })
            // .state("login", {
            //     url: "/login",
            //     templateUrl: "views/user/login.html",
            //     controller: 'login'
            // })
            .state("app2", {
                url: "/app",
                templateUrl: "views/blockchain/login_reg.html",
                controller: 'accounts'
            })
            .state('app2.login', {
                url: '/login',
                views: {
                    "content": {
                        templateUrl: 'views/user/login.html',
                        controller: 'login'
                    }
                }
            })
            .state('app2.register', {
                url: '/register',
                views: {
                    "content": {
                        templateUrl: 'views/user/register.html',
                        controller: 'register'
                    }
                }
            })



            .state("app1", {
                url: "/app",
                templateUrl: "views/blockchain/user.html",
                controller: 'accounts'
            })
            .state('app1.home', {
                url: '/home',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/home.html',
                        controller: 'config'
                    }
                }
            })
            .state('app1.accountsList', {
                url: '/accountsList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/accountsList.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app1.chargeAccount', {
                url: '/chargeAccount',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/chargeAccount.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app1.creatAccount', {
                url: '/creatAccount',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/createAccount.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app1.getBalance', {
                url: '/getBalance',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/getBalance.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app1.registerAccounts', {
                url: '/registerAccounts',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/registerAccounts.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app1.registerAccountsList', {
                url: '/registerAccountsList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/accounts/registerAccountsList.html',
                        controller: 'accounts'
                    }
                }
            })
            .state('app1.personalDataList', {
                url: '/personalDataList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/datamanagements/personalDataList.html',
                        controller: 'personalData'
                    }
                }
            })
            .state('app1.personalTaskList', {
                url: '/personalTaskList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/datamanagements/personalTaskList.html',
                        controller: 'personalTask'
                    }
                }
            })
            .state('app1.personalDataControl', {
                url: '/personalDataControl',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/datamanagements/provideDataControl.html',
                        controller: 'provideCtrl'
                    }
                }
            })
            .state('app1.personalTaskControl', {
                url: '/personalTaskControl',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/datamanagements/provideTaskControl.html',
                        controller: 'provideCtrlTask'
                    }
                }
            })
            .state('app1.provideData', {
                url: '/provideData',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/provides/provideData.html',
                        controller: 'provide'
                    }
                }
            })
            .state('app1.provideTask', {
                url: '/provideTask',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/provides/provideTask.html',
                        controller: 'provideTask'
                    }
                }
            })

            .state('app1.provideDataList', {
                url: '/provideDataList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/provides/provideDataList.html',
                        controller: 'provide'
                    }
                }
            })
            .state('app1.provideTaskList', {
                url: '/provideTaskList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/provides/provideTaskList.html',
                        controller: 'provideTask'
                    }
                }
            })
            .state('app1.requestData', {
                url: '/requestData',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/requests/requestData.html',
                        controller: 'request'
                    }
                }
            })
            .state('app1.requestTask', {
                url: '/requestTask',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/requests/requestTask.html',
                        controller: 'requestTask'
                    }
                }
            })
            .state('app1.requestDataList', {
                url: '/requestDataList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/requests/requestDataList.html',
                        controller: 'request'
                    }
                }
            })
            .state('app1.requestTaskList', {
                url: '/requestTaskList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/requests/requestTaskList.html',
                        controller: 'requestTask'
                    }
                }
            })
            .state('app1.searchData', {
                url: '/searchData',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/searches/searchData.html',
                        controller: 'search'
                    }
                }
            })
            .state('app1.searchTask', {
                url: '/searchTask',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/searches/searchtask.html',
                        controller: 'searchTask'
                    }
                }
            })
            .state('app1.dataList', {
                url: '/data',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/searches/DataList.html',
                        controller: 'data'
                    }
                }
            })
            .state('app1.taskList', {
                url: '/taskList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/searches/taskList.html',
                        controller: 'task'
                    }
                }
            })
            .state('app1.login', {
                url: '/login',
                views: {
                    "content": {
                        templateUrl: 'views/user/login.html',
                        controller: 'login'
                    }
                }
            })
            .state('app1.register', {
                url: '/register',
                views: {
                    "content": {
                        templateUrl: 'views/user/register.html',
                        controller: 'register'
                    }
                }
            });





    });
