(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('subactivity-monitoring', {
            parent: 'entity',
            url: '/subactivity-monitoring?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.subactivityMonitoring.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/subactivity-monitoring/subactivity-monitorings.html',
                    controller: 'SubactivityMonitoringController',
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
                    $translatePartialLoader.addPart('subactivityMonitoring');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('subactivity-monitoring-detail', {
            parent: 'entity',
            url: '/subactivity-monitoring/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.subactivityMonitoring.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/subactivity-monitoring/subactivity-monitoring-detail.html',
                    controller: 'SubactivityMonitoringDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('subactivityMonitoring');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SubactivityMonitoring', function($stateParams, SubactivityMonitoring) {
                    return SubactivityMonitoring.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('subactivity-monitoring.new', {
            parent: 'subactivity-monitoring',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/subactivity-monitoring/subactivity-monitoring-dialog.html',
                    controller: 'SubactivityMonitoringDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                year: null,
                                month: null,
                                week: null,
                                planningPercent: null,
                                realPercent: null,
                                accumulatedPercent: null,
                                startDate: null,
                                finalDate: null,
                                observations: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('subactivity-monitoring', null, { reload: true });
                }, function() {
                    $state.go('subactivity-monitoring');
                });
            }]
        })
        .state('subactivity-monitoring.edit', {
            parent: 'subactivity-monitoring',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/subactivity-monitoring/subactivity-monitoring-dialog.html',
                    controller: 'SubactivityMonitoringDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['SubactivityMonitoring', function(SubactivityMonitoring) {
                            return SubactivityMonitoring.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('subactivity-monitoring', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('subactivity-monitoring.delete', {
            parent: 'subactivity-monitoring',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/subactivity-monitoring/subactivity-monitoring-delete-dialog.html',
                    controller: 'SubactivityMonitoringDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['SubactivityMonitoring', function(SubactivityMonitoring) {
                            return SubactivityMonitoring.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('subactivity-monitoring', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
