(function (angular) {
    'use strict';

    angular
        .module('smartEnergy.solar')
        .controller('solarController', solarController);

    function solarController($http, $scope) {
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

        vm.$onInit = init;

        $scope.$on('date:change', function (event, val) {
            vm.dateChange = val;
            init();
        });

        function init() {
            getData().then(function () {
                plotChart();
            });
        }

        function getData() {
            var url = 'app/components/solar/mock_data.json';

            return $http({ method: 'GET', url: url })
                .then(function (result) {
                    vm.data = _(result.data)
                        .sortBy('dateTime')
                        .filter(function (date) {
                            return moment(date.dateTime).valueOf() > vm.dateChange.startDate
                                && moment(date.dateTime).valueOf() < vm.dateChange.endDate;
                        })
                        .value();
                });
        }

        function plotChart() {
            Highcharts.chart('solar', getChartConfig());
        }

        function getCategories() {
            vm.categories = _.map(vm.data, function (e) {
                return moment(e.dateTime).tz('UTC');
            });

            return vm.categories;
        }

        function getSplineData() {
            vm.splineData = _.map(vm.data, function (e) {
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
                        color: 'red', // Color value
                        dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                        value: moment().hour() + moment().minute() / 60, // Value of where the line will appear
                        width: 2, // Width of the line
                        zIndex: 4
                    }],
                    plotBands: [{ // mark the weekend
                        color: '#ffae83',
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
                        color: 'red', // Color value
                        dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                        value: moment().diff(moment(_.get(vm.dateChange, 'startDate')), 'days') * 24, // Value of where the line will appear
                        width: 2, // Width of the line
                        zIndex: 4
                    }],
                    plotBands: [{ // mark the weekend
                        color: '#ffae83',
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
                    text: 'Solar Consumption'
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
                series: [{
                    yAxis: 0,
                    stacking: 'normal',
                    name: 'Solar Delivered',
                    data: getSplineData()
                }, {
                    yAxis: 0,
                    type: 'spline',
                    name: 'Usage Point',
                    data: getSplineData()
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