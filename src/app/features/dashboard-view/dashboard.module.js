(function (angular) {
    'use strict';

    angular.module('smartEnergy.dashboard', [
        'smartEnergy.app.dateRangeSelector',
        'smartEnergy.app.totalImpact',
        'smartEnergy.timeseries'
    ]);
})(angular);