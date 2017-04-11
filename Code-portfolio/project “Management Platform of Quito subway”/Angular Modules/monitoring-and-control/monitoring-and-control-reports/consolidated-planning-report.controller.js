(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ConsolidatedPlanningReportController', ConsolidatedPlanningReportController);

    ConsolidatedPlanningReportController.$inject = ['$scope', '$state', 'User', 'AdministrativeUnit', 'PoaType'];

    function ConsolidatedPlanningReportController($scope, $state, User, AdministrativeUnit, PoaType) {
        var vm = this;

        // vm.poatypes = PoaType.query(null, function () {
        //     initializeVariables();
        // });

        //initial methods
        initializeVariables();

        //functions
        vm.clear = clear;
        vm.cancel = cancel;
        vm.generateReport = generateReport;

        function initializeVariables() {
            vm.poatypes = [{
                id: Number(2),
                name: 'EPMMQ'
            }];
            vm.poaType = vm.poatypes[0].id;
        }

        function clear() {
            initializeVariables();
        }

        function cancel() {
            $state.go('monitoring-and-control-reports', null, {reload: true});
        }

        function generateReport() {
            if(vm.poaType === null){
                vm.poaType = vm.poatypes[0] !== undefined ? vm.poatypes[0].id : null;
            }

            $state.go('report-viewer', {
                pdfExport: true,
                xlsExport: true,
                reportUrl: 'api/report/consolidated-planning-report/pdf',
                pdfUrl: 'api/report/consolidated-planning-report/pdf',
                xlsUrl: 'api/report/consolidated-planning-report/xls',
                moduleuiref: 'monitoring-and-control',
                backuiref: 'consolidated-planning-report',
                reportParams: {
                    poaType: vm.poaType
                }
            });
        }
    }
})();
