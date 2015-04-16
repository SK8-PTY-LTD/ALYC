'use strict';
/* Controllers */
JMSApp.controller('AppCtrl', function($scope, $http) {});
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
    $rootScope.currentUser = undefined;
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
JMSApp.controller('HomeCtrl', function($scope, $modal) {
  $scope.counter = 0;
  var query = new AV.Query(JMS.Cruise);
  query.equalTo("isOnPromotion", true);
  query.include("imageArray");
  query.find().then(function(results) {
    $scope.$apply(function() {
      console.log(results.length);
      $scope.cruises = results;
    });
  });
  $scope.getCategory = function(c) {
    var category = c.category;
    category.fetch({
      success: function(category) {
    $scope.$notify(function() {
  var name = category.name;
  // $scope.categoryName = "shit";
  console.log("In Controller-> name: " + name);
  $scope.counter++;
  console.log("In Controller-> counter " + $scope.counter);
  return name;
  });
  }});
  }
  $scope.viewCruise = function(cruise) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_cruise.ejs',
      controller: 'ViewCruiseController',
      size: 'lg',
      resolve: {
        cruise: function() {
          return cruise;
        }
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
  $scope.view_tab = 'cruise';
  $scope.$watch('currentUser', function(newVal, oldVal) {
    if ($scope.currentShop != undefined) {
      $scope.authorize($scope.currentUser);
    }
  }, true);
  $scope.authorize = function(user) {
    if (user == undefined) {
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
  query.ascending("createdAt");
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
        $scope.$apply(function() {
          $scope.cruises = results;
        });
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
    cruise.minimumHour = 4;
    $scope.editCruise(cruise);
  }
  $scope.editCruise = function(cruise) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_edit_cruise.ejs',
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
  $scope.viewCruise = function(cruise) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_cruise.ejs',
      controller: 'ViewCruiseController',
      size: 'lg',
      resolve: {
        cruise: function() {
          return cruise;
        }
      }
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
        alert(cruise.name + " had been added, good luck sailing!");
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
JMSApp.controller('ViewCruiseController', function($scope, cruise) {
  $scope.cruise = cruise;
  var slides = $scope.slides = [];
  for (var i = 0; i < cruise.imageArray.length; i++) {
    var avFile = cruise.imageArray[i];
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: avFile.thumbnailURL(360, 240)
    });
  }
  $scope.submit = function() {
    $scope.enquiry.subject = "Cruise Enquiry";
    $scope.enquiry.receiver = "133342301@163.com";
    AV.Cloud.run('sendEmail', $scope.enquiry);
    alert("Thank you for your enquiry. We will get back to you soon!");
  }
});
JMSApp.controller('AdsCtrl', function($scope) {
  var category = new JMS.Category();
  category.id = "54fd999be4b0447de160ab23";
  var query = new AV.Query(JMS.Cruise);
  query.equalTo("category", category);
  query.find().then(function(results) {
    var slides = $scope.slides = [];
    for (var i = 0; i < results.length; i++) {
      var image = results[i].coverImage;
      var newWidth = 600 + slides.length + 1;
      slides.push({
        image: image.url()
      });
    }
  });
});
JMSApp.controller("GalleryCtrl", function($scope) {
  var Photo = AV.Object.extend("Photo");
  var name = "photo.jpg";
  $scope.deleteImageFile = function(photo) {
    photo.get("file").destroy();
    photo.destroy();
    $scope.reloadPhotos();
  };
  $scope.uploadPhoto = function(files) {
    var file = files[0];
    if (file) {
      $scope.isUploading = true;
      var type = file.type;
      if (type.indexOf('image/') !== 0) {
        alert("Image needs to be an image!");
        return;
      }
      //Upload file
      var avFile = new AV.File(name, file);
      avFile.save().then(function() {
        var photo = new Photo();
        photo.set("file", avFile);
        photo.set("name", name);
        photo.save().then(function() {
          $scope.isUploading = false;
          $scope.reloadPhotos();
        });
      });
    }
  };
  $scope.reloadPhotos = function() {
    var query = new AV.Query(Photo);
    query.equalTo("name", name);
    query.include("file");
    query.find().then(function(results) {
      $scope.$apply(function() {
        $scope.photos = results;
      });
    });
  }
  $scope.photos = [];
  $scope.reloadPhotos();
});
JMSApp.controller('ServiceCtrl', function($scope) {
  $scope.services = [{
    name: '婚礼策划'
  }, {
    name: '商业活动'
  }, {
    name: '休闲娱乐'
  }, {
    name: '深海垂钓'
  }];
  $scope.submit = function(service) {
    $scope.enquiry.subject = service + " Enquiry";
    $scope.enquiry.receiver = "133342301@163.com";
    AV.Cloud.run('sendEmail', $scope.enquiry);
    alert("Thank you for your enquiry. We will get back to you soon!");
  }
});