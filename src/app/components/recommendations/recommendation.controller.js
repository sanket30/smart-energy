(function (_) {
    'use strict';

    angular
        .module('smartEnergy.app.recommendation')
        .controller('RecommendationController', RecommendationController);

    function RecommendationController($scope) {
        var vm = this;
        var startDate = moment().add(1, 'days').startOf('days');
        var endDate = moment().add(6, 'days').startOf('days');

        $scope.$on('forecast:change', function (event, val) {
            init(val);
        });

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
                    if (i > 14 && i < 23 && d.energy < 16) {
                        vm.suggestions.push(d);
                    }
                })
            });


        }
    }
}(_));
