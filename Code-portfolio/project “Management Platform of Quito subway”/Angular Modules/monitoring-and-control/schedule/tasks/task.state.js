(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('schedule-detail', {
            parent: 'schedule',
            url: '/schedule/{id}?page&sort',
            ncyBreadcrumb: {
                label: 'metroquitoApp.schedule.detail.title',
                showProject: true,
                data:""
            },
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.schedule.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/schedule/tasks/tasks.html',
                    controller: 'TaskController',
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
                }
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {

                    if(PaginationUtil.parsePredicate($stateParams.sort) == 'level'){
                        return {
                            page: PaginationUtil.parsePage($stateParams.page),
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort)
                        };
                    }else{
                        return {
                            page: 1,
                            sort: 'id,asc',
                            predicate: 'id',
                            ascending: 'asc'
                        };
                    }

                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('task');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Schedule', function($stateParams, Schedule) {
                    return Schedule.get({id : $stateParams.id}).$promise;
                }]
            }
        });
    }

})();
