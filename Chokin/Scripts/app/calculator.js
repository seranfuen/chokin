﻿var CHOKIN_FINANCES =
{
    Currency : '€',

    toCurrencyRound : function(value) {
        return Math.round(value).toLocaleString() + ' €';
    },

    MortageCalculator: function (nominal, downpaymentPercentage, interestRate, years) {
        this.Nominal = nominal;
        this.DownpaymentPercentage = downpaymentPercentage;
        this.Downpayment = this.Nominal * downpaymentPercentage / 100;
        this.Principal = this.Nominal - this.Downpayment;
        this.InterestRate = interestRate;
        this.MonthlyRate = interestRate / (12 * 100);
        this.Years = years;

        this.getMonthlyPayment = function() {
            // C = Principal / ([1-(1+r)^-n]/r)
            var cap = (1 - Math.pow((1 + this.MonthlyRate), -this.Years * 12)) / this.MonthlyRate;
            return this.Principal / cap;
        }

        this.getTotalWithInterest = function () {
            return this.getMonthlyPayment() * this.Years * 12;
        }

        this.getTotalInterests = function () {
            return this.getTotalWithInterest() - this.Principal;
        }

        this.setPrincipal = function (principal) {
            this.Nominal = principal;
            this.recalculatePrincipal();
        };

        this.recalculatePrincipal = function() {
            this.Downpayment = (this.DownpaymentPercentage / 100) * this.Nominal;
            this.Principal = this.Nominal - this.Downpayment;
        }

        this.setDownpayment = function (downpaymentPercentage) {
            this.DownpaymentPercentage = downpaymentPercentage;
            this.recalculatePrincipal();
        }

        this.setInterest = function (interest) {
            this.InterestRate = interest;
            this.MonthlyRate = interest / (12 * 100);
        }
    }
};

$(function () {
    var defaultPrincipal = 100000;
    var defaultDownpayment = 20;
    var defaultInterest = 2;
    var defaultYears = 30;

    var calculator = new CHOKIN_FINANCES.MortageCalculator(defaultPrincipal, defaultDownpayment, defaultInterest, defaultYears);
    var data = [];

    var options = {
        data : data,
        colorPalette: ["#006400", "#228B22"],
        showCaptionLocation : null,
        font : 12
    };

    var chartDrawer = SERFUEN.pieChart("graph_interests", options);

    var setSlider = function (setting) {

        var onValueChanged = function (event, ui) {
            setting.responseFunction(ui.value);
            $('#monthly_payment').text(calculator.getMonthlyPayment().toFixed(2) + ' €');
            $('#total_with_interest').text(Math.round(calculator.getTotalWithInterest()).toLocaleString() + ' €');
            $('#total_interests').text(Math.round(calculator.getTotalInterests()).toLocaleString() + ' €');
            $('#total_loan').text(Math.round(calculator.Principal).toLocaleString() + ' €');

            var interests = calculator.getTotalWithInterest() - calculator.Principal;

            var data = [
                { value: calculator.getTotalWithInterest() - calculator.Principal, valueFormatted : CHOKIN_FINANCES.toCurrencyRound(interests), name : "Interests"  },
                { value: calculator.Principal, valueFormatted : CHOKIN_FINANCES.toCurrencyRound(calculator.Principal), name : "Principal" }
            ];

            chartDrawer.setData(data);
        };

        $(setting.slider_id).slider(
        {
            orientation: "horizontal",
            range: false,
            min: setting.min,
            max: setting.max,
            value: setting.defaultValue,
            step: setting.step,
            animate: true,
            slide: onValueChanged,
            change: onValueChanged,
            create: function (event, ui) {
                $(this).slider('value', setting.defaultValue);
            }
            
        });
    }

    // Default settings for all sliders, we also define the response function when the value changes
    var sliderSettings =
    [
        {
            slider_id: '#principal_input',
            min: 20000,
            max: 500000,
            step: 5000,
            defaultValue: defaultPrincipal,
            responseFunction: function (value)
            {
                calculator.setPrincipal(value);
                $('#principal').val(parseInt(value.toFixed(0)).toLocaleString() + ' €');
            }
        },
        {
            slider_id: '#downpayment_input',
            min: 0,
            max: 100,
            step: 5,
            defaultValue : defaultDownpayment,
            responseFunction: function (value) {
                calculator.setDownpayment(value);
                $('#downpayment').text(value + '%');
            }
        },
        {
            slider_id: '#interest_input',
            min: 0.01,
            max: 5,
            step: 0.05,
            defaultValue: defaultInterest,
            responseFunction: function (value) {
                calculator.setInterest(value);
                $('#interest').text(value + '%');
            }
        },
        {
            slider_id: '#years_input',
            min: 5,
            max: 40,
            step: 5,
            defaultValue: defaultYears,
            responseFunction: function (value) {
                calculator.Years = value;
                $('#years').text(value + ' years')
            }
        },
    ];

    for (var i = 0; i < sliderSettings.length; i++) {
        setSlider(sliderSettings[i]);
    }

    $("#principal").focusin(function () {
        initialPrincipal = $(this).val().replace(',', '').replace('.', '').match(/\d+/)[0];
        $(this).select();
    });

    $("#principal").focusout(function () {
        var value = $('#principal').val();
        if (!isNaN(value)) {
            if ($('#principal_input').slider('option', 'max') < value) {
                $('#principal_input').slider('option', 'max', value);
            }
            $('#principal_input').slider('value', value);
        } else {
            $('#principal_input').slider('value', initialPrincipal);
        }
    });

    $("#principal").keyup(function(e) {
        if (e.keyCode == 13) {
            $(this).blur();
        }
    });
});