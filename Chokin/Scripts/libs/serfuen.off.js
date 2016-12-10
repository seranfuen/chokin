var SERFUEN = (function () {
    
    var version = "0.0.1";

    var createPieChartSettings = function (chartData) {
        chartData = chartData || [];
        /* Color chart, contiguous colors including last and first in the list should be distinct from one another */
        this.colorChart = ["red", "yellow", "brown", "black", "yellow", "blue"];
        this.animationSpeed = 1500;
        this.data = chartData;
    };

    var centerPoint = function (width, height) {
        this.x = width / 2;
        this.y = height / 2;
    };

    var rotateAngleRight = function (angle, rotateBy) {
        return (angle + rotateBy) % (2 * Math.PI);
    };

    var clearContext = function (canvas) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    var freezeContext = function (canvas) {
        var context = canvas.getContext("2d");
        context.save();
    };

    var unfreezeContext = function (canvas) {
        var context = canvas.getContext("2d");
        context.restore();
    };

    var drawCircleCenter = function (canvas, color, strokeWidth) {
        var color = color || "black";
        strokeWidth = strokeWidth || 1;

        var context = canvas.getContext("2d");
        var center = new centerPoint(canvas.width, canvas.height);
        var radius = Math.min(canvas.width, canvas.height) / 2;

        context.strokeStyle = color;
        context.lineWidth = strokeWidth;
        context.beginPath();
        context.arc(center.x, center.y, radius - 50, 0, 2 * Math.PI);
        context.stroke();
    };

    var drawPie = function(canvas, color, startingAngle, finishingAngle) {
        var context = canvas.getContext("2d");
        var center = new centerPoint(canvas.width, canvas.height);
        var radius = Math.min(canvas.width, canvas.height) / 2;

        context.fillStyle = color;
        context.beginPath();
        context.moveTo(center.x, center.y);
        context.arc(center.x, center.y, radius - 50, startingAngle - 0.1, finishingAngle);
        context.fill();
    };

    var sum = function (x, f) {
        if (x === undefined) {
            return 0;
        } else {
            var total = 0;
            for (var i = 0; i < x.length; i++) {
                total += f(x[i]);
            }
            return total;
        }
    }

    var pieDrawer = function (canvas, totalQuantity, values, colors) {
        var colors = colors;
        var canvas = canvas;
        var totalQuantity = totalQuantity;
        var values = values;
        
        this.animationSpeed = 1500;
        var drawingInterval = 20;
        
        function getColor(index) {
            return colors[index % colors.length];
        }

        function getValueAngle(value) {
            return (value / totalQuantity) * 2 * Math.PI;
        }
        this.drawAnimated = function () {

            var timesToDraw = this.animationSpeed / drawingInterval;
            var angleToIncrease = (2 * Math.PI) / timesToDraw;

            var status = {
                currentValueIndex: 0,
                currentColor : getColor(0),
                currentValue: values[0],
                currentValueAngle: getValueAngle(values[0]),
                currentValueDrawn: 0,
                currentAngle: 0,
                currentValueAngleStarting: 0,
                getAngleToDraw : function() {
                    return this.currentValueAngle - this.currentValueDrawn;
                },
                increaseValueIndex : function() {
                        this.currentValueIndex++;
                        this.currentValue = values[this.currentValueIndex];
                        this.currentValueAngleStarting += this.currentValueAngle;
                        this.currentValueAngle = getValueAngle(values[this.currentValueIndex]);
                        this.currentValueDrawn = 0;
                        this.currentColor = getColor(this.currentValueIndex);
                        
                },
                updateCurrentDrawn: function (valueDrawn) {
                    this.currentValueDrawn += valueDrawn;
                },
                reset: function () {
                    this.currentValueIndex = 0;
                    this.currentColor = getColor(0);
                    this.currentValue = values[0];
                    this.currentValueAngle = getValueAngle(values[0]);
                    this.currentValueDrawn = 0;
                    this.currentValueAngleStarting = 0;
                }
            };

            function normalizeAngle(angle) {
                return rotateAngleRight(angle, 1.5 * Math.PI);
            };

            _drawAnimated();

            function _drawAnimated() {
                status.reset();
                if (timesToDraw > 0) {

                    clearContext(canvas);
                    freezeContext(canvas);

                    status.currentAngle += angleToIncrease;

                    var totalDrawingIteration = status.currentAngle;

                    while (totalDrawingIteration > 0) {
                        var toDraw = Math.min(status.getAngleToDraw(), totalDrawingIteration);


                        drawPie(canvas, getColor(status.currentValueIndex), normalizeAngle(status.currentValueAngleStarting), normalizeAngle(status.currentValueAngleStarting + toDraw));
                        totalDrawingIteration -= toDraw;
                        status.increaseValueIndex();
                    }
                    drawCircleCenter(canvas, 'black', 2);
                    unfreezeContext(canvas);
                    timesToDraw--;
                    window.setTimeout(_drawAnimated, drawingInterval);
                } else {
                    timesToDraw = this.animationSpeed / drawingInterval;
                }
            }
        }
    }

    $.fn.pieChart = function (pieChartSettings) {
        var settings = pieChartSettings || new createPieChartSettings();
        return this.each(function () {
            var canvas = $(this).get(0);
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            var total = sum(pieChartSettings.data, function (x) { return x.value; });
            var drawer = new pieDrawer(canvas, total, pieChartSettings.data.map(function (x) { return x.value; }), pieChartSettings.colorChart);
            drawer.animationSpeed = settings.animationSpeed;
            drawer.drawAnimated();
        });
    }

    return {
        /* chartData should be a collection of objects (each representing a sector in the pie) with the following properties:
        value: number representing the value to display in that sector of the pie, required
        name: a name that defines the value, optional
        description: a string that gives a definition, optional
        */
        pieChartSettings : createPieChartSettings
    }
}());

$(function () {
    var data = [{ value: 75 }, { value: 24 }];
    var settings = new SERFUEN.pieChartSettings(data);
    settings.animationSpeed = 1000;
    $('#test_canvas').pieChart(settings);
});