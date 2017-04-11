(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('incidence-social-resp', {
            parent: 'incidences',
            url: '/incidence-social-resp?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.incidenceSocialResp.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/incidence-social-resp/incidence-social-resps.html',
                    controller: 'IncidenceSocialRespController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Consultar quejas/reclamos/atenci\u00F3n ciudadana'
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
                },
                incidenceNumber: {
                    value: '',
                    squash: true
                },
                incidenceTypeId: {
                    value: '',
                    squash: true
                },
                incidenceStateId: {
                    value: '',
                    squash: true
                },
                responsible: {
                    value: '',
                    squash: true
                },
                administrativeUnitId: {
                    value: '',
                    squash: true
                },
                promotor: {
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
                            toDate: $stateParams.toDate,
                            incidenceNumber: $stateParams.incidenceNumber,
                            incidenceTypeId: $stateParams.incidenceTypeId,
                            incidenceStateId: $stateParams.incidenceStateId,
                            responsible: $stateParams.responsible,
                            administrativeUnitId: $stateParams.administrativeUnitId,
                            promotor: $stateParams.promotor
                        }
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('incidenceSocialResp');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('incidence-social-resp-detail', {
            parent: 'incidence-social-resp',
            url: '/incidence-social-resp/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'metroquitoApp.incidenceSocialResp.detail.title'
            },
            ncyBreadcrumb: {
                label: 'Ver detalles de queja/reclamo/atenci\u00F3n ciudadana'
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/incidence-social-resp/incidence-social-resp-detail.html',
                    controller: 'IncidenceSocialRespDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('incidenceSocialResp');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'IncidenceSocialResp', function($stateParams, IncidenceSocialResp) {
                    return IncidenceSocialResp.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('incidence-social-resp.new', {
            parent: 'incidence-social-resp',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/incidence-social-resp/incidence-social-resp-dialog.html',
                    controller: 'IncidenceSocialRespDialogController',
                    controllerAs: 'vm',
                }
            },
            ncyBreadcrumb: {
                label: 'Adicionar queja/reclamo/atenci\u00F3n ciudadana'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('incidenceSocialResp');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'IncidenceSocialResp', function($stateParams, IncidenceSocialResp) {
                    return {
                        incidenceNumber: null,
                        incidenceRealDate: null,
                        incidenceReportDate: null,
                        informant: null,
                        subject: null,
                        description: null,
                        complaintClaimRegistrationDate: null,
                        complaintClaimDescription: null,
                        id: null,
                        incidenceStateId: null,
                        incidenceStateTempId: null,
                        incidenceTypeId: null,
                        socialPromoterId: null
                    };
                    // return IncidenceSocialResp.stateIncidence;
                }]
            }
        })
        .state('incidence-social-resp.edit', {
            parent: 'incidence-social-resp',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/incidence-social-resp/incidence-social-resp-dialog.html',
                    controller: 'IncidenceSocialRespDialogController',
                    controllerAs: 'vm'
                }
            },
            ncyBreadcrumb: {
                label: 'Modificar queja/reclamo/atenci\u00F3n ciudadana'
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('incidenceSocialResp');
                    return $translate.refresh();
                }],
                entity: ['$stateParams','IncidenceSocialResp', function($stateParams, IncidenceSocialResp) {
                    return IncidenceSocialResp.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('incidence-social-resp.delete', {
            parent: 'incidence-social-resp',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/incidences/incidence-social-resp/incidence-social-resp-delete-dialog.html',
                    controller: 'IncidenceSocialRespDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['IncidenceSocialResp', function(IncidenceSocialResp) {
                            return IncidenceSocialResp.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('incidence-social-resp', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('assing-incidence-social-resp', {
                parent: 'incidence-social-resp',
                url: '/assing/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.incidenceSocialResp.home.assignIncidence'
                },
                ncyBreadcrumb: {
                    label: 'Asignar/Reasignar queja'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/incidences/incidence-social-resp/assign-incidence-social-resp.html',
                        controller: 'AssignIncidenceSocialRespController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('incidenceSocialResp');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'IncidenceSocialResp', function($stateParams, IncidenceSocialResp) {
                        return IncidenceSocialResp.get({id : $stateParams.id}).$promise;
                    }]
                }
            });
    }

})();
