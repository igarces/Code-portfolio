(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('observation', {
            parent: 'incidences',
            url: '/observation?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.observation.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/observation/observations.html',
                    controller: 'ObservationController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Observaci\u00F3n'
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('observation');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('observation-detail', {
            parent: 'observation',
            url: '/observation/{id}/:incId/:type/:action',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.observation.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/observation/observation-detail.html',
                    controller: 'ObservationDetailController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Ver detalles de observaci\u00F3n'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('observation');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Observation', function($stateParams, Observation) {
                    return Observation.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('observation.new', {
            parent: 'observation',
            url: '/new/:incId/:type',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/observation/observation-dialog.html',
                    controller: 'ObservationDialogController',
                    controllerAs: 'vm',
                }
            },
            ncyBreadcrumb: {
                label: 'Adicionar observaci\u00F3n'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('observation');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Observation', function($stateParams, Observation) {
                    return {
                        observationId: null,
                        subject: null,
                        description: null,
                        evidence: null,
                        evidenceContentType: null,
                        id: null
                    };
                }]
            }
        })
        .state('observation.edit', {
            parent: 'observation',
            url: '/{id}/edit/:incId/:type',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/observation/observation-dialog.html',
                    controller: 'ObservationDialogController',
                    controllerAs: 'vm',
                }
            },
            ncyBreadcrumb: {
                label: 'Modificar observaci\u00F3n'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('observation');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Observation', function($stateParams, Observation) {
                    return Observation.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('observation.delete', {
            parent: 'observation',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/incidences/observation/observation-delete-dialog.html',
                    controller: 'ObservationDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Observation', function(Observation) {
                            return Observation.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('observation', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
