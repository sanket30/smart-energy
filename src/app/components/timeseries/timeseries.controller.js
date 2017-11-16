(function (angular) {
    'use strict';

    angular
        .module('smartEnergy.timeseries')
        .controller('timeSeriesController', timeSeriesController);

    function timeSeriesController($q, $http, $rootScope, $scope) {
        var vm = this;
        var solarData;
        var consumptionData;


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
            $q.all([
                getSolarData(),
                getConsumptionData()
            ]).then(function () {
                $rootScope.$broadcast('data:change', {
                    data: vm.solarData,
                    dateChange: vm.dateChange
                });
                $rootScope.$broadcast('forecast:change', {
                    solarData: solarData,
                    consumptionData: consumptionData
                });
                plotChart();
            });
        }


        function getSolarData() {
            var url = 'app/components/timeseries/mock_data.json';

            return $http({ method: 'GET', url: url })
                .then(function (result) {
                    solarData = _.sortBy(result.data, ['dateTime']);

                    vm.solarData = _(solarData)
                        .filter(function (date) {
                            return moment(date.dateTime).valueOf() > vm.dateChange.startDate
                                && moment(date.dateTime).valueOf() < vm.dateChange.endDate;
                        })
                        .value();
                });
        }

        function getConsumptionData() {
            var url = 'app/components/energy-consumption-data/energyPH.json';

            return $http({ method: 'GET', url: url })
                .then(function (result) {
                    consumptionData = _.sortBy(result.data, ['dateTime']);

                    vm.consumptionData = _(consumptionData)
                        .filter(function (date) {
                            return moment(date.dateTime).valueOf() > vm.dateChange.startDate
                                && moment(date.dateTime).valueOf() < vm.dateChange.endDate;
                        })
                        .value();
                });
        }

        function plotChart() {
            Highcharts.chart('container', getChartConfig());
        }

        function getCategories() {
            vm.categories = _.map(vm.solarData, function (e) {
                return moment(e.dateTime).tz('UTC');
            });

            return vm.categories;
        }

        function getSolarSplineData() {
            vm.splineData = _.map(vm.solarData, function (e) {
                return e.energy;
            });

            return vm.splineData;
        }

        function getConsumptionSplineData() {
            return _.map(vm.consumptionData, function (e) {
                return parseInt(e.gridEnergy);
            });
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
                    text: 'Energy Consumption',
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
                        stacking: 'normal',
                        name: 'Grid Delivered',
                        data: getConsumptionSplineData()
                    },
                    {
                        yAxis: 0,
                        stacking: 'normal',
                        color: '#7ED41C',
                        name: 'Renewable Delivered',
                        data: getSolarSplineData()
                    }, {
                        yAxis: 0,
                        type: 'spline',
                        name: 'Renewable Produced',
                        data: getSolarSplineData()
                    }
                ],
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