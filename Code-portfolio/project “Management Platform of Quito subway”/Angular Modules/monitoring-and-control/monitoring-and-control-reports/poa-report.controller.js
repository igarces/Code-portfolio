(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaReportController', PoaReportController);

    PoaReportController.$inject = ['$scope', '$state', 'User', 'AdministrativeUnit', 'AdminUnitDirection', 'nomenclatorsConstants'];

    function PoaReportController($scope, $state, User, AdministrativeUnit, AdminUnitDirection, nomenclatorsConstants) {
        var vm = this;

        //variables
        vm.dateformat = 'dd/MM/yyyy';
        vm.administrativeUnitList = [];
        vm.idAdministrativeUnitDPGI = nomenclatorsConstants.adminUnitDPGIId;
        vm.adminUnitGRSAId = nomenclatorsConstants.adminUnitGRSAId;
        vm.onlyOneAdminUnit = false;
        vm.directions = AdminUnitDirection.query();

        //initial methods
        initializeVariables();
        initData();

        //functions
        vm.clear = clear;
        vm.cancel = cancel;
        vm.generateReport = generateReport;

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.fromDate = false;
        vm.datePickerOpenStatus.toDate = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.fromDateOption = {
            maxDate: vm.toDate
        };

        vm.toDateOption = {
            minDate: vm.fromDate
        };

        $scope.$watch('vm.toDate', updateAsync);
        $scope.$watch('vm.fromDate', updateAsync);

        function updateAsync(){
            vm.fromDateOption = {
                maxDate: vm.toDate
            };

            vm.toDateOption = {
                minDate: vm.fromDate
            };
            $scope.$evalAsync();
        }

        function initializeVariables() {
            vm.fromDate = '';
            vm.toDate = '';
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
        }

        function clear() {
            initializeVariables();
        }

        function cancel() {
            $state.go('monitoring-and-control-reports', null, {reload: true});
        }

        function generateReport() {
            var adminUnitSearch = vm.administrativeUnit;
            if(vm.administrativeUnit === null || vm.administrativeUnit === undefined){
                adminUnitSearch = '';
            }
            if(vm.onlyOneAdminUnit){
                adminUnitSearch = vm.administrativeUnitList[0].id;
            }

            if(adminUnitSearch !== vm.adminUnitGRSAId || vm.adminUnitDirection === null || vm.adminUnitDirection === undefined){
                vm.adminUnitDirection = '';
            }

            $state.go('report-viewer', {
                pdfExport: true,
                xlsExport: true,
                reportUrl: 'api/report/poa-report/pdf',
                pdfUrl: 'api/report/poa-report/pdf',
                xlsUrl: 'api/report/poa-report/xls',
                moduleuiref: 'monitoring-and-control',
                backuiref: 'poa-report',
                reportParams: {
                    fromDate: vm.fromDate,
                    toDate: vm.toDate,
                    administrativeUnitId: adminUnitSearch,
                    adminUnitDirection: vm.adminUnitDirection
                }
            });
        }
    }
})();
