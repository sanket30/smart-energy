(function () {
    'use strict';

    angular
        .module('smartEnergy.app.totalImpact')
        .component('totalImpact', {
            bindings: {
                config: '<'
            },
            templateUrl: 'app/components/total-impact/total-impact.html',
            controller: 'TotalImpactController',
            controllerAs: 'vm'
        });
}());
