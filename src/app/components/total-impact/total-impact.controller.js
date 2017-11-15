(function () {
    'use strict';

    angular
        .module('smartEnergy.app.totalImpact')
        .controller('TotalImpactController', TotalImpactController);

    function TotalImpactController() {
        var vm = this;

        vm.$onInit = onInit;

        function onInit() {
            vm.values = [{
                name: '../../../_assets/images/bulb.svg',
                suffix: 'MWh',
                value: 400,
                footer: 'energy produced'
            }, {
                name: '../../../_assets/images/dollar.svg',
                prefix: '$',
                value: 35700,
                footer: 'dollars saved'
            }, {
                name: '../../../_assets/images/foot.svg',
                suffix: 'tons',
                value: 12600,
                footer: 'carbon offset'
            }, {
                name: '../../../_assets/images/gallon.svg',
                suffix: 'gallons',
                value: 14000,
                footer: 'gasoline saved'
            }, {
                name: '../../../_assets/images/drop.svg',
                suffix: 'gallons',
                value: 14000,
                footer: 'water saved'
            }];

            vm.width = {
                width: 100 / vm.values.length + '%'
            };
        }
    }
}());
