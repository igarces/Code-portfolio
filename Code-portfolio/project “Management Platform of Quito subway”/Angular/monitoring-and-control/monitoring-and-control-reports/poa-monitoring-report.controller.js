(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaMonitoringReportController', PoaMonitoringReportController);

    PoaMonitoringReportController.$inject = ['$scope', '$state', 'User', 'AdministrativeUnit', 'nomenclatorsConstants', 'AdminUnitDirection'];

    function PoaMonitoringReportController($scope, $state, User, AdministrativeUnit, nomenclatorsConstants, AdminUnitDirection) {
        var vm = this;

        //variables
        vm.directions = AdminUnitDirection.query();
        vm.administrativeUnitList = [];
        vm.idAdministrativeUnitDPGI = nomenclatorsConstants.adminUnitDPGIId;
        vm.adminUnitGRSAId = nomenclatorsConstants.adminUnitGRSAId;
        vm.onlyOneAdminUnit = false;
        vm.reportTypeList = [];
        vm.reportType = null;

        //initial methods
        initializeVariables();
        initData();

        //functions
        vm.clear = clear;
        vm.cancel = cancel;
        vm.generateReport = generateReport;

        function initializeVariables() {
            vm.administrativeUnit = '';
            vm.adminUnitDirection = '';
        }

        function initData() {
            User.getLoggedUser(function (userLogged) {
                if(userLogged.administrativeUnitId === vm.idAdministrativeUnitDPGI){
                    vm.administrativeUnitList = AdministrativeUnit.search({'name': '', 'acronym':''});
                }else{
                    AdministrativeUnit.get({'id': userLogged.administrativeUnitId}, function (adminUnit) {
                        vm.administrativeUnitList.push(adminUnit);
                        vm.onlyOneAdminUnit = true;
                    });
                }
            });

            vm.reportTypeList = [{id: 1, name: 'Semanal'},{id: 2, name: 'Mensual'}];
        }

        function clear() {
            initializeVariables();
        }

        function cancel() {
            $state.go('monitoring-and-control-reports', null, {reload: true});
        }

        function generateReport() {
            var adminUnitSearch = vm.administrativeUnit;
            if(vm.administrativeUnit === null){
                adminUnitSearch = '';
            }
            if(vm.onlyOneAdminUnit){
                adminUnitSearch = vm.administrativeUnitList[0].id;
            }

            var monthlyReport = true;
            if(vm.reportType !== null && vm.reportType === 1){
                monthlyReport = false;
            }

            if(adminUnitSearch !== vm.adminUnitGRSAId || vm.adminUnitDirection === null || vm.adminUnitDirection === undefined){
                vm.adminUnitDirection = '';
            }

            $state.go('report-viewer', {
                pdfExport: true,
                xlsExport: true,
                reportUrl: 'api/report/poa-monitoring-report/pdf',
                pdfUrl: 'api/report/poa-monitoring-report/pdf',
                xlsUrl: 'api/report/poa-monitoring-report/xls',
                moduleuiref: 'monitoring-and-control',
                backuiref: 'poa-monitoring-report',
                reportParams: {
                    administrativeUnitId: adminUnitSearch,
                    monthlyReport: monthlyReport,
                    adminUnitDirection: vm.adminUnitDirection
                }
            });
        }
    }
})();
