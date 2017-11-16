(function (angular) {
    'use strict';

    angular.module('smartEnergy.dashboard', [
        'smartEnergy.app.dateRangeSelector',
        'smartEnergy.timeseries',
        'smartEnergy.app.totalImpact',
        'smartEnergy.solar',
        'smartEnergy.battery',
        'smartEnergy.app.energyForecast',
        'smartEnergy.app.recommendation'
    ]);
})(angular);