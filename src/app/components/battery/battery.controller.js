(function (angular) {
    'use strict';

    angular
        .module('smartEnergy.battery')
        .controller('batteryController', batteryController);

    function batteryController($http, $rootScope, $scope) {
        var vm = this;
        vm.categories = [];
        vm.dateChange = {
            startDate: moment(new Date(moment().subtract(1, 'days').format('LLLL'))).valueOf() - (new Date() - new Date().setHours(0, 0, 0, 0)),
            endDate: moment(new Date(moment().format('LLLL'))).valueOf() - (new Date() - new Date().setHours(0, 0, 0, 0)),
            dateRange: {
                name: "daily",
                date: 1
            }
        };
        var EMERGENCY_STORAGE = 50;
        var MAX_STORAGE = 250;
        var usedBatteryData = [];
        var storedBatteryData = [];
        var solarData;

        vm.$onInit = init;

        $scope.$on('data:change', function (event, val) {
            solarData = val.data;
            vm.dateChange = val.dateChange
            init();
        });

        function init() {
            generateBatteryUsage();
            plotChart();
        }

        function generateBatteryUsage() {
            var initialValue = 50 + Math.random() * 10;
            usedBatteryData = [];
            storedBatteryData = [];

            _.forEach(solarData, function(data) {
                var energy = parseFloat(data.energy);
                var storedEnergy;
                var usedEnergy;

                if (energy > 10) {
                    if (initialValue > 150) {
                        storedEnergy = initialValue + energy * 0.01 * 0.8;
                        usedEnergy = energy * 0.99 * 0.9;
                    } else if (initialValue < 150) {
                        storedEnergy = initialValue + energy * 0.1 * 0.8;
                        usedEnergy = energy * 0.9 * 0.9;
                    }
                } else {
                    usedEnergy = initialValue * 0.75;
                    storedEnergy = initialValue * 0.25 + energy * 0.8;
                }


                if (storedEnergy > MAX_STORAGE) {
                    usedEnergy += (storedEnergy - MAX_STORAGE);
                    storedEnergy = MAX_STORAGE;
                } else if (storedEnergy < EMERGENCY_STORAGE) {
                    usedEnergy -= (EMERGENCY_STORAGE - storedEnergy);
                    storedEnergy = EMERGENCY_STORAGE;
                }

                initialValue = storedEnergy;

                usedBatteryData.push(parseFloat((usedEnergy).toFixed(2)));
                storedBatteryData.push(parseFloat((storedEnergy).toFixed(2)));
            });
        }

        function plotChart() {
            Highcharts.chart('battery', getChartConfig());
        }

        function getCategories() {
            vm.categories = _.map(solarData, function (e) {
                return moment(e.dateTime).tz('UTC');
            });
            return vm.categories;
        }

        function getSplineData() {
            vm.splineData = _.map(solarData, function (e) {
                return e.energy;
            });

            return vm.splineData;
        }

        function getXAxis() {
            var output;

            if (_.get(vm.dateChange, ['dateRange', 'name']) === 'daily') {
                output = {
                    title: {
                        text: 'Time'
                    },
                    categories: getCategories(),
                    type: 'datetime',
                    tickInterval: 2,
                    labels: {
                        format: '{value:%H:%M}'
                    },
                    plotLines: [{
                        color: '#696969', // Color value
                        dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                        value: moment().hour() + moment().minute() / 60, // Value of where the line will appear
                        width: 2, // Width of the line
                        zIndex: 4
                    }],
                    plotBands: [{ // mark the weekend
                        color: '#DCDCDC',
                        from: moment().hour() + moment().minute() / 60,
                        to: 24
                    }]
                }
            } else {
                output = {
                    title: {
                        text: 'Time'
                    },
                    categories: getCategories(),
                    type: 'datetime',
                    tickInterval: 20,
                    labels: {
                        format: '{value:%b:%e}'
                    },
                    plotLines: [{
                        color: '#696969', // Color value
                        dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                        value: moment().diff(moment(_.get(vm.dateChange, 'startDate')), 'days') * 24, // Value of where the line will appear
                        width: 2, // Width of the line
                        zIndex: 4
                    }],
                    plotBands: [{ // mark the weekend
                        color: '#DCDCDC',
                        from: moment().diff(moment(_.get(vm.dateChange, 'startDate')), 'days') * 24,
                        to: 1000 // imaginary highest value to end plotband
                    }]
                }
            }

            return output;
        }

        function getChartConfig() {
            return {
                title: {
                    text: 'Battery Level',
                    align: 'left'
                },
                chart: {
                    type: 'column',
                    backgroundColor: '#eff2f9'
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [
                {
                    yAxis: 0,
                    color: '#297DDC',
                    name: 'Battery Available',
                    data: storedBatteryData
                },{
                    yAxis: 0,
                    color: '#2AC7DC',
                    name: 'Battery Used',
                    data: usedBatteryData
                }],
                xAxis: getXAxis(),
                yAxis: [{
                    tickInterval: 10,
                    title: {
                        text: 'KWh'
                    }
                }]
            };
        }
    }
})(angular);