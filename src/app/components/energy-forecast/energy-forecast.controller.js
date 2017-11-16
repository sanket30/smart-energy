(function (_, moment) {
  'use strict';

  angular
    .module('smartEnergy.app.energyForecast')
    .controller('EnergyForecastCtrl', EnergyForecastCtrl);

  function EnergyForecastCtrl($scope) {
    var vm = this;
    var startDate = moment().add(1, 'days').startOf('day');
    var endDate = moment().add(6, 'days').startOf('day');
    var DATE_FORMAT = 'ddd MM/DD';
    var PRICE_KWH = 0.13;

    vm.forecastData = {};
    for(var i = 0; i < 5; i++) {
      _.set(vm.forecastData, moment().add(i + 1, 'days').startOf('day').format(DATE_FORMAT), {});
    }

    $scope.$on('forecast:change', function (event, val) {
      vm.solarData = _.filter(val.solarData, function (data) {
        return moment(data.dateTime).valueOf() > startDate
            && moment(data.dateTime).valueOf() < endDate;
      });

      vm.consumptionData = _.filter(val.consumptionData, function (data) {
        return moment(data.dateTime).valueOf() > startDate
            && moment(data.dateTime).valueOf() < endDate;
      });
      init();
    });

    function init() {
      _.filter(vm.solarData, function (data) {
        var date = moment(data.dateTime).startOf('day').format(DATE_FORMAT);
        var value = parseFloat(_.get(vm.forecastData, [date, 'solarEnergy'], 0)) + parseFloat(data.energy);
        var costSaved = (value * PRICE_KWH).toFixed(2);

        _.set(vm.forecastData, [date, 'solarEnergy'], value);
        _.set(vm.forecastData, [date, 'costSaved'], costSaved);
      });

      _.filter(vm.consumptionData, function (data) {
        var date = moment(data.dateTime).startOf('day').format(DATE_FORMAT);
        var value = parseFloat(_.get(vm.forecastData, [date, 'energyConsumption'], 0));

        _.set(vm.forecastData, [date, 'energyConsumption'], value + parseFloat(data.reading));
      });
      
      _.forEach(vm.forecastData, function (data, key) {
        var solar = _.get(vm.forecastData, [key, 'solarEnergy'], 0);
        var consumption = _.get(vm.forecastData, [key, 'energyConsumption'], 0);

        _.set(vm.forecastData, [key, 'renewable'], (solar * 100/consumption).toFixed(2) + '%');
        _.set(vm.forecastData, [key, 'grid'], ((consumption - solar) * 100/consumption).toFixed(2) + ' %');
        _.set(vm.forecastData, [key, 'gridUsage'], (consumption - solar).toFixed(2));
      });

      vm.width = {
        width: '15%'
      };
    }
  }
}(_, moment));
