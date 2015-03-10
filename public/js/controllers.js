var app = angular.module('JMSCruise', []);

app.controller('cruiseListCtrl', function($scope) {
    $scope.cruises = [{
        'name': '麥特凱',
        'introduction': '寬闊的甲板空間，流暢的線條，傑出的外觀使其成為一艘極其高貴典雅，超強性能的一艘豪華遊艇.',
        'price': '$200'
    }, {
        'name': '靈魂號',
        'introduction': '靈魂號無疑有著特別高雅和流線型的風格，別緻的構造能讓您瞬間喚起詹姆士邦德電影中的情懷，讓您立即進入一種放鬆和舒適的狀態.',
        'price': '$250'
    }, {
        'name': '昆騰',
        'introduction': '昆騰是一艘無可挑剔的120英呎的超級遊艇。擁有世界一流的設計。她是澳大利亞最高端的遊艇之一。',
        'price': '$150'
    }, {
        'name': '堪布里亞',
        'introduction': '卡布里亞是一艘兼具美麗與優雅的100英呎的豪華遊艇，她復古的外觀設計和內部精心挑選的古董裝飾與家具都時時刻刻在體現著她的美麗與優雅。',
        'price': '$200'
    }, {
        'name': 'AQA',
        'introduction': 'AQA提供非常優秀的餐飲服務和令人驚歎的後部頂層甲板。除此之外，她還擁有最先進的音響系統，AV要求配備和最豪華的住宿與連接套間。',
        'price': '$250'
    }, ];
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
            alert("cover image saved! Yay!");
            $scope.$apply(function() {
                $scope.cruise.coverImage = avFile;
            });
            // The file has been saved to AV.
        }, function(error) {
            alert("Oh F**k, error: " + error.message);
            // The file either could not be read, or could not be saved to AV.
        });
    };
});