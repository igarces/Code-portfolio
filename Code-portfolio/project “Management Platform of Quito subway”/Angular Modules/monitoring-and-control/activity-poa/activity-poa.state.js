(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('activity-poa', {
            parent: 'monitoring-and-control',
            url: '/activity-poa?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.activityPoa.home.title'
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.activityPoa.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/activity-poa/activity-poas.html',
                    controller: 'ActivityPoaController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'codeCompare,asc',
                    squash: true
                },
                search: null,
                description: {
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
                responsible: {
                    value: '',
                    squash: true
                },
                administrativeUnit: {
                    value: '',
                    squash: true
                },
                adminUnitDirection: {
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
                            description: $stateParams.description,
                            fromDate: $stateParams.fromDate,
                            toDate: $stateParams.toDate,
                            responsible: $stateParams.responsible,
                            administrativeUnit: $stateParams.administrativeUnit,
                            adminUnitDirection: $stateParams.adminUnitDirection
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activityPoa');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('activity-poa-detail', {
            parent: 'activity-poa',
            url: '/activity-poa/{id}',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.activityPoa.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/activity-poa/activity-poa-detail.html',
                    controller: 'ActivityPoaDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activityPoa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ActivityPoa', function($stateParams, ActivityPoa) {
                    return ActivityPoa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('activity-poa.new', {
            parent: 'activity-poa',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.activityPoa.home.createLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/activity-poa/activity-poa-dialog.html',
                    controller: 'ActivityPoaDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activityPoa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ActivityPoa', function($stateParams, ActivityPoa) {
                    return {
                        code: null,
                        description: null,
                        plannedGoal: 100,
                        startDate: null,
                        finalDate: null,
                        referentialAmount: 0,
                        drag: null,
                        multiannual: null,
                        observations: null,
                        budgetaryDetail: null,
                        registrationDate: null,
                        id: null,
                        users: [],
                        productId: null,
                        costCenterId: null
                    };
                }]
            }
        })
        .state('activity-poa.edit', {
            parent: 'activity-poa',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.activityPoa.home.createOrEditLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/activity-poa/activity-poa-dialog.html',
                    controller: 'ActivityPoaDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activityPoa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ActivityPoa', function($stateParams, ActivityPoa) {
                    return ActivityPoa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('activity-poa.delete', {
            parent: 'activity-poa',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.activityPoa.home.deleteLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/activity-poa/activity-poa-delete-dialog.html',
                    controller: 'ActivityPoaDeleteController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activityPoa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ActivityPoa', function($stateParams, ActivityPoa) {
                    return ActivityPoa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
            .state('activity-poa.breakdown', {
                parent: 'activity-poa',
                url: '/breakdown/{id}/',
                data: {
                    authorities: ['ROLE_USER']
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.activityPoa.home.breakdown'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/activity-poa/activity-poa-breakdown.html',
                        controller: 'ActivityPoaBreakdownController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('activityPoa');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'ActivityPoa', function($stateParams, ActivityPoa) {
                        return ActivityPoa.get({id : $stateParams.id}).$promise;
                    }]
                }
            });
    }

})();
