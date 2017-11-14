(function (angular, _) {
    'use strict';

    angular
        .module('smartEnergy.app.energyDataService')
        .service('energyDataService', energyDataService);

    function energyDataService($$http, $q) {
        var vm = this;
        var baseUrl = '';

        vm.getData = getData;

        function getData() {
            return $q.resolve({});
        }
    }
}(angular, _));
