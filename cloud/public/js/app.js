'use strict';

/* App Module */

var AV_APP_ID = "sw6jt1f8ew75wazc2gjt6koyzgw66m0taex87gl8fq7mkv4w";
var AV_APP_KEY = "wdxls3vts2p3xlm7qv19wy48ietmxqf4md5f6wrzj3cpvlaj";

var JMSApp = angular.module('JMSApp', ['ui.bootstrap',
  'ngRoute',
  'duScroll',
  'angularFileUpload',
  'uiGmapgoogle-maps'
]);

JMSApp.config(function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/landing',
  }).
  when('/dashboard', {
    templateUrl: 'partials/dashboard',
  }).
  when('/term', {
    templateUrl: 'partials/term',
  }).
  when('/home', {
    templateUrl: 'partials/home',
  }).
  when('/service', {
    templateUrl: 'partials/service'
  }).
  when('/cruise', {
    templateUrl: 'partials/cruise',
  }).
  when('/gallery', {
    templateUrl: 'partials/gallery'
  }).
  when('/about', {
    templateUrl: 'partials/about',
  }).
  when('/contact', {
    templateUrl: 'partials/contact',
  }).
  when('/wedding', {
    templateUrl: 'partials/wedding',
  }).
  when('/business', {
    templateUrl: 'partials/business',
  }).
  when('/casual', {
    templateUrl: 'partials/casual',
  }).
  when('/fishing', {
    templateUrl: 'partials/fishing',
  }).
  otherwise({
    redirectTo: '/home'
  });

  $locationProvider.html5Mode(true);
  //For JS SDK
  AV.useAVCloudUS();
  // AV.serverURL = "https://avoscloud.us";
  AV.initialize(AV_APP_ID, AV_APP_KEY);
  //For REST API, which is not in use atm
  $httpProvider.defaults.headers.common = {
    'Content-Type': 'application/json',
    'X-AVOSCloud-Application-Id': AV_APP_ID,
    'X-AVOSCloud-Application-Key': AV_APP_KEY
  }
});