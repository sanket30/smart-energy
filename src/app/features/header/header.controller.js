(function (angular) {
  'use strict';

  angular
    .module('smartEnergy.header')
    .controller('HeaderController', HeaderController);

  function HeaderController() {
    var vm = this;

    vm.user = localStorage.getItem('SMART_USER');
  }

})(angular);
