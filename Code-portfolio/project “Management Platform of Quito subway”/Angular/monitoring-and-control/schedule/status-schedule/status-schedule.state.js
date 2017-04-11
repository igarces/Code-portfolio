(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('status-schedule', {
                parent: 'project-schedule',
                url: '/status',
                ncyBreadcrumb: {
                    label: 'metroquitoApp.schedule.status.title',
                    showProject: true,
                    data:""
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.schedule.status.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/schedule/status-schedule/status-schedule.html',
                        controller: 'StatusScheduleController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('schedule');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('chart-station', {
                parent: 'status-schedule',
                url: '/chart-station',
                ncyBreadcrumb: {
                    label: 'metroquitoApp.schedule.chart.chartStateByStation',
                    showProject: true,
                    data:""
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.schedule.chart.chartStateByStation'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/schedule/charts/chart-station.html',
                        controller: 'ChartStationController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('schedule');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('chart-spi-cpi', {
                parent: 'status-schedule',
                url: '/chart-spi-cpi',
                ncyBreadcrumb: {
                    label: 'metroquitoApp.schedule.chart.chartSPIvsCPI',
                    showProject: true,
                    data:""
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.schedule.chart.chartSPIvsCPI'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/schedule/charts/chart-spi-cpi.html',
                        controller: 'ChartSPIvsCPIController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('schedule');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('chart-cpi', {
                parent: 'status-schedule',
                url: '/chart-cpi',
                ncyBreadcrumb: {
                    label: 'metroquitoApp.schedule.chart.chartCPI',
                    showProject: true,
                    data:""
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.schedule.chart.chartCPI'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/schedule/charts/chart-cpi.html',
                        controller: 'ChartCPIController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('schedule');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('chart-spi', {
                parent: 'status-schedule',
                url: '/chart-spi',
                ncyBreadcrumb: {
                    label: 'metroquitoApp.schedule.chart.chartSPI',
                    showProject: true,
                    data:""
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.schedule.chart.chartSPI'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/schedule/charts/chart-spi.html',
                        controller: 'ChartSPIController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('schedule');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('chart-s', {
                parent: 'status-schedule',
                url: '/chart-s',
                ncyBreadcrumb: {
                    label: 'metroquitoApp.schedule.chart.chartS',
                    showProject: true,
                    data:""
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.schedule.chart.chartS'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/schedule/charts/chart-s.html',
                        controller: 'ChartSController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('schedule');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            });
    }

})();
