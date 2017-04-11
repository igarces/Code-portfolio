(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('poa', {
            parent: 'monitoring-and-control',
            url: '/poa?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.poa.home.title'
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.poa.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/poa/poas.html',
                    controller: 'PoaController',
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
                project: {
                    value: '',
                    squash: true
                },
                dependence: {
                    value: '',
                    squash: true
                },
                year: {
                    value: '',
                    squash: true
                },
                program: {
                    value: '',
                    squash: true
                },
                indicator: {
                    value: '',
                    squash: true
                },
                goalProject: {
                    value: '',
                    squash: true
                },
                poaType: {
                    value: '',
                    squash: true
                },
                poaState: {
                    value: '',
                    squash: true
                }
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: {
                            project: $stateParams.project,
                            dependence: $stateParams.dependence,
                            year: $stateParams.year,
                            program: $stateParams.program,
                            indicator: $stateParams.indicator,
                            goalProject: $stateParams.goalProject,
                            poaType: $stateParams.poaType,
                            poaState: $stateParams.poaState
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('poa');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('poa-detail', {
            parent: 'poa',
            url: '/poa/{id}',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.poa.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/poa/poa-detail.html',
                    controller: 'PoaDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('poa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Poa', function($stateParams, Poa) {
                    return Poa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('poa.new', {
            parent: 'poa',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.poa.home.createLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/poa/poa-dialog.html',
                    controller: 'PoaDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('poa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Poa', function($stateParams, Poa) {
                    return {
                        dependence: null,
                        program: null,
                        project: null,
                        indicator: null,
                        projectGoal: null,
                        startDay: null,
                        finalDay: null,
                        year: null,
                        id: null
                    };
                }]
            }
        })
        .state('poa.edit', {
            parent: 'poa',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.poa.home.createOrEditLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/poa/poa-dialog.html',
                    controller: 'PoaDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('poa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Poa', function($stateParams, Poa) {
                    return Poa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('poa.delete', {
            parent: 'poa',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.poa.delete.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/poa/poa-delete-dialog.html',
                    controller: 'PoaDeleteController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('poa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Poa', function($stateParams, Poa) {
                    return Poa.get({id : $stateParams.id}).$promise;
                }]
            }
        });
    }

})();
