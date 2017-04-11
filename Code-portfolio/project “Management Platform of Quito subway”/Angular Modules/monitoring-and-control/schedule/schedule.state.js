(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('schedule', {
            parent: 'project-schedule',
            url: '/schedule?page&sort&search',
            ncyBreadcrumb: {
                label: 'metroquitoApp.schedule.home.title',
                showProject: true,
                data:""
            },
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.schedule.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/schedule/schedules.html',
                    controller: 'ScheduleController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'createDateSchedule,desc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    if(PaginationUtil.parsePredicate($stateParams.sort) != 'level') {
                        return {
                            page: PaginationUtil.parsePage($stateParams.page),
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort),
                            search: $stateParams.search
                        };
                    }else{
                        return {
                            page: 1,
                            sort: 'createDateSchedule,desc',
                            predicate: 'createDateSchedule',
                            ascending: 'desc',
                            search: $stateParams.search
                        };
                    }
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('schedule');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('schedule.new', {
            parent: 'schedule',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.schedule.home.createLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/schedule/schedule-dialog.html',
                    controller: 'ScheduleDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('schedule');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Schedule', function($stateParams, Schedule) {
                    return {
                        name: null,
                        baseLine: null,
                        dateDeclaredBase: null,
                        observation: null,
                        fileScheduleName: null,
                        fileSchedulePath: null,
                        fileSchedule: null,
                        fileScheduleContentType: null,
                        fileScheduleData: null,
                        fileScheduleDataContentType: null,
                        id: null
                    };
                }]
            }
        })
        .state('schedule.edit', {
            parent: 'schedule',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/schedule/schedule-dialog.html',
                    controller: 'ScheduleDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Schedule', function(Schedule) {
                            return Schedule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('schedule', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('schedule.delete', {
            parent: 'schedule',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/schedule/schedule-delete-dialog.html',
                    controller: 'ScheduleDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Schedule', function(Schedule) {
                            return Schedule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('schedule', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('schedule-changes', {
            parent: 'schedule',
            url: '/schedule/check-changes/{id}?page&sort',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.schedule.changes.title'
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.schedule.changes.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/schedule/check_changes/changes.html',
                    controller: 'ChangesController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1'
                }/*,
                search: {
                   value: 'task'
                }*/
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page)
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('schedule');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Schedule', function($stateParams, Schedule) {
                    return Schedule.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('schedule-compare', {
            parent: 'project-schedule',
            url: '/compare',
            ncyBreadcrumb: {
                label: 'metroquitoApp.schedule.compare.title',
                showProject: true,
                data:""
            },
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.schedule.compare.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/schedule/compare-schedule/compare-schedule.html',
                    controller: 'CompareScheduleController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('schedule');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        });

    }

})();
