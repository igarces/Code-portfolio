(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('report-plan-real', {
                parent: 'monitoring-and-control-reports',
                url: '/report-plan-real',
                ncyBreadcrumb: {
                    label: 'metroquitoApp.schedule.report.title',
                    showProject: true,
                    data:""
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'metroquitoApp.schedule.report.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/monitoring-and-control/schedule/report/report-plan-real.html',
                        controller: 'ReportPLMQController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('schedule');
                        return $translate.refresh();
                    }]/*,
                    entity: ['$stateParams', 'Schedule', function($stateParams, Schedule) {
                        return Schedule.get({id : $stateParams.id}).$promise;
                    }]*/
                }
            });
    }

})();
