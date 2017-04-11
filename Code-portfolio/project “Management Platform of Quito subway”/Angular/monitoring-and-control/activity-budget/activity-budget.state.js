(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('activity-budget', {
            parent: 'monitoring-and-control',
            url: '/activity-budget?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.activityBudget.home.title'
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.activityBudget.home.completeTitle'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/activity-budget/activity-budgets.html',
                    controller: 'ActivityBudgetController',
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
                search: null,
                product: {
                    value: '',
                    squash: true
                },
                administrativeUnit: {
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
                            product: $stateParams.product,
                            administrativeUnit: $stateParams.administrativeUnit
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activityBudget');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        }).state('activity-budget.adjust', {
            parent: 'activity-budget',
            url: '/adjust/{productId}/{adminUnitId}',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.activityBudget.adjustBudget'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/activity-budget/adjust-budget.html',
                    controller: 'AdjustActivityBudgetController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activityBudget');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ProductAU', function($stateParams, ProductAU) {

                    return ProductAU.getProductBudget({
                        page: 0,
                        size: 10,
                        productId: $stateParams.productId,
                        administrativeUnit: $stateParams.adminUnitId,
                        sort: 'id,asc'
                    }).$promise;
                }]
            }
        }).state('activity-budget.adjust.detail', {
            parent: 'activity-budget',
            url: '/adjust/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.activityBudget.detail.adjustBudget'
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.activityBudget.detail.adjustBudget'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/activity-budget/adjust-budget-detail.html',
                    controller: 'DetailAdjustActivityBudgetController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activityBudget');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ActivityPoa', function($stateParams, ActivityPoa) {

                    return ActivityPoa.findOneActivity({id: $stateParams.id}).$promise;
                }]
            }
        }).state('activity-budget.update', {
                parent: 'activity-budget',
                url: '/update/{productId}/{adminUnitId}',
                data: {
                    authorities: ['ROLE_USER']
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.activityBudget.updateBudget'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/activity-budget/update-budget-state.html',
                        controller: 'UpdateBudgetStateController',
                        controllerAs: 'vm'
                    }
                },
            resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('activityBudget');
                        return $translate.refresh();
                    }],
                entity: ['$stateParams', 'ProductAU', function($stateParams, ProductAU) {

                    return ProductAU.getProductBudget({
                            page: 0,
                            size: 10,
                            productId: $stateParams.productId,
                            administrativeUnit: $stateParams.adminUnitId,
                            sort: 'id,asc'
                    }).$promise;
                }]
            }
        });
    }
})();
