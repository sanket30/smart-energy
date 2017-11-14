(function () {
    'use strict';

    angular
        .module('smartEnergy.app.dateRangeSelector')
        .controller('SEDateRangeSelectorController', SEDateRangeSelectorController);

    function SEDateRangeSelectorController($rootScope, $scope, $timeout, energyDataService) {
        var vm = this;

        vm.$onInit = onInit();
        vm.applyDates = applyDates;
        vm.checkDates = checkDates;
        vm.isDisabled = isDisabled;

        function onInit() {
            var cachedDates = energyDataService.getData('dates');

            if (_.isEmpty(cachedDates)) {
                vm.dates = {
                    startDate: new Date(moment().subtract(5, 'days').format('LLLL')),
                    endDate: new Date(moment().format('LLLL'))
                };
                energyDataService.setData('dates', vm.dates);
            } else {
                vm.dates = {
                    startDate: new Date(cachedDates.startDate),
                    endDate: new Date(cachedDates.endDate)
                };

                $timeout(applyDates);
            }

            vm.granularity = [
                { name: 'Raw', value: 'FireHose' },
                { name: '1 Second Agg', value: 'OneSecond' },
                { name: '15 Second Agg', value: 'FifteenSeconds' },
                { name: '1 Minute Agg', value: 'OneMinute' },
                { name: '15 Minute Agg', value: 'FifteenMinutes' },
                { name: '1 Hour Agg', value: 'OneHour' },
                { name: '1 Day Agg', value: 'OneDay' }
            ];
        }

        function isDisabled() {
            taskTypes = energyDataService.getData('taskTypes');
            channelIds = _.map(energyDataService.getData('channels'), 'id');
            eventTypes = _.map(energyDataService.getData('eventTypes'), 'id');

            return !taskTypes.length && !channelIds.length && !eventTypes.length;
        }

        function applyDates() {
            $rootScope.$broadcast('date:change', {
                startDate: moment(vm.dates.startDate).valueOf(),
                endDate: moment(vm.dates.endDate).valueOf()
            });
        }

        // If date are changed from channel chart scrollbar then update new dates here
        $scope.$on('date:change', function (event, data) {
            energyDataService.setData('dates', data);
            vm.dates = {
                startDate: new Date(moment(data.startDate).format('LLLL')),
                endDate: new Date(moment(data.endDate).format('LLLL'))
            };
        });

        function checkDates(startDate, endDate) {
            vm.errMessage = '';

            if (moment(startDate).valueOf() >= moment(endDate).valueOf()) {
                vm.errMessage = '* End Date should be greater than start date';
            }
        }
    }
}());
