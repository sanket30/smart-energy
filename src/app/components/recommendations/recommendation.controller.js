(function (_) {
    'use strict';

    angular
        .module('smartEnergy.app.recommendation')
        .controller('RecommendationController', RecommendationController);

    function RecommendationController() {
        var vm = this;

        $scope.$on('solarData:change', function (event, val) {
            init(val);
        });

        function init(val) {
            console.log(val);
        }
    }
}(_));
