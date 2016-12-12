var SERFUEN = (function () {

    var version = "0.0.1";

    var helper = (function () {
        var helper = {};

        /* A point in the center of a rectangular space defined by its width and height */
        helper.centerPoint = function (width, height, xOffset, yOffset) {
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
        return helper;
    }());

    /* Helper function that holds the context for a canvas, fixes its width and height */
    function canvasContextHelper(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.origin = { x: 0, y: 0 };

        // empties the canvas
        this.clearContext = function () {
            this.context.translate(-this.origin.x, -this.origin.y);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.translate(this.origin.x, this.origin.y);
        };

        this.getTextSize = function(font, text) {
            this.context.font = font;
            return this.context.measureText(text);
        };

        this.changeOrigin = function (x, y) {
            this.origin = {
                x: x,
                y: y
            };
            this.context.translate(x, y);
        }
    }

    var createPieChartSettings = function (chartData) {
        this.data = chartData || [];
        /* The numeric total represented by the data given */
        this.total = chartData.map(function (x) { return x.value; }).reduce(function (x, y) { return x + y; });

        this.showPercentageInSectors = true;

        // APPEARANCE

        /* Color palette, contiguous colors including last and first in the list should be distinct from one another */
        this.colorPalette = ["gray", "blue", "orange", "green", "pink", "brown", "purple", "yellow", "red"];
        this.sectorLineColor = "LightGray";
        this.sectorLineWidth = 2;
        this.circleLineColor = "black";
        this.circleLineWidth = 2;

        /* Animation speed in milliseconds when displaying the pie chart. Set to 0 to disable the animation */
        this.animationSpeed = 1500;

    };

    var pieChart = function(canvas, pieChartSettings) {

        var self = this;

        var CIRCLE_ANGLE = 2 * Math.PI;
        var PIE_RADIUS_SUBSTRACT = 50; // Pixels to substract from the radius, the original radius being half the width/height (whichever is smaller) of the canvas
        var PIE_CENTER_X_OFFSET = 0;   // If X is positive, the pie will be offset to the right of the center of the canvas
        var PIE_CENTER_Y_OFFSET = 0;  // If Y is positive, it will be offset to the bottom of the center of the canvas

        var SHOW_TOOLTIP_AFTER_HOVER_MS = 1500; // Number of ms that must elapse to show the tooltip over a sector indicating value, percentage and name
        var FONT_SIZE_FACTOR = 1.5; // The largest the font size, the farthest the distance (by this factor) from the pie circle
        var FONT_SIZE = 16; // font size in pixels
        var FONT = "ARIAL"; // font name
        var fontString = FONT_SIZE + "px " + FONT;

        var canvasContext = new canvasContextHelper(canvas);
        var radius = Math.min(canvas.width, canvas.height) / 2 - PIE_RADIUS_SUBSTRACT;
        var schedule = createPieSectorSchedule();
        var mouseLastMoved = 0;
        var currentSector = null;

        setContextOrigin();

        this.drawPieChart = function () {
            canvasContext.clearContext();
            var i, len, sector;

            for (i = 0, len = schedule.length; i < len; i++) {
                sector = schedule[i];
                if (sector.isMouseOver) {
                    canvasContext.context.globalAlpha = 0.5;
                }
                drawPieSector(sector.color, sector.startingAngle, sector.finishingAngle);
                canvasContext.context.globalAlpha = 1;
            }

            if (pieChartSettings.sectorLineColor && schedule.length > 1) {
                for (i = 0, len = schedule.length; i < len; i++) {
                    sector = schedule[i];
                    drawPieSectorDividingLine( pieChartSettings.sectorLineColor, pieChartSettings.sectorLineWidth, sector.finishingAngle);
                }
            }

            if (pieChartSettings.circleLineColor) {
                drawCircle(pieChartSettings.circleLineColor, pieChartSettings.circleLineWidth);
            }

            if (pieChartSettings.showPercentageInSectors) {
                for (i = 0, len = schedule.length; i < len; i++) {
                    sector = schedule[i];
                    var text = Math.round(sector.percentage) + "%";
                    var textSize = canvasContext.getTextSize(FONT, text);

                    var point = {
                        x: Math.cos(sector.bisectingAngle) * (radius + FONT_SIZE * FONT_SIZE_FACTOR),
                        y: Math.sin(sector.bisectingAngle) * (radius + FONT_SIZE * FONT_SIZE_FACTOR)
                    };
                    drawText(fontString, 'black', Math.round(sector.percentage) + "%", point);
                }
            }
        };

        $(canvas).mousemove(function (event) {
            var rect = this.getBoundingClientRect();
            var point = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };

            currentSector = null;

            var i, len, sector;
            var canTrigger = true;
            for (i = 0, len = schedule.length; i < len; i++) {
                sector = schedule[i];
                var isInside = isInsideSector(point, sector);
                sector.isMouseOver = isInside && canTrigger;
                if (sector.isMouseOver) {
                    currentSector = sector;
                    canTrigger = false;
                }
            }

            mouseLastMoved = Date.now();
            var lastMoved = mouseLastMoved;
            var currentSectorInternal = currentSector;

            self.drawPieChart(); // redraw

            setTimeout(function () {
                if (mouseLastMoved == lastMoved && currentSector && currentSectorInternal == currentSector) {
                    // draw tooltip with name + value + percentage
                }
            }, SHOW_TOOLTIP_AFTER_HOVER_MS);

        });

        function setContextOrigin() {
            var center = new helper.centerPoint(canvas.width, canvas.height, PIE_CENTER_X_OFFSET, PIE_CENTER_Y_OFFSET);
            canvasContext.changeOrigin(center.x, center.y);
        }

        function isInsideSector(point, sector) {
            var ctx = canvasContext.context;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(sector.startingAngle) * radius, Math.sin(sector.startingAngle) * radius);
            ctx.arc(0, 0, radius, sector.startingAngle, sector.finishingAngle);
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(sector.finishingAngle) * radius, Math.sin(sector.finishingAngle) * radius);

            return ctx.isPointInPath(point.x, point.y);
        }

        function getColor(index) {
            return pieChartSettings.colorPalette[index % pieChartSettings.colorPalette.length];
        }

        function getSectorSchedule(data, accumulatedAngle, sectorAngle, value, color) {
            return {
                startingAngle: accumulatedAngle,
                finishingAngle: Math.min(CIRCLE_ANGLE, sectorAngle + accumulatedAngle),
                angle: sectorAngle,
                value: value,
                color: color,
                bisectingAngle: (sectorAngle / 2) + accumulatedAngle,
                percentage: (value / pieChartSettings.total) * 100,
                getBisectingWidth: function (radius) {
                    return Math.sin(sectorAngle / 2) * radius;
                },
                isMouseOver: false
            };
        }

        function createPieSectorSchedule() {
            var pieChartData = pieChartSettings.data;
            var schedule = [];
            var currentAngle = 0;

            var i, len;
            for (i = 0, len = pieChartData.length; i < len; i++) {
                var angle = pieChartData[i].value * (CIRCLE_ANGLE / pieChartSettings.total);
                schedule[i] = getSectorSchedule(pieChartData, currentAngle, angle, pieChartData[i].value, getColor(i));
                currentAngle += schedule[i].angle;
            }

            // Fix color of last element if it's the same as the first to avoid two identical contiguous sectors. Will take the sector in the middle. Will not work if only 2 colors and 3 sectors
            if (schedule[schedule.length - 1].color == schedule[0].color) {
                schedule[schedule.length - 1].color = getColor(Math.round((schedule.length - 1) / 2));
            }

            return schedule;
        }

        function getAvailableWidth(bisectingWidth) {
            return Math.round(bisectingWidth) - (pieChartSettings.sectorLineWidth || 0) - 2;
        }

        function drawPieSector(color, startingAngle, finishingAngle) {
            var context = canvasContext.context;
            context.fillStyle = color;
            context.beginPath();
            context.moveTo(0, 0);
            context.arc(0, 0, radius, startingAngle, finishingAngle);
            context.fill();
        }

        function drawPieSectorDividingLine(color, lineWidth, angle) {
            var context = canvasContext.context;
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            context.lineCap = "round";
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            context.stroke();
        }

        function drawCircle(color, strokeWidth) {
            var context = canvasContext.context;
            context.strokeStyle = color;
            context.lineWidth = strokeWidth;
            context.beginPath();
            context.arc(0, 0, radius, 0, 2 * Math.PI);
            context.stroke();
        }

        function drawText(font, color, text, position) {
            var context = canvasContext.context;
            context.fillStyle = color;
            context.textAlign = 'center';
            context.textBaseline = "middle";
            context.font = font;
            context.fillText(text, position.x, position.y);
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