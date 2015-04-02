'use strict';

/* Directives */

JMSApp.directive('appVersion', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
});
JMSApp.directive("jmsNavbar", function($rootScope) {
	return {
		restrict: "E",
		replace: true,
		transclude: true,
		templateUrl: 'partials/navbar'
	}
});
JMSApp.directive("jmsFooter", function() { // (1)
	return {
		restrict: "E",
		replace: true,
		transclude: true,
		templateUrl: "partials/footer"
	}
});
JMSApp.directive('validNumber', function() {
	return {
		require: '?ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			if (!ngModelCtrl) {
				return;
			}

			ngModelCtrl.$parsers.push(function(val) {
				if (angular.isUndefined(val)) {
					var val = '';
				}
				var clean = val.replace(/[^0-9\.]/g, '');
				var decimalCheck = clean.split('.');

				if (!angular.isUndefined(decimalCheck[1])) {
					decimalCheck[1] = decimalCheck[1].slice(0, 2);
					clean = decimalCheck[0] + '.' + decimalCheck[1];
				}

				if (val !== clean) {
					ngModelCtrl.$setViewValue(clean);
					ngModelCtrl.$render();
				}
				return clean;
			});

			element.bind('keypress', function(event) {
				if (event.keyCode === 32) {
					event.preventDefault();
				}
			});
		}
	};
});
JMSApp.directive('ngReallyClick', [
	function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('click', function() {
					var message = attrs.ngReallyMessage;
					if (message && confirm(message)) {
						scope.$apply(attrs.ngReallyClick);
					}
				});
			}
		}
	}
]);

JMSApp.directive('Collage', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			alert("Collage worked");
			element.removeWhitespace().collagePlus();

		}
	}
})