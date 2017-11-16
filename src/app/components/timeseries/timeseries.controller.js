(function (angular) {
    'use strict';

    angular
        .module('smartEnergy.timeseries')
        .controller('timeSeriesController', timeSeriesController);

    function timeSeriesController($q, $http, $rootScope, $scope) {
        var vm = this;
        var consumptionData;
        var forecatUrl = "http://ec2-54-91-170-212.compute-1.amazonaws.com:8080/api/energy-production/forecast/solar";
        var observationUrl = "http://ec2-54-91-170-212.compute-1.amazonaws.com:8080/api/energy-production/observation/solar";
        // var forecatUrl = "http://10.200.201.51:8080/api/energy-production/forecast/solar";
        // var observationUrl = "http://10.200.201.51:8080/api/energy-production/observation/solar";
        var observationData = [];
        var forecastedData = [];
        var braadcastSolarData;
        var braadcastConsumptionData;


        vm.categories = [];
        vm.dateChange = {
            startDate: moment().startOf('day').valueOf(),
            endDate: moment().endOf('day').valueOf(),
            dateRange: {
                name: "daily",
                date: 1
            }
        };

        vm.$onInit = init;
        broadcast5DayPredictions();

        function broadcast5DayPredictions() {
            $q.all([
                broadcast5DayPredictionSolar(forecatUrl),
                broadcast5DayPredictionConsumption()
            ]).then(function () {
                $rootScope.$broadcast('forecast:change', {
                    solarData: braadcastSolarData,
                    consumptionData: braadcastConsumptionData
                });
            });
        }

        function broadcast5DayPredictionSolar(url) {
            var dataUrl = url || 'app/components/timeseries/mock_data.json';
            var data;
            var startDate = moment().add(1, 'days').startOf('day').valueOf();
            var endDate = moment().add(5, 'days').endOf('day').valueOf();

            return $http({ method: 'GET', url: dataUrl })
                .then(function (result) {
                    var solarData = _.sortBy(result.data, ['dateTime']);

                    braadcastSolarData = _(solarData)
                        .filter(function (date) {
                            return moment(date.dateTime).valueOf() >= startDate
                                && moment(date.dateTime).valueOf() < endDate;
                        })
                        .value();
                });
        }

        function broadcast5DayPredictionConsumption() {
            var url = 'app/components/energy-consumption-data/energyPH.json';
            var startDate = moment().add(1, 'days').startOf('day').valueOf();
            var endDate = moment().add(5, 'days').endOf('day').valueOf();

            return $http({ method: 'GET', url: url })
                .then(function (result) {
                    consumptionData = _.sortBy(result.data, ['dateTime']);

                    braadcastConsumptionData = _(consumptionData)
                        .filter(function (date) {
                            return moment(date.dateTime).valueOf() >= startDate
                                && moment(date.dateTime).valueOf() < endDate;
                        })
                        .value();
                });
        }

        $scope.$on('date:change', function (event, val) {
            vm.dateChange = val;
            init();
        });

        function init() {
            vm.solarData = [];
            observationData = [];
            forecastedData = [];

            $q.all([
                // getSolarData(),
                getSolarData(forecatUrl, true),
                getSolarData(observationUrl),
                getConsumptionData()
            ]).then(function () {
                vm.solarData = _.flatten(observationData.concat(forecastedData));
                $rootScope.$broadcast('data:change', {
                    data: vm.solarData,
                    dateChange: vm.dateChange
                });
                
                plotChart();
            });
        }


        // function getSolarData() {
        //     var url = 'app/components/timeseries/mock_data.json';

        //     return $http({ method: 'GET', url: url })
        //         .then(function (result) {
        //             solarData = _.sortBy(result.data, ['dateTime']);

        //             vm.solarData = _(solarData)
        //                 .filter(function (date) {
        //                     return moment(date.dateTime).valueOf() > vm.dateChange.startDate
        //                         && moment(date.dateTime).valueOf() < vm.dateChange.endDate;
        //                 })
        //                 .value();
        //         });
        // }


        function getSolarData(url, isPredicted) {
            var dataUrl = url || 'app/components/timeseries/mock_data.json';
            var data;
            var startDate = isPredicted ? moment().valueOf() : vm.dateChange.startDate;
            var endDate = isPredicted ? vm.dateChange.endDate : moment().valueOf();
            console.log(isPredicted, vm.dateChange);

            if (!url) {
                startDate = vm.dateChange.startDate;
                endDate = vm.dateChange.endDate;
            }

            return $http({ method: 'GET', url: dataUrl })
                .then(function (result) {
                    var solarData = _.sortBy(result.data, ['dateTime']);

                    data = _(solarData)
                        .filter(function (date) {
                            return moment(date.dateTime).valueOf() >= startDate
                                && moment(date.dateTime).valueOf() < endDate;
                        })
                        .value();

                    if (url) {
                        if (isPredicted) {
                            forecastedData = data;
                            console.log('forecastedData', forecastedData);
                        } else {
                            observationData = data;
                        }
                    } else {
                        observationData = data;
                    }
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

            console.log(vm.splineData.length);
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
                        label: {
                            text: 'Prediction range',
                            align: 'center'
                        },
                        from: moment().hour() + moment().minute() / 60,
                        to: 24
                    }]
                }
            } else {
                console.log(_.get(vm.dateChange, ['dateRange', 'date']));
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
                        value: _.get(vm.dateChange, ['dateRange', 'date']) * 24, // Value of where the line will appear
                        width: 2, // Width of the line
                        zIndex: 4
                    }],
                    plotBands: [{ // mark the weekend
                        color: '#DCDCDC',
                        label: {
                            text: 'Prediction range',
                            align: 'center'
                        },
                        from: _.get(vm.dateChange, ['dateRange', 'date']) * 24,
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