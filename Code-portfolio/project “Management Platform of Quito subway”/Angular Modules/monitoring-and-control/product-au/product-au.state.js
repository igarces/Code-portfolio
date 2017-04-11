(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('product-au', {
            parent: 'monitoring-and-control',
            url: '/product-au?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.productAU.home.title'
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.productAU.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/product-au/product-aus.html',
                    controller: 'ProductAUController',
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
                administrativeUnit: {
                    value: '',
                    squash: true
                },
                product: {
                    value: '',
                    squash: true
                },
                year: {
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
                            administrativeUnit: $stateParams.administrativeUnit,
                            year: $stateParams.year
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('productAU');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('product-au-detail', {
            parent: 'product-au',
            url: '/product-au/{id}',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.productAU.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/product-au/product-au-detail.html',
                    controller: 'ProductAUDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('productAU');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ProductAU', function($stateParams, ProductAU) {
                    return ProductAU.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('product-au.new', {
            parent: 'product-au',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.productAU.home.createLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/product-au/product-au-dialog.html',
                    controller: 'ProductAUDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('productAU');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ProductAU', function($stateParams, ProductAU) {
                    return {
                        product: null,
                        year: null,
                        id: null,
                        administrativeUnits: []
                    };
                }]
            }
        })
        .state('product-au.edit', {
            parent: 'product-au',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.productAU.home.createOrEditLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/product-au/product-au-dialog.html',
                    controller: 'ProductAUDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('productAU');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ProductAU', function ($stateParams, ProductAU) {
                    return ProductAU.get({id: $stateParams.id}).$promise;
                }]
            }
        })
        .state('product-au.delete', {
            parent: 'product-au',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.productAU.delete.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/product-au/product-au-delete-dialog.html',
                    controller: 'ProductAUDeleteController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('productAU');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ProductAU', function ($stateParams, ProductAU) {
                    return ProductAU.get({id: $stateParams.id}).$promise;
                }]
            }
        });
    }

})();
