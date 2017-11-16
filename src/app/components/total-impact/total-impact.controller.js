(function (_) {
    'use strict';

    angular
        .module('smartEnergy.app.totalImpact')
        .controller('TotalImpactController', TotalImpactController);

    function TotalImpactController($scope) {
        var vm = this;
        var PRICE_KWH = 0.13;

        vm.$onInit = onInit;

        $scope.$on('data:change', function (event, val) {
            updateValues(val.data);
        });

        function onInit() {
            vm.values = [{
                name: '../../../_assets/images/bulb.svg',
                suffix: 'MWh',
                value: 0,
                footer: 'energy produced'
            }, {
                name: '../../../_assets/images/money.svg',
                prefix: '$',
                value: 0,
                footer: 'dollars saved'
            }, {
                name: '../../../_assets/images/foot.svg',
                suffix: 'tons',
                value: 0,
                footer: 'carbon offset'
            }, {
                name: '../../../_assets/images/gas.svg',
                suffix: 'gallons',
                value: 0,
                footer: 'petroleum saved'
            }, {
                name: '../../../_assets/images/drop.svg',
                suffix: 'gallons',
                value: 0,
                footer: 'water saved'
            }];

            vm.width = {
                width: 100 / vm.values.length + '%'
            };
        }

        function updateValues(data) {
            var energyProduced = 0;
            var carbonOffset = 0;

            _.filter(data, function(reading) {
                if(reading.type === 'observation') {
                    energyProduced += reading.energy;
                }
            });

            // https://cleantechnica.com/2014/03/22/solar-power-water-use-infographic/
            // Oil (Petroleum) produces about 0.6% of electricity in 2016 (https://www.eia.gov/tools/faqs/faq.php?id=427&t=3)

            _.set(vm.values, [0, 'value'], (energyProduced * 0.001).toFixed(2));
            _.set(vm.values, [1, 'value'], (energyProduced * PRICE_KWH).toFixed(2));
            _.set(vm.values, [2, 'value'], (energyProduced * 0.0008485).toFixed(2));
            _.set(vm.values, [3, 'value'], (energyProduced * 0.46).toFixed(2));
            _.set(vm.values, [4, 'value'], (energyProduced * 5).toFixed(2));
        }
    }
}(_));
