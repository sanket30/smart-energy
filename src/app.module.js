(function (angular) {
    'use strict';

    angular
        .module('app', [
            'ngAnimate',
            'ngMessages',
            'ngTouch',
            'ui.router',
            'ui.bootstrap',
            'angular-loading-bar',
            "ngSanitize",

            'smartEnergy.app'
        ])
        .config(moduleConfig)
        .run(moduleRun);

    function moduleConfig($locationProvider) {
        $locationProvider.html5Mode(true);
    }

    function moduleRun($log, CONFIG, $rootScope, $state) {
        $log.warn(CONFIG);
      $rootScope.$on( '$stateChangeStart', function(e, toState  , toParams
        , fromState, fromParams) {

        var isLogin = toState.name === "login";
        if(isLogin){
          return; // no need to redirect
        }

        var name = localStorage.getItem('SMART_USER');
        if (!name) {
          e.preventDefault(); // stop current execution
          $state.go('login');
        }
      });
    }

})(angular);
