(function(angular) {
    'use strict';

    angular.module('smartEnergy.battery')
        .component('battery', {
            templateUrl: 'app/components/battery/battery.html',
            controller: 'batteryController',
            controllerAs: 'vm',
            bindings: {
                config: '<'
            }
        });
}(angular));