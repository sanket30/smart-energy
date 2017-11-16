(function () {
    'use strict';

    angular
        .module('smartEnergy.app.recommendation')
        .component('solarRecommendation', {
            bindings: {
                config: '<'
            },
            templateUrl: 'app/components/recommendation/recommendation.html',
            controller: 'RecommendationController',
            controllerAs: 'vm'
        });
}());
