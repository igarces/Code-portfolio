(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('attached-document', {
            parent: 'entity',
            url: '/attached-document?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.attachedDocument.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/attached-document/attached-documents.html',
                    controller: 'AttachedDocumentController',
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
                    $translatePartialLoader.addPart('attachedDocument');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('attached-document-detail', {
            parent: 'entity',
            url: '/attached-document/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.attachedDocument.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/attached-document/attached-document-detail.html',
                    controller: 'AttachedDocumentDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('attachedDocument');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'AttachedDocument', function($stateParams, AttachedDocument) {
                    return AttachedDocument.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('attached-document.new', {
            parent: 'attached-document',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/attached-document/attached-document-dialog.html',
                    controller: 'AttachedDocumentDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                description: null,
                                contentFile: null,
                                contentFileContentType: null,
                                fileName: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('attached-document', null, { reload: true });
                }, function() {
                    $state.go('attached-document');
                });
            }]
        })
        .state('attached-document.edit', {
            parent: 'attached-document',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/attached-document/attached-document-dialog.html',
                    controller: 'AttachedDocumentDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['AttachedDocument', function(AttachedDocument) {
                            return AttachedDocument.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('attached-document', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('attached-document.delete', {
            parent: 'attached-document',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/attached-document/attached-document-delete-dialog.html',
                    controller: 'AttachedDocumentDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['AttachedDocument', function(AttachedDocument) {
                            return AttachedDocument.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('attached-document', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
