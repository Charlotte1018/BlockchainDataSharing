'use strict';
angular.module('mainrouter', [
    'ctrlModule',
    'accounts',
    'datamanagements',
    'provide',
    'request',
    'searches',
    'login',
    'data'
])
    .config(function ($stateProvider) {
        $stateProvider
            .state("app", {
                url: "/app",
                templateUrl: "views/blockchain/main.html",
                controller: 'accounts'
            })
            .state('app.home', {
                url: '/home',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/home.html',
                        controller: 'accounts'
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
            .state('app.personalDataList', {
                url: '/personalDataList',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/datamanagements/personalDataList.html',
                        controller: 'personalData'
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
            .state('app.provideData', {
                url: '/provideData',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/provides/provideData.html',
                        controller: 'provide'
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
            .state('app.requestData', {
                url: '/requestData',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/requests/requestData.html',
                        controller: 'request'
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
            .state('app.search', {
                url: '/search',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/searches/searchData.html',
                        controller: 'search'
                    }
                }
            })
            .state('app.data', {
                url: '/data',
                views: {
                    "content": {
                        templateUrl: 'views/blockchain/searches/DataList.html',
                        controller: 'data'
                    }
                }
            })
            .state('app.login', {
                url: '/login',
                views: {
                    "content": {
                        templateUrl: 'views/user/login.html',
                        controller: 'login'
                    }
                }
            });





    });