(function (angular) {
    'use strict';

    angular
        .module('smartEnergy.solar')
        .controller('solarController', solarController);

    function solarController($http, $scope) {
        var vm = this;
        vm.categories = [];
        vm.dateChange = {};

        vm.$onInit = init;

        $scope.$on('date:change', function (event, val) {
            vm.dateChange = val;
            if (_.get(vm.dateChange, ['dateRange', 'name']) === 'daily') {
                init('test');
            } else {
                init() ;
            }
        });

        function init(test) {
            getData(test).then(function () {
                plotChart();
            });
        }

        function getData(test) {
            var url = test ? 'app/components/solar/mock_data_daily.json' : 'app/components/solar/mock_data.json';

            return $http({ method: 'GET', url: url })
                .then(function (result) {
                    vm.data = _.sortBy(result.data, ['validTime']);
                });
        }

        function plotChart() {
            Highcharts.chart('solar', getChartConfig());
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
                        value: moment().hour() + moment().minute()/60, // Value of where the line will appear
                        width: 2, // Width of the line
                        zIndex:4
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
                        width: 2 // Width of the line
                    }]
                }
            }

            return output;
        }

        function getChartConfig() {
            return {
                chart: {
                    type: 'column',
                    width: 300
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