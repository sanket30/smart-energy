(function (angular) {
    'use strict';

    angular.module('smartEnergy.dashboard', [
        'smartEnergy.timeseries',
        'smartEnergy.app.dateRangeSelector',
        'smartEnergy.app.totalImpact'
    ]);
})(angular);