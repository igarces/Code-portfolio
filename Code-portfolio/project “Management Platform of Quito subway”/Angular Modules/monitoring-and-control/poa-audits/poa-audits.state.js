(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('poa-audits', {
            parent: 'operating-plan',
            url: '/poa-audits?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.poaAudits.home.title'
            },
            ncyBreadcrumb: {
                label: 'metroquitoApp.poaAudits.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/monitoring-and-control/poa-audits/poa-audits.html',
                    controller: 'PoaAuditsController',
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
                    $translatePartialLoader.addPart('poaAudits');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        });
        // .state('poa-audits-detail', {
        //     parent: 'entity',
        //     url: '/poa-audits/{id}',
        //     data: {
        //         authorities: ['ROLE_USER'],
        //         pageTitle: 'metroquitoApp.poaAudits.detail.title'
        //     },
        //     views: {
        //         'content@': {
        //             templateUrl: 'app/entities/poa-audits/poa-audits-detail.html',
        //             controller: 'PoaAuditsDetailController',
        //             controllerAs: 'vm'
        //         }
        //     },
        //     resolve: {
        //         translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
        //             $translatePartialLoader.addPart('poaAudits');
        //             return $translate.refresh();
        //         }],
        //         entity: ['$stateParams', 'PoaAudits', function($stateParams, PoaAudits) {
        //             return PoaAudits.get({id : $stateParams.id}).$promise;
        //         }]
        //     }
        // })
        // .state('poa-audits.new', {
        //     parent: 'poa-audits',
        //     url: '/new',
        //     data: {
        //         authorities: ['ROLE_USER']
        //     },
        //     onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
        //         $uibModal.open({
        //             templateUrl: 'app/entities/poa-audits/poa-audits-dialog.html',
        //             controller: 'PoaAuditsDialogController',
        //             controllerAs: 'vm',
        //             backdrop: 'static',
        //             size: 'lg',
        //             resolve: {
        //                 entity: function () {
        //                     return {
        //                         dateHour: null,
        //                         ip: null,
        //                         action: null,
        //                         id: null
        //                     };
        //                 }
        //             }
        //         }).result.then(function() {
        //             $state.go('poa-audits', null, { reload: true });
        //         }, function() {
        //             $state.go('poa-audits');
        //         });
        //     }]
        // })
        // .state('poa-audits.edit', {
        //     parent: 'poa-audits',
        //     url: '/{id}/edit',
        //     data: {
        //         authorities: ['ROLE_USER']
        //     },
        //     onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
        //         $uibModal.open({
        //             templateUrl: 'app/entities/poa-audits/poa-audits-dialog.html',
        //             controller: 'PoaAuditsDialogController',
        //             controllerAs: 'vm',
        //             backdrop: 'static',
        //             size: 'lg',
        //             resolve: {
        //                 entity: ['PoaAudits', function(PoaAudits) {
        //                     return PoaAudits.get({id : $stateParams.id}).$promise;
        //                 }]
        //             }
        //         }).result.then(function() {
        //             $state.go('poa-audits', null, { reload: true });
        //         }, function() {
        //             $state.go('^');
        //         });
        //     }]
        // })
        // .state('poa-audits.delete', {
        //     parent: 'poa-audits',
        //     url: '/{id}/delete',
        //     data: {
        //         authorities: ['ROLE_USER']
        //     },
        //     onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
        //         $uibModal.open({
        //             templateUrl: 'app/entities/poa-audits/poa-audits-delete-dialog.html',
        //             controller: 'PoaAuditsDeleteController',
        //             controllerAs: 'vm',
        //             size: 'md',
        //             resolve: {
        //                 entity: ['PoaAudits', function(PoaAudits) {
        //                     return PoaAudits.get({id : $stateParams.id}).$promise;
        //                 }]
        //             }
        //         }).result.then(function() {
        //             $state.go('poa-audits', null, { reload: true });
        //         }, function() {
        //             $state.go('^');
        //         });
        //     }]
        // });
    }

})();
