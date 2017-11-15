(function(angular) {
    'use strict';

    angular.module('smartEnergy.timeseries')
        .component('timeSeries', {
            templateUrl: 'app/components/timeseries/timeseries.html',
            controller: 'timeSeriesController',
            controllerAs: 'vm',
            bindings: {
                config: '<'
            }
        });
}(angular));