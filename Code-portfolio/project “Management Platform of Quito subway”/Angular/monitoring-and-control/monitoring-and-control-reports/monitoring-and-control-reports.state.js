(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('poa-report', {
                parent: 'monitoring-and-control-reports',
                url: '/poa-report',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.monitoringAndControlReports.poa.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/monitoring-and-control-reports/poa-report.html',
                        controller: 'PoaReportController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.monitoringAndControlReports.poa.title'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('monitoringAndControlReports');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('poa-budget-report', {
            parent: 'monitoring-and-control-reports',
            url: '/poa-budget-report',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.monitoringAndControlReports.poaBudget.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/monitoring-and-control-reports/poa-budget-report.html',
                    controller: 'PoaBudgetReportController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.monitoringAndControlReports.poaBudget.title'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('monitoringAndControlReports');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
            .state('poa-monitoring-report', {
                parent: 'monitoring-and-control-reports',
                url: '/poa-monitoring-report',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.monitoringAndControlReports.poaMonitoring.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/monitoring-and-control-reports/poa-monitoring-report.html',
                        controller: 'PoaMonitoringReportController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.monitoringAndControlReports.poaMonitoring.title'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('monitoringAndControlReports');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('pep-report', {
                parent: 'monitoring-and-control-reports',
                url: '/pep-report',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.monitoringAndControlReports.pep.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/monitoring-and-control-reports/pep-report.html',
                        controller: 'PepReportController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.monitoringAndControlReports.pep.title'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('monitoringAndControlReports');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('poa-plmq-report', {
                parent: 'monitoring-and-control-reports',
                url: '/poa-plmq-report',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.monitoringAndControlReports.poaPlmq.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/monitoring-and-control-reports/poa-plmq-report.html',
                        controller: 'PoaPlmqReportController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.monitoringAndControlReports.poaPlmq.title'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('monitoringAndControlReports');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('consolidated-planning-report', {
                parent: 'monitoring-and-control-reports',
                url: '/consolidated-planning',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.monitoringAndControlReports.consolidatedPlanning.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/monitoring-and-control-reports/consolidated-planning-report.html',
                        controller: 'ConsolidatedPlanningReportController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.monitoringAndControlReports.consolidatedPlanning.title'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('monitoringAndControlReports');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
        ;
    }

})();
