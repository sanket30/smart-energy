(function(angular) {
    'use strict';

    angular.module('smartEnergy.timeseries')
        .component('timeSeries', {
            templateUrl: 'app/features/timeseries/timeseries.html',
            controller: 'timeSeriesController',
            controllerAs: 'vm',
            bindings: {
                config: '<'
            }
        });
}(angular));