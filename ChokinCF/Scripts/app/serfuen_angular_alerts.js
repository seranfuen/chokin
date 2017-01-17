(function () {
    'use strict';
    var alertsModule = angular.module("serfuenAlerts", []),
        ALERT_TIMEOUT_MS = 2000;

    alertsModule.directive("alertBox", function () {
        return {
            template: "<div class=\"bootstrap-fixed-alert-container\"><div class=\"bootstrap-fixed-alert\"></div></div>",
            link: function link(scope, element, attributes) {
                scope.$on("alertEmitted", function (event, args) {
                    $(element).find(".bootstrap-fixed-alert").showBootstrapAlert(args.message, {
                        alertType: args.type,
                        timeout: ALERT_TIMEOUT_MS
                    });
                });
            }
        }
    });
})();