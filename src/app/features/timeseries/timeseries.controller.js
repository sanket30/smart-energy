(function (angular) {
    'use strict';

    angular
        .module('smartEnergy.timeseries')
        .controller('timeSeriesController', timeSeriesController);

    function timeSeriesController($http) {
        var vm = this;
        vm.categories = [];

        vm.$onInit = init;

        function init() {
            getData().then(function () {
                plotChart();
            });
        }

        function getData() {
            return $http({ method: 'GET', url: 'app/features/timeseries/mock_data.json' })
                .then(function (result) {
                    vm.data = _.sortBy(result.data, ['validTime']);
                });
        }

        function plotChart() {
            Highcharts.chart('container', getChartConfig());
        }

        function getCategories() {
            vm.categories = _.map(vm.data, function (e) {
                return new Date(e.validTime);
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
                    yAxis: 1,
                    type: 'spline',
                    data: getSplineData()
                }],
                xAxis: {
                    categories: getCategories(),
                    tickInterval: 100
                },

                yAxis: [{ // Primary yAxis
                    min: getMinValue(),
                    max: getMaxValue(),
                    tickInterval: 100
                }, { // Secondary yAxis
                    min: getMinValue(),
                    max: getMaxValue(),
                    tickInterval: 10,
                    opposite: true
                }]
            };
        }
    }
})(angular);