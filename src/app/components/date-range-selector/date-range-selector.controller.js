(function () {
    'use strict';

    angular
        .module('smartEnergy.app.dateRangeSelector')
        .controller('DateRangeSelectorController', DateRangeSelectorController);

    function DateRangeSelectorController($rootScope) {
        var vm = this;

        vm.$onInit = onInit;
        vm.checkDates = checkDates;
        vm.applyDatesThroughButtonGroup = applyDatesThroughButtonGroup;
        vm.applyDatesThroughClick = applyDatesThroughClick;

        function onInit() {
            vm.dates = {
                startDate: new Date(moment().subtract(1, 'days').format('LLLL')),
                endDate: new Date(moment().format('LLLL'))
            };
            vm.buttonGroup = [
                { name: 'daily', date: 1 },
                { name: '10 days', date: 10 },
                { name: 'monthly', date: 30 }
            ];
            vm.selectedRange = vm.buttonGroup[0];
        }

        function applyDatesThroughButtonGroup(obj) {
            vm.selectedRange = obj;
            vm.errMessage = '';
            vm.dates = {
                startDate: new Date(moment().subtract(obj.date, 'days').format('LLLL')),
                endDate: new Date(moment().format('LLLL'))
            };

            applyDates();
        }

        function applyDatesThroughClick() {
            vm.selectedRange = [];
            applyDates()
        }

        function applyDates() {
            $rootScope.$broadcast('date:change', {
                startDate: moment(vm.dates.startDate).valueOf(),
                endDate: moment(vm.dates.endDate).valueOf()
            });
            console.log(vm.dates.startDate, vm.dates.endDate);
        }

        function checkDates(startDate, endDate) {
            vm.errMessage = '';

            if (moment(startDate).valueOf() >= moment(endDate).valueOf()) {
                vm.errMessage = '* End Date should be greater than start date';
            }
        }
    }
}());
