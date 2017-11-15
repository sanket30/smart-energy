(function () {
  'use strict';

  angular
    .module('smartEnergy.app.energyForecast')
    .component('energyForecast', {
      bindings: {
        config: '<'
      },
      templateUrl: 'app/components/energy-forecast/energy-forecast.html',
      controller: 'EnergyForecastCtrl',
      controllerAs: 'vm'
    });
}());
