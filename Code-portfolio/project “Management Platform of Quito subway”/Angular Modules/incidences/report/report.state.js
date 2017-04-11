(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('report', {
            parent: 'incidences',
            url: '/report?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.report.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/report/reports.html',
                    controller: 'ReportController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,desc',
                    squash: true
                },
                search: null,
                reportNumber: {
                    value: '',
                    squash: true
                },
                fromDate: {
                    value: '',
                    squash: true
                },
                toDate: {
                    value: '',
                    squash: true
                },
                activity: {
                    value: '',
                    squash: true
                },
                subactivity: {
                    value: '',
                    squash: true
                },
                responsible: {
                    value: '',
                    squash: true
                },
                visitSiteId: {
                    value: '',
                    squash: true
                },
                stationId: {
                    value: '',
                    squash: true
                },
                stretchTunnelId: {
                    value: '',
                    squash: true
                },
                specialSiteId: {
                    value: '',
                    squash: true
                },
                administrativeUnitId: {
                    value: '',
                    squash: true
                }
            },
            ncyBreadcrumb: {
                label: 'Consultar informes de visita'
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: {
                            reportNumber: $stateParams.reportNumber,
                            fromDate: $stateParams.fromDate,
                            toDate: $stateParams.toDate,
                            activity: $stateParams.activity,
                            subactivity: $stateParams.subactivity,
                            responsible: $stateParams.responsible,
                            visitSiteId: $stateParams.visitSiteId,
                            stationId: $stateParams.stationId,
                            stretchTunnelId: $stateParams.stretchTunnelId,
                            specialSiteId: $stateParams.specialSiteId,
                            administrativeUnitId: $stateParams.administrativeUnitId
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('report');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('report-detail', {
            parent: 'report',
            url: '/report/{id}',
            data: {
                authorities: ['ROLE_USER'],
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/report/report-detail.html',
                    controller: 'ReportDetailController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Ver detalles del informe'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('report');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Report', function($stateParams, Report) {
                    return Report.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('report.new', {
            parent: 'report',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/report/report-dialog.html',
                    controller: 'ReportDialogController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Adicionar informe de visita'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('report');
                    $translatePartialLoader.addPart('incidenceTechnical');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Report', function($stateParams, Report) {
                    return {
                        name: null,
                        id: null,
                        reportNumber: null,
                        hasIncidences: null,
                        visitorId: null,
                        administrativeUnitId: null,
                        visitSiteId: null,
                        stationId: null,
                        stretchTunnelId: null,
                        specialSiteId: null,
                        reportDate: null
                    };
                }]
            }
        })
        .state('report.edit', {
            parent: 'report',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/report/report-dialog.html',
                    controller: 'ReportDialogController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Modificar informe de visita'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('report');
                    $translatePartialLoader.addPart('incidenceTechnical');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Report', function($stateParams, Report) {
                    return Report.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('report.delete', {
            parent: 'report',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/report/report-delete-dialog.html',
                    controller: 'ReportDeleteController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Eliminar informe'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('report');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Report', function($stateParams, Report) {
                    return Report.get({id : $stateParams.id}).$promise;
                }]
            }
        });
    }

})();
