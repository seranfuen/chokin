/* 
Copyright 2016, Sergio Ángel Verbo, All rights reserved.
Contact at seranfuen@gmail.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/* TODO: 
 * 1. The pie should be rotated so that the first sector's bisection has an angle of 0 (the first sector is pointing upwards)
 * 2. When hovering over a sector, display it's info as a tooltip box
 */


var SERFUEN = (function () {

    var version = "0.0.1";

    var helper = (function () {
        var lib = {};

        /* A point in the center of a rectangular space defined by its width and height */
        lib.CenterPoint = function (width, height, xOffset, yOffset) {
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

        // Allows to manage a canvas status, clear it while keeping a coordinate translation, etc.
        lib.CanvasContextHelper = function (canvas) {
            this.canvas = canvas;
            this.context = this.canvas.getContext("2d");
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.origin = { x: 0, y: 0 };

            // empties the canvas
            this.clearContext = function () {
                this.restoreOrigin();
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            };

            this.getTextSize = function (font, text) {
                this.context.font = font;
                return this.context.measureText(text).width;
            };

            this.changeOrigin = function (x, y) {
                this.origin = {
                    x: x,
                    y: y
                };
                this.context.translate(x, y);
            };

            this.restoreOrigin = function () {
                this.context.translate(-this.origin.x, -this.origin.y);
                this.origin = {
                    x: 0,
                    y: 0
                };
            };
        };

        return lib;
    }());

    // Create a template for the pie chart settings
    // The chart data is an array of objects with the following properties
    // value: the numeric value that represents a piece of data out of the total data being charted
    // valueFormatted: if provided, this will be shown instead of value
    // name: the name or description of the value
    var createPieChartSettings = function (chartData) {
        this.data = chartData || [];
        this.total = chartData.map(function (x) { return x.value; }).reduce(function (x, y) { return x + y; }); // the sum of all sectors

        this.showPercentageInSectors = true; // show the percentage next to the sectors
        this.showCaptionLocation = "right"; // show a caption box if defined as right, top, bottom or left. If undefined or value unknown, no caption will be shown

        // APPEARANCE
        this.colorPalette = ["gray", "blue", "orange", "green", "pink", "brown", "purple", "yellow", "red"]; // color palette, colors will repeat if more values than colors
        this.sectorLineColor = "LightGray"; // the color of the line separating sectors. If not defined, no line will be drawn
        this.sectorLineWidth = 2; // thickness of line separating sectors
        this.circleLineColor = "black"; // the color of the circle. If not defined, no line will be drawn
        this.circleLineWidth = 2; // thicness of the circle

        this.showingChartKey = function () {
            var caption = (this.showCaptionLocation || "").toUpperCase();
            return caption == "RIGHT" || caption == "LEFT" || caption == "TOP" || caption == "BOTTOM";
        };

        this.showingKeyRight = function () {
            return this.showCaptionLocation.toUpperCase() == "RIGHT";
        };

        this.showingKeyLeft = function () {
            this.showCaptionLocation.toUpperCase() == "LEFT"
        };
    };

    var pieChart = function (canvas, pieChartSettings) {
        var self = this;

        var CIRCLE_ANGLE = 2 * Math.PI;
        var PIE_RADIUS_RATIO = 0.85; // Percentage of the total width/height (whichever is smaller) that will be used for the caption, if enabled
        var MAX_CAPTION_WIDTH_RATIO = 0.5; // The pie will be shrunk up to this ratio of its maximum possible size to make room for the caption. If some caption is wider, it will be clipped
        var PIE_CENTER_Y_OFFSET = 0;  // If Y is positive, it will be offset to the bottom of the center of the canvas
        var ANGLE_ROTATE = CIRCLE_ANGLE * (3 / 4);

        var SHOW_TOOLTIP_AFTER_HOVER_MS = 1500; // Number of ms that must elapse to show the tooltip over a sector indicating value, percentage and name
        var PERCENTAGE_FONT_SIZE_FACTOR = 1.5; // The largest the font size, the farthest the distance (by this factor) from the pie circle
        var PERCENTAGE_FONT_SIZE = 16; // font size in pixels
        var FONT = "ARIAL"; // font name
        var PERCENTAGE_CAPTION_DISTANCE = 5; // distance in pixels between the pie chart and the caption showing the percentage
        var KEY_FONT_SIZE = 14;
        var KEY_BOX_PADDING = 10; // in pixels
        var KEY_BOX_LINEWIDTH = 3;
        var KEY_LINE_HEIGHT_MODIFIER = 1.6; // proportion of the key font size for the line height

        var percentageFontString = PERCENTAGE_FONT_SIZE + "px " + FONT;
        var keyFontString = KEY_FONT_SIZE + "px " + FONT;

        var canvasContext = new helper.CanvasContextHelper(canvas);
        var contextData = getContextData();

        var schedule = createPieSectorSchedule();
        var mouseLastMoved = 0;
        var currentSector = null;

        this.drawPieChart = function () {
            canvasContext.clearContext();
            setContextOrigin();
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
                    drawPieSectorDividingLine(pieChartSettings.sectorLineColor, pieChartSettings.sectorLineWidth, sector.finishingAngle);
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
                        x: Math.cos(sector.bisectingAngle) * ((contextData.radius + contextData.maxTextWidth / 2) + PERCENTAGE_CAPTION_DISTANCE),
                        y: Math.sin(sector.bisectingAngle) * ((contextData.radius + contextData.maxTextHeight / 2) + PERCENTAGE_CAPTION_DISTANCE)
                    };
                    drawText(percentageFontString, 'black', Math.round(sector.percentage) + "%", point);
                }
            }

            if (pieChartSettings.showingChartKey()) {
                drawChartKey();
            }
        };

        function getContextData() {
            var maxTextWidth = canvasContext.getTextSize(percentageFontString, "100%");
            var maxTextHeight = PERCENTAGE_FONT_SIZE + 6;
            var longestCaption = getLongestCaption();
            var longestCaptionWidth = canvasContext.getTextSize("bold " + keyFontString, longestCaption);
            var keyBoxWidth = Math.min(canvas.width * MAX_CAPTION_WIDTH_RATIO, 2 * KEY_BOX_PADDING + KEY_FONT_SIZE * 2 + longestCaptionWidth + 2 * KEY_BOX_LINEWIDTH); // twice the font size will be the square with the color

            var availableWidth = canvas.width - (pieChartSettings.showingChartKey() ? keyBoxWidth : 0);

            var pieMaxSize = Math.min(availableWidth, canvas.height);
            var piepieMaxSize = pieMaxSize * (pieChartSettings.showingChartKey() ? PIE_RADIUS_RATIO : 1);
            var pieWorkingWidth = piepieMaxSize - 2 * (PERCENTAGE_CAPTION_DISTANCE + maxTextWidth);
            var pieWorkingHeight = piepieMaxSize - 2 * (PERCENTAGE_CAPTION_DISTANCE + maxTextHeight);

            var radius = Math.min(pieWorkingWidth, pieWorkingHeight) / 2;
            var xOffset = getXOffset(pieMaxSize, radius);

            return {
                pieMaxSize: pieMaxSize,
                keyBoxWidth: keyBoxWidth,
                maxTextWidth: maxTextWidth,
                maxTextHeight: maxTextHeight,
                piepieMaxSize: pieMaxSize,
                radius: radius,
                xOffset: xOffset
            };
        }

        function getCaptionText(dataSlice) {
            return dataSlice.name + " - " + (dataSlice.valueFormatted || dataSlice.value);
        }

        function getLongestCaption() {
            var widths = pieChartSettings.data.map(function (x) {
                return getCaptionText(x);
            });
            var longestCaption = null;
            var i = 0, len = widths.length;
            for (; i < len; i++) {
                if (!longestCaption || longestCaption.length < widths[i].length) {
                    longestCaption = widths[i];
                }
            }
            return longestCaption;
        }

        function getXOffset(pieMaxSize, radius) {
            if (!pieChartSettings.showingChartKey()) {
                return 0;
            } else {
                var captionpieMaxSize = (pieMaxSize * (1 - PIE_RADIUS_RATIO));
                var xSurplus = canvas.width > canvas.height ? (canvas.width - canvas.height) : 0;
                if (pieChartSettings.showingKeyRight()) {
                    return -(captionpieMaxSize + xSurplus) / 2;
                } else if (pieChartSettings.showingKeyLeft()) {
                    return (captionpieMaxSize + xSurplus) / 2;
                } else {
                    return 0;
                }
            }
        }

        function drawChartKey() {
            var settings = getChartKeySettings();
            canvasContext.restoreOrigin();
            var captions = getCaptions();

            var i = 0, len = captions.length;

            for (; i < len; i++) {
                drawChartKeySquare(i, captions[i], settings);
                drawChartKeyCaption(i, captions[i], settings);
            }

            drawChartKeyRectangle(settings);
        }

        function drawChartKeySquare(index, caption, settings) {
            var y = settings.lineY + index * settings.lineHeight;
            var x = settings.squareX;
            var ctx = canvasContext.context;
            ctx.beginPath();
            ctx.fillStyle = caption.color;
            ctx.rect(x, y, KEY_FONT_SIZE, KEY_FONT_SIZE);
            ctx.fill();

            if (schedule[index] == currentSector) {
                ctx.strokeStyle = "grey";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        function drawChartKeyCaption(index, caption, settings) {
            var y = settings.lineY + index * settings.lineHeight;
            var x = settings.lineX;

            var font = schedule[index] == currentSector ? "bold " + keyFontString : keyFontString;

            drawText(font, 'black', caption.caption, { x: x, y: y }, "left", "top");
        }

        function drawChartKeyRectangle(settings) {
            var ctx = canvasContext.context;
            ctx.beginPath();
            ctx.strokeStyle = pieChartSettings.circleLineColor;
            ctx.lineWidth = KEY_BOX_LINEWIDTH;
            ctx.rect(settings.boxStartPoint.x, settings.boxStartPoint.y, settings.width, settings.height);
            ctx.stroke();
        }

        function getChartKeySettings() {
            var keyBoxHeight = getBoxHeight();
            var xPoint = pieChartSettings.showingKeyLeft() ? 0 : canvas.width - contextData.keyBoxWidth - KEY_BOX_LINEWIDTH;
            var yPoint = (canvas.height - keyBoxHeight) / 2;

            var squareX = xPoint + KEY_BOX_PADDING + KEY_FONT_SIZE / 2;
            var captionX = squareX + KEY_FONT_SIZE * 1.5;

            function getBoxHeight() {
                return KEY_FONT_SIZE * KEY_LINE_HEIGHT_MODIFIER * pieChartSettings.data.length + 2 * (KEY_BOX_PADDING + KEY_BOX_LINEWIDTH);
            }

            return {
                height: keyBoxHeight,
                width: contextData.keyBoxWidth,
                boxStartPoint: {
                    x: xPoint,
                    y: yPoint
                },
                lineHeight: KEY_FONT_SIZE * KEY_LINE_HEIGHT_MODIFIER,
                lineX: captionX,
                lineY: yPoint + KEY_BOX_PADDING + KEY_LINE_HEIGHT_MODIFIER,
                squareX: squareX
            };
        }

        var mouseEvents = (function () {
            var previousSector = null;

            var onMouseMove = function (event) {
                setContextOrigin();
                var rect = this.getBoundingClientRect();
                var point = {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                };

                var previousSector = currentSector;
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

                if ((currentSector === null && previousSector !== null) ||
                    (currentSector !== null && previousSector === null) ||
                    (currentSector !== null && previousSector !== null && currentSector.startingAngle !== previousSector.startingAngle)) {
                    //console.log("Drawing");
                    self.drawPieChart(); // redraw
                }

                canvasContext.restoreOrigin();
 
                setTimeout(function () {
                    if (mouseLastMoved == lastMoved && currentSector && currentSectorInternal == currentSector) {
                        // draw tooltip with name + value + percentage
                    }
                }, SHOW_TOOLTIP_AFTER_HOVER_MS);

            };
            return {
                onMouseMove: onMouseMove
            };
        })();
        
        $(canvas).mousemove(mouseEvents.onMouseMove);

        function getCaptions() {
            return pieChartSettings.data.map(function (value, index) {
                return {
                    caption: value.name + " - " + value.valueFormatted,
                    color: getColor(index)
                }
            });
        }

        function setContextOrigin() {
            var center = new helper.CenterPoint(canvas.width, canvas.height, contextData.xOffset, PIE_CENTER_Y_OFFSET);
            canvasContext.changeOrigin(center.x, center.y);
        }

        function isInsideSector(point, sector) {
            var ctx = canvasContext.context;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(sector.startingAngle) * contextData.radius, Math.sin(sector.startingAngle) * contextData.radius);
            ctx.arc(0, 0, contextData.radius, sector.startingAngle, sector.finishingAngle);
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(sector.finishingAngle) * contextData.radius, Math.sin(sector.finishingAngle) * contextData.radius);

            var result = ctx.isPointInPath(point.x, point.y);
            ctx.closePath();
            return result;
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
            rotateSectorSchedule(schedule);
            return schedule;
        }

        function rotateSectorSchedule(schedule) {
            if (schedule.length > 0) {
                var sector1 = schedule[0];
                var rotateBy = ANGLE_ROTATE - sector1.angle / 2;
                var i, len = schedule.length;
                for (i = 0; i < len; i++) {
                    var sector = schedule[i];
                    sector.startingAngle = (sector.startingAngle + rotateBy) % CIRCLE_ANGLE;
                    sector.finishingAngle = (sector.finishingAngle + rotateBy) % CIRCLE_ANGLE;
                    sector.bisectingAngle = (sector.bisectingAngle + rotateBy) % CIRCLE_ANGLE;
                }
            }
        }

        function getAvailableWidth(bisectingWidth) {
            return Math.round(bisectingWidth) - (pieChartSettings.sectorLineWidth || 0) - 2;
        }

        function drawPieSector(color, startingAngle, finishingAngle) {
            var context = canvasContext.context;
            context.fillStyle = color;
            context.beginPath();
            context.moveTo(0, 0);
            context.arc(0, 0, contextData.radius, startingAngle, finishingAngle);
            context.fill();
        }

        function drawPieSectorDividingLine(color, lineWidth, angle) {
            var context = canvasContext.context;
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            context.lineCap = "round";
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(Math.cos(angle) * contextData.radius, Math.sin(angle) * contextData.radius);
            context.stroke();
        }

        function drawCircle(color, strokeWidth) {
            var context = canvasContext.context;
            context.strokeStyle = color;
            context.lineWidth = strokeWidth;
            context.beginPath();
            context.arc(0, 0, contextData.radius, 0, 2 * Math.PI);
            context.stroke();
        }

        function drawText(font, color, text, position, textAlign, textBaseline) {
            var context = canvasContext.context;
            context.fillStyle = color;
            context.textAlign = textAlign || "center";
            context.textBaseline = textBaseline || "middle";
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
        getPieChartSettings: createPieChartSettings,
        helper: helper
    };
}());

$(function () {
    var data =
       [{ value: 46, valueFormatted: "46 million", name: "Spain" },
        { value: 80, valueFormatted: "80 million", name: "Germany" },
        { value: 66, valueFormatted: "66 million", name: "France" },
        { value: 64, valueFormatted: "64 million", name: "United Kingdom" },
        { value: 38, valueFormatted: "38 million", name: "Poland" },
        { value: 17, valueFormatted: "17 million", name: "Netherlands" },
        { value: 11, valueFormatted: "11 million", name: "Belgium" },
        { value: 10, valueFormatted: "10 million", name: "Portugal" }].sort(function (x, y) {
            return -(x.value - y.value);
        });

    var data =
        [{ value: 25000, valueFormatted: "25.000 €", name: "Dinero invertido" }
        ];
    var settings = new SERFUEN.getPieChartSettings(data);
    settings.showCaptionLocation = "right";
    settings.animationSpeed = 1000;
    $('#test_canvas').pieChart(settings);
});