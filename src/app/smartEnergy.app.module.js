(function (angular) {
    'use strict';

    angular
        .module('smartEnergy.app', [
            'smartEnergy.header',
            'smartEnergy.footer',
            'smartEnergy.dashboard',
            'smartEnergy.timeseries'
        ])
        .config(moduleConfig)
        .run(moduleRun);

    function moduleConfig($urlRouterProvider, $stateProvider) {

        $urlRouterProvider.when('/', '/app/dashboard');

        $urlRouterProvider.otherwise(function ($injector) {
            $injector.get('$state').go("smartEnergy.404");
        });

        $stateProvider
            .state('smartEnergy', {
                url: '/app',
                views: {
                    '@': {
                        templateUrl: 'app/smartEnergy.app.tmpl.html'
                    },
                    'header@smartEnergy': {
                        templateUrl: 'app/features/header/header.tmpl.html',
                        controller: 'HeaderController',
                        controllerAs: 'headerVm'
                    },
                    'footer@smartEnergy': {
                        templateUrl: 'app/features/footer/footer.tmpl.html',
                        controller: 'FooterController',
                        controllerAs: 'footerVm'
                    }
                }
            })
            .state('smartEnergy.dashboard', {
                url: "/dashboard",
                templateUrl: 'app/features/dashboard-view/dashboard.tmpl.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
                resolve: {
                }
            })
            .state('smartEnergy.404', {
                templateUrl: 'app/smartEnergy.404.tmpl.html'
            });
    }

    function moduleRun() {
    }

})(angular);
