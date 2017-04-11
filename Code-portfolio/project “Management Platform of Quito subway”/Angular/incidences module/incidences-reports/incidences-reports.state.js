(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('citizen-attention-report', {
            parent: 'incidences',
            url: '/citizen-attention-report',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.incidencesReports.citizenAttention.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/incidences-reports/citizen-attention-report.html',
                    controller: 'CitizenAttentionReportController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Reporte de atenci\u00F3n ciudadana'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('incidencesReports');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
            .state('incidence-technical-report', {
                parent: 'incidences',
                url: '/incidence-technical-report',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.incidencesReports.incidenceTechnical.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/incidences-reports/incidence-technical-report.html',
                        controller: 'IncidenceTechnicalReportController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Reporte de incidencias t\u00e9cnicas'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('incidencesReports');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('visit-report', {
                parent: 'incidences',
                url: '/visit-report',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.incidencesReports.visitReport.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/incidences-reports/visit-report-report.html',
                        controller: 'VisitReportController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Reporte de informes de visita'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('incidencesReports');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('incidence-social-resp-report', {
                parent: 'incidences',
                url: '/incidence-social-resp-report',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.incidencesReports.incidenceSocialResp.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/incidences-reports/incidence-social-resp-report.html',
                        controller: 'IncidenceSocialRespReportController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Reporte de quejas/reclamos/atenci\u00F3n ciudadana'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('incidencesReports');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('incidence-graphic-report', {
                parent: 'incidences',
                url: '/incidence-graphic-report',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.incidencesReports.incidenceSocialResp.titleGraphic'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/incidences-reports/incidence-graphic-report.html',
                        controller: 'IncidenceGraphicReportController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Reporte gr\u00e1fico de quejas/reclamos/atenci\u00F3n ciudadana'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('incidencesReports');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
        ;
    }

})();
