(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('activity', {
            parent: 'incidences',
            url: '/activity?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.activity.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/activity/activities.html',
                    controller: 'ActivityController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'name,asc',
                    squash: true
                },
                search: null,
                name: {
                    value: '',
                    squash: true
                }
            },
            ncyBreadcrumb: {
                label: 'Consultar actividades'
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: {
                            name: $stateParams.name,
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activity');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('activity-detail', {
            parent: 'activity',
            url: '/activity/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.activity.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/activity/activity-detail.html',
                    controller: 'ActivityDetailController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Ver detalles de la actividad'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activity');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Activity', function($stateParams, Activity) {
                    return Activity.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('activity.new', {
            parent: 'activity',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/activity/activity-dialog.html',
                    controller: 'ActivityDialogController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Adicionar actividad'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activity');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Activity', function($stateParams, Activity) {
                    return {
                        name: null,
                        id: null
                    };
                }]
            }
        })
        .state('activity.edit', {
            parent: 'activity',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/activity/activity-dialog.html',
                    controller: 'ActivityDialogController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Modificar actividad'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activity');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Activity', function($stateParams, Activity) {
                    return Activity.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('activity.delete', {
            parent: 'activity',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/activity/activity-delete-dialog.html',
                    controller: 'ActivityDeleteController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Eliminar actividad'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('activity');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Activity', function($stateParams, Activity) {
                    return Activity.get({id : $stateParams.id}).$promise;
                }]
            }
        });
    }

})();
