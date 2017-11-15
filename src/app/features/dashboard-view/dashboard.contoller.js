(function (angular) {
    'use strict';

  angular.module('smartEnergy.dashboard')
  .controller('DashboardController', DashboardController);

    function DashboardController() {
        var vm = this;

        vm.$onInit = init;

        function init(){
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
        }
    }
})(angular);
