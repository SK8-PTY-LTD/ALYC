'use strict';

/* App Module */

var AV_APP_ID = "9bzfvch6oauso7mhu5n3wo8p5vnk8xd2pbl8hiohqg08ib4w";
var AV_APP_KEY = "xmkls6i71a6733tow806dze8v5arzi6levnb2sjmbt98v80n";

var JMSApp = angular.module('JMSApp', 
  ['ui.bootstrap', 
  'ngRoute', 
  'duScroll', 
  'angularFileUpload']);

JMSApp.config(function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/partial1',
  }).
  when('/dashboard', {
    templateUrl: 'partials/dashboard',
  }).
  when('/term', {
    templateUrl: 'partials/term',
  }).
  when('/cn/home', {
    templateUrl: 'partials/home',
  }).
  when('/cn/service', {
    templateUrl: 'partials/service'
  }).
  when('/cn/cruise', {
    templateUrl: 'partials/cruise',
  }).
  when('/cn/gallery', {
    templateUrl: 'partials/gallery'
  }).
  when('/cn/about', {
    templateUrl: 'partials/about',
  }).
  when('/cn/contact', {
    templateUrl: 'partials/contact',
  }).
  when('/cn/wedding', {
    templateUrl: 'partials/wedding',
  }).
  when('/cn/business', {
    templateUrl: 'partials/business',
  }).
  when('/cn/casual', {
    templateUrl: 'partials/casual',
  }).
  when('/cn/fishing', {
    templateUrl: 'partials/fishing',
  }).
  otherwise({
    redirectTo: '/cn/home'
  });

  $locationProvider.html5Mode(true);
  //For JS SDK
  AV.initialize(AV_APP_ID, AV_APP_KEY);
  //For REST API, which is not in use atm
  $httpProvider.defaults.headers.common = {
    'Content-Type': 'application/json',
    'X-AVOSCloud-Application-Id': AV_APP_ID,
    'X-AVOSCloud-Application-Key': AV_APP_KEY
  }
});