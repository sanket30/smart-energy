(function () {
    'use strict';

    angular
        .module('smartEnergy.app.recommendation')
        .component('recommendation', {
            bindings: {
            },
            templateUrl: 'app/components/recommendations/recommendation.html',
            controller: 'RecommendationController',
            controllerAs: 'vm'
        });
}());
