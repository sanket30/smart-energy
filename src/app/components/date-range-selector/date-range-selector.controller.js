(function (angular, moment) {
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
        vm.openStartDatePicker = openStartDatePicker;
        vm.openEndDatePicker = openEndDatePicker;

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
            vm.isEndDatePickerOpen = false;
            vm.isStartDatePickerOpen = false;
            vm.datePickerOptions = {
                showWeeks: false,
                maxMode: 'day',
                startingDay: 1
            };
            vm.dateModelOptions = {
                timezone: moment.tz.guess()
            };
        }

        function applyDatesThroughButtonGroup(obj) {
            vm.selectedRange = obj;
            vm.errMessage = '';
            vm.dates = {
                startDate: new Date(moment().subtract(obj.date/2, 'days').format('LLLL')),
                endDate: new Date(moment().add(obj.date/2, 'days').format('LLLL'))
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
                endDate: moment(vm.dates.endDate).valueOf(),
                dateRange: vm.selectedRange
            });
        }

        function checkDates() {
            vm.errMessage = '';
            vm.invalidDate = false;

            if (moment(vm.dates.startDate).valueOf() >= moment(vm.dates.endDate).valueOf()) {
                vm.errMessage = '* End Date should be greater than start date';
                vm.invalidDate = true;
            }
        }

        function openEndDatePicker(event) {
            vm.isEndDatePickerOpen = !vm.isEndDatePickerOpen;
            event.stopPropagation();
        }

        function openStartDatePicker(event) {
            vm.isStartDatePickerOpen = !vm.isStartDatePickerOpen;
            event.stopPropagation();
        }
    }
}(angular, moment));
