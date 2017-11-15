(function (angular) {
    'use strict';

    angular
        .module('smartEnergy.timeseries')
        .controller('timeSeriesController', timeSeriesController);

    function timeSeriesController($http, $rootScope, $scope) {
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
            var url = 'app/features/timeseries/mock_data.json';

            return $http({ method: 'GET', url: url })
                .then(function (result) {
                    vm.data = _(result.data)
                        .sortBy('validTime')
                        .filter(function (date) {
                            return moment(date.validTime).valueOf() > vm.dateChange.startDate
                                && moment(date.validTime).valueOf() < vm.dateChange.endDate;
                        })
                        .value();

                    $rootScope.$broadcast('data:change', {
                        data: vm.data
                    });
                });
        }

        function plotChart() {
            Highcharts.chart('container', getChartConfig());
        }

        function getCategories() {
            vm.categories = _.map(vm.data, function (e) {
                return moment(e.validTime).tz('UTC');
            });
            return vm.categories;
        }

        function getSplineData() {
            vm.splineData = _.map(vm.data, function (e) {
                return e.energy;
            });
            vm.min = _.min(vm.splineData);
            vm.max = _.max(vm.splineData);

            return vm.splineData;
        }

        function getMinValue() {
            vm.min = _.min(vm.splineData);

            return vm.min;
        }

        function getMaxValue() {
            vm.max = _.max(vm.splineData);

            return vm.max;
        }

        function getXAxis() {
            var output;

            if (_.get(vm.dateChange, ['dateRange', 'name']) === 'daily') {
                output = {
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
                    }]
                }
            } else {
                output = {
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
                    }]
                }
            }

            return output;
        }

        function getChartConfig() {
            return {
                chart: {
                    type: 'column'
                },
                series: [{
                    yAxis: 0,
                    stacking: 'normal',
                    data: getSplineData()
                }, {
                    yAxis: 0,
                    type: 'spline',
                    data: getSplineData()
                }],
                xAxis: getXAxis(),
                yAxis: [{ // Primary yAxis
                    min: getMinValue(),
                    max: getMaxValue(),
                    tickInterval: 10
                }]
            };
        }
    }
})(angular);