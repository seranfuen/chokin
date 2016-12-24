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
along with this program.  If not, see <http://www.gnu.org/licenses/>. */

var SERFUEN = (function () {
    var chartHelper = {
        // A point at the center of a rectangular space defined by its width and height, and optionally initialized relative to that point offset by x and y
        CenterPoint: function (width, height, xOffset, yOffset) {
            this.xOffset = xOffset || 0;
            this.yOffset = yOffset || 0;
            this.x = width / 2 + this.xOffset;
            this.y = height / 2 + this.yOffset;
        },
        CanvasContextchartHelper: function (canvas) {
            this.canvas = canvas;
            this.context = this.canvas.getContext("2d");
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.origin = { x: 0, y: 0 };
        }
    };

    chartHelper.CenterPoint.prototype = {
        // Gets another point relative to the center point, offset by "x" and "y"
        getRelativePosition: function (xOffset, yOffset) {
            return {
                x: this.x + xOffset,
                y: this.y + yOffset
            };
        }
    };

    chartHelper.CanvasContextchartHelper.prototype = {
        // Clears (deletes) all elements in the context. It restores the coordinate origin
        clearContext: function () {
            this.restoreOrigin();
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        // For the font type-size and text passed, determines the width of the text in pixels
        getTextSize: function (font, text) {
            this.context.font = font;
            return this.context.measureText(text).width;
        },
        // Changes 
        changeOrigin: function (x, y) {
            this.restoreOrigin();
            this.origin = {
                x: x,
                y: y
            };
            this.context.translate(x, y);
        },
        restoreOrigin: function () {
            this.context.translate(-this.origin.x, -this.origin.y);
            this.origin = {
                x: 0,
                y: 0
            };
        }
    };

    /* A template with the settings that must be passed to the pie chart. It is exported so the client can
       set up a pie chart. The compulsory data to pass is the chartData, which is an array-like collection of objects
       with the properties
       value : the numerical value of each slice of the pie. It is needed to set the proportions
       valueFormatted : optionally, the same value but given a format to display (For example, in currency)
       name: the name that the data slice represents

       The rest of the properties may be changed by the client if so desired. They mainly set the color palette, line width and color, wheteher to show a chart key or percentages
    */
    var PieChartInitializer = function (chartData) {
        this.setData(chartData);
        this.showPercentageInSectors = true; // show the percentage each sector represents next to it
        this.showCaptionLocation = "right"; // show a caption box if defined as right or left. If undefined or value unknown, no caption will be shown

        // APPEARANCE
        this.colorPalette = ["gray", "blue", "orange", "green", "pink", "brown", "purple", "yellow", "red"]; // color palette, colors will repeat if more values than colors
        this.sectorLineColor = "LightGray"; // the color of the line separating sectors. If not defined, no line will be drawn
        this.sectorLineWidth = 2; // thickness of line separating sectors
        this.circleLineColor = "black"; // the color of the circle. If not defined, no line will be drawn
        this.circleLineWidth = 2; // thicness of the circle
    };

    PieChartInitializer.prototype = {
        calculateTotal: function (data) {
            return data.map(function (x) {
                return x.value;
            }).reduce(function (x, y) {
                return x + y;
            });
        },
        setData: function (data) {
            this.data = data || [];
            this.total = this.calculateTotal(this.data);
        },
        showingChartKey: function () {
            return this.showingKeyRight() || this.showingKeyLeft();
        },
        showingKeyRight: function () {
            return this.showCaptionLocation !== null && this.showCaptionLocation.toUpperCase() == "RIGHT";
        },
        showingKeyLeft: function () {
            return this.showCaptionLocation !== null && this.showCaptionLocation.toUpperCase() == "LEFT";
        }
    };

    var PieChart = function (canvas, pieChartSettings) {
        var self = this;
        var LINE_HEIGHT_MULTIPLIER = 1.6;

        var FONT_SCALE = 0.02;

        var FONT = "ARIAL"; // font name
        var PERCENTAGE_CAPTION_DISTANCE = 5; // distance in pixels between the pie chart and the caption showing the percentage
        var KEY_BOX_PADDING = 10; // in pixels
        var KEY_BOX_LINEWIDTH = 3;

        var fontSizeRange = {
            getFontSizes: function (canvasWidth, canvasHeight) {
                var sizeBase = Math.min(canvasWidth, canvasHeight);

                var fontSize = getFontSize();
                var lineHeight = getLineHeight() + fontSize;

                function getFontSize() {
                    if (sizeBase < 400) {
                        return 10;
                    }
                    else if (sizeBase >= 400 && sizeBase < 800) {
                        return 14 + 0.025 * (sizeBase - 400);
                    } else {
                        return 24;
                    }
                }

                function getLineHeight() {
                    if (sizeBase < 400) {
                        return 2;
                    } else if (sizeBase > 400 && sizeBase <= 800) {
                        return 2 + 3 / (800 - 400);
                    } else {
                        return 6;
                    }
                }

                return {
                    fontSize: fontSize,
                    lineHeight: lineHeight
                };
            }
        };


        var canvasContext = new chartHelper.CanvasContextchartHelper(canvas);
        var fontMeasures = fontSizeRange.getFontSizes(canvas.width, canvas.height);

        var percentageFontString = fontMeasures.fontSize + "px " + FONT;
        var keyFontString = fontMeasures.fontSize + "px " + FONT;
        var lineHeight = fontMeasures.lineHeight;
        var contextData = getContextData();

        var schedule = createPieSectorSchedule();
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

                    var point = {
                        x: Math.cos(sector.bisectingAngle) * ((contextData.radius + contextData.maxTextWidth / 2) + PERCENTAGE_CAPTION_DISTANCE),
                        y: Math.sin(sector.bisectingAngle) * ((contextData.radius + contextData.maxTextHeight / 2) + PERCENTAGE_CAPTION_DISTANCE)
                    };
                    drawText(percentageFontString, 'black', text, point);
                }
            }

            if (pieChartSettings.showingChartKey()) {
                drawChartKey();
            }
        };

        this.disable = function () {
            canvas.removeEventListener("mousemove", mouseEvents.onMouseMove);
            canvasContext.clearContext();
        };

        this.setData = function (data) {
            pieChartSettings.setData(data);
            contextData = getContextData();
            schedule = createPieSectorSchedule();
        };

        function getContextData() {
            var PIE_RADIUS_RATIO = 0.85,
                MAX_CAPTION_WIDTH_RATIO = 0.5, // The pie will be shrunk up to this ratio of its maximum possible size to make room for the caption. If some caption is wider, it will be clipped // Percentage of the total width/height (whichever is smaller) that will be used for the caption, if enabled
                maxTextWidth = canvasContext.getTextSize(percentageFontString, "100%"),
                longestCaption = getLongestCaption(),
                longestCaptionWidth = canvasContext.getTextSize("bold " + keyFontString, longestCaption),
                keyBoxWidth = Math.min(canvas.width * MAX_CAPTION_WIDTH_RATIO, 2 * KEY_BOX_PADDING + fontMeasures.fontSize * 2 + longestCaptionWidth + 2 * KEY_BOX_LINEWIDTH); // twice the font size will be the square with the color

            var availableWidth = canvas.width - (pieChartSettings.showingChartKey() ? keyBoxWidth : 0);

            var pieMaxSize = Math.min(availableWidth, canvas.height);
            var piepieMaxSize = pieMaxSize * (pieChartSettings.showingChartKey() ? PIE_RADIUS_RATIO : 1);
            var pieWorkingWidth = piepieMaxSize - 2 * (PERCENTAGE_CAPTION_DISTANCE + fontMeasures.lineHeight);
            var pieWorkingHeight = piepieMaxSize - 2 * (PERCENTAGE_CAPTION_DISTANCE + fontMeasures.lineHeight);

            var radius = Math.min(pieWorkingWidth, pieWorkingHeight) / 2;
            var xOffset = getXOffset();

            function getXOffset() {
                if (!pieChartSettings.showingChartKey()) {
                    return 0;
                } else if (pieChartSettings.showingKeyRight()) {
                    return -(canvas.width - (canvas.width - keyBoxWidth)) / 2
                } else if (this.pieChartSettings.showingKeyLeft()) {
                    return (canvas.width - keyBoxWidth) / 2;
                } else {
                    return 0;
                }
            }

            return {
                pieMaxSize: pieMaxSize,
                keyBoxWidth: keyBoxWidth,
                maxTextWidth: maxTextWidth,
                maxTextHeight: fontMeasures.lineHeight,
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
            ctx.rect(x, y, fontMeasures.fontSize, fontMeasures.fontSize);
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

            drawText(font, 'black', caption.caption, { x: x, y: y }, "left", "hanging");
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

            var squareX = xPoint + KEY_BOX_PADDING + fontMeasures.fontSize / 2;
            var captionX = squareX + fontMeasures.fontSize * 1.5;

            function getBoxHeight() {
                return fontMeasures.lineHeight * pieChartSettings.data.length + 2 * (KEY_BOX_PADDING + KEY_BOX_LINEWIDTH);
            }

            return {
                height: keyBoxHeight,
                width: contextData.keyBoxWidth,
                boxStartPoint: {
                    x: xPoint,
                    y: yPoint
                },
                lineHeight: fontMeasures.lineHeight,
                lineX: captionX,
                lineY: yPoint + (KEY_BOX_PADDING + fontMeasures.lineHeight) / 2,
                squareX: squareX
            };
        }

        var mouseEvents = (function () {
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

                var currentSectorInternal = currentSector;

                if ((currentSector === null && previousSector !== null) ||
                    (currentSector !== null && previousSector === null) ||
                    (currentSector !== null && previousSector !== null && currentSector.startingAngle !== previousSector.startingAngle)) {
                    self.drawPieChart(); // redraw
                }
                canvasContext.restoreOrigin();
            };
            return {
                onMouseMove: onMouseMove
            };
        })();

        if (pieChartSettings.showingChartKey()) {
            canvas.addEventListener("mousemove", mouseEvents.onMouseMove);
        }

        function getCaptions() {
            return pieChartSettings.data.map(function (value, index) {
                return {
                    caption: value.name + " - " + value.valueFormatted,
                    color: getColor(index)
                };
            });
        }

        function setContextOrigin() {
            var PIE_CENTER_Y_OFFSET = 0,  // If Y is positive, it will be offset to the bottom of the center of the canvas
                center = new chartHelper.CenterPoint(canvas.width, canvas.height, contextData.xOffset, PIE_CENTER_Y_OFFSET);
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

        function createPieSectorSchedule() {
            var CIRCLE_ANGLE = 2 * Math.PI;
            var ANGLE_ROTATE = CIRCLE_ANGLE * (3 / 4);

            var data = pieChartSettings.data,
                schedule = [],
                currentAngle = 0,
                i,
                len,
                getSectorSchedule = function () {
                    var color = getColor(i),
                        value = data[i].value,
                        sectorAngle = data[i].value * (CIRCLE_ANGLE / pieChartSettings.total);
                    return {
                        startingAngle: currentAngle,
                        finishingAngle: Math.min(CIRCLE_ANGLE, sectorAngle + currentAngle),
                        angle: sectorAngle,
                        value: value,
                        color: color,
                        bisectingAngle: (sectorAngle / 2) + currentAngle,
                        percentage: (value / pieChartSettings.total) * 100,
                        getBisectingWidth: function (radius) {
                            return Math.sin(sectorAngle / 2) * radius;
                        },
                        isMouseOver: false
                    };
                },
                rotateSectorSchedule = function () {
                    if (schedule.length > 1) {
                        var sector1 = schedule[0];
                        var rotateBy = ANGLE_ROTATE - sector1.angle / 2;
                        var i, len = schedule.length;
                        for (i = 0; i < len; i++) {
                            var sector = schedule[i];
                            sector.startingAngle = (sector.startingAngle + rotateBy) % CIRCLE_ANGLE;
                            sector.finishingAngle = (sector.finishingAngle + rotateBy) % CIRCLE_ANGLE;
                            sector.bisectingAngle = (sector.bisectingAngle + rotateBy) % CIRCLE_ANGLE;
                        }
                    } else if (schedule.length == 1) {
                        var sector1 = schedule[0];
                        sector1.bisectingAngle = (sector1.angle / 2 - ANGLE_ROTATE) % CIRCLE_ANGLE;
                    }
                };

            for (i = 0, len = data.length; i < len; i++) {
                schedule[i] = getSectorSchedule();
                currentAngle += schedule[i].angle;
            }

            // Fix color of last element if it's the same as the first to avoid two identical contiguous sectors. Will take the sector in the middle. Will not work if only 2 colors and 3 sectors
            if (schedule[schedule.length - 1].color == schedule[0].color) {
                schedule[schedule.length - 1].color = getColor(Math.round((schedule.length - 1) / 2));
            }
            rotateSectorSchedule();
            return schedule;
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

    PieChart.VERSION = "0.0.1";
    PieChart.cache = [];
    PieChart.PieChartContext = function (elementId, pieChartSettings) {
            var canvasElement = document.getElementById(elementId);
            var pieChart = new PieChart(canvasElement, pieChartSettings);

            this.show = function () {
                pieChart.drawPieChart();
            };

            this.hide = function () {
                pieChart.disable();
            };

            this.setData = function (data) {
                pieChart.setData(data);
                pieChart.drawPieChart();
            };
        }

    var makePieChart = function (elementId, pieChartSettings) {
        if (!(elementId in PieChart.cache)) {
            PieChart.cache.elementId = new PieChart.PieChartContext(elementId, pieChartSettings);
        }
        return PieChart.cache.elementId;
    };

    return {
        // We export a chartHelper function that allows retrieving a default settings object for the pie, with the data passed by the caller
        getPieChartSettings: PieChartInitializer,
        pieChart: makePieChart,
    };
} ());

//$(function () {
//    var data =
//        [{ value: 46, valueFormatted: "46 million", name: "Spain" },
//        { value: 80, valueFormatted: "80 million", name: "Germany" },
//        { value: 66, valueFormatted: "66 million", name: "France" },
//        { value: 64, valueFormatted: "64 million", name: "United Kingdom" },
//        { value: 38, valueFormatted: "38 million", name: "Poland" },
//        { value: 17, valueFormatted: "17 million", name: "Netherlands" },
//        { value: 11, valueFormatted: "11 million", name: "Belgium" },
//        { value: 10, valueFormatted: "10 million", name: "Portugal" }].sort(function (x, y) {
//            return -(x.value - y.value);
//        });


//    var settings = new SERFUEN.getPieChartSettings(data);
//    settings.showCaptionLocation = "right";
//    var pie = SERFUEN.pieChart("test_canvas", settings);
//    pie.show();
//    $("#boton").click(function () {
//        var data =
//            [{ value: 25000, valueFormatted: "25.000 €", name: "Dinero invertido" },
//            { value: 80000, valueFormatted: "80.000 €", name: "Dinero en depósito" }
//            ];
//        pie.setData(data);
//    });
//});