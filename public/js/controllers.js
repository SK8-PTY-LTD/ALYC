var app = angular.module('JMSCruise', []);

app.controller('cruiseListCtrl', function($scope) {

});


app.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.controller('addBoatCtrl', function($scope) {
    $scope.cruise = new JMS.Cruise();

    $scope.uploadFile = function() {
        //Get and create file
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var avFile = new AV.File("coverImage.jpg", file);
        //Save file
        avFile.save().then(function() {
            //if successful
            alert("Cover image saved.");
            $scope.$apply(function() {
                $scope.cruise.coverImage = avFile;
            });
            // The file has been saved to AV.
        }, function(error) {
            alert("Oh F**k, error: " + error.message);
            // The file either could not be read, or could not be saved to AV.
        });
    };

    $scope.uploadPortfiloFile = function() {
        //Get and create file
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var avFile = new AV.File("portfiloImage.jpg", file);
        //Save file
        avFile.save().then(function() {
            //if successful
            alert("Portfilo image saved.");
            $scope.$apply(function() {
                $scope.cruise.add("imageArray", avFile);
                $scope.cruise.save();
            });
            // The file has been saved to AV.
        }, function(error) {
            alert("Oh F**k, error: " + error.message);
            // The file either could not be read, or could not be saved to AV.
            file.val(null);
        });
    };

    $scope.delete = function(avFile) {
        $scope.cruise.remove("imageArray", avFile);
        $scope.cruise.save();
    }
});

app.controller('FirstClassCtrl', function($scope) {
    //Get first class category
    var category = new JMS.Category({
        id: '54fd999be4b0447de160ab23'
    });
    //Get all cruises, and select the first class only
    var query = new AV.Query(JMS.Cruise);
    query.equalTo("category", category);
    //Download the list of cruises
    query.find({
        success: function(results) {
            $scope.$apply(function() {
                $scope.cruiseList = results;
            });
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
});

app.controller('BusinessClassCtrl', function($scope) {
    //Get first class category
    var category = new JMS.Category({
        id: '54fd99a7e4b0447de160abb6'
    });
    //Get all cruises, and select the first class only
    var query = new AV.Query(JMS.Cruise);
    query.equalTo("category", category);
    //Download the list of cruises
    query.find({
        success: function(results) {
            $scope.cruiseList = results;
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
});

app.controller('EconomyClassCtrl', function($scope) {
    //Get first class category
    var category = new JMS.Category({
        id: '54fd9a10e4b0447de160b259'
    });
    //Get all cruises, and select the first class only
    var query = new AV.Query(JMS.Cruise);
    query.equalTo("category", category);
    //Download the list of cruises
    query.find({
        success: function(results) {
            $scope.cruiseList = results;
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
});

app.controller('FishingClassCtrl', function($scope) {
    //Get first class category
    var category = new JMS.Category({
        id: '54fd9a21e4b0447de160b36a'
    });
    //Get all cruises, and select the first class only
    var query = new AV.Query(JMS.Cruise);
    query.equalTo("category", category);
    //Download the list of cruises
    query.find({
        success: function(results) {
            $scope.cruiseList = results;
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
});