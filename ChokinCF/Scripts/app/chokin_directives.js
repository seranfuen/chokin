(function () {
    'use strict';
    var app = angular.module("chokin");
    app.directive("focusOn", function ($timeout) {
        return {
            restrict: "A",
            link: function ($scope, $element, $attr) {
                $scope.$watch($attr.focusOn, function (focusVal) {
                    $timeout(function () {
                        focusVal ? $element[0].select() :
                            $element[0].blur();
                    });
                });
            }
        };
    });

    app.directive("escapePressed", function () {
        return function (scope, element, attributes) {
            $(element).keyup(function (event) {
                if (event.keyCode === 27) {
                    scope.$apply(function () {
                        scope.$eval(attributes.escapePressed)
                    });
                }
            });
        };
    });

    app.directive("enterPressed", function () {
        return function (scope, element, attributes) {
            $(element).keyup(function (event) {
                if (event.keyCode === 13) {
                    scope.$apply(function () {
                        scope.$eval(attributes.enterPressed);
                    });
                }
            });
        };
    });

    app.directive("addingRow", function () {
        return {
            link: function (scope, element, attributes) {
                if (scope.currency !== null && scope.currency.Id === 0) {
                    scope.$parent.currentEditing = element;
                }
            }
        }
    });

    app.directive("tooltip", function () {
        return {
            link: function (scope, element, attributes) {
                $(element).tooltip();
            }
        }
    });

})();