(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('activity-breakdown', {
            parent: 'entity',
            url: '/activity-breakdown?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.activityBreakdown.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/activity-breakdown/activity-breakdowns.html',
                    controller: 'ActivityBreakdownController',
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
                    $translatePartialLoader.addPart('activityBreakdown');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('activity-breakdown-detail', {
            parent: 'entity',
            url: '/activity-breakdown/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.activityBreakdown.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/activity-breakdown/activity-breakdown-detail.html',
                    controller: 'ActivityBreakdownDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activityBreakdown');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ActivityBreakdown', function($stateParams, ActivityBreakdown) {
                    return ActivityBreakdown.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('activity-breakdown.new', {
            parent: 'activity-breakdown',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/activity-breakdown/activity-breakdown-dialog.html',
                    controller: 'ActivityBreakdownDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                year: null,
                                month: null,
                                planningPercent: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('activity-breakdown', null, { reload: true });
                }, function() {
                    $state.go('activity-breakdown');
                });
            }]
        })
        .state('activity-breakdown.edit', {
            parent: 'activity-breakdown',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/activity-breakdown/activity-breakdown-dialog.html',
                    controller: 'ActivityBreakdownDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['ActivityBreakdown', function(ActivityBreakdown) {
                            return ActivityBreakdown.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('activity-breakdown', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('activity-breakdown.delete', {
            parent: 'activity-breakdown',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/activity-breakdown/activity-breakdown-delete-dialog.html',
                    controller: 'ActivityBreakdownDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['ActivityBreakdown', function(ActivityBreakdown) {
                            return ActivityBreakdown.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('activity-breakdown', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
