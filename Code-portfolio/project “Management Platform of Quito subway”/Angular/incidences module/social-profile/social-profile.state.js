(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('social-profile', {
            parent: 'incidences',
            url: '/social-profile?page&sort&search&isSelection',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.socialProfile.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/social-profile/social-profiles.html',
                    controller: 'SocialProfileController',
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
                isSelection: {
                    value: '0',
                    squash: true
                },
                name: {
                    value: '',
                    squash: true
                },
                lastName: {
                    value: '',
                    squash: true
                },
                infrastructureTypeId: {
                    value: '',
                    squash: true
                },
                sexId: {
                    value: '',
                    squash: true
                },
                identityCard: {
                    value: '',
                    squash: true
                }
            },
            ncyBreadcrumb: {
                label: 'Consultar actores sociales'
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
                            lastName: $stateParams.lastName,
                            infrastructureTypeId: $stateParams.infrastructureTypeId,
                            sexId: $stateParams.sexId,
                            identityCard: $stateParams.identityCard
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('socialProfile');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('social-profile-detail', {
            parent: 'social-profile',
            url: '/social-profile/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.socialProfile.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/social-profile/social-profile-detail.html',
                    controller: 'SocialProfileDetailController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Ver detalles del actor social'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('socialProfile');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SocialProfile', function($stateParams, SocialProfile) {
                    return SocialProfile.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('social-profile.new', {
            parent: 'social-profile',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/social-profile/social-profile-dialog.html',
                    controller: 'SocialProfileDialogController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Adicionar actor social'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('socialProfile');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SocialProfile', function($stateParams, SocialProfile) {
                    return {
                        name: null,
                        lastName: null,
                        conventionalPhone: null,
                        cellPhone: null,
                        email: null,
                        address: null,
                        predio: null,
                        affectedBusiness: null,
                        affectedHouse: null,
                        othersAffected: null,
                        otherInfrastructure: null,
                        otherProperty: null,
                        businessType: null,
                        businessName: null,
                        locationLongitude: null,
                        locationLatitude: null,
                        id: null,
                        identityCard: null
                    };
                }]
            }
        })
        .state('social-profile.edit', {
            parent: 'social-profile',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/social-profile/social-profile-dialog.html',
                    controller: 'SocialProfileDialogController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Modificar actor social'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('socialProfile');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SocialProfile', function($stateParams, SocialProfile) {
                    return SocialProfile.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('social-profile.delete', {
            parent: 'social-profile',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/incidences/social-profile/social-profile-delete-dialog.html',
                    controller: 'SocialProfileDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['SocialProfile', function(SocialProfile) {
                            return SocialProfile.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('social-profile', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
