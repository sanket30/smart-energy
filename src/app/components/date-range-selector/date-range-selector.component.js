(function () {
    'use strict';

    angular
        .module('smartEnergy.app.dateRangeSelector')
        .component('sEDateRangeSelector', {
            bindings: {
                onDateChange: '&'
            },
            templateUrl: 'tools/asset-data-hub/components/date-range-selector/date-range-selector.html',
            controller: 'SEDateRangeSelectorController',
            controllerAs: 'vm'
        });
}());
