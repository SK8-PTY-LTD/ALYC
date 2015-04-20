'use strict';

/* App Module */

var AV_APP_ID = "9bzfvch6oauso7mhu5n3wo8p5vnk8xd2pbl8hiohqg08ib4w";
var AV_APP_KEY = "xmkls6i71a6733tow806dze8v5arzi6levnb2sjmbt98v80n";

var JMSApp = angular.module('JMSApp', 
  ['ui.bootstrap', 
  'ngRoute', 
  'duScroll', 
  'angularFileUpload',
  'uiGmapgoogle-maps']);

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
  AV.initialize(AV_APP_ID, AV_APP_KEY);
  //For REST API, which is not in use atm
  $httpProvider.defaults.headers.common = {
    'Content-Type': 'application/json',
    'X-AVOSCloud-Application-Id': AV_APP_ID,
    'X-AVOSCloud-Application-Key': AV_APP_KEY
  }
});