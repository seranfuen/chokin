// TODO: the animation when showing/hiding should be a parameter too

(function () {
    'use strict';

    var VERSION = "0.0.1",
        currentAlerts = {}; // each DOM element can have an alert associated. If a timeout is declared and the level is greater than 1, the timeout will not hide the element until it reaches 0

    $.fn.showBootstrapAlert = function (message, options, callback) {
        /// <summary>
        /// Displays a bootstrap alert in the element(s) selected
        /// </summary>
        /// <param name="message" type="type">the message to show</param>
        /// <param name="options" type="type">an object containing the following optional properties:
        ///     timeout: the time in ms until the alert disappears. If undefined or 0, it will never disappear
        ///     alertType: the type of bootstrap alert (success, info, warning, danger) to display. 
        ///                If undefined, null or any other value, it will be set to info
        /// </param>
        /// <returns type="">jQuery object</returns>
        if (this.is(":visible")) {
            this.fadeOut(function () { showAlert(this); });
        } else {
            showAlert(this);
        }
        return this;

        function showAlert(element) {
            addAlertLevel(element);
            $(element).addClass("alert").addClass(getAlertClass(options.alertType)).html(message).fadeIn();
            if (options["timeout"]) {
                window.setTimeout(function () {
                    if (currentAlerts[element] === 1) {
                        $(element).fadeOut();
                    }
                    removeAlertLevel(element);
                }, options["timeout"]);
            }
            else {
                removeAlertLevel(element);
            }
        }

        function addAlertLevel(element) {
            if (currentAlerts[element] === undefined) {
                currentAlerts[element] = 1;
            } else {
                currentAlerts[element]++;
            }
        }

        function removeAlertLevel(element) {
            currentAlerts[element]--;
        }
    };

    function getAlertClass(alertType) {
        alertType = alertType || "";
        switch (alertType.toLowerCase()) {
            case "success":
                return "alert-success";
            case "warning":
                return "alert-warning";
            case "danger":
                return "alert-danger";
            default:
                return "alert-info";
        }
    }
})();

//$(document).ready(function () {
//    $("#alert-box").showBootstrapAlert("The request was successfully processed", { alertType: "success", timeout : 5000 });
//});

//$(document).ready(function () {
//    window.setTimeout(function () {
//        $("#alert-box").showBootstrapAlert("Server error", { alertType: "danger", timeout: 6000 });
//    }, 3000);
//});