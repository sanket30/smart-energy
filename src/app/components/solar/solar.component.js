(function(angular) {
    'use strict';

    angular.module('smartEnergy.solar')
        .component('solar', {
            templateUrl: 'app/components/solar/solar.html',
            controller: 'solarController',
            controllerAs: 'vm',
            bindings: {
                config: '<'
            }
        });
}(angular));