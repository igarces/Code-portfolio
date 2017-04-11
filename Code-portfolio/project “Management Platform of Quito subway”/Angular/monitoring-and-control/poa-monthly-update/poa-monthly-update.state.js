(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('poa-monthly-update', {
                parent: 'monitoring-and-control',
                url: '/poa-monthly-update?page&sort&search',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.poaMonthly.title'
                },
                ncyBreadcrumb: {
                    label: 'metroquitoApp.poaMonthly.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/poa-monthly-update/poa-monthly-update.html',
                        controller: 'PoaMonthlyUpdateController',
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
                    date: {
                        value: '',
                        squash: true
                    },
                    administrativeUnit: {
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
                                date: $stateParams.date,
                                administrativeUnit: $stateParams.administrativeUnit
                            }
                        };
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('poa');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            });
    }

})();
