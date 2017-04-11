(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('valued-schedule', {
            parent: 'monitoring-and-control',
            url: '/valued-schedule?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.valuedSchedule.home.title'
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.valuedSchedule.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/valued-schedule/valued-schedules.html',
                    controller: 'ValuedScheduleController',
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
                fromDate: {
                    value: '',
                    squash: true
                },
                toDate: {
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
                            fromDate: $stateParams.fromDate,
                            toDate: $stateParams.toDate
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('valuedSchedule');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('valued-schedule.new', {
            parent: 'valued-schedule',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.valuedSchedule.home.importLabel'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/valued-schedule/valued-schedule-dialog.html',
                    controller: 'ValuedScheduleDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('valuedSchedule');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ValuedSchedule', function($stateParams, ValuedSchedule) {
                    return {
                        registrationDate: null,
                        name: null,
                        state: null,
                        observation: null,
                        file: null,
                        fileContentType: null,
                        id: null
                    };
                }]
            }
        })
            .state('valued-schedule.compare', {
                parent: 'valued-schedule',
                url: '/{id}/compare',
                data: {
                    authorities: ['ROLE_USER']
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.valuedSchedule.home.compare'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/valued-schedule/valued-schedule-compare.html',
                        controller: 'ValuedScheduleCompareController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('valuedSchedule');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'ValuedSchedule', function($stateParams, ValuedSchedule) {
                        return ValuedSchedule.getComparison({id: $stateParams.id}).$promise;
                    }]
                }
            })
            .state('valued-schedule.financial-execution', {
                parent: 'valued-schedule',
                url: '/{id}/financial-execution',
                data: {
                    authorities: ['ROLE_USER']
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.valuedSchedule.home.financialExecution'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/valued-schedule/financial-execution.html',
                        controller: 'FinancialExecutionController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('valuedSchedule');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'ValuedSchedule', function($stateParams, ValuedSchedule) {
                        return ValuedSchedule.getMonthList({id: $stateParams.id}).$promise;
                    }]
                }
            });
    }

})();
