(function () {
    'use strict';

    var app = angular.module("angularTest", []);
    app.controller("ListCurrencies", function ($scope, $http) {
        $scope.isEditing = [];
        
        function stopEditing() {
            $scope.isEditing[currentEditingId] = false;
            currentEditing = currentEditingId = null;
            // save context via web api request
        }

        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                stopEditing();
                $scope.$apply();
            }
        });

        $(document).click(function (event) {
            if (currentEditingId !== null) {
                if (!$(event.target).closest(currentEditing).length) {
                    stopEditing();
                    $scope.$apply();
                }
            }
        });

        var currentEditing = null,
            currentEditingId = null;

        $scope.entryClicked = function ($event, id) {
            if (currentEditingId != id) {
                stopEditing();
            }
            $scope.isEditing[id] = true;
            currentEditingId = id;
            currentEditing = $event.delegateTarget;
            $event.stopPropagation();
        };

        $http.get("/api/currencies").then(function (data) {
            $scope.currencies =  angular.fromJson(data.data);
        });
    });
})();