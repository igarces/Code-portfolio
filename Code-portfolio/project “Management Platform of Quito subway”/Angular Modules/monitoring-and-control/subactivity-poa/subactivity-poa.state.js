(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('subactivity-poa', {
            parent: 'activity-poa',
            url: '/subactivity-poa?page&sort&search/{actId}',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.subactivityPoa.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/subactivity-poa/subactivity-poas.html',
                    controller: 'SubactivityPoaController',
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
                subactivityId: {
                    value: '',
                    squash: true
                },
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
                            subactivityId: $stateParams.subactivityId
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('subactivityPoa');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('subactivity-poa-detail', {
            parent: 'subactivity-poa',
            url: '/subactivity-poa/{id}',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.subactivityPoa.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/subactivity-poa/subactivity-poa-detail.html',
                    controller: 'SubactivityPoaDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('subactivityPoa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SubactivityPoa', function($stateParams, SubactivityPoa) {
                    return SubactivityPoa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('subactivity-poa.new', {
            parent: 'subactivity-poa',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'Adicionar subactividad'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/subactivity-poa/subactivity-poa-dialog.html',
                    controller: 'SubactivityPoaDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('subactivityPoa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SubactivityPoa', function($stateParams, SubactivityPoa) {
                    return {
                        code: null,
                        description: null,
                        startDate: null,
                        finalDate: null,
                        plannedGoal: 100,
                        indicator: null,
                        verificationMeans: null,
                        registrationDate: null,
                        level: null,
                        id: null,
                        budget: 0,
                        activityPoaId: Number($stateParams.actId),
                        subactivityPoaId: null,
                        process: null,
                        stationId: null,
                        users: []
                    };
                }]
            }
        })
        .state('subactivity-poa.edit', {
            parent: 'subactivity-poa',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'Modificar subactividad'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/subactivity-poa/subactivity-poa-dialog.html',
                    controller: 'SubactivityPoaDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('subactivityPoa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SubactivityPoa', function($stateParams, SubactivityPoa) {
                    return SubactivityPoa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('subactivity-poa.delete', {
            parent: 'subactivity-poa',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'Eliminar subactividad'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/subactivity-poa/subactivity-poa-delete-dialog.html',
                    controller: 'SubactivityPoaDeleteController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('subactivityPoa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SubactivityPoa', function($stateParams, SubactivityPoa) {
                    return SubactivityPoa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('subactivity-poa.breakdown', {
            parent: 'subactivity-poa',
            url: '/breakdown/{id}/',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.subactivityPoa.home.breakdown'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/subactivity-poa/subactivity-poa-breakdown.html',
                    controller: 'SubactivityPoaBreakdownController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('subactivityPoa');
                    return $translate.refresh();
                }],
                entityAct: ['$stateParams', 'ActivityPoa', function($stateParams, ActivityPoa) {
                    return ActivityPoa.get({id : $stateParams.actId}).$promise;
                }],
                entity: ['$stateParams', 'SubactivityPoa', function($stateParams, SubactivityPoa) {
                    return SubactivityPoa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
            .state('subactivity-poa.monitoring-level1', {
                parent: 'subactivity-poa',
                url: '/monitoring-level1/{id}/',
                data: {
                    authorities: ['ROLE_USER']
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.subactivityPoa.home.monitoring'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/subactivity-poa/subactivity-poa-level1-monitoring.html',
                        controller: 'SubactivityPoaLevel1MonitoringController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('subactivityPoa');
                        return $translate.refresh();
                    }],
                    entityAct: ['$stateParams', 'ActivityPoa', function($stateParams, ActivityPoa) {
                        return ActivityPoa.get({id : $stateParams.actId}).$promise;
                    }],
                    entity: ['$stateParams', 'SubactivityPoa', function($stateParams, SubactivityPoa) {
                        return SubactivityPoa.get({id : $stateParams.id}).$promise;
                    }]
                }
            })
            .state('subactivity-poa.monitoring-level2', {
                parent: 'subactivity-poa',
                url: '/monitoring-level2/{id}/',
                data: {
                    authorities: ['ROLE_USER']
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.subactivityPoa.home.monitoring'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/subactivity-poa/subactivity-poa-level2-monitoring.html',
                        controller: 'SubactivityPoaLevel2MonitoringController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('subactivityPoa');
                        return $translate.refresh();
                    }],
                    entityAct: ['$stateParams', 'ActivityPoa', function($stateParams, ActivityPoa) {
                        return ActivityPoa.get({id : $stateParams.actId}).$promise;
                    }],
                    entity: ['$stateParams', 'SubactivityPoa', function($stateParams, SubactivityPoa) {
                        return SubactivityPoa.get({id : $stateParams.id}).$promise;
                    }]
                }
            });
    }

})();
