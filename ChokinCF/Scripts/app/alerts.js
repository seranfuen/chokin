var BOOTSTRAP_ALERTS = (function () {
    var DEFAULT_TIMEOUT_MS = 3000,
        DEFAULT_POSITION = "top",
        POSITIONS = ["left", "right", "bottom", "top"];

    var currentAlert = null;

    var alerts = {
        showSuccess: function (message, position, timeout) {
            var alertMessage = $("<p></p>");
            timeout = timeout || DEFAULT_TIMEOUT_MS;
            if (position === undefined || !isValidPosition(position)) {
                position = DEFAULT_POSITION;
            }
            if (currentAlert !== null) {
                removeCurrentAlert();
            }
            currentAlert = $("<div></div>").addClass("alert").addClass("alert-success").addClass("bootstrap-fixed-alert");
            currentAlert.hide();
            setPosition(position);
            alertMessage.text(message);
            $("body").prepend(currentAlert);
            currentAlert.fadeIn();
        }
    };

    function isValidPosition(position) {
        return POSITIONS.includes(position.toLowerCase());
    }

    function removeCurrentAlert() {
        $(document).remove(currentAlert);
        currentAlert = null;
    }

    function setPosition(position) {
        switch (position) {
            case "left":
                currentAlert.addClass("bootstrap-fixed-alert-left");
                break;
            case "right":
                currentAlert.addClass("bootstrap-fixed-alert-right");
                break;
            case "top":
                currentAlert.addClass("bootstrap-fixed-alert-top");
                break;
            case "bottom":
                currentAlert.addClass("bootstrap-fixed-alert-bottom");
                break;
        }
    }

    return alerts;

})();

$(document).ready(function () {
    BOOTSTRAP_ALERTS.showSuccess("PROBANDO PROBANDO", "top");
});