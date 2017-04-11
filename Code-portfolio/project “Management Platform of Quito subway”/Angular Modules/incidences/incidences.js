(function () {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig ($stateProvider) {
        $stateProvider.state('incidences', {
            parent: 'app',
            url: '/incidence',
            ncyBreadcrumb: {
                label: 'Gestión de Incidencias',
                color: '#1EA9E1',
                theme: "light"
            },
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/incidences.html',
                    controller: 'IncidenceController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]
            }
        })
        .state('incidences-report', {
            parent: 'incidences',
            url: '/reports',
            ncyBreadcrumb: {
                label: 'Reportes'
            },
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/incidences/incidences-report.html',
                    controller: 'IncidenceController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
