(function () {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('incidence-technical', {
                parent: 'incidences',
                url: '/incidence-technical?page&sort&search',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.incidenceTechnical.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/incidence-technical/incidence-technicals.html',
                        controller: 'IncidenceTechnicalController',
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
                    incidenceNumber: {
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
                    state: {
                        value: '',
                        squash: true
                    },
                    responsible: {
                        value: '',
                        squash: true
                    },
                    administrativeUnitId: {
                        value: '',
                        squash: true
                    }
                },
                ncyBreadcrumb: {
                    label: 'Consultar incidencias t\u00e9cnicas'
                },
                resolve: {
                    pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                        return {
                            page: PaginationUtil.parsePage($stateParams.page),
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort),
                            search: {
                                incidenceNumber: $stateParams.incidenceNumber,
                                fromDate: $stateParams.fromDate,
                                toDate: $stateParams.toDate,
                                state: $stateParams.state,
                                responsible: $stateParams.responsible,
                                administrativeUnitId: $stateParams.administrativeUnitId
                            }
                        };
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('incidenceTechnical');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('incidence-technical-detail', {
                parent: 'incidence-technical',
                url: '/incidence-technical/{id}/:reportId/:action',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.incidenceTechnical.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/incidence-technical/incidence-technical-detail.html',
                        controller: 'IncidenceTechnicalDetailController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Ver detalles de incidencia t\u00e9cnica'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('incidenceTechnical');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'IncidenceTechnical', function ($stateParams, IncidenceTechnical) {
                        return IncidenceTechnical.get({id: $stateParams.id}).$promise;
                    }]
                }
            })
            .state('incidence-technical.new', {
                parent: 'incidence-technical',
                url: '/new/:reportId',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/incidence-technical/incidence-technical-dialog.html',
                        controller: 'IncidenceTechnicalDialogController',
                        controllerAs: 'vm',
                    }
                },
                ncyBreadcrumb: {
                    label: 'Adicionar incidencia t\u00e9cnica'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('incidenceTechnical');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'IncidenceTechnical', function ($stateParams, IncidenceTechnical) {
                        return {
                            incidenceNumber: null,
                            subject: null,
                            description: null,
                            id: null,
                            functionaryId: null,
                            responsibleId: null,
                            administrativeUnitResponsibleId: null,
                            reportsId: null,
                            incidenceStateId: null,
                            observations: {}
                        };
                    }]
                }

            })
            .state('incidence-technical.edit', {
                parent: 'incidence-technical',
                url: '/{id}/edit/:reportId',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/incidence-technical/incidence-technical-dialog.html',
                        controller: 'IncidenceTechnicalDialogController',
                        controllerAs: 'vm',
                    }
                },
                ncyBreadcrumb: {
                    label: 'Modificar incidencia t\u00e9cnica'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('incidenceTechnical');
                        $translatePartialLoader.addPart('observation');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'IncidenceTechnical', function ($stateParams, IncidenceTechnical) {
                        return IncidenceTechnical.get({id: $stateParams.id}).$promise;
                    }]
                }
            })
            .state('incidence-technical.delete', {
                parent: 'incidence-technical',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/incidence-technical/incidence-technical-delete-dialog.html',
                        controller: 'IncidenceTechnicalDeleteController',
                        controllerAs: 'vm',
                    }
                },
                ncyBreadcrumb: {
                    label: 'Eliminar incidencia'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('incidenceTechnical');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'IncidenceTechnical', function ($stateParams, IncidenceTechnical) {
                        return IncidenceTechnical.get({id: $stateParams.id}).$promise;
                    }]
                }
            })
            .state('assing-incidence-technical', {
            parent: 'incidence-technical',
            url: '/assing/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.incidenceTechnical.home.assignIncidence'
            },
            ncyBreadcrumb: {
                label: 'Asignar/Reasignar incidencia t\u00e9cnica'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/incidence-technical/assign-incidence-technical.html',
                    controller: 'AssignIncidenceTechnicalController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('incidenceTechnical');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'IncidenceTechnical', function($stateParams, IncidenceTechnical) {
                    return IncidenceTechnical.get({id : $stateParams.id}).$promise;
                }]
            }
        });
    }

})();
