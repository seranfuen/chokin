var SERFUEN = (function () {

    var version = '0.0.1';

    var createPieChartSettings = function (chartData) {
        chartData = chartData || [];
        /* Color chart, contiguous colors including last and first in the list should be distinct from one another */
        this.colorChart = ['red', 'green', 'brown', 'black', 'yellow', 'blue'];
        this.animationSpeed = 1500;
        this.data = chartData;
    };

    var centerPoint = function (width, height) {
        this.x = width / 2;
        this.y = height / 2;
    };

    var rotateAngleRight = function(angle, rotateBy) {
        return (angle + rotateBy) % (2 * Math.PI);
    }

    var clearContext = function (canvas) {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    var drawCircleCenter = function (canvas, color, strokeWidth) {
        color = color || 'black';
        strokeWidth = strokeWidth || 1;

        var context = canvas.getContext('2d');
        var center = new centerPoint(canvas.width, canvas.height);
        var radius = Math.min(canvas.width, canvas.height) / 2;

        context.strokeStyle = color;
        context.lineWidth = strokeWidth;
        context.beginPath();
        context.arc(center.x, center.y, radius - 50, 0, 2 * Math.PI);
        context.stroke();
    };

    var drawPie = function(canvas, color, startingAngle, finishingAngle) {
        var context = canvas.getContext('2d');
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
            var sum = 0;
            for (var i = 0; i < x.length; i++) {
                sum += f(x[i]);
            }
            return sum;
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
            var angleToDraw = (2 * Math.PI) / timesToDraw;

            var status = {
                currentValueIndex: 0,
                currentColor : getColor(0),
                currentValue: values[0],
                currentValueAngle: getValueAngle(values[0]),
                currentValueDrawn: 0,
                currentAngle : 0,
                getAngleToDraw : function() {
                    return this.currentValueAngle - this.currentValueDrawn;
                },
                increaseValueIndex : function() {
                        this.currentValueIndex++;
                        this.currentValue = values[this.currentValueIndex];
                        this.currentValueAngle = getValueAngle(values[this.currentValueIndex]);
                        this.currentValueDrawn = 0;
                        this.currentColor = getColor(this.currentValueIndex);
                        
                },
                updateCurrentDrawn: function (valueDrawn) {
                    this.currentValueDrawn += valueDrawn;
                }
            };

            function normalizeAngle(angle) {
                return rotateAngleRight(angle, 1.5 * Math.PI);
            }

            _drawAnimated();

            function _drawAnimated() {
                if (timesToDraw > 0) {
                    var currentDrawing = angleToDraw;

                    while (currentDrawing > 0) {
                        var toDraw = Math.min(currentDrawing, status.getAngleToDraw(status.currentValue));

                        drawPie(canvas, status.currentColor, normalizeAngle(status.currentAngle), normalizeAngle(status.currentAngle + toDraw));

                        status.updateCurrentDrawn(toDraw);
                        currentDrawing -= toDraw;
                        status.currentAngle += toDraw;
                        if (status.getAngleToDraw() <= 0 && status.currentValueIndex < values.length) {
                            status.increaseValueIndex();
                        }
                    }
                    timesToDraw--;
                    window.setTimeout(_drawAnimated, drawingInterval);
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

            drawCircleCenter(canvas, 'black', 2);
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
    var data = [{ value: 30 }, { value: 80 }, { value: 65 }, { value: 40 }, { value: 20 }];
    var settings = new SERFUEN.pieChartSettings(data);
    settings.animationSpeed = 1000;
    $('#test_canvas').pieChart(settings);
});