'use strict';

/**
 * @ngdoc overview
 * @name uiRouterApp
 * @description
 * # uiRouterApp
 *
 * Main module of the application.
 */
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
