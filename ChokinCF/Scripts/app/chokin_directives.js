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

    app.directive("tooltip", function () {
        function link(scope, element, attributes) {
            $(element).tooltip();
        }

        return {
            link: link
        }
    });

    app.directive("alertBox", function () {
        return {
            template : "<div class=\"bootstrap-fixed-alert-container\"><div class=\"bootstrap-fixed-alert\"></div></div>",
            link: function link(scope, element, attributes) {
                scope.$on("alertEmitted", function (event, args) {
                    $(element).find(".bootstrap-fixed-alert").showBootstrapAlert(args.message, {
                        alertType: args.type,
                        timeout: 2000
                    });
                });
            }
        }
    });
})();