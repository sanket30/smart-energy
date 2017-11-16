(function (angular) {
  'use strict';

  angular
    .module('smartEnergy.login')
    .controller('LoginController', LoginController);

  function LoginController($state) {
    var vm = this;
    window.onSignIn = onSignIn;

    vm.error = '';
    function onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      var userToken = localStorage.getItem('SMART_USER');
      if (userToken) {
        $state.go('smartEnergy.dashboard');
      } else {
        localStorage.setItem('SMART_USER', profile.getName());
        $state.go('smartEnergy.dashboard');
      }
    }
  }

})(angular);
