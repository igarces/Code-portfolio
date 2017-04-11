(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('verification', {
                parent: 'incidences',
                url: '/verification?page&sort&search',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.verification.home.title'
                },
                ncyBreadcrumb: {
                    label: 'Verificaci\u00F3n'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/verification/verifications.html',
                        controller: 'VerificationController',
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
                        $translatePartialLoader.addPart('verification');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('verification-detail', {
                parent: 'verification',
                url: '/verification/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.verification.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/verification/verification-resolved-detail.html',
                        controller: 'VerificationDetailController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Ver detalles de la verificaci\u00F3n'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('verification');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Verification', function($stateParams, Verification) {
                        return Verification.get({id : $stateParams.id}).$promise;
                    }]
                }
            })
            .state('verification.new', {
                parent: 'verification',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/verification/verification-resolved-dialog.html',
                        controller: 'VerificationDialogController',
                        controllerAs: 'vm',
                    }
                },
                ncyBreadcrumb: {
                    label: 'Adicionar verificaci\u00F3n'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('verification');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Verification', function($stateParams, Verification) {
                        return {
                            verificationDate: null,
                            description: null,
                            conformity: null,
                            photographicRecord: null,
                            photographicRecordContentType: null,
                            subject: null,
                            socialPromoterId: null,
                            type: 'resolved',
                            id: null
                        };
                    }]
                }
            })
            .state('verification.edit', {
                parent: 'verification',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/verification/verification-resolved-dialog.html',
                        controller: 'VerificationDialogController',
                        controllerAs: 'vm'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Modificar verificaci\u00F3n'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('verification');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Verification', function($stateParams, Verification) {
                        return Verification.get({id : $stateParams.id}).$promise;
                    }]
                }
            })
            .state('verification.delete', {
                parent: 'verification',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/verification/verification-delete-dialog.html',
                        controller: 'VerificationDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Verification', function(Verification) {
                                return Verification.get({id : $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function() {
                        $state.go('verification', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            });
    }

})();
