var serfuen = serfuen || {};

(function () {
    "use strict";
    serfuen.utils = {
        combinePath: function () {
            var elements = Array.from(arguments);
            return elements.join("/");
        }
    };
})();

(function () {
    "use strict";
    var app = angular.module("chokin");
    app.controller("chokin.SpreadsheetModeEdit", function ($scope, $http, $attrs) {
        var isAdding = false,
            currentEditingEntity,
            newEntityId = 0,
            currentEditing = null,
            currentEditingId = null,
            repositoryBaseUrl = "",
            combinePath = serfuen.utils.combinePath;

        repositoryBaseUrl = "/" + combinePath("api", $attrs.entityRepository);

        var endEdit = function (commitData, callbackOnEditionEnded) {
            /// <summary>
            /// Causes the edition on the current row to end, returning to a clean state. If commitData is true, it will attempt to save the data. If false,
            /// it will roll back all changes.
            /// The edit state will not be switched off if commitData is true and the data is not valid. In this case, an error will be shown and the user will be able
            /// to correct the data, or discard the data
            /// </summary>
            /// <param name="commitData" type="type">if true, all changes will be saved. If false, all changes will be rolled back</param>
            if (currentEditingId !== null) {
                if (commitData === true && (isAdding === true || !angular.equals(currentEditingEntity, getEntity(currentEditingId)))) {
                    saveCurrent(currentEditingId, callbackOnEditionEnded);
                } else if (isAdding === true) { // remove entity being added
                    removeEntity(currentEditingId);
                    exitEditMode();
                } else { // restore entity being edited
                    var editing = getEntity(currentEditingId);
                    angular.copy(currentEditingEntity, editing);
                    exitEditMode();
                    if (typeof callbackOnEditionEnded === "function") {
                        callbackOnEditionEnded();
                    }
                }
            }
        };

        function exitEditMode() {
            $scope.isEditing[currentEditingId] = false;
            currentEditing = null;
            currentEditingId = null;
            isAdding = false;
        }

        function removeEntity(id) {
            var indexAdding = $scope.currencies.findIndex(function (element) {
                return element.Id == id;
            });
            $scope.isEditing[id] = false;
            isAdding = false;
            $scope.currencies.splice(indexAdding, 1);
        }

        function saveCurrent(id, callbackOnEditionEnded) {
            var savingEntity = getEntity(id);
            var jsonEntity =  angular.toJson(savingEntity);
            if (id === newEntityId) {
                $http.post(repositoryBaseUrl, jsonEntity).then(saveCurrentSuccess, saveCurrentFailure);
            } else {
                $http.put(combinePath(repositoryBaseUrl, id), jsonEntity).then(saveCurrentSuccess, saveCurrentFailure);
            }

            function saveCurrentSuccess(response) {
                // show OK! message
                exitEditMode();
                if (typeof callbackOnEditionEnded === "function") {
                    callbackOnEditionEnded();
                }
            }

            function saveCurrentFailure(response) {
                var modelResponse,
                    modelProperty;

                if (response.status === 400) {
                    modelResponse = angular.fromJson(response.data.ModelState);
                    if (modelResponse) {
                        for (modelProperty in modelResponse) {
                            $scope.modelStatus[getPropertyPath(modelProperty)] = modelResponse[modelProperty][0];
                        }
                    }
                    // add more errors as alerts
                }
                // add other errors or a generic one
            }
        }

        function getPropertyPath(path) {
            var firstSeparatorIndex = path.indexOf(".");
            return firstSeparatorIndex >= 0 ? path.substr(firstSeparatorIndex + 1) : path;
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

        function setAdding() {
            $scope.modelStatus = [];
            isAdding = true;
            setEditing(newEntityId);
        }

        function editMode(id) {
            setEditing(id);
            currentEditingEntity = angular.copy(getEntity(id));
        }

        function setEditing(editEntityId) {
            var len, i, id;
            for (i = 0, len = $scope.currencies.length; i < len; i++) {
                id = $scope.currencies[i].Id;
                $scope.isEditing[id] = id === editEntityId;
            }
            currentEditingId = editEntityId;
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
            $scope.currencies.push({
                Id: newEntityId
            });
            setAdding();
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

        $scope.startEdit = function ($event, id) {
            /// <summary>
            /// Sets the row edit mode on. Allows modifying the data on the row whose Id is passed. If another row is being edited,
            /// the changes will be commited
            /// </summary>
            /// <param name="$event" type="type">the event data</param>
            /// <param name="id" type="type">the Id of the row to modify</param>
            var delegateTarget = $event.target;
            if (currentEditingId !== null && currentEditingId !== id) {
                endEdit(true, function () {
                    setEditMode();
                });
            }
            else if (currentEditingId === null || currentEditingId !== id) {
                setEditMode();
            }

            function setEditMode() {
                editMode(id);
                currentEditing = delegateTarget;
                $event.stopPropagation();
                $scope.modelStatus = [];
            }
        };

        $scope.endEdit = endEdit;
        $scope.isEditing = []; // associative array Id --> boolean that establishes whether the current entity is being edited
        $scope.getEditingClass = function (entityId) { // tests if the entity with the ID given is being edited
            return $scope.isEditing[entityId] ? "entity-row-editing" : "entity-row";
        };
    });
})();