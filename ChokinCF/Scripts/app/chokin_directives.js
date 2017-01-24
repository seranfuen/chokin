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

    app.directive("entityRow", function () {
        return {
            link: function (scope, element, attributes) {
                if (scope.currency !== null && scope.currency.Id === 0) {
                    scope.$parent.currentEditing = element;
                }

                scope.$on("validationError", function () {
                    if (scope.$parent.isEditing[scope.currency.Id]) {
                        flashError(element, function () {
                            getRowFirstInput().focus()
                        });
                    }
                });

                function flashError(element, callback) {
                    var validationErrorClass = "row-validation-error";
                    var blinkingSpeedMs = 100;

                    $(element).toggleClass(validationErrorClass);
                    setTimeout(function () {
                        $(element).toggleClass(validationErrorClass);
                        setTimeout(function () {
                            $(element).toggleClass(validationErrorClass);
                            setTimeout(function () {
                                $(element).toggleClass(validationErrorClass);
                                callback();
                            }, blinkingSpeedMs);
                        }, blinkingSpeedMs);
                    }, blinkingSpeedMs);
                }

                $(element).focusin(function (event) {
                    scope.currentSelectedInput = event.target;
                });

                $(element).keydown(function (event) {
                    if (event.keyCode === 9) {
                        if (!event.shiftKey && isLast()) {
                            setFocus(getRowFirstInput());
                        } else if (event.shiftKey && isFirst()) {
                            setFocus(getRowLastInput());
                        }
                    }

                    function isFirst() {
                        return event.target === getRowFirstInput().get(0);
                    }

                    function isLast() {
                        return event.target === getRowLastInput().get(0);
                    }

                    function setFocus(inputElement) {
                        inputElement.focus();
                        event.preventDefault();
                    }
                });

                function getRowFirstInput() {
                    return $(element).find("input:first");
                }

                function getRowLastInput() {
                    return $(element).find("input:last");
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

    app.directive("chokinLoginForm", function () {
        return {
            templateUrl: "/Templates/Login.html"
        }
    });

})();