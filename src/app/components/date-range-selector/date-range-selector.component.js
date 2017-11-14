(function () {
    'use strict';

    angular
        .module('smartEnergy.app.dateRangeSelector')
        .component('dateRangeSelector', {
            bindings: {
                onDateChange: '&'
            },
            templateUrl: 'app/components/date-range-selector/date-range-selector.html',
            controller: 'DateRangeSelectorController',
            controllerAs: 'vm'
        });
}());
