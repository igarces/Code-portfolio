(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('heading-subheading', {
            parent: 'monitoring-and-control',
            url: '/heading-subheading?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.headingSubheading.home.title'
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.headingSubheading.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/heading-subheading/heading-subheadings.html',
                    controller: 'HeadingSubheadingController',
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
                code:  {
                    value: '',
                    squash: true
                },
                heading:  {
                    value: '',
                    squash: true
                },
                subheading:  {
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
                            code: $stateParams.code,
                            heading: $stateParams.heading,
                            subheading: $stateParams.subheading
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('headingSubheading');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('heading-subheading-detail', {
            parent: 'heading-subheading',
            url: '/heading-subheading/{id}',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.headingSubheading.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/heading-subheading/heading-subheading-detail.html',
                    controller: 'HeadingSubheadingDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('headingSubheading');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'HeadingSubheading', function($stateParams, HeadingSubheading) {
                    return HeadingSubheading.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('heading-subheading.new', {
            parent: 'heading-subheading',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.headingSubheading.home.createLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/heading-subheading/heading-subheading-dialog.html',
                    controller: 'HeadingSubheadingDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('headingSubheading');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'HeadingSubheading', function($stateParams, HeadingSubheading) {
                    return {
                        code: null,
                        description: null,
                        heading: true,
                        clarifications: null,
                        id: null
                    };
                }]
            }
        })
        .state('heading-subheading.edit', {
            parent: 'heading-subheading',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.headingSubheading.home.createOrEditLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/heading-subheading/heading-subheading-dialog.html',
                    controller: 'HeadingSubheadingDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('headingSubheading');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'HeadingSubheading', function($stateParams, HeadingSubheading) {
                    return HeadingSubheading.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('heading-subheading.delete', {
            parent: 'heading-subheading',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.headingSubheading.delete.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/heading-subheading/heading-subheading-delete-dialog.html',
                    controller: 'HeadingSubheadingDeleteController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('headingSubheading');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'HeadingSubheading', function ($stateParams, HeadingSubheading) {
                    return HeadingSubheading.get({id: $stateParams.id}).$promise;
                }]
            }
            // onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
            //     $uibModal.open({
            //         templateUrl: 'app/entities/heading-subheading/heading-subheading-delete-dialog.html',
            //         controller: 'HeadingSubheadingDeleteController',
            //         controllerAs: 'vm',
            //         size: 'md',
            //         resolve: {
            //             entity: ['HeadingSubheading', function(HeadingSubheading) {
            //                 return HeadingSubheading.get({id : $stateParams.id}).$promise;
            //             }]
            //         }
            //     }).result.then(function() {
            //         $state.go('heading-subheading', null, { reload: true });
            //     }, function() {
            //         $state.go('^');
            //     });
            // }]
        });
    }

})();
