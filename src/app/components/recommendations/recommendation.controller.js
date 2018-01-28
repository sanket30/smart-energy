(function (_) {
    'use strict';

    angular
        .module('smartEnergy.app.recommendation')
        .controller('RecommendationController', RecommendationController);

    function RecommendationController($scope, $element) {
        var vm = this;
        var startDate = moment().add(1, 'days').startOf('days');
        var endDate = moment().add(6, 'days').startOf('days');
        var ticker = angular.element($element[0].querySelector('.myWrapper'));

        vm.setIcon = setIcon;

        $scope.$on('forecast:change', function (event, val) {
            init(val);
        });

        $scope.$on('date:change', function (event, val) {
            startDate = val.startDate;
            endDate = val.endDate;
            init(val);
        });

        ticker.easyTicker({
            direction: 'up',
            interval: 2000
        });

        function setIcon() {
            return _.sample([
                '../../../_assets/images/weather/cloudy.svg',
                '../../../_assets/images/weather/drizzle.svg',
                '../../../_assets/images/weather/flurries.svg',
                '../../../_assets/images/weather/rain.svg',
                '../../../_assets/images/weather/thunderstorms.svg',
                '../../../_assets/images/weather/windy.svg']);
        }

        function init(val) {
            var solarDataArray24 = [];
            var size = 24;

            vm.suggestions = [];

            var solarDataArray120 = _(val.solarData)
                .filter(function (date) {
                    return moment(date.dateTime).valueOf() > startDate
                        && moment(date.dateTime).valueOf() < endDate;
                })
                .value();

            while (solarDataArray120.length > 0)
                solarDataArray24.push(solarDataArray120.splice(0, size));


            _.forEach(solarDataArray24, function (data) {
                _.forEach(data, function (d, i) {
                    if (i > 8 && i < 17 && d.energy < 16) {
                        vm.suggestions.push({
                            value: d,
                            icon: setIcon()
                        });
                    }
                })
            });
        }
    }
}(_));
