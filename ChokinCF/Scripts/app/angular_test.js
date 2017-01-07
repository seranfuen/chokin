(function () {
    'use strict';

    var app = angular.module("angularTest", []);
    app.controller("ListCurrencies", function ($scope, $http) {
        $scope.isEditing = [];

        var isAdding = false,
            currentEditingEntity,
            newEntityId = 90;
       
        function stopEditing(commitData) {
            $scope.isEditing[currentEditingId] = false;
            if (currentEditingId !== null && commitData === true && !angular.equals(currentEditingEntity, getEntity(currentEditingId))) {
                saveCurrent(currentEditingId);
            } else { // restore
                var editing = getEntity(currentEditingId);
                angular.copy(currentEditingEntity, editing);
            }
            currentEditing = currentEditingId = null;
        }

        function saveCurrent(id) {
            var savingEntity = getEntity(id);
            $http.put("/api/Currencies/" + id, angular.toJson(savingEntity)).then(function (response) {
                window.alert(response.status);
            });
        }

        function getEntity(id) {
            return $scope.currencies.find(function (entity) {
                return entity.Id === id;
            });
        }

        function deleteEntity(id) {
            $http.delete("/api/Currencies/" + id).then(function(response) {
                window.alert(response.status);
            });
        }

        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                stopEditing(false);
                $scope.$apply();
            }
        });

        $(document).click(function (event) {
            if (currentEditingId !== null) {
                if (!$(event.target).closest(currentEditing).length) {
                    stopEditing(true);
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
            editMode(id);
            currentEditing = $event.delegateTarget;
            $event.stopPropagation();
        };

        function editMode(id) {
            $scope.isEditing[id] = true;
            currentEditingId = id;
            currentEditingEntity = angular.copy(getEntity(id));
        }

        $scope.isEditMode = function () {
            var i = $scope.isEditing.length;

            while (i--) {
                if ($scope.isEditing[i]) {
                    return true;
                }
            }
            return false;
        };

        $scope.isAddingMode = function () {
            return isAdding;
        };

        $scope.addEntity = function ($event) {
            isAdding = true;
            $scope.currencies.push({
                Id: newEntityId,
                Name: null,
                Currency: null,
                Symbol : null
            });
            $scope.isEditing[newEntityId] = true;
            currentEditingId = newEntityId;
            $event.stopPropagation();
        };

        $scope.isNew = function (id) {
            return id === newEntityId;
        };

        $scope.confirmDelete = function (id) {
            bootbox.confirm("Do you wish to delete this entry?", function (result) {
                if (result) {
                    deleteEntity(id);
                    delete $scope.currencies.id;
                }
            });
        };

        $http.get("/api/currencies").then(function (data) {
            $scope.currencies =  angular.fromJson(data.data);
        });
    });

    app.directive("focusOn", function($timeout) {
        return {
            restrict : "A",
            link : function($scope,$element,$attr) {
                $scope.$watch($attr.focusOn, function(focusVal) {
                    $timeout(function() {
                        focusVal ? $element[0].select() :
                            $element[0].blur();
                    });
                });
            }
        };
    });
})();