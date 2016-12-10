var SERFUEN = (function () {

    var version = "0.0.1";

    var helper = (function() {
        // Given an array x, get the sum of the values returned by mapping each item in the array with function f
        this.sumMap = function (array, f) {
            if (array === undefined) {
                return 0;
            } else {
                var total = 0;
                for (var i = 0; i < array.length; i++) {
                    total += f(array[i]);
                }
                return total;
            }
        };

        /* A point in the center of a rectangular space defined by its width and height */
        this.centerPoint = function (width, height, xOffset, yOffset) {
            this.x = width / 2 + xOffset;
            this.y = height / 2 + yOffset;

            // gets a location in terms of the center. Can be used to obtain vectors
            this.getRelativePosition = function (x, y) {
                return {
                    x: this.x + x,
                    y: this.y + y
                };
            };
        };
        
        return this;

    }());

    /* Helper function that holds the context for a canvas, fixes its width and height */
    function canvasContextHelper(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        // empties the canvas
        this.clearContext = function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
    }

    var createPieChartSettings = function (chartData) {
        this.data = chartData || [];
        /* The numeric total represented by the data given */
        this.total = helper.sumMap(this.data, function (x) { return x.value; });
        /* Color palette, contiguous colors including last and first in the list should be distinct from one another */
        this.colorPalette = ["gray", "blue", "orange", "green", "pink", "brown", "purple", "yellow", "red"];
        /* Animation speed in milliseconds when displaying the pie chart. Set to 0 to disable the animation */
        this.animationSpeed = 1500;
        this.sectorLineColor = "Aquamarine";
        this.sectorLineWidth = 2;
        this.circleLineColor = "black";
        this.circleLineWidth = 2;
        
    };

    var pieChart = function(canvas, pieChartSettings) {

        /* How many pixels to substract from the pie radius. If 0, the pie radius is the same as the canvas height divided by 2 */
        var PIE_RADIUS_SUBSTRACT = 50;
        /* By how many pixels the center of the pie will be offset from the canvas center.
         * When offset, it is required that the offset be not greater than the PIE_RADIUS_SUBSTRACT parameter or there will be glitches
         */
        // If X is positive, it will be offset to the right, if negative to the left
        var PIE_CENTER_X_OFFSET = 0;
        // If Y is positive, it will be offset to the bottom, if negative to the top
        var PIE_CENTER_Y_OFFSET = 0;

        var CIRCLE_ANGLE = 2 * Math.PI;

        var canvasContext = new canvasContextHelper(canvas);
        var center = new helper.centerPoint(canvas.width, canvas.height, PIE_CENTER_X_OFFSET, PIE_CENTER_Y_OFFSET);
        var radius = Math.min(canvas.width, canvas.height) / 2 - PIE_RADIUS_SUBSTRACT;
        var schedule = createPieSectorSchedule();

        this.drawPieChart = function () {
            canvasContext.clearContext();
            for (var i = 0, len = schedule.length; i < len; i++) {
                var sector = schedule[i];
                drawPieSector(sector.color, sector.startingAngle, sector.finishingAngle);
            }

            if (pieChartSettings.sectorLineColor) {
                for (var i = 0, len = schedule.length; i < len; i++) {
                    var sector = schedule[i];
                    drawPieSectorDividingLine(pieChartSettings.sectorLineColor, pieChartSettings.sectorLineWidth, sector.finishingAngle);
                }
            }

            if (pieChartSettings.circleLineColor) {
                drawCircle(pieChartSettings.circleLineColor, pieChartSettings.circleLineWidth);
            }
        };

        function getColor(index) {
            return pieChartSettings.colorPalette[index % pieChartSettings.colorPalette.length];
        }

        function createPieSectorSchedule() {
            var pieChartData = pieChartSettings.data;
            var schedule = [];
            var currentAngle = 0;

            for (var i = 0, len = pieChartData.length; i < len; i++) {
                var angle = pieChartData[i].value * (CIRCLE_ANGLE / pieChartSettings.total);

                schedule[i] = {
                    startingAngle : currentAngle,
                    finishingAngle: Math.min(CIRCLE_ANGLE, angle + currentAngle),
                    angle : angle,
                    value : pieChartData[i].value,
                    color : getColor(i)
                };
                currentAngle += schedule[i].angle;
            }

            // Fix color of last element if it's the same as the first to avoid two identical contiguous sectors. Will take the sector in the middle. Will not work if only 2 colors and 3 sectors
            if (schedule[schedule.length - 1].color == schedule[0].color) {
                schedule[schedule.length - 1].color = getColor(Math.round((schedule.length - 1)/2));
            }

            return schedule;
        }

        function drawPieSector(color, startingAngle, finishingAngle) {
            var context = canvasContext.context;
            context.fillStyle = color;
            context.beginPath();
            context.moveTo(center.x, center.y);
            context.arc(center.x, center.y, radius, startingAngle, finishingAngle);
            context.fill();
        }

        function drawPieSectorDividingLine(color, lineWidth, angle) {
            var context = canvasContext.context;
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            context.lineCap="round";
            context.beginPath();
            context.moveTo(center.x, center.y);
            var position = center.getRelativePosition(Math.cos(angle) * radius, Math.sin(angle) * radius);
            context.lineTo(position.x, position.y);
            context.stroke();
        }

        function drawCircle(color, strokeWidth) {
            var context = canvasContext.context;
            context.strokeStyle = color;
            context.lineWidth = strokeWidth;
            context.beginPath();
            context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
            context.stroke();
        }
    };

    $.fn.pieChart = function (pieChartSettings) {
        pieChartSettings = pieChartSettings || new createPieChartSettings();
        return this.each(function () {
            var canvas = $(this).get(0);
            var drawer = new pieChart(canvas, pieChartSettings);
            drawer.drawPieChart();
        });
    };

    return {
        // We export a helper function that allows retrieving a default settings object for the pie, with the data passed by the caller
        getPieChartSettings: createPieChartSettings
    };
}());

$(function () {
    var data = [{ value: 75 }, { value: 25 }, { value: 10 }, { value: 33 }, { value: 66 }, { value: 10 }, { value: 45 }, { value: 90 }, { value: 30 }, { value: 41 }];
    var settings = new SERFUEN.getPieChartSettings(data);
    settings.animationSpeed = 1000;
    $('#test_canvas').pieChart(settings);
});