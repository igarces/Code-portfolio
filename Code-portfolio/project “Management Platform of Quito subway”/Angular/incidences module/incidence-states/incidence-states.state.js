(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('incidence-states', {
            parent: 'entity',
            url: '/incidence-states?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.incidenceStates.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/incidence-states/incidence-states.html',
                    controller: 'IncidenceStatesController',
                    controllerAs: 'vm'
                }
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
                    $translatePartialLoader.addPart('incidenceStates');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('incidence-states-detail', {
            parent: 'entity',
            url: '/incidence-states/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.incidenceStates.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/incidence-states/incidence-states-detail.html',
                    controller: 'IncidenceStatesDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('incidenceStates');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'IncidenceStates', function($stateParams, IncidenceStates) {
                    return IncidenceStates.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('incidence-states.new', {
            parent: 'incidence-states',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/incidence-states/incidence-states-dialog.html',
                    controller: 'IncidenceStatesDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                date: null,
                                active: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('incidence-states', null, { reload: true });
                }, function() {
                    $state.go('incidence-states');
                });
            }]
        })
        .state('incidence-states.edit', {
            parent: 'incidence-states',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/incidence-states/incidence-states-dialog.html',
                    controller: 'IncidenceStatesDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['IncidenceStates', function(IncidenceStates) {
                            return IncidenceStates.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('incidence-states', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('incidence-states.delete', {
            parent: 'incidence-states',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/incidence-states/incidence-states-delete-dialog.html',
                    controller: 'IncidenceStatesDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['IncidenceStates', function(IncidenceStates) {
                            return IncidenceStates.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('incidence-states', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
