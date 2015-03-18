'use strict';
/* Controllers */
JMSApp.controller('AppCtrl', function($scope, $http) {

});
JMSApp.controller("NavCtrl", function($scope, $rootScope, $modal, $location) {
  $rootScope.currentUser = JMS.User.current();
  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };
  $scope.login = function() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_login',
      controller: 'LoginCtrl',
      scope: $scope,
      size: "sm"
    });
    modalInstance.result.then(function(user) {
      if (user != undefined) {
        $rootScope.currentUser = user;
      }
    });
  };
  $scope.logOut = function() {
    JMS.User.logOut();
    // Do stuff after successful login.
    $rootScope.currentUser = new JMS.User();
  }
  $scope.openWeChat = function() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/wechat',
      controller: 'LoginCtrl',
      scope: $scope,
      size: "sm"
    });
    modalInstance.result.then(function(user) {
      if (user != undefined) {
        $rootScope.currentUser = user;
      }
    });
  }
});
JMSApp.controller('LoginCtrl', function($scope, $modalInstance) {
  $scope.close = function() {
    $scope.isLoading = false;
    $scope.promote = undefined;
    $modalInstance.close();
  }
  $scope.logIn = function() {
    $scope.isLoading = true;
    $scope.promote = "Logging in";
    JMS.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
      success: function(user) {
        // Do stuff after successful login.
        $scope.isLoading = false;
        $modalInstance.close(user);
      },
      error: function(user, error) {
        $scope.isLoading = false;
        alert("Login failed " + error.message);
        // The login failed. Check error to see why.
      }
    });
  }
  $scope.resetPassword = function() {
    $scope.isLoading = true;
    $scope.promote = "Requesting password";
    AV.User.requestPasswordReset($scope.currentUser.username, {
      success: function() {
        $scope.isLoading = false;
        $modalInstance.close();
      },
      error: function(error) {
        $scope.isLoading = false;
        alert("Reset failed " + error.message);
      }
    });
  }
});
JMSApp.controller("DashboardCtrl", function($scope, $location) {
  $scope.$watch('currentUser', function(newVal, oldVal) {
    if ($scope.currentShop != undefined) {
      $scope.authorize($scope.currentUser);
    }
  }, true);
  $scope.authorize = function(user) {
    if (user == undefined ) {
      //Authorization failed, redirect.
      $location.path('/');
      $location.replace();
      alert("It seems that you can't access this page. Taking you to home page instead.");
      return false;
    }
    if (!user.isAdminUser) {
      //Authorization failed, redirect.
      $location.path('/');
      $location.replace();
      alert("It seems that you can't access this page. Taking you to home page instead.");
      return false;
    } else {
      console.log($scope.currentUser.profileName + " authorized to access dashboard");
      return true;
    }
  }
  $scope.changeTab = function(tab) {
    $scope.view_tab = tab;
  }
  $scope.authorize($scope.currentUser);
});
JMSApp.controller("CategoryCtrl", function($scope) {
    var query = new AV.Query(JMS.Category);
    query.find({
      success: function(categories) {
        $scope.$apply(function() {
          $scope.categories = categories;
        });
      }
    });
});
JMSApp.controller("CruiseCtrl", function($scope, $modal) {
  $scope.reloadCruise = function(category) {
    var query = new AV.Query(JMS.Cruise);
    query.equalTo("category", category);
    query.include("imageArray");
    query.find({
      success: function(results) {
        $scope.cruises = results;
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }
  $scope.newCruise = function() {
    var cruise = new JMS.Cruise();
    cruise.imageArray = [];
    cruise.price = 0
    cruise.agentPrice = 0
    cruise.category = $scope.category;
    $scope.editCruise(cruise);
  }
  $scope.editCruise = function(cruise) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_cruise',
      controller: 'NewCruiseController',
      size: 'lg',
      resolve: {
        cruise: function() {
          return cruise;
        }
      }
    });
    modalInstance.result.then(function() {
      $scope.reloadCruise($scope.category);
    });
  }
  $scope.$watch('category', function(newVal, oldVal) {
    if ($scope.category != undefined) {
      $scope.reloadCruise($scope.category);
    }
  }, true);
  if ($scope.category != undefined) {
    $scope.reloadCruise($scope.category);
  }
});
JMSApp.controller("NewCruiseController", function($scope, $modalInstance, cruise) {
  $scope.close = function() {
    $scope.isLoading = false;
    $scope.promote = undefined;
    $modalInstance.close();
  }
  $scope.cruise = cruise;

  $scope.uploadCoverImage = function(files) {
    var file = files[0];
    if (file) {
      var type = file.type;
      if (type.indexOf('image/') !== 0) {
        alert("Cover image needs to be an image!");
        return;
      }
      $scope.isLoading = true;
      $scope.promote = "Uploading cover image";
      //Delete old cover image
      if (cruise.coverImage != undefined) {
        cruise.coverImage.destroy();
      }
      //Upload file
      var name = "coverImage.jpg";
      var avFile = new AV.File(name, file);
      avFile.save().then(function() {
        cruise.coverImage = avFile;
        $scope.$apply(function() {
          $scope.isLoading = false;
          $scope.promote = undefined;
        });
      }, function(error) {
        $scope.$apply(function() {
          $scope.isLoading = false;
          $scope.promote = undefined;
        });
      });
    }
  };

  $scope.deleteImageFile = function(imageFile) {
    cruise.remove("imageArray", imageFile);
    imageFile.destroy();
  };

  $scope.uploadCruiseImage = function(files) {
    var file = files[0];
    if (file) {
      $scope.isUploading = true;
      var type = file.type;
      if (type.indexOf('image/') !== 0) {
        alert("Image needs to be an image!");
        return;
      }
      //Upload file
      var name = "cruiseImage.jpg";
      var avFile = new AV.File(name, file);
      avFile.save().then(function() {
        var file = new AV.File();
        file.id = avFile.id;
        file._url = avFile._url;
        cruise.addUnique("imageArray", file);
        $scope.$apply(function() {
          $scope.isUploading = false;
        });
      });
    }
  };

  $scope.save = function() {
    cruise.save(null, {
      success: function(cruise) {
        // Execute any logic that should take place after the object is saved.
        alert(cruise.name + "had been added, good luck sailing!");
        $modalInstance.close();
      },
      error: function(cruise, error) {
        // Execute any logic that should take place if the save fails.
        // error is a AV.Error with an error code and description.
        alert("Failed to add " + cruise.name + ". Error: " + error.message);
      }
    });
  }

  $scope.delete = function() {
    var array = cruise.imageArray;
    for (var i = 0; i < array.length; i++) {
      var file = array[i];
      if (file != undefined) {
        file.destroy();
      }
    }
    if (cruise.coverImage) {
      cruise.coverImage.destroy();
    }
    cruise.destroy();
    $modalInstance.close();
    alert("Cruise had been deleted. It will disappear upon page refresh.");
  }

});