(function (angular) {
    'use strict';

  angular.module('smartEnergy.dashboard')
  .controller('DashboardController', DashboardController);

    function DashboardController($element, $window) {
        var vm = this;

        vm.$onInit = init;

        function init(){

        }
    }
})(angular);
