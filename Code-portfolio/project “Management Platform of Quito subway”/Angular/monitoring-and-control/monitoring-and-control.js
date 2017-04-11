(function () {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig ($stateProvider) {
        $stateProvider.state('monitoring-and-control', {
            parent: 'app',
            url: '/monitoring-and-control',
            ncyBreadcrumb: {
                label: 'Seguimiento y control',
                color: '#F08022',
                theme: "light",
                showProject: true,
                data:""
            },
            data: {
                authorities: ['ROLE_USER']
            },
             views: {
                 'content@': {
                     templateUrl: 'app/monitoring-and-control/monitoring-and-control.html',
                     controller: 'MonitoringControlController',
                     controllerAs: 'vm'
                 }
             },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]
            }
        })
        .state('monitoring-configuration', {
            parent: 'monitoring-and-control',
            url: '/configuration',
            ncyBreadcrumb: {
                label: 'Configuración',
                showProject: true,
                data:""
            },
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/monitoring-configuration.html',
                    controller: 'MonitoringControlController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]


            }
        })
        .state('operating-plan', {
            parent: 'monitoring-and-control',
            url: '/operating-plan',
            ncyBreadcrumb: {
                label: 'Plan Operativo Anual',
                showProject: true,
                data:""
            },
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/monitoring-operating-plan.html',
                    controller: 'MonitoringControlController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]


            }
        })
        .state('project-schedule', {
            parent: 'monitoring-and-control',
            url: '/project-schedule',
            ncyBreadcrumb: {
                label: 'Cronograma de Ejecución del Proyecto',
                showProject: true,
                data:""
            },
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/monitoring-project-schedule.html',
                    controller: 'MonitoringControlController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]


            }
        })
        .state('monitoring-and-control-reports', {
            parent: 'monitoring-and-control',
            url: '/reports',
            ncyBreadcrumb: {
                label: 'Reportes'
            },
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/monitoring-and-control-report.html',
                    controller: 'MonitoringControlController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]
            }
        })
        ;
    }
})();
