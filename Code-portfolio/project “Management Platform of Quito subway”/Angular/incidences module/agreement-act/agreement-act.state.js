(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('agreement-act', {
            parent: 'entity',
            url: '/agreement-act?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.agreementAct.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/agreement-act/agreement-acts.html',
                    controller: 'AgreementActController',
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
                    $translatePartialLoader.addPart('agreementAct');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('agreement-act-detail', {
            parent: 'entity',
            url: '/agreement-act/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.agreementAct.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/agreement-act/agreement-act-detail.html',
                    controller: 'AgreementActDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('agreementAct');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'AgreementAct', function($stateParams, AgreementAct) {
                    return AgreementAct.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('agreement-act.new', {
            parent: 'agreement-act',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/agreement-act/agreement-act-dialog.html',
                    controller: 'AgreementActDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                companyRepresentative: null,
                                company: null,
                                content: null,
                                annexedAct: null,
                                annexedActContentType: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agreement-act', null, { reload: true });
                }, function() {
                    $state.go('agreement-act');
                });
            }]
        })
        .state('agreement-act.edit', {
            parent: 'agreement-act',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/agreement-act/agreement-act-dialog.html',
                    controller: 'AgreementActDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['AgreementAct', function(AgreementAct) {
                            return AgreementAct.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agreement-act', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agreement-act.delete', {
            parent: 'agreement-act',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/agreement-act/agreement-act-delete-dialog.html',
                    controller: 'AgreementActDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['AgreementAct', function(AgreementAct) {
                            return AgreementAct.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agreement-act', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
