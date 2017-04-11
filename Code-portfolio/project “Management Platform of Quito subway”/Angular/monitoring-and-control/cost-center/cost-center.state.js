(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('cost-center', {
            parent: 'monitoring-and-control',
            url: '/cost-center?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.costCenter.home.title'
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.costCenter.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/cost-center/cost-centers.html',
                    controller: 'CostCenterController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'code,asc',
                    squash: true
                },
                search: null,
                code: {
                    value: '',
                    squash: true
                },
                description: {
                    value: '',
                    squash: true
                }
            },
            resolve: {
                descriptionsList: ['$stateParams', 'CostCenter', function ($stateParams, CostCenter) {
                    return CostCenter.getDescriptionsList().$promise;
                }],
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: {
                            code: $stateParams.code,
                            description: $stateParams.description
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('costCenter');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('cost-center-detail', {
            parent: 'cost-center',
            url: '/cost-center/{id}',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.costCenter.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/cost-center/cost-center-detail.html',
                    controller: 'CostCenterDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('costCenter');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'CostCenter', function($stateParams, CostCenter) {
                    return CostCenter.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('cost-center.new', {
            parent: 'cost-center',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.costCenter.home.createLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/cost-center/cost-center-dialog.html',
                    controller: 'CostCenterDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('costCenter');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'CostCenter', function($stateParams, CostCenter) {
                    return {
                        code: null,
                        description: null,
                        id: null,
                        active: true
                    };
                }]
            }
        })
        .state('cost-center.edit', {
            parent: 'cost-center',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.costCenter.home.createOrEditLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/cost-center/cost-center-dialog.html',
                    controller: 'CostCenterDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('costCenter');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'CostCenter', function($stateParams, CostCenter) {
                    return CostCenter.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('cost-center.delete', {
            parent: 'cost-center',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.costCenter.delete.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/cost-center/cost-center-delete-dialog.html',
                    controller: 'CostCenterDeleteController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('costCenter');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'CostCenter', function($stateParams, CostCenter) {
                    return CostCenter.get({id : $stateParams.id}).$promise;
                }]
            }
        });
    }

})();
