(function () {
    'use strict';

    angular
        .module('smartEnergy.app.dateRangeSelector')
        .controller('DateRangeSelectorController', DateRangeSelectorController);

    function DateRangeSelectorController($rootScope) {
        var vm = this;

        vm.$onInit = onInit();
        vm.applyDates = applyDates;
        vm.checkDates = checkDates;
        vm.isDisabled = isDisabled;

        function onInit() {
            vm.dates = {
                startDate: new Date(moment().subtract(5, 'days').format('LLLL')),
                endDate: new Date(moment().format('LLLL'))
            };

        }

        function isDisabled() {

            return false;
        }

        function applyDates() {
            $rootScope.$broadcast('date:change', {
                startDate: moment(vm.dates.startDate).valueOf(),
                endDate: moment(vm.dates.endDate).valueOf()
            });
        }

        function checkDates(startDate, endDate) {
            vm.errMessage = '';

            if (moment(startDate).valueOf() >= moment(endDate).valueOf()) {
                vm.errMessage = '* End Date should be greater than start date';
            }
        }
    }
}());
