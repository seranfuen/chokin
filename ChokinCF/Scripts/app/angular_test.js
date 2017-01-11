var serfuen = serfuen || {};

(function () {
    'use strict';
    serfuen.utils = {
        combinePath: function () {
            var elements = Array.from(arguments);
            return elements.join("/");
        }
    };
})();


(function () {
    'use strict';
    var app = angular.module("angularTest", []);
    app.controller("SpreadsheetModeEdit", function ($scope, $http, $attrs) {
        var isAdding = false,
            currentEditingEntity,
            newEntityId = 0,
            currentEditing = null,
            currentEditingId = null,
            repositoryBaseUrl = "",
            combinePath = serfuen.utils.combinePath;

        repositoryBaseUrl = "/" + combinePath("api", $attrs.entityRepository);
        $scope.isEditing = []; // associative array Id --> boolean that establishes whether the current entity is being edited 

        var endEdit = function (commitData) {
            /// <summary>
            /// Causes the edition on the current row to end, returning to a clean state. If commitData is true, it will attempt to save the data. If false,
            /// it will roll back all changes.
            /// 
            /// The edit state will not be switched off if commitData is true and the data is not valid. In this case, an error will be shown and the user will be able
            /// to correct the data, or discard the data
            /// </summary>
            /// <param name="commitData" type="type">if true, all changes will be saved. If false, all changes will be rolled back</param>
            if (currentEditingId !== null) {
                $scope.isEditing[currentEditingId] = false;
                if (commitData === true && (isAdding === true || !angular.equals(currentEditingEntity, getEntity(currentEditingId)))) {
                    saveCurrent(currentEditingId);
                } else if (isAdding === true) { // remove entity being added
                    removeEntity(currentEditingId);
                } else { // restore entity being edited
                    var editing = getEntity(currentEditingId);
                    angular.copy(currentEditingEntity, editing);
                }
                isAdding = false;
                $scope.$apply();
            }
            currentEditing = currentEditingId = null;
        }

        $scope.endEdit = endEdit;

        function removeEntity(id) {
            var indexAdding = $scope.currencies.findIndex(function (element) {
                return element.Id == id;
            });
            $scope.currencies.splice(indexAdding, 1);
        }

        function saveCurrent(id) {
            var savingEntity = getEntity(id);
            var jsonEntity =  angular.toJson(savingEntity);
            if (id === newEntityId) {
                $http.post(repositoryBaseUrl, jsonEntity).then(function (response) {
                    window.alert(response.status);
                });
            } else {
                $http.put(combinePath(repositoryBaseUrl, id), jsonEntity).then(function (response) {
                    window.alert(response.status);
                });
            }
        }

        function getEntity(id) {
            return $scope.currencies.find(function (entity) {
                return entity.Id === id;
            });
        }

        function deleteEntity(id) {
            $http.delete(combinePath(repositoryBaseUrl, id)).then(function (response) {
                window.alert(response.status);
            });
        }

        $(document).click(function (event) {
            if (currentEditingId !== null) {
                if (!$(event.target).closest(currentEditing).length) {
                    endEdit(true);
                    $scope.$apply();
                }
            }
        });

        $scope.startEdit = function ($event, id) {
            /// <summary>
            /// Sets the row edit mode on. Allows modifying the data on the row whose Id is passed. If another row is being edited,
            /// the changes will be commited
            /// </summary>
            /// <param name="$event" type="type">the event data</param>
            /// <param name="id" type="type">the Id of the row to modify</param>
            if (currentEditingId !== id) {
                endEdit(true);
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
                    endEdit(id);
                    removeEntity(currentEditingId);
                }
            });
        };

        $http.get(repositoryBaseUrl).then(function (data) {
            $scope.currencies =  angular.fromJson(data.data);
        });
    });

    // DIRECTIVES

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

    app.directive("escapePressed", function() {
        return function(scope, element, attributes) {
            $(element).keyup(function (event) {
                if (event.keyCode === 27) {
                    scope.$eval(attributes.escapePressed);
                }
            });
        };
    });

    app.directive("enterPressed", function () {
        return function (scope, element, attributes) {
            $(element).keyup(function (event) {
                if (event.keyCode === 13) {
                    scope.$eval(attributes.enterPressed);
                }
            });
        };
    });
})();